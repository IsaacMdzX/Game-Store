import re

with open('app/static/js/menu-system.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Segundo paso: Añadir la búsqueda a la base de datos INCLUSO si no usaron la palabra "tienes" 
# (por ejemplo, si el usuario solo pegó "RESIDENT EVIL REQUIEM").

replacement = """        this.showTypingIndicator();
        window.setTimeout(async () => {
            try {
                // INTENTO DE SECUENCIA DIRECTA (Solo el nombre del juego o consulta estándar)
                let queryToSearch = message;
                const searchMatch = message.match(/\\b(tienes|tienen|busco|precio|precio de|cuanto cuesta|cuánto cuesta|costo|quiero|hay|venden)\\s+(?:el\\s+|la\\s+|los\\s+|las\\s+|un\\s+|una\\s+|juego\\s+|consola\\s+|juegos\\s+)*([^?.]+)/i);
                
                if (searchMatch && searchMatch[2].trim().length > 2) {
                    queryToSearch = searchMatch[2].trim();
                }

                if (queryToSearch.length > 3 && !/^(hola|adios|gracias|ayuda|menu|precios|xbox|ps5|nintendo)$/i.test(queryToSearch)) {
                    try {
                        const response = await fetch('/api/productos?buscar=' + encodeURIComponent(queryToSearch));
                        if (response.ok) {
                            const data = await response.json();
                            if (data && data.length > 0) {
                                const p = data[0]; 
                                let formattedCat = (p.nombre_categoria || 'juegos').toLowerCase();
                                const urlDestino = '/' + formattedCat;
                                
                                const botText = `¡Claro! Tras buscar "**${queryToSearch}**" en el inventario te confirmo que sí tenemos **${p.nombre}**. Su precio actual es de **$${p.precio}**. Lo encuentras en nuestra sección de ${p.nombre_categoria}.`;
                                
                                this.hideTypingIndicator();
                                this.addMessage('bot', botText);
                                this.renderQuickActions([{label: `Ver ${p.nombre_categoria}`, url: urlDestino}]);
                                
                                this.trackFaqQuestion(message, { text: botText, intents: [{id: 'busqueda_bd'}] });
                                this.saveConversationState();
                                return; 
                            }
                        }
                    } catch(e) {
                        console.warn("Fallo búsqueda en base de datos para Chatbot:", e);
                    }
                }

                // SI NO ENCONTRÓ NADA, FLUJO NORMAL
                const responsePayload = this.getResponsePayload(message);"""

# Quitamos el injerto viejo y ponemos el ultra-mejorado
old_block_regex = r"        this\.showTypingIndicator\(\);\s+window\.setTimeout\(async \(\) => \{\s+try \{\s+// INTENTO DE BÚSQUEDA DINÁMICA EN BD[\s\S]*?// SI NO ENCONTRÓ NADA, FLUJO NORMAL\s+const responsePayload = this\.getResponsePayload\(message\);"

text = re.sub(old_block_regex, replacement, text)

with open('app/static/js/menu-system.js', 'w', encoding='utf-8') as f:
    f.write(text)
