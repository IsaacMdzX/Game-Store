import re

with open('app/static/js/menu-system.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Ampliamos radicalmente el patrón de búsqueda para que intercepte casi cualquier mención de un producto 
# La clave es capturar todo lo que venga después de las palabras clave, pero si en tu captura el usuario
# puso "tienes el juego resident evil?", "tienes" NO estaba en "(tienen|busco|...)".

old_regex = r"const searchMatch = message.match\(/\\b\(tienen\|busco\|precio\|precio de\|cuanto cuesta\|cuánto cuesta\|costo\|quiero\|hay\|venden\)\\s\+\(\[\^\?\.\]\+\)/i\);"
new_regex = r"const searchMatch = message.match(/\\b(tienes|tienen|busco|precio(?: de)?|cuanto cuesta|cuánto cuesta|costo|quiero|hay|venden)\\s+(?:el juego |la consola )?([^?.]+)/i);"

text = text.replace(r"const searchMatch = message.match(/\b(tienen|busco|precio|precio de|cuanto cuesta|cuánto cuesta|costo|quiero|hay|venden)\s+([^?.]+)/i);", 
                    r"const searchMatch = message.match(/\b(tienes|tienen|busco|precio|precio de|cuanto cuesta|cuánto cuesta|costo|quiero|hay|venden)\s+(?:el\s+|la\s+|los\s+|las\s+|un\s+|una\s+|juego\s+|consola\s+|juegos\s+)*([^?.]+)/i);")

# We should also handle the case where they JUST TYPE THE NAME OF THE GAME ("RESIDENT EVIL REQUIEM PS5")
# In that case, it hits composeIntentResponse and gets "no estoy seguro de como responder". 
# So we ALSO fallback to DB search inside getResponsePayload if no intent matches!

with open('app/static/js/menu-system.js', 'w', encoding='utf-8') as f:
    f.write(text)
