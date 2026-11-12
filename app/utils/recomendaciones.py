from collections import Counter
from itertools import combinations
from math import ceil
import re
import unicodedata
from typing import Iterable


def clasificar_producto(
    nombre: str,
    categoria: str | None = None,
    descripcion: str | None = None,
    imagen: str | None = None,
) -> tuple[str | None, frozenset[str]]:
    """Infer product type and platform from catalog text and image metadata."""
    texto = unicodedata.normalize(
        'NFKD', f'{nombre or ""} {categoria or ""} {descripcion or ""} {imagen or ""}'
    )
    texto = ''.join(caracter for caracter in texto if not unicodedata.combining(caracter)).lower()
    categoria_normalizada = unicodedata.normalize('NFKD', categoria or '').lower()
    categoria_normalizada = ''.join(
        caracter for caracter in categoria_normalizada if not unicodedata.combining(caracter)
    )

    plataformas = set()
    if re.search(r'playstation|\bdual\s?sense\b|\bps\s?[345]\b|\bpsvr\b|\bps\s?portal\b', texto):
        plataformas.add('playstation')
    if re.search(r'\bxbox\b|\bxsx\b|\bxss\b|\bxb1\b|\bseries\s+[xs]\b', texto):
        plataformas.add('xbox')
    if re.search(
        r'\bnintendo\b|\bswitch\b|\bnsw2?\b|\bwii\b|\b3ds\b|\bmario\b|\bzelda\b|\bpokemon\b|\bpikachu\b|\byoshi\b|\bsmash\s?bros\b',
        texto,
    ):
        plataformas.add('nintendo')

    nombre_normalizado = texto.split(categoria_normalizada, 1)[0] if categoria_normalizada else texto
    es_accesorio = categoria_normalizada == 'accesorios' or re.search(
        r'\bheadset\b|\bauriculares\b|\bestuche\b|\bfunda\b|\bkit\b|\bcarga\b|\bcargador\b|\bllavero\b',
        nombre_normalizado,
    )
    es_control = categoria_normalizada == 'controles' or re.search(
        r'\bcontrol(?:es)?\b|\bcontroller\b|\bgamepad\b|\bdualsense\b', nombre_normalizado
    ) and not es_accesorio

    if es_control:
        tipo = 'control'
    elif categoria_normalizada == 'juegos':
        tipo = 'juego'
    elif es_accesorio:
        tipo = 'accesorio'
    elif categoria_normalizada == 'consolas' and not re.search(r'\bcontrol(?:es)?\b', nombre_normalizado):
        tipo = 'consola'
    elif re.search(r'\bconsola\b|\bplaystation\s?portal\b', nombre_normalizado):
        tipo = 'consola'
    elif re.search(r'\bjuego\b|\bgame\b|\bfc\s?\d{2}\b', nombre_normalizado):
        tipo = 'juego'
    else:
        tipo = None

    return tipo, frozenset(plataformas)


def puntuar_compatibilidad(
    origen: tuple[str | None, frozenset[str]],
    candidato: tuple[str | None, frozenset[str]],
) -> int | None:
    """Return a relevance score, or None when type/platform do not match."""
    tipo_origen, plataformas_origen = origen
    tipo_candidato, plataformas_candidato = candidato

    if plataformas_origen:
        if not plataformas_origen.intersection(plataformas_candidato):
            return None
    elif plataformas_candidato:
        return None

    tipos_validos = {
        'consola': {'juego': 4, 'control': 3, 'accesorio': 2},
        'juego': {'juego': 4},
        'control': {'accesorio': 4},
        'accesorio': {'accesorio': 3},
    }
    return tipos_validos.get(tipo_origen, {}).get(tipo_candidato)


def nombre_plataforma(plataformas: Iterable[str]) -> str:
    etiquetas = {'playstation': 'PlayStation', 'xbox': 'Xbox', 'nintendo': 'Nintendo'}
    return ' / '.join(sorted(etiquetas.get(plataforma, plataforma) for plataforma in plataformas))


def generar_recomendaciones(
    transacciones: Iterable[Iterable[int]],
    productos_en_carrito: Iterable[int],
    soporte_minimo: float = 0.05,
    confianza_minima: float = 0.15,
    limite: int = 4,
    max_tamano_itemset: int = 3,
) -> list[dict[str, int | float]]:
    """Find products associated with the products currently in a cart."""
    compras = [frozenset(compra) for compra in transacciones if compra]
    carrito = frozenset(productos_en_carrito)
    if not compras or not carrito or limite <= 0 or max_tamano_itemset < 2:
        return []

    soporte_absoluto_minimo = max(1, ceil(soporte_minimo * len(compras)))
    conteos_frecuentes: dict[frozenset[int], int] = {}
    conteos_individuales = Counter(
        producto_id for compra in compras for producto_id in compra
    )
    nivel_actual = {
        frozenset((producto_id,)): cantidad
        for producto_id, cantidad in conteos_individuales.items()
        if cantidad >= soporte_absoluto_minimo
    }
    conteos_frecuentes.update(nivel_actual)

    for tamano in range(2, max_tamano_itemset + 1):
        candidatos: set[frozenset[int]] = set()
        itemsets_previos = list(nivel_actual)

        for izquierda, derecha in combinations(itemsets_previos, 2):
            candidato = izquierda | derecha
            if len(candidato) != tamano:
                continue
            if not all(
                frozenset(subconjunto) in nivel_actual
                for subconjunto in combinations(candidato, tamano - 1)
            ):
                continue
            candidatos.add(candidato)

        siguiente_nivel: dict[frozenset[int], int] = {}
        for candidato in candidatos:
            cantidad = sum(candidato.issubset(compra) for compra in compras)
            if cantidad >= soporte_absoluto_minimo:
                siguiente_nivel[candidato] = cantidad

        if not siguiente_nivel:
            break
        conteos_frecuentes.update(siguiente_nivel)
        nivel_actual = siguiente_nivel

    mejores_reglas: dict[int, tuple[float, float]] = {}
    total_compras = len(compras)

    for itemset, cantidad in conteos_frecuentes.items():
        if len(itemset) < 2:
            continue

        soporte_itemset = cantidad / total_compras
        for producto_recomendado in itemset:
            antecedente = itemset - frozenset((producto_recomendado,))
            if not antecedente.issubset(carrito):
                continue

            cantidad_antecedente = conteos_frecuentes.get(antecedente, 0)
            if not cantidad_antecedente:
                continue

            confianza = cantidad / cantidad_antecedente
            if confianza < confianza_minima or producto_recomendado in carrito:
                continue

            regla_actual = (confianza, soporte_itemset)
            if regla_actual > mejores_reglas.get(producto_recomendado, (0.0, 0.0)):
                mejores_reglas[producto_recomendado] = regla_actual

    recomendaciones = [
        {
            'producto_id': producto_id,
            'confianza': round(confianza, 4),
            'soporte': round(soporte, 4),
        }
        for producto_id, (confianza, soporte) in mejores_reglas.items()
    ]
    recomendaciones.sort(
        key=lambda recomendacion: (
            -recomendacion['confianza'],
            -recomendacion['soporte'],
            recomendacion['producto_id'],
        )
    )
    return recomendaciones[:limite]