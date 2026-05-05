import re

with open('app/static/js/menu-system.js', 'r') as f:
    content = f.read()

css_replacement = """            .chatbot-close, .chatbot-refresh-btn {
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
                transition: background 0.2s;
            }
            
            @keyframes cb-spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }"""

content = re.sub(
    r"\.chatbot-close, \.chatbot-refresh-btn\s*\{[^}]+\}", 
    css_replacement, 
    content, 
    count=1
)

js_replacement = """        const refreshBtn = this.panel.querySelector('.chatbot-refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                const icon = refreshBtn.querySelector('i');
                if (icon) {
                    icon.style.animation = 'none';
                    icon.offsetHeight; /* trigger reflow */
                    icon.style.animation = 'cb-spin 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                }
                this.restartConversation();
            });
        }"""

content = re.sub(
    r"const refreshBtn = this\.panel\.querySelector\('\.chatbot-refresh-btn'\);\s*if \(refreshBtn\) \{\s*refreshBtn\.addEventListener\('click', \(\) => \{\s*this\.restartConversation\(\);\s*\}\);\s*\}",
    js_replacement,
    content
)

with open('app/static/js/menu-system.js', 'w') as f:
    f.write(content)
