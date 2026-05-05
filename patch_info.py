import re

with open("app/static/js/menu-system.js", "r", encoding="utf-8") as f:
    text = f.read()

old_quienes = """            {
                id: 'quienes_somos',
                pattern: /\\b(quienes son|quienes son|quienes somos|quienes-somos|quien es game store|sobre ustedes|sobre nosotros|historia de la tienda)\\b/,
                response: 'Claro, te llevo al apartado de Quiénes Somos para que conozcas mejor la tienda.'
            }"""

new_quienes = """            {
                id: 'quienes_somos',
                pattern: /\\b(quienes son|quienes son|quienes somos|quienes-somos|quien es game store|sobre ustedes|sobre nosotros|historia de la tienda|informacion|información|mas informacion|más información|info)\\b/,
                response: '¡Somos **GameStore**! 🎮\\n\\nContamos con nuestra **tienda digital completamente 24/7** para tus compras en línea, y también tenemos **tienda física con horario de 11:00 AM a 6:00 PM**.\\n\\nTe invito a nuestra sección de "Quiénes Somos" para conocer más sobre nosotros.'
            }"""

if old_quienes in text:
    text = text.replace(old_quienes, new_quienes)
    print("Quienes somos & Informacion updated!")
else:
    print("WARNING: Could not find quienes somos intent.")

old_known = "si|no|hora|horas|horario|horarios|atencion|atención|calidad|original|originales|garantia|garantía"
new_known = "si|no|hora|horas|horario|horarios|atencion|atención|calidad|original|originales|garantia|garantía|informacion|información|info"

if old_known in text:
    text = text.replace(old_known, new_known)
    print("Known words updated with info.")

with open("app/static/js/menu-system.js", "w", encoding="utf-8") as f:
    f.write(text)
