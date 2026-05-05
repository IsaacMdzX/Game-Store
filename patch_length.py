with open("app/static/js/menu-system.js", "r", encoding="utf-8") as f:
    text = f.read()

# 1. Update HTML input
old_input = '<input class="chatbot-input" type="text" placeholder="Escribe tu pregunta..." aria-label="Escribe tu pregunta al chatbot">'
new_input = '<input class="chatbot-input" type="text" maxlength="200" placeholder="Escribe tu pregunta..." aria-label="Escribe tu pregunta al chatbot">'
text = text.replace(old_input, new_input)
print("Maxlength applied to input.")

# 2. Update handleUserMessage
old_handle = """    handleUserMessage(text) {
        const message = text.trim();
        if (!message) return;

        if (this.isConversationClosed) {
            this.addMessage('bot', 'Esta conversación quedó cerrada y se mantiene guardada en esta página. Si quieres reiniciarla, recarga la página.');
            this.saveConversationState();
            return;
        }

        
        this.addMessage('user', message);
        this.input.value = '';"""

new_handle = """    handleUserMessage(text) {
        const message = text.trim();
        if (!message) return;

        if (this.isConversationClosed) {
            this.addMessage('bot', 'Esta conversación quedó cerrada y se mantiene guardada en esta página. Si quieres reiniciarla, recarga la página.');
            this.saveConversationState();
            return;
        }

        this.addMessage('user', message);
        this.input.value = '';

        // INTERCEPTOR DE MENSAJES MUY LARGOS
        if (message.length > 130) {
            window.setTimeout(() => {
                this.addMessage('bot', '¡Vaya! 😅 Tu mensaje es bastante largo para mí. ¿Podrías resumirme en un par de palabras qué necesitas? (Ej: "precio de ps5", "problema con pedido").');
            }, 600);
            return;
        }"""

if old_handle in text:
    text = text.replace(old_handle, new_handle)
    print("Interceptor added.")
else:
    print("WARNING: handleUserMessage not found.")

with open("app/static/js/menu-system.js", "w", encoding="utf-8") as f:
    f.write(text)
