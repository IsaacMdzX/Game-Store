import re

with open("app/static/js/menu-system.js", "r", encoding="utf-8") as f:
    text = f.read()

old_add_msg = """    addMessage(type, text) {
        const message = document.createElement('div');
        message.className = `chatbot-message ${type}`;
        message.textContent = text;
        this.messagesContainer.appendChild(message);
        this.scrollConversationToBottom();
        this.saveConversationState();
    }"""

new_add_msg = """    addMessage(type, text) {
        const message = document.createElement('div');
        message.className = `chatbot-message ${type}`;
        
        let formattedText = text;
        if (type === 'bot') {
            const div = document.createElement('div');
            div.textContent = text;
            formattedText = div.innerHTML;
            
            // Negritas
            formattedText = formattedText.replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>');
            // Saltos de línea
            formattedText = formattedText.replace(/\\n/g, '<br>');
            message.innerHTML = formattedText;
        } else {
            message.textContent = text;
        }

        this.messagesContainer.appendChild(message);
        this.scrollConversationToBottom();
        this.saveConversationState();
    }"""

if old_add_msg in text:
    text = text.replace(old_add_msg, new_add_msg)
    print("addMessage updated successfully!")
else:
    print("WARNING: Could not find old addMessage.")

with open("app/static/js/menu-system.js", "w", encoding="utf-8") as f:
    f.write(text)
