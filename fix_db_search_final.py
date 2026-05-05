import re

with open('app/static/js/menu-system.js', 'r', encoding='utf-8') as f:
    text = f.read()

replacement = """
                // INTENTO DE SECUENCIA DIRECTA PARA BASE DE DATOS
                let queryToSearch = message.trim();
                
                // Extraer el nombre del producto si usan preguntas comunes
                const searchMatch = message.match(/\\b(?:tienes?|tienen|busco|precio(?: de)?|cuanto cuesta|cuánto cuesta|costo|quiero|hay|venden)\\b\\s*(?:el\\s+|la\\s+|los\\s+|las\\s+|un\\s+|una\\s+|juego\\s+|consola\\s+|juegos\\s+)?(.*)/i);
                
                if (searchMatch && searchMatch[1].trim().length > 2) {
                    queryToSearch = searchMatch[1].trim().replace(/\\?$/, '');
                } else {
                    queryToSearch = queryToSearch.replace(/\\?$/, '');
                }

                const ignoreWords = ['hola', 'adios', 'gracias', 'ayuda', 'menu', 'precios', 'xbox', 'ps5', 'nintendo', 'tienes', 'tienen', 'quejas', 'contacto'];
                const isGeneric = ignoreWords.includes(queryToSearch.toLowerCase());

                if (queryToSearch.length > 2 && !isGeneric) {
                    try {
                        const response = await fetch('/api/productos?buscar=' + encodeURIComponent(queryToSearch));
                        if (response.ok) {
                            const data = await response.json();
                            if (data && Array.isArray(data) && data.length > 0) {
                                // Match exacto o el primero general
                                const p = data[0]; 
                                let formattedCat = (p.nombre_categoria || 'juegos').toLowerCase();
                                const urlDestino = '/' + formattedCat;
                                
                                const precioNum = parseFloat(p.precio) || 0;
                                const botText = `¡Claro! Tras buscar en nuestro inventario te confirmo que sí tenemos **${p.nombre}**. Su precio actual es de **$${precioNum.toFixed(2)}**. Lo encuentras en nuestra sección de ${p.nombre_categoria}.`;
                                
                                this.hideTypingIndicator();
                                this.addMessage('bot', botText);
                                this.renderQuickActions([{label: `Ver ${p.nombre_categoria}`, url: urlDestino}]);
                                
                                this.trackFaqQuestion(message, { text: botText, intents: [{id: 'busqueda_bd'}] });
                                this.saveConversationState();
                                return; // DETENER EL FLUJO SI LO ENCONTRÓ
                            }
                        }
                    } catch(err) {
                        console.warn('Error en fetch chat DB', err);
                    }
                }
"""

old_block_regex = r"\s*// INTENTO DE BÚSQUEDA DINÁMICA EN BD[\s\S]*?(?=\s*// SI NO ENCONTRÓ NADA, FLUJO NORMAL)"

text = re.sub(old_block_regex, replacement, text)

with open('app/static/js/menu-system.js', 'w', encoding='utf-8') as f:
    f.write(text)
