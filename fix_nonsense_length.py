import re

with open('app/static/js/menu-system.js', 'r', encoding='utf-8') as f:
    content = f.read()

nonsense_logic = """    isLikelyNonsenseQuery(normalizedQuery) {
        if (!normalizedQuery) return true;

        const compact = normalizedQuery.replace(/[^a-z0-9]/g, '');
        if (!compact) return true;

        // Si es muy corto y no es una palabra válida como "si" o "no"
        if (compact.length <= 4) {
            if (!/\\b(si|no|ok|hey|hi)\\b/i.test(normalizedQuery)) {
                return true;
            }
        }

        // Si es SOLO números o mayormente números (sin letras o muy pocas)
        const numbersOnly = compact.replace(/[^0-9]/g, '');
        if (numbersOnly.length > 0 && numbersOnly.length >= compact.length * 0.7) {
            return true;
        }

        // Si repite la misma letra muchas veces (ej. hhhh, jjjjj)
        if (/(.)\\1{2,}/.test(compact)) return true;
        
        // Patrones clásicos de teclado al azar
        if (/asdf|qwer|zxcv|poiuy|lkjh|mnbv|ñlkj/i.test(compact)) return true;

        const tokens = normalizedQuery.split(/\\s+/).filter(Boolean);
        const lettersOnlyTokens = tokens.map((token) => token.replace(/[^a-z]/g, '')).filter(Boolean);

        // Verifica muchas consonantes seguidas (bshdfg)
        const hasLargeConsonantCluster = lettersOnlyTokens.some((token) => /[bcdfghjklmnñpqrstvwxyz]{4,}/i.test(token));
        if (hasLargeConsonantCluster) return true;

        const letterOnly = compact.replace(/[^a-z]/g, '');
        
        // Verifica proporción baja de vocales si la frase tiene mas de 3 letras
        if (letterOnly.length >= 3) {
            const vowels = (letterOnly.match(/[aeiou]/g) || []).length;
            const vowelRatio = vowels / letterOnly.length;
            if (vowelRatio < 0.25) return true; // Muy pocas vocales es casi seguro spam de teclado
        }

        // Si ninguna palabra del usuario es una palabra clave conocida, o al menos "común" del español:
        const knownWords = /\\b(hola|buenas|quiero|necesito|como|cómo|que|qué|cual|cuál|cuando|cuándo|donde|dónde|ayuda|precio|precios|costo|vale|pedido|pedidos|pago|pagos|envio|envios|envíos|carrito|contacto|perfil|juego|juegos|accesorio|accesorios|consola|consolas|control|controles|quienes|quiénes|somos|ubicacion|ubicación|favorito|favoritos|queja|quejas|comentario|comentarios|busco|tienes|tienda|si|no)\\b/i;
        const hasKnownWord = knownWords.test(normalizedQuery);

        if (!hasKnownWord) {
            // Si tiene más de una palabra y NINGUNA es conocida, asume que es algo sin sentido en el contexto del bot
            if (tokens.length >= 1) return true;
        }

        return false;
    }"""

content = re.sub(r"isLikelyNonsenseQuery\(\w+\)\s*\{[\s\S]*?return false;\s*\}", nonsense_logic, content)

with open('app/static/js/menu-system.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Nonsense length restrictions updated.")
