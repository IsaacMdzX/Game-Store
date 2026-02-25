// ============================================
// MENÚ RETRÁCTIL - Sistema de expansión/contracción
// ============================================

class MenuToggle {
    constructor() {
        this.sectionHeadings = document.querySelectorAll('nav h3');
        this.init();
    }

    init() {
        this.sectionHeadings.forEach(heading => {
            // Crear botón de toggle
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'section-toggle';
            toggleBtn.innerHTML = '<i class="fa-solid fa-chevron-down"></i>';
            toggleBtn.type = 'button';
            
            heading.appendChild(toggleBtn);
            
            // Event listener en el botón
            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleSection(heading);
            });
            
            // También permitir hacer click en el h3
            heading.style.cursor = 'pointer';
            heading.addEventListener('click', (e) => {
                if (e.target !== toggleBtn && e.target.closest('.section-toggle') === null) {
                    this.toggleSection(heading);
                }
            });
        });
    }

    toggleSection(heading) {
        const icon = heading.querySelector('.section-toggle i');
        const parentLi = heading.parentElement;
        
        // Encontrar todos los li después del h3 hasta el siguiente h3
        const itemsToToggle = [];
        let currentLi = parentLi.nextElementSibling;
        
        while (currentLi && currentLi.tagName === 'LI') {
            // Parar si encontramos otro h3 (siguiente sección)
            if (currentLi.querySelector('h3')) {
                break;
            }
            itemsToToggle.push(currentLi);
            currentLi = currentLi.nextElementSibling;
        }
        
        if (itemsToToggle.length === 0) return;
        
        // Toggle visibility
        const isHidden = itemsToToggle[0].style.display === 'none';
        
        itemsToToggle.forEach(item => {
            item.style.display = isHidden ? 'block' : 'none';
            if (isHidden) {
                item.style.animation = 'slideDown 0.3s ease';
            } else {
                item.style.animation = 'slideUp 0.3s ease';
            }
        });
        
        // Rotar icono
        icon.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(-90deg)';
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.menuToggle = new MenuToggle();
    }, { passive: true });
} else {
    window.menuToggle = new MenuToggle();
}
