import re

with open('app/static/js/menu-system.js', 'r') as f:
    content = f.read()

old_str = """                <div class="chatbot-header-actions">
                    <button type="button" class="chatbot-font-btn" aria-label="Activar texto grande" aria-pressed="false">
                        A+
                    </button>
                    <button type="button" class="chatbot-close" aria-label="Cerrar chatbot">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>"""

new_str = """                <div class="chatbot-header-actions">
                    <button type="button" class="chatbot-refresh-btn" aria-label="Reiniciar conversación" title="Reiniciar conversación">
                        <i class="fa-solid fa-arrows-rotate"></i>
                    </button>
                    <button type="button" class="chatbot-font-btn" aria-label="Activar texto grande" aria-pressed="false">
                        A+
                    </button>
                    <button type="button" class="chatbot-close" aria-label="Cerrar chatbot">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>"""

if old_str in content:
    content = content.replace(old_str, new_str)
else:
    print("Old string not found! Using regex...")
    content = re.sub(
        r'<div class="chatbot-header-actions">\s*<button type="button" class="chatbot-font-btn"[^>]*>\s*A\+\s*</button>\s*<button type="button" class="chatbot-close"[^>]*>\s*<i class="fa-solid fa-xmark"></i>\s*</button>\s*</div>',
        new_str,
        content
    )

with open('app/static/js/menu-system.js', 'w') as f:
    f.write(content)
