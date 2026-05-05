import re

with open("app/static/js/menu-system.js", "r", encoding="utf-8") as f:
    text = f.read()

old_prefix = """            if (filteredIntents.length === 1 && pageContext &&
                (filteredIntents[0].id === 'precios' || filteredIntents[0].id === 'catalogo' || filteredIntents[0].id === 'inventario') && 
                filteredIntents[0].id !== pageContext.intentId) {
                // Combinar la intro de la página con la respuesta genérica si aplica
                responsePayload.text = this.addPageContextPrefix(responsePayload.text, pageContext);
            }"""

new_prefix = """            if (filteredIntents.length === 1 && pageContext &&
                (filteredIntents[0].id === 'precios' || filteredIntents[0].id === 'catalogo' || filteredIntents[0].id === 'inventario') && 
                filteredIntents[0].id !== pageContext.intentId &&
                filteredIntents[0].id !== 'quienes_somos') { // Nunca anexar prefijos de pantalla si es "informacion/quienes_somos"
                // Combinar la intro de la página con la respuesta genérica si aplica
                responsePayload.text = this.addPageContextPrefix(responsePayload.text, pageContext);
            }"""

if old_prefix in text:
    text = text.replace(old_prefix, new_prefix)
    print("Page prefix logic updated successfully!")
else:
    print("WARNING: Could not find page prefix logic.")

with open("app/static/js/menu-system.js", "w", encoding="utf-8") as f:
    f.write(text)
