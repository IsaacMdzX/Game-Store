import re

with open('app/static/js/menu-system.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Update the response for nonsense 
text = text.replace(
    "text: 'No logré entender bien tu mensaje 😅. ¿Me lo puedes explicar con más detalle? Por ejemplo: pagos, pedidos, envíos, productos o contacto.'",
    "text: 'No logré entender tu mensaje 😅. Parece que escribiste algo sin sentido, números o letras al azar. Por favor, explícame tu duda nuevamente o dime si buscas un producto, pedido, contacto o ayuda en general.'"
)

with open('app/static/js/menu-system.js', 'w', encoding='utf-8') as f:
    f.write(text)

