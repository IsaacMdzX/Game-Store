import re

with open("app/static/js/menu-system.js", "r", encoding="utf-8") as f:
    text = f.read()

# UPDATE PRODUCT LIST FORMAT
old_product_res = """                    if (productos && productos.length > 0) {
                        let responseText = `¡Encontré ${productos.length} producto(s) en nuestra tienda! 👇\\n\\n`;
                        productos.forEach(p => {
                            const price = p.precio !== undefined ? p.precio : p.precio_venta;
                            const status = (p.stock && p.stock > 0) ? `✅ Disponible (${p.stock} unidades)` : '❌ Agotado';
                            responseText += `🎮 **${p.nombre || p.descripcion}**\\n💰 Precio: $${price}\\n📦 Inventario: ${status}\\n\\n`;
                        });
                        this.addMessage('bot', responseText.trim());"""

new_product_res = """                    if (productos && productos.length > 0) {
                        let responseText = `¡Encontré ${productos.length} producto(s) relacionado(s)! Aquí tienes la lista:\\n\\n`;
                        productos.forEach(p => {
                            const price = p.precio !== undefined ? p.precio : p.precio_venta;
                            const status = (p.stock && p.stock > 0) ? `✅ Disponible (${p.stock})` : '❌ Agotado';
                            responseText += `▪️ **${p.nombre || p.descripcion}**\\n  ↳ 💰 Precio: $${price}\\n  ↳ 📦 Estado: ${status}\\n\\n`;
                        });
                        this.addMessage('bot', responseText.trim());"""

if old_product_res in text:
    text = text.replace(old_product_res, new_product_res)
    print("Product list format updated successfully!")
else:
    print("WARNING: Could not find old product list format.")


# UPDATE OUT OF DOMAIN FALLBACKS
old_nonsense = """            if (this.isLikelyNonsenseQuery(normalizedQuery)) {
                const nonsenseReplies = [
                    'Hmm, no logro entender qué intentas decirme 🤔. ¿Podrías escribirlo con otras palabras?',
                    'Parece que escribiste algo que no puedo procesar 😅. ¿Buscas algún producto, ayuda con un pedido o soporte?',
                    'Lo siento, mi inteligencia artificial no detecta qué necesitas. Intenta preguntarme por un "juego", "consola" o "pedido".'
                ];"""

new_nonsense = """            if (this.isLikelyNonsenseQuery(normalizedQuery)) {
                const nonsenseReplies = [
                    'Como asistente virtual de GameStore, mi conocimiento se enfoca únicamente en nuestra tienda. ¿Te gustaría buscar algún videojuego o ver tus pedidos? 🎮',
                    '¡Hola! Soy la IA de GameStore y solo puedo ayudarte con temas de la tienda (juegos, consolas, tu carrito o pedidos). ¿Qué necesitas hacer hoy? 👾',
                    'Esa pregunta está fuera de mis capacidades 😅. Yo me especializo en videojuegos, accesorios y soporte de la tienda. ¿Buscas algún producto en especial?'
                ];"""

if old_nonsense in text:
    text = text.replace(old_nonsense, new_nonsense)
    print("Nonsense replies updated successfully!")
else:
    print("WARNING: Could not find old nonsense replies.")


old_fallback = """            const fallbackReplies = [
                '¡Entiendo! Para darte la mejor asistencia, dime exactamente qué buscas: ¿juegos, accesorios, ver tu pedido o quizás necesitas soporte?',
                '¡Perfecto! Estoy aquí para ayudarte. ¿En qué sección te gustaría que busque? Puedo revisar precio de un juego, tu carrito, envíos, etc.',
                '¡Claro que sí! Cuéntame un poco más detallado qué necesitas hacer y yo me encargo de guiarte. 🤖'
            ];"""

new_fallback = """            const fallbackReplies = [
                'Soy la IA exclusiva de GameStore y no encontré respuesta para eso. Mi especialidad son nuestros productos (juegos, consolas) y ayudarte con tus compras. ¿Te guío a nuestro catálogo? 🎮',
                'Creo que esa pregunta no está relacionada con la tienda 🤔. Yo estoy aquí para ayudarte con precios, stock, envíos o problemas con tu carrito. ¿En qué de esto te puedo asistir?',
                'Vaya, como asistente de GameStore, esa consulta se sale de mis funciones 😅. Pero si necesitas comprar un videojuego o revisar un pedido, ¡soy experto en eso!'
            ];"""

if old_fallback in text:
    text = text.replace(old_fallback, new_fallback)
    print("Fallback replies updated successfully!")
else:
    print("WARNING: Could not find old fallback replies.")


with open("app/static/js/menu-system.js", "w", encoding="utf-8") as f:
    f.write(text)
