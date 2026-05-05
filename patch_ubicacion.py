import re

with open("app/static/js/menu-system.js", "r", encoding="utf-8") as f:
    text = f.read()

old_envios = """            {
                id: 'envios',
                pattern: /\\b(envio|envíos|envios|entrega|domicilio|llega|despacho|shipping|direccion|dirección|reparto)\\b/,
                response: 'Con gusto te ayudo con envíos. Antes de pagar, revisa bien tu dirección y luego consulta el avance en Pedidos.'
            }"""

new_envios = """            {
                id: 'envios',
                pattern: /\\b(envio|envíos|envios|entrega|domicilio|llega|despacho|shipping|reparto|direccion|dirección|mi direccion|mi dirección|mi ubicacion|mi ubicación|poner direccion)\\b/,
                response: 'Para recibir tus compras de GameStore, puedes agregar o actualizar tu dirección y ubicación de envío directamente en tu perfil. Desde allí gestionaremos tus entregas.'
            }"""

if old_envios in text:
    text = text.replace(old_envios, new_envios)
    print("Envios updated!")

old_ubicacion = """            {
                id: 'ubicacion',
                pattern: /\\b(ubicacion|ubicación|donde estan|donde están|direccion de tienda|tienda fisica|tienda física|mapa)\\b/,
                response: 'Si quieres, te llevo a Ubicación para que veas el mapa y datos de referencia de la tienda.'
            }"""

new_ubicacion = """            {
                id: 'ubicacion',
                pattern: /\\b(ubicacion|ubicación|donde estan|donde están|direccion de tienda|direccion de la tienda|tienda fisica|tienda física|mapa|donde se ubican|donde se encuentran|donde es la tienda)\\b/,
                response: '¡Nuestra tienda GameStore está ubicada en el corazón de la ciudad!📍\\n\\nVisítanos para ver nuestras consolas y juegos en persona. Te invito a pasar a nuestra sección de Ubicación para ver el mapa exacto.'
            }"""

if old_ubicacion in text:
    text = text.replace(old_ubicacion, new_ubicacion)
    print("Ubicacion updated!")

with open("app/static/js/menu-system.js", "w", encoding="utf-8") as f:
    f.write(text)
