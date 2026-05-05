import re

with open('app/static/js/menu-system.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update the Action Map URL for "favoritos"
content = re.sub(r"favoritos: \{ label: 'Mis favoritos', url: '/perfil/favoritos' \},",
                 "favoritos: { label: 'Mis favoritos', url: '/favoritos' },", 
                 content)

# 2. Add to nonMetaDomainIntents
content = content.replace(
    "const nonMetaDomainIntents = ['pagos', 'pedidos', 'envios', 'carrito', 'devoluciones', 'cuenta', 'cat_consolas', 'cat_accesorios', 'cat_controles', 'cat_juegos', 'precios', 'contacto', 'productos', 'ubicacion', 'quienes_somos', 'recomendacion', 'seguridad', 'problema'];",
    "const nonMetaDomainIntents = ['quejas', 'favoritos', 'pagos', 'pedidos', 'envios', 'carrito', 'devoluciones', 'cuenta', 'cat_consolas', 'cat_accesorios', 'cat_controles', 'cat_juegos', 'precios', 'contacto', 'productos', 'ubicacion', 'quienes_somos', 'recomendacion', 'seguridad', 'problema'];"
)

# 3. Add to priorityOrder
content = content.replace(
    "const priorityOrder = ['despedida', 'problema', 'pagos', 'pedidos', 'envios', 'carrito', 'devoluciones', 'cuenta', 'cat_consolas', 'cat_accesorios', 'cat_controles', 'cat_juegos', 'precios', 'quienes_somos', 'recomendacion', 'contacto', 'ubicacion', 'seguridad', 'productos', 'saludo', 'agradecimiento'];",
    "const priorityOrder = ['despedida', 'quejas', 'problema', 'favoritos', 'pagos', 'pedidos', 'envios', 'carrito', 'devoluciones', 'cuenta', 'cat_consolas', 'cat_accesorios', 'cat_controles', 'cat_juegos', 'precios', 'quienes_somos', 'recomendacion', 'contacto', 'ubicacion', 'seguridad', 'productos', 'saludo', 'agradecimiento'];"
)

# 4. Add to knownWords in isLikelyNonsenseQuery (just to be absolutely 1000% safe)
content = content.replace(
    "const knownWords = /\\b(hola|buenas|quiero|necesito|como|cómo|que|qué|cual|cuál|cuando|cuándo|donde|dónde|ayuda|precio|precios|pedido|pedidos|pago|pagos|envio|envios|envíos|carrito|contacto|perfil|juego|juegos|accesorio|accesorios|consola|consolas|control|controles|quienes|quiénes|somos|ubicacion|ubicación)\\b/;",
    "const knownWords = /\\b(hola|buenas|quiero|necesito|como|cómo|que|qué|cual|cuál|cuando|cuándo|donde|dónde|ayuda|precio|precios|pedido|pedidos|pago|pagos|envio|envios|envíos|carrito|contacto|perfil|juego|juegos|accesorio|accesorios|consola|consolas|control|controles|quienes|quiénes|somos|ubicacion|ubicación|favorito|favoritos|queja|quejas|comentario|comentarios)\\b/;"
)

with open('app/static/js/menu-system.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Favoritos fixed!")
