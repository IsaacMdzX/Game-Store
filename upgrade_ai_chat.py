import re

with open('app/static/js/menu-system.js', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update normalizeQuery
old_normalize = """    normalizeQuery(text) {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\\u0300-\\u036f]/g, '')
            .trim();
    }"""

new_normalize = """    normalizeQuery(text) {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\\u0300-\\u036f]/g, '')
            // Reducir 3 o más letras repetidas consecutivas a solo 1 (ej "holaaaa" -> "hola")
            .replace(/([a-z])\\1{2,}/g, '$1')
            // Reducir 2 o más vocales o 's' repetidas al final de una palabra (ej "holaa" -> "hola")
            .replace(/([aeious])\\1+\\b/g, '$1')
            .trim();
    }"""

if old_normalize in text:
    text = text.replace(old_normalize, new_normalize)
    print("normalizeQuery actualizado")

# 2. Add more safe words to nonsense check
old_nonsense = r"if (compact.length <= 4 && !/\b(si|no|ok|hey|hi|hola)\b/i.test(normalizedQuery)) {"
new_nonsense = r"if (compact.length <= 4 && !/\b(si|no|ok|hey|hi|hola|holi|oye|che|va|ya)\b/i.test(normalizedQuery)) {"
if old_nonsense in text:
    text = text.replace(old_nonsense, new_nonsense)
    print("nonsense updated safe words")

# 3. Enhance fallback response to feel more AI-driven
old_nonsense_msg = """                return {
                    text: 'No logré entender tu mensaje 😅. Parece que escribiste algo sin sentido, números o letras al azar. Por favor, explícame tu duda nuevamente o dime si buscas un producto, pedido, contacto o ayuda en general.',"""

new_nonsense_msg = """                const nonsenseReplies = [
                    'Hmm, no logro entender qué intentas decirme 🤔. ¿Podrías escribirlo con otras palabras?',
                    'Parece que escribiste algo que no puedo procesar 😅. ¿Buscas algún producto, ayuda con un pedido o soporte?',
                    'Lo siento, mi inteligencia artificial no detecta qué necesitas. Intenta preguntarme por un "juego", "consola" o "pedido".'
                ];
                return {
                    text: nonsenseReplies[Math.floor(Math.random() * nonsenseReplies.length)],"""

if old_nonsense_msg in text:
    text = text.replace(old_nonsense_msg, new_nonsense_msg)
    print("nonsense message updated")

old_fallback_msg = """            return {
                text: 'Te entiendo. Para ayudarte mejor, dime qué necesitas resolver ahora mismo: pago, pedido, envío, consola, accesorios, precios o contacto.',"""

new_fallback_msg = """            const fallbackReplies = [
                '¡Entiendo! Para darte la mejor asistencia, dime exactamente qué buscas: ¿juegos, accesorios, ver tu pedido o quizás necesitas soporte?',
                '¡Perfecto! Estoy aquí para ayudarte. ¿En qué sección te gustaría que busque? Puedo revisar precio de un juego, tu carrito, envíos, etc.',
                '¡Claro que sí! Cuéntame un poco más detallado qué necesitas hacer y yo me encargo de guiarte. 🤖'
            ];
            return {
                text: fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)],"""

if old_fallback_msg in text:
    text = text.replace(old_fallback_msg, new_fallback_msg)
    print("fallback message updated")

with open('app/static/js/menu-system.js', 'w', encoding='utf-8') as f:
    f.write(text)

