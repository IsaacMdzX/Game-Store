import re

with open('app/static/js/menu-system.js', 'r', encoding='utf-8') as f:
    content = f.read()

with open('patch_intents.js', 'r', encoding='utf-8') as f:
    new_intents = f.read()

# Buscamos el bloque de favoritos original para reemplazarlo por los nuevos
pattern = r"\{\s*id:\s*'favoritos'[\s\S]*?\},"

new_content = re.sub(pattern, new_intents, content, count=1)

with open('app/static/js/menu-system.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print('Hecho')
