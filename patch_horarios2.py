import re

with open("app/static/js/menu-system.js", "r", encoding="utf-8") as f:
    text = f.read()

# Add to the action intents ignore list for fallback
old_domain = "const nonMetaDomainIntents = ['quejas', 'favoritos', 'pagos', 'pedidos', 'envios', 'carrito', 'devoluciones', 'cuenta', 'cat_consolas', 'cat_accesorios', 'cat_controles', 'cat_juegos', 'precios', 'contacto', 'productos', 'ubicacion', 'quienes_somos', 'recomendacion', 'seguridad', 'problema'];"
new_domain = "const nonMetaDomainIntents = ['quejas', 'favoritos', 'pagos', 'pedidos', 'envios', 'carrito', 'devoluciones', 'cuenta', 'cat_consolas', 'cat_accesorios', 'cat_controles', 'cat_juegos', 'precios', 'contacto', 'productos', 'ubicacion', 'quienes_somos', 'recomendacion', 'seguridad', 'problema', 'horarios'];"

if old_domain in text:
    text = text.replace(old_domain, new_domain)
    print("Action intents domain updated successfully!")

# Add to knownwords so nonsense filter passes words like "horario"
old_known = "const knownWords = /\\b(hola|buenas|quiero|necesito|como|cómo|que|qué|cual|cuál|cuando|cuándo|donde|dónde|ayuda|precio|precios|pedido|pedidos|pago|pagos|envio|envios|envíos|carrito|contacto|perfil|juego|juegos|accesorio|accesorios|consola|consolas|control|controles|quienes|quiénes|somos|ubicacion|ubicación|favorito|favoritos|queja|quejas|comentario|comentarios|busco|tienes|tienda|si|no)\\b/;"
new_known = "const knownWords = /\\b(hola|buenas|quiero|necesito|como|cómo|que|qué|cual|cuál|cuando|cuándo|donde|dónde|ayuda|precio|precios|pedido|pedidos|pago|pagos|envio|envios|envíos|carrito|contacto|perfil|juego|juegos|accesorio|accesorios|consola|consolas|control|controles|quienes|quiénes|somos|ubicacion|ubicación|favorito|favoritos|queja|quejas|comentario|comentarios|busco|tienes|tienda|si|no|hora|horas|horario|horarios|atencion|atención)\\b/;"

if old_known in text:
    text = text.replace(old_known, new_known)
    print("knownWords updated successfully!")

with open("app/static/js/menu-system.js", "w", encoding="utf-8") as f:
    f.write(text)
