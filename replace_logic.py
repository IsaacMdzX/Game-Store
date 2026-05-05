import re

with open('app/static/js/menu-system.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's find exactly the pattern using regex substitution
text = re.sub(
    r"/\\\\b\(tienes\|busco\|quiero\|precio de\|cuanto cuesta\)\\\\s\+\(el\|la\|los\|las\)\?\\\\s\*\((?:juego\|consola\|control\|accesorio)\)\?\\\\s\*\(\.\*\?\)\$/i",
    r"/\\b(tienes|busco|quiero|precio de|cuanto cuesta|hay|disponibilidad de|stock de|que precio tiene)\\s+(el|la|los|las)?\\s*(juego|consola|control|accesorio)?\\s*(.*?)$/i",
    text
)

text = re.sub(
    r"/\\\\b\(tienes\|busco\|quiero\|precio de\|cuanto cuesta\|por favor\|gracias\|hola\)\\\\b/ig",
    r"/\\b(tienes|busco|quiero|precio de|cuanto cuesta|hay|disponibilidad de|stock de|que precio tiene|por favor|gracias|hola)\\b/ig",
    text
)

text = re.sub(
    r"¡Encontré \$\{productos\.length\} producto\(s\)! Aquí tienes los precios:\\n\\n",
    r"¡Encontré ${productos.length} producto(s) en nuestra tienda! 👇\\n\\n",
    text
)

text = re.sub(
    r"responseText \+= `🎮 \*\*\$\{p\.nombre \|\| p\.descripcion\}\*\* - \$\$\{price\}\\\\n`;",
    r"const status = (p.stock && p.stock > 0) ? `✅ Disponible (${p.stock} unidades)` : '❌ Agotado';\n                            responseText += `🎮 **${p.nombre || p.descripcion}**\\n💰 Precio: $${price}\\n📦 Inventario: ${status}\\n\\n`;",
    text
)

with open('app/static/js/menu-system.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated via regex script")
