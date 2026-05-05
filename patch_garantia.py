import re

with open("app/static/js/menu-system.js", "r", encoding="utf-8") as f:
    text = f.read()

# 1. Update Devoluciones and ADD Garantia + Calidad intents
old_devoluciones = """            {
                id: 'devoluciones',
                pattern: /\\b(devolucion|devoluciones|reembolso|garantia|garantía|cambio|cancelar|cancelacion|cancelación|devolver)\\b/,
                response: 'Para devoluciones o reembolsos, lo ideal es escribir a soporte con tu número de pedido y motivo para darte una solución rápida.'
            },"""

new_garantia_and_calidad = """            {
                id: 'devoluciones',
                pattern: /\\b(devolucion|devoluciones|reembolso|cambio|cancelar|cancelacion|cancelación|devolver)\\b/,
                response: 'Para devoluciones o reembolsos, lo ideal es escribir a soporte con tu número de pedido y motivo para darte una solución rápida.'
            },
            {
                id: 'garantia',
                pattern: /\\b(garantia|garantía|garantias|garantías)\\b/i,
                response: 'Todos nuestros productos cuentan con una **garantía de 30 días** contados a partir del momento en el que se te entrega el paquete. 📦'
            },
            {
                id: 'calidad',
                pattern: /\\b(calidad|original|originales|nuevo|nuevos|autentico|auténtico|clon|clones|pirata|replica|réplica)\\b/i,
                response: '¡Así es! Todos nuestros productos son **100% originales, nuevos y de la mejor calidad** 🎮✨.\\n\\nAdemás, para tu total tranquilidad, cuentas con **30 días de garantía** posteriores a tu entrega.'
            },"""

if old_devoluciones in text:
    text = text.replace(old_devoluciones, new_garantia_and_calidad)
    print("Intents for Garantia and Calidad added!")
else:
    print("WARNING: Could not find devoluciones intent.")

# 2. Add to action map
old_action_map_dev = "devoluciones: { label: 'Ir a contacto', url: '/contactanos' },"
new_action_map_dev = "devoluciones: { label: 'Ir a contacto', url: '/contactanos' },\n            garantia: { label: 'Ir a contacto', url: '/contactanos' },\n            calidad: { label: 'Ver juegos', url: '/juegos' },"

if old_action_map_dev in text:
    text = text.replace(old_action_map_dev, new_action_map_dev)
    print("Action map updated.")
else:
    print("WARNING: Action map for devoluciones not found.")

# 3. Add to known words
old_known = "const knownWords = /\\b(hola|buenas|quiero|necesito|como|cómo|que|qué|cual|cuál|cuando|cuándo|donde|dónde|ayuda|precio|precios|pedido|pedidos|pago|pagos|envio|envios|envíos|carrito|contacto|perfil|juego|juegos|accesorio|accesorios|consola|consolas|control|controles|quienes|quiénes|somos|ubicacion|ubicación|favorito|favoritos|queja|quejas|comentario|comentarios|busco|tienes|tienda|si|no|hora|horas|horario|horarios|atencion|atención)\\b/;"
new_known = "const knownWords = /\\b(hola|buenas|quiero|necesito|como|cómo|que|qué|cual|cuál|cuando|cuándo|donde|dónde|ayuda|precio|precios|pedido|pedidos|pago|pagos|envio|envios|envíos|carrito|contacto|perfil|juego|juegos|accesorio|accesorios|consola|consolas|control|controles|quienes|quiénes|somos|ubicacion|ubicación|favorito|favoritos|queja|quejas|comentario|comentarios|busco|tienes|tienda|si|no|hora|horas|horario|horarios|atencion|atención|calidad|original|originales|garantia|garantía)\\b/;"

if old_known in text:
    text = text.replace(old_known, new_known)
    print("Known words updated.")

# 4. Enhance follow-up context logic for conversational coherence
old_followup = r"return /\b(y|tambien|tambien quiero|de eso|de eso mismo|de ese|de esa|eso|mas|mas info|otro|otra)\b/.test(normalizedQuery);"
new_followup = r"return /\b(y|tambien|también|entonces|además|ademas|de eso|de eso mismo|de ese|de esa|eso|mas|mas info|otro|otra|son|tiene|tienen)\b/.test(normalizedQuery);"

if old_followup in text:
    text = text.replace(old_followup, new_followup)
    print("FollowUp pattern updated for coherence.")
else:
    print("WARNING: Follow up pattern not found.")

# 5. Add to nonMetaDomainIntents
old_domain = "const nonMetaDomainIntents = ['quejas', 'favoritos', 'pagos', 'pedidos', 'envios', 'carrito', 'devoluciones', 'cuenta', 'cat_consolas', 'cat_accesorios', 'cat_controles', 'cat_juegos', 'precios', 'contacto', 'productos', 'ubicacion', 'quienes_somos', 'recomendacion', 'seguridad', 'problema', 'horarios'];"
new_domain = "const nonMetaDomainIntents = ['quejas', 'favoritos', 'pagos', 'pedidos', 'envios', 'carrito', 'devoluciones', 'cuenta', 'cat_consolas', 'cat_accesorios', 'cat_controles', 'cat_juegos', 'precios', 'contacto', 'productos', 'ubicacion', 'quienes_somos', 'recomendacion', 'seguridad', 'problema', 'horarios', 'garantia', 'calidad'];"

if old_domain in text:
    text = text.replace(old_domain, new_domain)
    print("Domain array updated.")

with open("app/static/js/menu-system.js", "w", encoding="utf-8") as f:
    f.write(text)
