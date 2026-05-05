import re

with open('app/static/js/menu-system.js', 'r', encoding='utf-8') as f:
    text = f.read()

# I want to replace the search regex
old_regex = r"/\\b(tienes|busco|quiero|precio de|cuanto cuesta|hay|disponibilidad de|stock de|que precio tiene)\\s+(el|la|los|las)?\\s*(juego|consola|control|accesorio)?\\s*(.*?)$/i;"
new_regex = r"/\\b(tienes|busco|quiero|precio|cuanto|hay|disponible|disponibilidad|stock|que precio)\\s+(de\\s+)?(el|la|los|las)?\\s*(juego|consola|control|accesorio)?\\s*(.*?)$/i;"

# The match index changes.
# In old_regex:
# 1: (tienes...)
# 2: (el...)
# 3: (juego...)
# 4: (.*?) => searchQuery = match[4]

# In new_regex:
# 1: (tienes...)
# 2: (de\s+)
# 3: (el...)
# 4: (juego...)
# 5: (.*?) => we need match[5]

# So I also need to change match[4] to match[5] everywhere in that block.

if old_regex in text:
    text = text.replace(old_regex, new_regex)
    
    # We only want to replace match[4] around this block.
    # The block looks like:
    # if (match && match[4] && match[4].length > 2) {
    #    isDirectProductSearch = true;
    #    searchQuery = match[4].replace(...
    
    old_match = "if (match && match[4] && match[4].length > 2) {\n            isDirectProductSearch = true;\n            searchQuery = match[4].replace"
    new_match = "if (match && match[5] && match[5].length > 2) {\n            isDirectProductSearch = true;\n            searchQuery = match[5].replace"
    
    text = text.replace(old_match, new_match)
    
    print("Reemplazo regex completado")
else:
    print("No encontré el regex a reemplazar")

with open('app/static/js/menu-system.js', 'w', encoding='utf-8') as f:
    f.write(text)

