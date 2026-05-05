import re

with open('app/static/js/menu-system.js', 'r', encoding='utf-8') as f:
    text = f.read()

replacement = """        this.showTypingIndicator();
        window.setTimeout(async () => {
            try {
                // INTENTO DE BÚSQUEDA DINÁMICA EN BD
                const searchMatch = message.match(/\\b(tienen|busco|precio|precio de|cuanto cuesta|cuánto cuesta|costo|quiero|hay|venden)\\s+([^?.]+)/i);
                
                if (searchMatch && searchMatch[2].trim().length > 2) {
                    const rawQuery = searchMatch[2].trim();
                    const cleanQuery = rawQuery.replace(/^(el|la|los|las|un|una)\\s+/i, '');
                    
                    if (cleanQuery.length > 2 && !/^(ps5|xbox|consolas|juegos|controles)$/i.test(cleanQuery)) {
                        try {
                            const response = await fetch('/api/productos?buscar=' + encodeURIComponent(cleanQuery));
                            if (response.ok) {
                                const data = await response.json();
                                if (data && data.length > 0) {
                                    const p = data[0]; 
                                    let formattedCat = (p.nombre_categoria || 'juegos').toLowerCase();
                                    const urlDestino = '/' + formattedCat;
                                    
                                    const botText = `¡Claro! Tras revisar nuestro inventario te confirmo que sí tenemos **${p.nombre}**. Su precio actual es de **$${p.precio}**. Lo encuentras en nuestra sección de ${p.nombre_categoria}.`;
                                    
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
                }

                // SI NO ENCONTRÓ NADA, FLUJO NORMAL
                const responsePayload = this.getResponsePayload(message);"""

text = text.replace("""        this.showTypingIndicator();
        window.setTimeout(async () => {
            try {
                const responsePayload = this.getResponsePayload(message);""", replacement)

with open('app/static/js/menu-system.js', 'w', encoding='utf-8') as f:
    f.write(text)
