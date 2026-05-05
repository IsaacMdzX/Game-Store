import re

with open("app/static/js/menu-system.js", "r", encoding="utf-8") as f:
    text = f.read()

old_pagos_intent = """            {
                id: 'pagos',
                pattern: /\\b(pago|pagos|pagar|tarjeta|debito|débito|credito|crédito|paypal|checkout|transaccion|transacción|pasarela|cobro)\\b/,
                response: 'Para pagar, solo ve al carrito y continúa al checkout con PayPal. Si el pago falla, intenta de nuevo y verifica conexión, datos y saldo.'
            }"""

new_pagos_intent = """            {
                id: 'pagos',
                pattern: /\\b(pago|pagos|pagar|tarjeta|debito|débito|credito|crédito|paypal|checkout|transaccion|transacción|pasarela|cobro|metodo|metodos|método|métodos)\\b/,
                response: 'Aceptamos los siguientes métodos de pago para tus compras:\\n\\n💳 **Tarjeta de crédito**\\n💳 **Tarjeta de débito**\\n🌐 **PayPal**\\n\\nPuedes seleccionar tu método de pago preferido directamente de forma segura desde tu carrito al momento de finalizar tu pedido.'
            }"""

if old_pagos_intent in text:
    text = text.replace(old_pagos_intent, new_pagos_intent)
    print("Pagos intent updated successfully!")
else:
    print("WARNING: Could not find old pagos intent.")

with open("app/static/js/menu-system.js", "w", encoding="utf-8") as f:
    f.write(text)
