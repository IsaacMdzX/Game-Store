import re

with open('app/static/js/menu-system.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Define part to replace
old_search_logic = """        // INTERCEPTOR DE BÚSQUEDA DINÁMICA DE PRODUCTOS (PRECIOS EN TIEMPO REAL)
        const lowerMsg = message.toLowerCase();
        const searchRegex = /\\b(tienes|busco|quiero|precio de|cuanto cuesta)\\s+(el|la|los|las)?\\s*(juego|consola|control|accesorio)?\\s*(.*?)$/i;
        const match = lowerMsg.match(searchRegex);
        
        let isDirectProductSearch = false;
        let searchQuery = '';
        
        if (match && match[4] && match[4].length > 2) {
            isDirectProductSearch = true;
            searchQuery = match[4].replace(/\\b(por favor|gracias|hola)\\b/ig, '').trim();
        } else if (lowerMsg.length > 3 && !this.getIntentCatalog().some(intent => intent.pattern.test(lowerMsg))) {
            // Si el mensaje es largo y no coincide con ninguna intención, intentar buscarlo como producto
            isDirectProductSearch = true;
            searchQuery = lowerMsg.replace(/\\b(tienes|busco|quiero|precio de|cuanto cuesta|por favor|gracias|hola)\\b/ig, '').trim();
        }

        if (isDirectProductSearch && searchQuery.length > 2) {
            
            fetch(`/api/productos?buscar=${encodeURIComponent(searchQuery)}`)
                .then(res => res.json())
                .then(data => {
                    const productos = data.productos || data; // Maneja ambas estructuras backend
                    if (productos && productos.length > 0) {
                        let responseText = `¡Encontré ${productos.length} producto(s)! Aquí tienes los precios:\\n\\n`;
                        productos.forEach(p => {
                            const price = p.precio !== undefined ? p.precio : p.precio_venta;
                            responseText += `🎮 **${p.nombre || p.descripcion}** - $${price}\\n`;
                        });
                        this.addMessage('bot', responseText);
                        this.scrollConversationToBottom();"""

new_search_logic = """        // INTERCEPTOR DE BÚSQUEDA DINÁMICA DE PRODUCTOS (PRECIOS Y DISPONIBILIDAD)
        const lowerMsg = message.toLowerCase();
        const searchRegex = /\\b(tienes|busco|quiero|precio de|cuanto cuesta|hay|disponibilidad de|stock de|que precio tiene)\\s+(el|la|los|las)?\\s*(juego|consola|control|accesorio)?\\s*(.*?)$/i;
        const match = lowerMsg.match(searchRegex);
        
        let isDirectProductSearch = false;
        let searchQuery = '';
        
        if (match && match[4] && match[4].length > 2) {
            isDirectProductSearch = true;
            searchQuery = match[4].replace(/\\b(por favor|gracias|hola)\\b/ig, '').trim();
        } else if (lowerMsg.length > 3 && !this.getIntentCatalog().some(intent => intent.pattern.test(lowerMsg))) {
            // Si el mensaje es largo y no coincide con ninguna intención, intentar buscarlo como producto
            isDirectProductSearch = true;
            searchQuery = lowerMsg.replace(/\\b(tienes|busco|quiero|precio de|cuanto cuesta|hay|disponibilidad de|stock de|por favor|gracias|hola)\\b/ig, '').trim();
        }

        if (isDirectProductSearch && searchQuery.length > 2) {
            
            fetch(`/api/productos?buscar=${encodeURIComponent(searchQuery)}`)
                .then(res => res.json())
                .then(data => {
                    const productos = data.productos || data; // Maneja ambas estructuras backend
                    if (productos && productos.length > 0) {
                        let responseText = `¡Encontré ${productos.length} producto(s) en nuestra tienda! 👇\\n\\n`;
                        productos.forEach(p => {
                            const price = p.precio !== undefined ? p.precio : p.precio_venta;
                            const status = (p.stock && p.stock > 0) ? `✅ Disponible (${p.stock})` : '❌ Agotado';
                            responseText += `🎮 **${p.nombre || p.descripcion}**\\n💰 Precio: $${price}\\n📦 Inventario: ${status}\\n\\n`;
                        });
                        this.addMessage('bot', responseText.trim());
                        this.scrollConversationToBottom();"""

if old_search_logic in text:
    text = text.replace(old_search_logic, new_search_logic)
    with open('app/static/js/menu-system.js', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Reemplazo de búsqueda completado exitosamente.")
else:
    print("No se encontró el bloque a reemplazar.")

