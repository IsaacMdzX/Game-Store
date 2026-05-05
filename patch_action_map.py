import re

with open('app/static/js/menu-system.js', 'r', encoding='utf-8') as f:
    content = f.read()

new_actions = """        return {
            pagos: { label: 'Ir al carrito', url: '/carrito' },
            pedidos: { label: 'Ir a pedidos', url: '/pedidos' },
            envios: { label: 'Ir a dirección', url: '/perfil/direccion' },
            carrito: { label: 'Abrir carrito', url: '/carrito' },
            devoluciones: { label: 'Ir a contacto', url: '/contactanos' },
            cuenta: { label: 'Ir a mis datos', url: '/perfil/mis-datos' },
            contacto: { label: 'Ir a contacto', url: '/contactanos' },
            favoritos: { label: 'Ver mis favoritos', url: '/favoritos' },
            inventario_ps5_xbox: { label: 'Ver consolas', url: '/consolas' },
            precios_juegos: { label: 'Buscar juegos', url: '/juegos' },
            juegos_oferta: { label: 'Ver promociones', url: '/juegos' },
            color_accesorios: { label: 'Ver controles', url: '/controles' },
            estado_pedido_especifico: { label: 'Ver mis pedidos', url: '/pedidos' },
            tiempo_envio: { label: 'Ir al carrito', url: '/carrito' },
            numero_guia: { label: 'Ver pedidos', url: '/pedidos' },
            soporte_sincronizar: { label: 'Recibir soporte', url: '/contactanos' },
            tiempo_garantia: { label: 'Contáctanos', url: '/contactanos' },
            devolucion_abierto: { label: 'Atención al cliente', url: '/contactanos' },
            canje_codigo: { label: 'Más ayuda', url: '/contactanos' },
            problemas_login: { label: 'Iniciar sesión', url: '/login' },
            metodos_pago_seguros: { label: 'Ir al carrito', url: '/carrito' },
            recuperar_password: { label: 'Recuperar cuenta', url: '/login' },
"""

pattern = r"return\s+\{\s*pagos:\s*\{\s*label:\s*'Ir al carrito',\s*url:\s*'/carrito'\s*\},[\s\S]*?favoritos:[\s\S]*?\n\s+(?=\w+: \{ label: 'Ver consolas', url: '/consolas' \})"

# Find exact block to replace safely
pattern_safe = r"return\s+\{[^{}]*pagos:[^{}]*(?:{[^{}]*}[^{}]*)*favoritos:[^{}]*(?:{[^{}]*}[^{}]*)*"

# Let's just do a simpler search and replace string manipulation
lines = content.split('\n')
start_idx = -1
for i, line in enumerate(lines):
    if "pagos: { label: 'Ir al carrito', url: '/carrito' }," in line:
        start_idx = i
        break

if start_idx != -1:
    # insert the new items right after the `favoritos` line
    for j in range(start_idx, start_idx + 20):
        if "favoritos: {" in lines[j]:
            parts = new_actions.split('\n')[9:] # Get the ones after favoritos
            lines.insert(j+1, '\n'.join(parts))
            break

    with open('app/static/js/menu-system.js', 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    print("Action map actualitzado")
else:
    print("No se encontro")

