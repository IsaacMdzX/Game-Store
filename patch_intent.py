with open("app/static/js/menu-system.js", "r", encoding="utf-8") as f:
    text = f.read()

old_productos_intent = """            {
                id: 'productos',
                pattern: /\\b(producto|productos|catalogo|catálogo|tienda|stock|disponible|disponibilidad)\\b/,
                response: 'Puedes explorar productos por categorías y revisar disponibilidad directamente en cada tarjeta.'
            }"""

new_productos_intent = """            {
                id: 'productos',
                pattern: /\\b(producto|productos|vende|venden|vendes|ofrece|ofrecen|ofreces|catalogo|catálogo|tienda|stock|disponible|disponibilidad)\\b/,
                response: 'En nuestra tienda contamos con una gran variedad de opciones. Vendemos principalmente cuatro categorías:\\n\\n🎮 **Juegos**\\n🕹️ **Consolas**\\n🎮 **Controles**\\n🎧 **Accesorios**\\n\\n¿Cuál de estas categorías te gustaría explorar hoy?'
            }"""

if old_productos_intent in text:
    text = text.replace(old_productos_intent, new_productos_intent)
    print("Intent replaced successfully!")
else:
    print("Could not find the intent block to replace.")

with open("app/static/js/menu-system.js", "w", encoding="utf-8") as f:
    f.write(text)
