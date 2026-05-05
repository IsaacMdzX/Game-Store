import re

with open('app/static/js/menu-system.js', 'r') as f:
    content = f.read()

old_msg = r"Esta conversación quedó cerrada y se mantiene guardada en esta página\. Si quieres reiniciarla, recarga la página\."
new_msg = r"Esta conversación quedó cerrada. Si quieres volver a empezar, haz clic en el botón de reiniciar la conversación en la esquina superior derecha."

content = re.sub(old_msg, new_msg, content)

with open('app/static/js/menu-system.js', 'w') as f:
    f.write(content)
