import re

with open("app/static/js/menu-system.js", "r", encoding="utf-8") as f:
    text = f.read()

old_inject = """        if (this.shouldInjectPageContextIntent(normalizedQuery, matched, pageContext)) {
            const pageIntent = intents.find(intent => intent.id === pageContext.intentId);
            if (pageIntent) {
                matched.push(pageIntent);
            }
        }"""

new_inject = """        if (this.shouldInjectPageContextIntent(normalizedQuery, matched, pageContext)) {
            const isInfoQuery = /\\b(informacion|información|info|quienes son|quienes somos|historia)\\b/i.test(normalizedQuery);
            // Evitar inyectar contexto de página (como accesorios/juegos) si el usuario pide explícitamente "información" general.
            if (!isInfoQuery) {
                const pageIntent = intents.find(intent => intent.id === pageContext.intentId);
                if (pageIntent) {
                    matched.push(pageIntent);
                }
            }
        }"""

if old_inject in text:
    text = text.replace(old_inject, new_inject)
    print("Page context logic updated successfully!")
else:
    print("WARNING: Could not find page context logic.")

with open("app/static/js/menu-system.js", "w", encoding="utf-8") as f:
    f.write(text)
