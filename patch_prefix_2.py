import re

with open("app/static/js/menu-system.js", "r", encoding="utf-8") as f:
    text = f.read()

old_res = """        if (filteredIntents.length === 1) {
            return {
                text: this.addPageContextPrefix(filteredIntents[0].response, filteredIntents, normalizedQuery),
                intents: filteredIntents,
                normalizedQuery
            };
        }"""

new_res = """        if (filteredIntents.length === 1) {
            let finalResponseText = filteredIntents[0].response;
            if (filteredIntents[0].id !== 'quienes_somos') {
                finalResponseText = this.addPageContextPrefix(finalResponseText, filteredIntents, normalizedQuery);
            }
            return {
                text: finalResponseText,
                intents: filteredIntents,
                normalizedQuery
            };
        }"""

if old_res in text:
    text = text.replace(old_res, new_res)
    print("Direct prefix response updated successfully!")
else:
    print("WARNING: Could not find direct prefix response logic.")

with open("app/static/js/menu-system.js", "w", encoding="utf-8") as f:
    f.write(text)
