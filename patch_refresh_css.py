import re

with open('app/static/js/menu-system.js', 'r') as f:
    content = f.read()

replacement_css = """            .chatbot-close, .chatbot-refresh-btn {
                border: none;
                background: rgba(255, 255, 255, 0.16);
                color: #fff;
                width: 44px;
                height: 44px;
                border-radius: 10px;
                cursor: pointer;
                font-size: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
            }"""

content = re.sub(r"\.chatbot-close\s*\{[^}]+\}", replacement_css, content)

with open('app/static/js/menu-system.js', 'w') as f:
    f.write(content)
