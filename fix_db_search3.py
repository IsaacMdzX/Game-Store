import re

with open('app/static/js/menu-system.js', 'r', encoding='utf-8') as f:
    text = f.read()

start_marker = "// INTERCEPTOR DE BÚSQUEDA DINÁMICA DE PRODUCTOS (PRECIOS EN TIEMPO REAL)"
end_marker = "this.processStandardIntent(message);"

start_idx = text.find(start_marker)
if start_idx == -1:
    print("No se encontró el start marker")
    exit(1)

# I need to find the specific branch where the request catches.
# Actually, I can just replace the specific strings.

new_text = text.replace(
    r"/\\b(tienes|busco|quiero|precio de|cuanto cuesta)\\s+(el|la|los|las)?\\s*(juego|consola|control|accesorio)?\\s*(.*?)$/i;",
    r"/\\b(tienes|busco|quiero|precio de|cuanto cuesta|hay|disponibilidad de|stock de|que precio tiene)\\s+(el|la|los|las)?\\s*(juego|consola|control|accesorio)?\\s*(.*?)$/i;"
)

new_text = new_text.replace(
    r"/\\b(tienes|busco|quiero|precio de|cuanto cuesta|por favor|gracias|hola)\\b/ig",
    r"/\\b(tienes|busco|quiero|precio de|cuanto cuesta|hay|disponibilidad de|stock de|qué precio tiene|por favor|gracias|hola)\\b/ig"
)

# And now update the response message
old_response = """                    if (productos && productos.length > 0) {
                        let responseText = `¡Encontré ${productos.length} producto(s)! Aquí tienes los precios:\\n\\n`;
                        productos.forEach(p => {
                            const price = p.precio !== undefined ? p.precio : p.precio_venta;
                            responseText += `🎮 **${p.nombre || p.descripcion}** - $${price}\\n`;
                        });
                        this.addMessage('bot', responseText);
                        this.scrollConversationToBottom();"""

new_response = """                    if (productos && productos.length > 0) {
                        let responseText = `¡Encontré ${productos.length} producto(s) en nuestra tienda! 👇\\n\\n`;
                        productos.forEach(p => {
                            const price = p.precio !== undefined ? p.precio : p.precio_venta;
                            const status = (p.stock && p.stock > 0) ? `✅ Disponible (${p.stock} unidades)` : '❌ Agotado';
                            responseText += `🎮 **${p.nombre || p.descripcion}**\\n💰 Precio: $${price}\\n📦 Inventario: ${status}\\n\\n`;
                        });
                        this.addMessage('bot', responseText.trim());
                        this.scrollConversationToBottom();"""

if old_response in new_text:
    new_text = new_text.replace(old_response, new_response)
    print("Reemplazo completado visual de items")
else:
    print("FALLA en reemplazo visual de items")


with open('app/static/js/menu-system.js', 'w', encoding='utf-8') as f:
    f.write(new_text)

print("Actualizado.")
