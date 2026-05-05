document.addEventListener("DOMContentLoaded", function() {
    setupSidebarAccordion();
});

function setupSidebarAccordion() {
    const sidebar = document.querySelector('.barra_lateral');
    if (!sidebar) return;

    // Permitir scroll en móviles si event prevent default lo paraba
    sidebar.addEventListener('touchmove', function(e) {
        e.stopPropagation();
    }, { passive: true });

    const ul = sidebar.querySelector('ul');
    if (!ul) return;

    // Quitar márgenes indeseados para que entren todos en pantalla
    ul.style.paddingBottom = "50px"; // Dar espacio al final para poder hacer scroll cómodo

    const listItems = Array.from(ul.children);
    let currentCategoryGrp = null;

    listItems.forEach((li, index) => {
        const h3 = li.querySelector('h3');
        
        if (h3) {
            li.classList.add('category-header-item');
            
            // Estilizar el padre de H3
            li.style.background = 'rgba(255,255,255,0.08)';
            li.style.borderRadius = '10px';
            li.style.marginTop = '10px';
            li.style.overflow = 'hidden'; // Para los hijos dentro si quisieramos, pero lo dejaremos así
            
            // Estilizar H3
            h3.style.margin = '0';
            h3.style.padding = '15px';
            h3.style.fontSize = '1.1rem';
            h3.style.cursor = 'pointer';
            h3.style.display = 'flex';
            h3.style.justifyContent = 'space-between';
            h3.style.alignItems = 'center';
            h3.style.color = '#fff';

            if (!h3.querySelector('.fa-chevron-down')) {
                const icon = document.createElement('i');
                icon.className = 'fa-solid fa-chevron-down category-toggle-icon';
                icon.style.transition = 'transform 0.3s ease';
                h3.appendChild(icon);
            }
            
            currentCategoryGrp = [];
            li.categoryChildren = currentCategoryGrp;
            
            // ESTADO INICIAL: COLAPSADO (excepto el primero si se desea, lo dejaremos colapsado)
            li.classList.remove('expanded');
            
            li.addEventListener('click', function(e) {
                // Si el click feu en el h3...
                e.preventDefault();
                const icon = this.querySelector('.category-toggle-icon');
                const isExpanded = this.classList.contains('expanded');
                
                if (isExpanded) {
                    this.classList.remove('expanded');
                    if(icon) icon.style.transform = 'rotate(0deg)';
                } else {
                    this.classList.add('expanded');
                    if(icon) icon.style.transform = 'rotate(180deg)';
                }
                
                const myChildren = this.categoryChildren || [];
                myChildren.forEach(childLi => {
                    if (isExpanded) {
                        childLi.style.display = 'none';
                        // Para animar
                        childLi.style.opacity = '0';
                    } else {
                        childLi.style.display = 'block';
                        setTimeout(() => childLi.style.opacity = '1', 50);
                    }
                });
            });
            
        } else if (li.querySelector('a') && !li.querySelector('.logo') && !li.querySelector('.enlace_barra_lateral_fijo')) {
            if (currentCategoryGrp !== null) {
                currentCategoryGrp.push(li);
                
                // Estilizar los elementos hijos
                li.style.display = 'none'; // oculto por defecto
                li.style.opacity = '0';
                li.style.transition = 'opacity 0.3s ease';
                
                const a = li.querySelector('a');
                if (a) {
                    a.style.paddingLeft = '30px'; // Sangría para submenú
                    a.style.background = 'transparent';
                    a.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
                    a.style.borderRadius = '0';
                }
            }
        }
    });

    // Expandir el primer grupo por defecto
    const firstHeader = document.querySelector('.category-header-item');
    if(firstHeader) {
        firstHeader.click();
    }
}
