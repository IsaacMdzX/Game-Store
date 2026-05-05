with open('app/static/js/menu-system.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re

start_marker = "isLikelyNonsenseQuery(normalizedQuery)"
end_marker = "            if (vowelRatio < 0.28) return true;"
end_index = text.find(end_marker)

if end_index != -1:
    end_of_func = text.find("}", end_index)
    
    new_func = """isLikelyNonsenseQuery(normalizedQuery) {
        if (!normalizedQuery) return true;

        const compact = normalizedQuery.replace(/[^a-z0-9]/g, '');
        if (!compact) return true;

        // Si es muy corto (<= 4 letras o números) y NO es una palabra común de saludo/afirmación
        if (compact.length <= 4 && !/\\b(si|no|ok|hey|hi|hola)\\b/i.test(normalizedQuery)) {
             return true;
        }

        // Si es SOLO números o mayormente números (ej. '1234', '12', '99%')
        const numbersOnly = compact.replace(/[^0-9]/g, '');
        if (numbersOnly.length > 0 && numbersOnly.length >= compact.length * 0.7) {
            return true;
        }

        if (/(.)\\1{2,}/.test(compact)) return true;
        
        if (/asdf|qwer|zxcv|poiuy|lkjh|mnbv/i.test(compact)) return true;

        const tokens = normalizedQuery.split(/\\s+/).filter(Boolean);
        const lettersOnlyTokens = tokens.map((token) => token.replace(/[^a-z]/g, '')).filter(Boolean);

        const hasLargeConsonantCluster = lettersOnlyTokens.some((token) => /[bcdfghjklmnñpqrstvwxyz]{4,}/i.test(token));
        if (hasLargeConsonantCluster) return true;

        const letterOnly = compact.replace(/[^a-z]/g, '');
        if (letterOnly.length >= 4) {
            const vowels = (letterOnly.match(/[aeiou]/g) || []).length;
            const vowelRatio = vowels / letterOnly.length;
            if (vowelRatio < 0.25) return true;
        }

        const knownWords = /\\b(hola|buenas|quiero|necesito|como|cómo|que|qué|cual|cuál|cuando|cuándo|donde|dónde|ayuda|precio|precios|pedido|pedidos|pago|pagos|envio|envios|envíos|carrito|contacto|perfil|juego|juegos|accesorio|accesorios|consola|consolas|control|controles|quienes|quiénes|somos|ubicacion|ubicación|favorito|favoritos|queja|quejas|comentario|comentarios|busco|tienes|tienda|si|no)\\b/;
        const hasKnownWord = knownWords.test(normalizedQuery);

        if (!hasKnownWord && tokens.length >= 1) return true;

        return false;
    }"""
    
    start_index = text.find(start_marker)
    text = text[:start_index] + new_func + text[end_of_func + 1:]

    with open('app/static/js/menu-system.js', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Replace done")
else:
    print("Marker not found")
