import re

with open('app/static/js/menu-system.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update the 'quejas' intent pattern and response. And ensure no duplicates.
# Remove existing 'quejas' blocks completely to rewrite them cleanly.
content = re.sub(r"\s*\{\s*id:\s*'quejas'[\s\S]*?\},", "", content)

# Remove existing 'favoritos' blocks completely to rewrite cleanly.
content = re.sub(r"\s*\{\s*id:\s*'favoritos'[\s\S]*?\},", "", content)

# Now, add them back exactly once before 'ubicacion'
intents_clean = """
            {
                id: 'quejas',
                pattern: /\\b(queja|quejas|reclamacion|reclamo|reclamos|comentario|comentarios|opinion|opiniones|opinio|sugerencia|sugerencias|pesimo|mal servicio)\\b/i,
                response: 'Ya sea que tengas una queja, comentario o sugerencia, nos encantaría escucharte. Para darle el mejor seguimiento, por favor escríbenos directamente en la sección de Contacto.'
            },
            {
                id: 'favoritos',
                pattern: /\\b(favoritos|favorito|lista de deseos|deseos|wishlist|apartados|guardados)\\b/i,
                response: 'En tu Lista de Deseos (Favoritos) puedes guardar los productos que te gusten para comprarlos después. Puedes acceder a ella desde el corazón en la barra de navegación o tu perfil.'
            },"""

content = re.sub(r"(\s*\{\s*id:\s*'ubicacion')", intents_clean + r"\1", content)

# 2. Fix the action map duplicates
content = re.sub(r"\s*quejas:\s*\{[^}]*\},", "", content)
content = re.sub(r"\s*favoritos:\s*\{[^}]*\},", "", content)

actions_clean = """
            quejas: { label: 'Ir a contacto', url: '/contactanos' },
            favoritos: { label: 'Mis favoritos', url: '/perfil/favoritos' },"""

content = re.sub(r"(\s*cat_consolas:)", actions_clean + r"\1", content)

# Write it back
with open('app/static/js/menu-system.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Duplicates cleaned and comentarios logic updated.")
