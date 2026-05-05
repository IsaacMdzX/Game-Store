import re

with open('app/static/js/menu-system.js', 'r', encoding='utf-8') as f:
    text = f.read()

# I also need to update the fallback replace so 'disponibilidad' 'precio' alone works.
old_regex_fallback = r"/\\b(tienes|busco|quiero|precio de|cuanto cuesta|hay|disponibilidad de|stock de|qué precio tiene|por favor|gracias|hola)\\b/ig"
new_regex_fallback = r"/\\b(tienes|busco|quiero|precio|cuanto cuesta|hay|disponible|disponibilidad|stock|qué precio tiene|de|por favor|gracias|hola)\\b/ig"

if old_regex_fallback in text:
    text = text.replace(old_regex_fallback, new_regex_fallback)
    print("Fallback replace success")

with open('app/static/js/menu-system.js', 'w', encoding='utf-8') as f:
    f.write(text)

