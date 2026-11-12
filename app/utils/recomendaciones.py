from collections import Counter
from itertools import combinations
from math import ceil
from typing import Iterable


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