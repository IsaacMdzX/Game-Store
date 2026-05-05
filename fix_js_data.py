import re

with open('app/static/js/menu-system.js', 'r') as f:
    content = f.read()

# El bloque de código problemático es:
old_block = """                            if (response.ok) {
                                const data = await response.json();
                                if (data && data.length > 0) {
                                    const p = data[0]; 
                                    let formattedCat = (p.nombre_categoria || 'juegos').toLowerCase();
                                    const urlDestino = '/' + formattedCat;
                                    
                                    const botText = `¡Claro! Tras revisar nuestro inventario te confirmo que sí tenemos **${p.nombre}**. Su precio actual es de **$${p.precio}**. Lo encuentras en nuestra sección de **${p.nombre_categoria}**.`;
                                    
                                    this.hideTypingIndicator();
                                    this.addMessage('bot', botText);
                                    
                                    // Determinar categoría para el botón según nombre_categoria
                                    const catButtonLabel = (formattedCat === 'juegos' || formattedCat === 'consolas' || formattedCat === 'accesorios') ? formattedCat : 'juegos';
                                    
                                    this.renderQuickActions([{label: `Ir a ${catButtonLabel}`, url: '/' + catButtonLabel}]);
                                    
                                    this.trackFaqQuestion(message, { text: botText, intents: [{id: 'busqueda_bd'}] });
                                    this.saveConversationState();
                                    return; // FIN DEL FLUJO, YA RESPONDIÓ
                                }
                            }"""

new_block = """                            if (response.ok) {
                                const data = await response.json();
                                // ✅ Corregimos el acceso a los datos porque la API en web.py devuelve un objeto con la llave "productos"
                                const productosArray = Array.isArray(data) ? data : (data.productos || []);
                                
                                if (productosArray && productosArray.length > 0) {
                                    const p = productosArray[0]; 
                                    // Usar p.categoria en vez de p.nombre_categoria (debido al formato de web.py)
                                    const nombreCategoria = p.categoria || p.nombre_categoria || 'juegos';
                                    let formattedCat = nombreCategoria.toLowerCase();
                                    const urlDestino = '/' + formattedCat;
                                    
                                    const botText = `¡Claro! Tras revisar nuestro inventario te confirmo que sí tenemos **${p.nombre}**. Su precio actual es de **$${p.precio}**. Lo encuentras en nuestra sección de **${nombreCategoria}**.`;
                                    
                                    this.hideTypingIndicator();
                                    this.addMessage('bot', botText);
                                    
                                    // Determinar categoría para el botón según nombre_categoria
                                    const catButtonLabel = (formattedCat === 'juegos' || formattedCat === 'consolas' || formattedCat === 'accesorios') ? formattedCat : 'juegos';
                                    
                                    this.renderQuickActions([{label: `Ir a ${catButtonLabel}`, url: '/' + catButtonLabel}]);
                                    
                                    this.trackFaqQuestion(message, { text: botText, intents: [{id: 'busqueda_bd'}] });
                                    this.saveConversationState();
                                    return; // FIN DEL FLUJO, YA RESPONDIÓ
                                }
                            }"""

if old_block in content:
    new_content = content.replace(old_block, new_block)
    with open('app/static/js/menu-system.js', 'w') as f:
        f.write(new_content)
    print("Éxito en reemplazar.")
else:
    print("No se encontró el bloque exacto en JS.")
