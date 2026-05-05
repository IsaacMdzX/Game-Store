import re

with open('app/static/js/menu-system.js', 'r') as f:
    content = f.read()

content = content.replace('class="chatbot-refresh-btn" aria-label="Reiniciar conversación" aria-pressed="false" style="margin-right: 5px;"', 'class="chatbot-refresh-btn" aria-label="Reiniciar conversación"')

with open('app/static/js/menu-system.js', 'w') as f:
    f.write(content)
