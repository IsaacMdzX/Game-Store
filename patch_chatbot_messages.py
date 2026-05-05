import re

with open("app/static/css/mobile-aesthetic.css", "r", encoding="utf-8") as f:
    css = f.read()

old_messages = """    .chatbot-messages {
        height: calc(100dvh - 140px) !important;
    }"""

new_messages = """    .chatbot-messages {
        height: calc(85dvh - 140px) !important;
    }"""

if old_messages in css:
    css = css.replace(old_messages, new_messages)
    print("messages height updated")
else:
    print("could not find messages height, appending override...")
    css += "\n\n@media (max-width: 768px) {\n" + new_messages + "\n}\n"

with open("app/static/css/mobile-aesthetic.css", "w", encoding="utf-8") as f:
    f.write(css)
