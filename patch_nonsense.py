import re

with open("app/static/js/menu-system.js", "r", encoding="utf-8") as f:
    text = f.read()

old_replies = """            if (this.isLikelyNonsenseQuery(normalizedQuery)) {
                const nonsenseReplies = [
                    'Como asistente virtual de GameStore, mi conocimiento se enfoca únicamente en nuestra tienda. ¿Te gustaría buscar algún videojuego o ver tus pedidos? 🎮',
                    '¡Hola! Soy la IA de GameStore y solo puedo ayudarte con temas de la tienda (juegos, consolas, tu carrito o pedidos). ¿Qué necesitas hacer hoy? 👾',
                    'Esa pregunta está fuera de mis capacidades 😅. Yo me especializo en videojuegos, accesorios y soporte de la tienda. ¿Buscas algún producto en especial?'
                ];
                return {
                    text: nonsenseReplies[Math.floor(Math.random() * nonsenseReplies.length)],
                    intents: [],
                    normalizedQuery
                };
            }"""

new_replies = """            if (this.isLikelyNonsenseQuery(normalizedQuery)) {
                const nonsenseReplies = [
                    'No logré entender tu mensaje 😅. Por favor reformula tu pregunta o duda y con gusto te ayudaré.',
                    'Hmm, parece que tu mensaje contiene caracteres o palabras sin sentido para mí. ¿Podrías escribir tu duda de otra forma? ¡Estaré encantado de apoyarte!',
                    'No pude descifrar lo que intentaste decirme 🤔. Si reformulas tu pregunta sobre nuestros productos, precios o tu cuenta, con gusto te guiaré.',
                    'Diculpa, no logré entender tu mensaje. Escribe tu duda claramente y trataré de ayudarte lo mejor posible. 🎮'
                ];
                return {
                    text: nonsenseReplies[Math.floor(Math.random() * nonsenseReplies.length)],
                    intents: [],
                    normalizedQuery
                };
            }"""

if old_replies in text:
    text = text.replace(old_replies, new_replies)
    print("Nonsense replies updated!")
else:
    print("Could not find nonsense replies.")

with open("app/static/js/menu-system.js", "w", encoding="utf-8") as f:
    f.write(text)
