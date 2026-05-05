import re

with open('app/static/js/menu-system.js', 'r') as f:
    content = f.read()

replacement = """        this.menuToggleBtn.addEventListener('click', () => this.toggleOptionsMenu());
        this.panel.querySelector('.chatbot-close').addEventListener('click', () => this.closePanel());
        
        const refreshBtn = this.panel.querySelector('.chatbot-refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.restartConversation();
            });
        }
        
        this.panel.addEventListener('click', (e) => {"""

content = re.sub(
    r"this\.menuToggleBtn\.addEventListener\('click', \(\) => this\.toggleOptionsMenu\(\)\);\s*this\.panel\.querySelector\('\.chatbot-close'\)\.addEventListener\('click', \(\) => this\.closePanel\(\)\);\s*this\.panel\.addEventListener\('click', \(e\) => \{",
    replacement,
    content,
    flags=re.MULTILINE
)

with open('app/static/js/menu-system.js', 'w') as f:
    f.write(content)
