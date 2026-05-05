document.addEventListener("DOMContentLoaded", function() {
    // Evitar que el script se inicialice más de una vez
    if (window._sidebarAccordionInited) return;
    window._sidebarAccordionInited = true;

    setupMobileSidebarAccordion();
});

function setupMobileSidebarAccordion() {
    const sidebar = document.querySelector('.barra_lateral');
    if (!sidebar) return;

    // Permitir scroll interno desactivando propagation solo en movil
    sidebar.addEventListener('touchmove', function(e) {
        if (window.innerWidth <= 600) {
            e.stopPropagation();
        }
    }, { passive: true });

    const ul = sidebar.querySelector('ul');
    if (!ul) return;

    const listItems = Array.from(ul.children);
    let currentCategoryGrp = null;

    listItems.forEach((li) => {
        const h3 = li.querySelector('h3');
        if (h3) {
            li.classList.add('mobile-accordion-header');
            
            // Asegurarnos de limpiar iconos viejos si el script se corre 2 veces por error
            const oldIcons = h3.querySelectorAll('i.mobile-category-icon, i.category-toggle-icon');
            oldIcons.forEach(i => i.remove());

            const icon = document.createElement('i');
            icon.className = 'fa-solid fa-chevron-down mobile-category-icon';
            h3.appendChild(icon);
            
            // IMPORTANTE: Asegurar que los hijos entran por referencia limpia
            currentCategoryGrp = [];
            li.categoryChildren = currentCategoryGrp;
            
            // Reemplazar eventos viejos con cloneNode (por si hay duplicidad de listeners zombies)
            const clonedLi = li.cloneNode(true);
            li.parentNode.replaceChild(clonedLi, li);
            
            // Re-asignar el puntero del array al nodo nuevo
            clonedLi.categoryChildren = currentCategoryGrp;

            clonedLi.addEventListener('click', function(e) {
                if (window.innerWidth > 600) return; // Nada en escritorio
                
                // Toggle expansion flag para CSS
                this.classList.toggle('expanded');
                
                // Toggle a cada hijo
                const myChildren = this.categoryChildren || [];
                myChildren.forEach(childLi => {
                    childLi.classList.toggle('show-mobile-item');
                });
            });
            
        } else if (li.querySelector('a') && !li.querySelector('.logo') && !li.querySelector('.enlace_barra_lateral_fijo')) {
            if (currentCategoryGrp !== null) {
                li.classList.add('mobile-accordion-item');
                currentCategoryGrp.push(li);
            }
        }
    });

    // Expandir primera categoría si es móvil
    setTimeout(() => {
        if(window.innerWidth <= 600) {
            const firstHeader = document.querySelector('.mobile-accordion-header');
            if(firstHeader && !firstHeader.classList.contains('expanded')) {
                firstHeader.click();
            }
        }
    }, 150);
}
