import re

with open('app/static/js/menu-system.js', 'r', encoding='utf-8') as f:
    text = f.read()

# I will find the EXACT bounds of the duplicated mess.
start_idx = text.find("    isLikelyNonsenseQuery(normalizedQuery)")
if start_idx == -1:
    print("Could not find start idx")
    exit(1)

# we know the next function is isFollowUpQuery
end_idx = text.find("    isFollowUpQuery", start_idx)

if end_idx == -1:
    print("Could not find end idx")
    exit(1)

new_func = """    isLikelyNonsenseQuery(normalizedQuery) {
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
    }

"""

new_text = text[:start_idx] + new_func + text[end_idx:]

with open('app/static/js/menu-system.js', 'w', encoding='utf-8') as f:
    f.write(new_text)

print("Syntax fixed")
