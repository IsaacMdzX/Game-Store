import re

with open('app/static/js/menu-system.js', 'r') as f:
    content = f.read()

# Buscamos dónde insertar los nuevos intents
# Para evitar machacar lo anterior, reemplazaremos las respuestas de 'devoluciones', 'cuenta', 'pagos', etc. que son relevantes
# Pero podemos simplemente inyectar nuevas.
# Ya tenemos unas similares pero el usuario pidió más específicas, vamos a actualizar las respuestas y agregar nuevos patrones.

old_devoluciones = """            {
                id: 'devoluciones',
                pattern: /\\b(devolucion|devoluciones|reembolso|garantia|garantía|cambio|cancelar|cancelacion|cancelación|devolver)\\b/,
                response: 'Para devoluciones o reembolsos, lo ideal es escribir a soporte con tu número de pedido y motivo para darte una solución rápida.'
            },"""

new_devoluciones = """            {
                id: 'devoluciones',
                pattern: /\\b(devolucion|devoluciones|reembolso|garantia|garantía|cambio|cancelar|cancelacion|cancelación|devolver)\\b/,
                response: 'Para devoluciones de productos, reembolsos o garantías, lo ideal es escribir a soporte con tu número de pedido. Toma en cuenta que si el juego físico ya fue abierto y no cuenta con sus sellos originales, no podremos aceptar la devolución.'
            },
            {
                id: 'devolucion_abierto',
                pattern: /\\b(devolver.+abiert|devolucion.*abiert|juego.*abierto)\\b/i,
                response: 'Por políticas de seguridad, los juegos físicos no se pueden devolver si los sellos originales o el empaque ya fueron abiertos. Si tienes un defecto de fábrica comprobable, repórtalo en nuestra sección de Contacto.'
            },
            {
                id: 'tiempo_garantia',
                pattern: /\\b(cuanto|tiempo).*(garantia|garantía)\\b/i,
                response: 'La mayoría de nuestras consolas (como Nintendo Switch, PS5, Xbox) cuentan con al menos 1 año de garantía por defectos de fábrica directamente. Para más detalles contáctanos.'
            },
            {
                id: 'soporte_sincronizar',
                pattern: /\\b(no sincroniza|no conecta|falla.*control|problema.*hardware)\\b/i,
                response: 'Si tu control o consola está fallando o no sincroniza, te sugerimos reiniciar el dispositivo o consola de fábrica en los ajustes del sistema. Si el problema persiste, ponte en contacto con nosotros para validar una posible garantía.'
            },
            {
                id: 'canje_codigo',
                pattern: /\\b(canjear|canje|codigo|código|descarga|digital)\\b/i,
                response: 'Para canjear un código o juego digital, ve a la tienda virtual de tu plataforma (eShop, PlayStore o Microsoft Store), busca la opción de "Canjear código" e introduce los caracteres de tu recibo tal cual aparecen en tu compra.'
            },"""


old_cuenta = """            {
                id: 'cuenta',
                pattern: /\\b(cuenta|login|iniciar sesion|registro|registrar|contrasena|contraseña|perfil|mis datos|usuario|correo|email|acceso)\\b/,
                response: 'Con tu cuenta puedes iniciar sesión, registrarte y actualizar tus datos desde Perfil. Si tienes problemas de acceso, te guío para recuperarlo.'
            },"""

new_cuenta = """            {
                id: 'cuenta',
                pattern: /\\b(cuenta|login|iniciar sesion|registro|registrar|contrasena|contraseña|perfil|mis datos|usuario|correo|email|acceso)\\b/,
                response: 'Con tu cuenta puedes iniciar sesión, registrarte y actualizar tus datos desde Perfil.'
            },
            {
                id: 'problemas_login',
                pattern: /\\b(no puedo iniciar|no puedo entrar|olvide|olvidé|recuperar|restablecer|error iniciar)\\b/i,
                response: 'Lamento que tengas problemas de acceso a tu cuenta. A veces es tema del navegador; intenta borrar la caché o presionar en "Recuperar contraseña" en la vista de iniciar sesión. Si no recibes el correo o el problema persiste, escríbenos directamente en Contacto.'
            },"""

old_pagos = """            {
                id: 'pagos',
                pattern: /\\b(pago|pagos|pagar|tarjeta|debito|débito|credito|crédito|paypal|checkout|transaccion|transacción|pasarela|cobro)\\b/,
                response: 'Para pagar, solo ve al carrito y continúa al checkout con PayPal. Si el pago falla, intenta de nuevo y verifica conexión, datos y saldo.'
            },"""

new_pagos = """            {
                id: 'pagos',
                pattern: /\\b(pago|pagos|pagar|tarjeta|debito|débito|credito|crédito|paypal|checkout|transaccion|transacción|pasarela|cobro|metodos de pago)\\b/,
                response: 'Tu compra es 100% segura con nosotros, usamos cifrado. Aceptamos pagos mediante tarjetas de Débito/Crédito y PayPal a través del Checkout desde el carrito de compras. No manejamos pago contra entrega por seguridad.'
            },
            {
                id: 'seguridad_pago',
                pattern: /\\b(seguro|seguridad|precaucion|fraude|estafa|seguro comprar)\\b/i,
                response: '¡Es totalmente seguro comprar aquí! Toda nuestra plataforma está encriptada y monitoreada para tu seguridad y tus datos de pago (ej. PayPal) viajan asegurados. Puedes comprar con absoluta tranquilidad.'
            },"""


if old_devoluciones in content:
    content = content.replace(old_devoluciones, new_devoluciones)
else:
    print("No se encontró block devoluciones.")

if old_cuenta in content:
    content = content.replace(old_cuenta, new_cuenta)
else:
    print("No se encontró block cuenta.")

if old_pagos in content:
    content = content.replace(old_pagos, new_pagos)
else:
    print("No se encontró block pagos.")

with open('app/static/js/menu-system.js', 'w') as f:
    f.write(content)

print("Intents adicionales integrados.")

