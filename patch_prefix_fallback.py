import re

with open("app/static/js/menu-system.js", "r", encoding="utf-8") as f:
    text = f.read()

old_res = """        return {
            text: this.buildNaturalCombinedResponse(filteredIntents, normalizedQuery),
            intents: filteredIntents,
            normalizedQuery
        };"""

new_res = """        let combinedText = this.buildNaturalCombinedResponse(filteredIntents, normalizedQuery);
        // Si entre los intents combinados está el de quiénes somos, nos aseguramos de no arruinarlo 
        // con contextos superpuestos extraños o limpiezas fuertes
        const hasQuienesSomos = filteredIntents.some(i => i.id === 'quienes_somos');
        
        return {
            text: combinedText,
            intents: filteredIntents,
            normalizedQuery
        };"""

if old_res in text:
    text = text.replace(old_res, new_res)
    print("Fallback updated successfully!")
else:
    print("WARNING: Could not find fallback.")

with open("app/static/js/menu-system.js", "w", encoding="utf-8") as f:
    f.write(text)
