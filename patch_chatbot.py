import re

with open('app/static/js/menu-system.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Modify handleUserMessage to inject the real-time search
search_injection = """
        this.addMessage('user', message);
        this.input.value = '';
        
        // INTERCEPTOR DE BÚSQUEDA DINÁMICA DE PRODUCTOS (PRECIOS EN TIEMPO REAL)
        const lowerMsg = message.toLowerCase();
        const searchRegex = /\\\\b(tienes|busco|quiero|precio de|cuanto cuesta)\\\\s+(el|la|los|las)?\\\\s*(juego|consola|control|accesorio)?\\\\s*(.*?)$/i;
        const match = lowerMsg.match(searchRegex);
        
        let isDirectProductSearch = false;
        let searchQuery = '';
        
        if (match && match[4] && match[4].length > 2) {
            isDirectProductSearch = true;
            searchQuery = match[4].replace(/\\\\b(por favor|gracias|hola)\\\\b/ig, '').trim();
        } else if (lowerMsg.length > 3 && !this.getIntentCatalog().some(intent => intent.pattern.test(lowerMsg))) {
            // Si el mensaje es largo y no coincide con ninguna intención, intentar buscarlo como producto
            isDirectProductSearch = true;
            searchQuery = lowerMsg.replace(/\\\\b(tienes|busco|quiero|precio de|cuanto cuesta|por favor|gracias|hola)\\\\b/ig, '').trim();
        }

        if (isDirectProductSearch && searchQuery.length > 2) {
            this.addMessage('bot', `Buscando "${searchQuery}" en nuestro catálogo en tiempo real... 🔍`);
            
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
                        this.scrollConversationToBottom();
                    } else {
                        // Fallback a lógica normal si no hay resultados en la BD
                        this.processStandardIntent(message);
                    }
                })
                .catch(err => {
                    console.error('Error fetching real-time prices:', err);
                    this.processStandardIntent(message);
                });
            return;
        }

        this.processStandardIntent(message);
    }

    processStandardIntent(message) {
"""

# Use string replace directly to avoid re.sub replacement expansion issue!
target = "this.addMessage('user', message);\n        this.input.value = '';\n        window.setTimeout(() => {"
replacement = search_injection + "\n        window.setTimeout(() => {"
content = content.replace(target, replacement)


# 2. Add Quejas and Favoritos to intents
intents_to_add = """
            {
                id: 'quejas',
                pattern: /\\b(queja|quejas|reclamacion|reclamo|comentario|sugerencia|pesimo|mal servicio)\\b/i,
                response: 'Lamentamos mucho la situación. Para canalizar tu comentario o queja al área correspondiente y darle solución, por favor escríbenos desde la sección de Contacto.'
            },
            {
                id: 'favoritos',
                pattern: /\\b(favoritos|favorito|lista de deseos|deseos|wishlist|apartados|guardados)\\b/i,
                response: 'En tu Lista de Deseos (Favoritos) puedes guardar los productos que te gusten para comprarlos después. Puedes acceder a ella desde el corazón en la barra de navegación o tu perfil.'
            },"""

content = re.sub(r"(id: 'contacto',[^}]*\},)", r"\1" + intents_to_add.replace('\\', '\\\\'), content)

# Also update the Action map for quejas and favoritos
actions_to_add = """
            quejas: { label: 'Ir a contacto', url: '/contactanos' },
            favoritos: { label: 'Mis favoritos', url: '/perfil/favoritos' },"""

content = re.sub(r"(contacto: \{ label: 'Ir a contacto', url: '/contactanos' \},)", r"\1" + actions_to_add, content)

# 3. Disable the Session Restoration logic to force restart on refresh
content = content.replace("restoreConversationState() {", "restoreConversationState() {\n        return false; // Force ignore session on reload (Usuario request)")

with open('app/static/js/menu-system.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patch applied successfully.")
