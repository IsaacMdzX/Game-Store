import re

with open("app/static/js/menu-system.js", "r", encoding="utf-8") as f:
    text = f.read()

# Replace the intent search to correctly prioritize the user address intent if "mi direccion" is mentioned over "ubicacion de la tienda"
old_compose = """        const uniqueById = [];
        const seen = new Set();
        matched.forEach((intent) => {
            if (!seen.has(intent.id)) {
                seen.add(intent.id);
                uniqueById.push(intent);
            }
        });"""

new_compose = """        // Lógica para diferenciar ubicación de la tienda vs ubicación del cliente
        const isClientAddress = /\\b(mi direccion|mi dirección|mi ubicacion|mi ubicación|poner direccion|agregar direccion|envio|envíos|envios)\\b/i.test(normalizedQuery);
        if (isClientAddress) {
            matched = matched.filter(intent => intent.id !== 'ubicacion');
        } else {
             const isStoreLocation = /\\b(ubicacion|ubicación|donde estan|donde están|tienda fisica)\\b/i.test(normalizedQuery);
             if (isStoreLocation) {
                 matched = matched.filter(intent => intent.id !== 'envios');
             }
        }

        const uniqueById = [];
        const seen = new Set();
        matched.forEach((intent) => {
            if (!seen.has(intent.id)) {
                seen.add(intent.id);
                uniqueById.push(intent);
            }
        });"""

if old_compose in text:
    text = text.replace(old_compose, new_compose)
    print("Logic injected")

with open("app/static/js/menu-system.js", "w", encoding="utf-8") as f:
    f.write(text)
