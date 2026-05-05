import re

with open('app/static/js/menu-system.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Buscamos la función attachEvents que parece tener más sentido
# o la función createWidget
