// ============================================
// GESTIÓN DE MENÚ RESPONSIVO MÓVIL
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const barra_lateral = document.querySelector('.barra_lateral');
    const body = document.body;

    // CREAR BOTÓN HAMBURGUESA SI NO EXISTE
    const header = document.querySelector('header');
    if (header && window.innerWidth <= 575) {
        createHamburgerButton();
    }

    // CREAR OVERLAY SI NO EXISTE
    let mobileOverlay = document.querySelector('.mobile-overlay');
    if (!mobileOverlay && window.innerWidth <= 575) {
        mobileOverlay = document.createElement('div');
        mobileOverlay.className = 'mobile-overlay';
        body.appendChild(mobileOverlay);
    }

    // FUNCIÓN PARA CREAR BOTÓN HAMBURGUESA
    function createHamburgerButton() {
        const header = document.querySelector('header');
        const existingBtn = header.querySelector('.hamburger-btn');
        
        if (!existingBtn) {
            const hamburgerBtn = document.createElement('button');
            hamburgerBtn.className = 'hamburger-btn';
            hamburgerBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
            hamburgerBtn.setAttribute('aria-label', 'Menú');
            hamburgerBtn.style.order = '-1'; // Poner antes que el buscador
            
            hamburgerBtn.addEventListener('click', toggleMenu);
            header.insertBefore(hamburgerBtn, header.firstChild);
        }
    }

    // FUNCIÓN PARA TOGGLE DEL MENÚ
    function toggleMenu() {
        const barra_lateral = document.querySelector('.barra_lateral');
        const mobileOverlay = document.querySelector('.mobile-overlay');
        
        if (barra_lateral) {
            barra_lateral.classList.toggle('mobile-open');
        }
        if (mobileOverlay) {
            mobileOverlay.classList.toggle('show');
        }
    }

    // CERRAR MENÚ AL HACER CLICK EN UN ENLACE
    const enlaces = document.querySelectorAll('.enlace_barra_lateral, .enlace_barra_lateral_fijo');
    enlaces.forEach(enlace => {
        enlace.addEventListener('click', function() {
            if (window.innerWidth <= 575) {
                const barra_lateral = document.querySelector('.barra_lateral');
                const mobileOverlay = document.querySelector('.mobile-overlay');
                
                if (barra_lateral) {
                    barra_lateral.classList.remove('mobile-open');
                }
                if (mobileOverlay) {
                    mobileOverlay.classList.remove('show');
                }
            }
        });
    });

    // CERRAR MENÚ AL HACER CLICK EN OVERLAY
    document.addEventListener('click', function(event) {
        const barra_lateral = document.querySelector('.barra_lateral');
        const mobileOverlay = document.querySelector('.mobile-overlay');
        const hamburgerBtn = document.querySelector('.hamburger-btn');
        
        if (!barra_lateral || !mobileOverlay) return;

        // Si la ventana es mayor que 575px, no hacer nada
        if (window.innerWidth > 575) return;

        // Si se clickea fuera del menú y no es el botón hamburguesa
        if (!barra_lateral.contains(event.target) && 
            !hamburgerBtn?.contains(event.target) && 
            mobileOverlay.classList.contains('show')) {
            barra_lateral.classList.remove('mobile-open');
            mobileOverlay.classList.remove('show');
        }
    });

    // MANEJAR CAMBIOS DE TAMAÑO DE VENTANA
    window.addEventListener('resize', function() {
        const barra_lateral = document.querySelector('.barra_lateral');
        const mobileOverlay = document.querySelector('.mobile-overlay');
        const hamburgerBtn = document.querySelector('.hamburger-btn');

        if (window.innerWidth > 575) {
            // Si es Desktop
            if (barra_lateral) {
                barra_lateral.classList.remove('mobile-open');
            }
            if (mobileOverlay) {
                mobileOverlay.classList.remove('show');
            }
            if (hamburgerBtn) {
                hamburgerBtn.style.display = 'none';
            }
        } else {
            // Si es Móvil
            if (!hamburgerBtn && document.querySelector('header')) {
                createHamburgerButton();
            }
            if (hamburgerBtn) {
                hamburgerBtn.style.display = 'flex';
            }
        }
    });

    // OPTIMIZAR INPUT DE BÚSQUEDA PARA MÓVIL
    const searchInput = document.querySelector('#buscar-input');
    if (searchInput) {
        searchInput.addEventListener('focus', function() {
            if (window.innerWidth <= 575) {
                setTimeout(() => {
                    window.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            }
        });
    }

    // MEJORAS DE RENDIMIENTO PARA MÓVIL
    // Lazy loading de imágenes
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // VALIDACIÓN DE FORMULARIOS EN MÓVIL
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            // Asegurar que todos los campos sean válidos
            const inputs = form.querySelectorAll('input[required], select[required]');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.style.borderColor = 'red';
                    isValid = false;
                } else {
                    input.style.borderColor = '';
                }
            });

            if (!isValid) {
                e.preventDefault();
                alert('Por favor completa todos los campos requeridos');
            }
        });
    });

    // MEJORAR EXPERIENCIA DE SCROLL EN MÓVIL
    let lastScrollTop = 0;
    const header_element = document.querySelector('header');
    
    if (header_element) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Ocultar header al hacer scroll hacia abajo
            if (scrollTop > lastScrollTop && scrollTop > 80) {
                header_element.style.transform = 'translateY(-100%)';
                header_element.style.transition = 'transform 0.3s ease';
            } else {
                header_element.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        }, false);
    }
});

// ============================================
// FUNCIÓN AUXILIAR PARA TOGGLE DE CLASES
// ============================================
function toggleClass(selector, className) {
    const element = document.querySelector(selector);
    if (element) {
        element.classList.toggle(className);
    }
}

// ============================================
// NOTIFICACIÓN DE CAMBIO DE ORIENTACIÓN
// ============================================
window.addEventListener('orientationchange', function() {
    // Reajustar layout después de cambio de orientación
    const barra_lateral = document.querySelector('.barra_lateral');
    if (barra_lateral) {
        barra_lateral.classList.remove('mobile-open');
    }
    const mobileOverlay = document.querySelector('.mobile-overlay');
    if (mobileOverlay) {
        mobileOverlay.classList.remove('show');
    }
    
    // Recargar para mejor ajuste (opcional)
    // location.reload();
});
