import re

with open('app/static/js/menu-system.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Buscamos donde asigna los events en createWidget
old_events = """        this.toggleBtn.addEventListener('click', () => this.togglePanel());
        this.fontToggleBtn.addEventListener('click', () => this.toggleFontSizePreference());
        this.menuToggleBtn.addEventListener('click', () => this.toggleOptionsMenu());
        this.panel.querySelector('.chatbot-close').addEventListener('click', () => this.closePanel());
        this.panel.querySelector('.chatbot-input-wrap').addEventListener('submit', (event) => {
            event.preventDefault();
            this.handleUserMessage(this.input.value);
        });
    }"""

new_events = """        this.toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.togglePanel();
        });
        
        this.fontToggleBtn.addEventListener('click', () => this.toggleFontSizePreference());
        this.menuToggleBtn.addEventListener('click', () => this.toggleOptionsMenu());
        this.panel.querySelector('.chatbot-close').addEventListener('click', () => this.closePanel());
        
        this.panel.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        this.panel.querySelector('.chatbot-input-wrap').addEventListener('submit', (event) => {
            event.preventDefault();
            this.handleUserMessage(this.input.value);
        });

        // Ocultar al clickear fuera
        document.addEventListener('click', (e) => {
            if (this.panel && this.panel.classList.contains('show')) {
                if (!this.panel.contains(e.target) && !this.toggleBtn.contains(e.target)) {
                    this.closePanel();
                }
            }
        });
    }"""

if old_events in text:
    text = text.replace(old_events, new_events)
    print("Eventos actualizados")
else:
    print("Eventos no encontrados")

with open('app/static/js/menu-system.js', 'w', encoding='utf-8') as f:
    f.write(text)

