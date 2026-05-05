import re

with open("app/static/js/menu-system.js", "r", encoding="utf-8") as f:
    text = f.read()

old_search = """        // INTERCEPTOR DE BÚSQUEDA DINÁMICA DE PRODUCTOS (PRECIOS EN TIEMPO REAL)
        const lowerMsg = message.toLowerCase();
        const searchRegex = /\\b(tienes|busco|quiero|precio|cuanto|hay|disponible|disponibilidad|stock|que precio)\\s+(de\\s+)?(el|la|los|las)?\\s*(juego|consola|control|accesorio)?\\s*(.*?)$/i;
        const match = lowerMsg.match(searchRegex);
        
        let isDirectProductSearch = false;
        let searchQuery = '';
        
        if (match && match[5] && match[5].length > 2) {
            isDirectProductSearch = true;
            searchQuery = match[5].replace(/\\b(por favor|gracias|hola)\\b/ig, '').trim();
        } else if (lowerMsg.length > 3 && !this.getIntentCatalog().some(intent => intent.pattern.test(lowerMsg))) {
            // Si el mensaje es largo y no coincide con ninguna intención, intentar buscarlo como producto
            isDirectProductSearch = true;
            searchQuery = lowerMsg.replace(/\\b(tienes|busco|quiero|precio|cuanto cuesta|hay|disponible|disponibilidad|stock|qué precio tiene|de|por favor|gracias|hola)\\b/ig, '').trim();
        }"""

new_search = """        // INTERCEPTOR DE BÚSQUEDA DINÁMICA DE PRODUCTOS (PRECIOS EN TIEMPO REAL)
        const lowerMsg = message.toLowerCase();
        // Regex ampliado para detectar intenciones de búsqueda de productos más genéricas
        const searchRegex = /\\b(tienes|busco|quiero|precio|cuanto|hay|disponible|disponibilidad|stock|que precio|juego|juegos|consola|consolas|accesorio|accesorios|control|controles|producto|productos)\\s+(de\\s+|del\\s+|el\\s+|la\\s+|los\\s+|las\\s+)?([\\w\\s\\d-]{3,})$/i;
        const match = lowerMsg.match(searchRegex);
        
        let isDirectProductSearch = false;
        let searchQuery = '';
        
        // Excepciones donde no debemos buscar en la BD (preguntas generales del catálogo que no especifican un producto)
        const isGeneralCategoryQuestion = /\\b(que|qué|cuales|cuáles)\\s+(producto|productos|juego|juegos|consola|consolas|venden|vendes)\\b/i.test(lowerMsg) && !/\\b(de)\\b/.test(lowerMsg);
        
        if (match && match[3] && match[3].trim().length > 2 && !isGeneralCategoryQuestion) {
            isDirectProductSearch = true;
            searchQuery = match[3].replace(/\\b(por favor|gracias|hola|para|con)\\b/ig, '').trim();
        } else if (lowerMsg.length > 3 && !isGeneralCategoryQuestion && !this.getIntentCatalog().some(intent => intent.pattern.test(lowerMsg))) {
            // Palabras clave directas (por ejemplo si pone solo "halo" o "minecraft")
            isDirectProductSearch = true;
            searchQuery = lowerMsg.replace(/\\b(tienes|busco|quiero|precio|cuanto cuesta|hay|disponible|disponibilidad|stock|qué precio tiene|por favor|gracias|hola)\\b/ig, '').trim();
        }"""

if old_search in text:
    text = text.replace(old_search, new_search)
    print("Interceptor updated successfully!")
else:
    print("WARNING: Could not find old search interceptor.")

with open("app/static/js/menu-system.js", "w", encoding="utf-8") as f:
    f.write(text)
