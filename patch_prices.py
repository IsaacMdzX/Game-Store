import re

with open("app/static/js/menu-system.js", "r", encoding="utf-8") as f:
    text = f.read()

old_precios_intent = """            {
                id: 'precios',
                pattern: /\\b(precio|precios|cuanto|cuánto|valor|vale|coste|costo|oferta|ofertas|descuento|descuentos|promocion|promociones|barato|barata)\\b/,
                response: 'Sobre precios, te recomiendo validar el valor final en el carrito, porque ahí verás el monto real antes de pagar.'
            }"""

new_precios_intent = """            {
                id: 'precios',
                pattern: /\\b(precio|precios|cuanto|cuánto|valor|vale|coste|costo|costos|cuesta|cuestan|oferta|ofertas|descuento|descuentos|promocion|promociones|barato|barata)\\b/,
                response: 'Hola, los precios de cada producto son visibles debajo de la imagen de cada uno si quieres saber el precio especifico de algun producto pregunta poniendo el nombre del producto.'
            }"""

if old_precios_intent in text:
    text = text.replace(old_precios_intent, new_precios_intent)
    print("Precios intent updated successfully!")
else:
    print("WARNING: Could not find old precios intent.")

old_action_map = "precios: { label: 'Ver juegos', url: '/juegos' },"
new_action_map = "precios: { label: 'Ir a Inicio', url: '/' },"

if old_action_map in text:
    text = text.replace(old_action_map, new_action_map)
    print("Action map updated successfully!")
else:
    print("WARNING: Could not find old action map.")

with open("app/static/js/menu-system.js", "w", encoding="utf-8") as f:
    f.write(text)
