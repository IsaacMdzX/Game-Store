import re

with open('app/static/js/menu-system.js', 'r') as f:
    content = f.read()

# 1. Revert suggestions
new_suggestions = """        this.suggestions = [
            {
                label: '👾 Productos',
                children: ['Juegos', 'Consolas', 'Controles', 'Accesorios', 'Precios']
            },
            {
                label: '📦 Mi Cuenta y Compras',
                children: ['Pedidos', 'Pagos', 'Favoritos', 'Carrito']
            },
            {
                label: '🎧 Soporte y FAQs',
                children: ['Contacto', 'Envíos', 'Devoluciones', '¿Problemas con tu cuenta?']
            }
        ];"""

old_suggestions = """        this.suggestions = [
            { label: 'Pagos' },
            { label: 'Pedidos' },
            { label: 'Consolas' },
            { label: 'Controles' },
            { label: 'Accesorios' },
            { label: 'Juegos' },
            { label: 'Precios' },
            { label: 'Contacto' }
        ];"""

if new_suggestions in content:
    content = content.replace(new_suggestions, old_suggestions)
    print("Sugerencias revertidas.")
else:
    print("No se encontraron las nuevas sugerencias.")

# 2. Revert setMenuVisibility
new_set_menu = """    setMenuVisibility(visible) {
        this.isMenuVisible = Boolean(visible);
        const suggestionsContainer = this.panel?.querySelector('.chatbot-suggestions');
        if (suggestionsContainer) {
            suggestionsContainer.classList.toggle('show', this.isMenuVisible);
            
            // Colapsar submenús cuando se oculta el menú principal para que al volver a abrirlo se vea desde el inicio
            if (!this.isMenuVisible) {
                const submenus = suggestionsContainer.querySelectorAll('.chatbot-submenu.show');
                submenus.forEach(sub => sub.classList.remove('show'));
                const parentBtns = suggestionsContainer.querySelectorAll('.chatbot-chip-parent.expanded');
                parentBtns.forEach(btn => {
                    btn.classList.remove('expanded');
                    btn.setAttribute('aria-expanded', 'false');
                });
            }
        }

        if (this.menuToggleBtn) {"""

old_set_menu = """    setMenuVisibility(visible) {
        this.isMenuVisible = Boolean(visible);
        const suggestionsContainer = this.panel?.querySelector('.chatbot-suggestions');
        if (suggestionsContainer) {
            suggestionsContainer.classList.toggle('show', this.isMenuVisible);
        }

        if (this.menuToggleBtn) {"""

if new_set_menu in content:
    content = content.replace(new_set_menu, old_set_menu)
    print("setMenuVisibility revertido.")
else:
    print("No se encontró setMenuVisibility.")

with open('app/static/js/menu-system.js', 'w') as f:
    f.write(content)

