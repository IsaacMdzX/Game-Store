import re

with open('app/static/js/menu-system.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the broken patterns by finding them and putting the correct ones
content = re.sub(r"pattern:\s*\(queja\|quejas\|reclamacion\|reclamo\|reclamos\|comentario\|comentarios\|opinion\|opiniones\|opinio\|sugerencia\|sugerencias\|pesimo\|mal servicio/i,", 
                 r"pattern: /\\b(queja|quejas|reclamacion|reclamo|reclamos|comentario|comentarios|opinion|opiniones|opinio|sugerencia|sugerencias|pesimo|mal servicio)\\b/i,", 
                 content)

content = re.sub(r"pattern:\s*\(favoritos\|favorito\|lista de deseos\|deseos\|wishlist\|apartados\|guardados/i,", 
                 r"pattern: /\\b(favoritos|favorito|lista de deseos|deseos|wishlist|apartados|guardados)\\b/i,", 
                 content)

with open('app/static/js/menu-system.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Regex syntax fixed.")
