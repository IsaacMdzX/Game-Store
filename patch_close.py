import re

with open('app/static/js/menu-system.js', 'r') as f:
    content = f.read()

old_str = """    closePanel() {
        this.panel.classList.remove('show');
        this.toggleBtn.setAttribute('aria-expanded', 'false');
        this.saveConversationState();
    }"""

new_str = """    closePanel() {
        this.panel.classList.remove('show');
        this.toggleBtn.setAttribute('aria-expanded', 'false');
        if (this.isConversationClosed) {
            this.restartConversation();
        }
        this.saveConversationState();
    }

    restartConversation() {
        this.isConversationClosed = false;
        this.conversationContext = { lastIntents: [], lastActions: [], turns: 0 };
        if (this.messagesContainer) {
            this.messagesContainer.innerHTML = '';
            this.addMessage('bot', this.getWelcomeMessage());
        }
        if (this.menuToggleBtn) {
            this.menuToggleBtn.style.display = '';
        }
        if (this.input) {
            this.input.disabled = false;
            this.input.placeholder = "Escribe tu pregunta...";
        }
        this.setMenuVisibility(false);
        this.saveConversationState();
    }"""

content = content.replace(old_str, new_str)

with open('app/static/js/menu-system.js', 'w') as f:
    f.write(content)
