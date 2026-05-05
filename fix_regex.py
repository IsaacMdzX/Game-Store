with open('app/static/js/menu-system.js', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(
    r"/\\b(por favor|gracias|hola)\\b/ig,",
    r"/\b(por favor|gracias|hola)\b/ig,"
)

with open('app/static/js/menu-system.js', 'w', encoding='utf-8') as f:
    f.write(text)
