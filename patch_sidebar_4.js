document.addEventListener("DOMContentLoaded", function() {
    setupMobileSidebarAccordion();
});

function setupMobileSidebarAccordion() {
    const sidebar = document.querySelector('.barra_lateral');
    if (!sidebar) return;

    // Fix scroll capture only for mobile
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
            
            if (!h3.querySelector('.mobile-category-icon')) {
                const icon = document.createElement('i');
                icon.className = 'fa-solid fa-chevron-down mobile-category-icon';
                h3.appendChild(icon);
            }
            
            // ELIMINADO e.preventDefault(), tal vez detiene propagaciones extrañas
            li.addEventListener('click', function(e) {
                if (window.innerWidth > 600) return; // NADA EN ESCRITORIO
                
                // toggle global expanded state on header
                this.classList.toggle('expanded');
                
                // apply toggle classes directly to child nodes
                const myChildren = this.categoryChildren || [];
                myChildren.forEach(childLi => {
                    childLi.classList.toggle('show-mobile-item');
                });
            });
            
            currentCategoryGrp = [];
            li.categoryChildren = currentCategoryGrp;
            
        } else if (li.querySelector('a') && !li.querySelector('.logo') && !li.querySelector('.enlace_barra_lateral_fijo')) {
            if (currentCategoryGrp !== null) {
                li.classList.add('mobile-accordion-item');
                currentCategoryGrp.push(li); // this works fine
            }
        }
    });

    // Expandir la primera por defecto
    setTimeout(() => {
        if(window.innerWidth <= 600) {
            const firstHeader = document.querySelector('.mobile-accordion-header');
            if(firstHeader && !firstHeader.classList.contains('expanded')) {
                firstHeader.click();
            }
        }
    }, 100);
}
