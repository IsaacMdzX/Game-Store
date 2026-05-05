import re

with open("app/static/css/mobile-aesthetic.css", "r", encoding="utf-8") as f:
    css = f.read()

# Replace the chatbot full-screen takeover if it exists, or append it
old_chatbot = """    .chatbot-panel.show {
        height: 100dvh !important;
        max-height: 100dvh !important;
        top: 0 !important;
        bottom: 0 !important;
        border-radius: 0 !important;
        width: 100vw !important;
        right: 0 !important;
        position: fixed !important;
        z-index: 99999 !important;
    }"""

new_chatbot = """    /* Redimensionando chatbot para que no ocupe 100% de la pantalla */
    .chatbot-panel.show {
        height: 85dvh !important; /* Altura más moderada */
        max-height: 85dvh !important;
        top: auto !important; /* Dejar que se pegue abajo */
        bottom: 0 !important;
        border-radius: 20px 20px 0 0 !important; /* Bordes solo arriba */
        width: 100vw !important;
        right: 0 !important;
        left: 0 !important;
        position: fixed !important;
        z-index: 99999 !important;
        box-shadow: 0 -5px 20px rgba(0,0,0,0.5) !important;
    }"""

if old_chatbot in css:
    css = css.replace(old_chatbot, new_chatbot)
    print("Chatbot css updated in mobile-aesthetic")
else:
    css += "\n\n@media (max-width: 768px) {\n" + new_chatbot + "\n}\n"
    print("Chatbot css appended to mobile-aesthetic")

with open("app/static/css/mobile-aesthetic.css", "w", encoding="utf-8") as f:
    f.write(css)
