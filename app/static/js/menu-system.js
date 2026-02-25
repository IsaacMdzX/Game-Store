// ============================================
// SISTEMA DE MENÚ UNIFICADO Y EFICIENTE
// ============================================

class MenuManager {
    constructor() {
        this.sidebar = document.querySelector('.barra_lateral');
        this.header = document.querySelector('header');
        this.body = document.body;
        this.hamburgerBtn = null;
        this.overlay = null;
        this.isMobile = window.innerWidth <= 575;
        this.isMenuOpen = false;
        this.resizeTimer = null;
        
        this.init();
    }

    init() {
        if (!this.sidebar || !this.header) return;
        
        this.setupElements();
        this.attachEventListeners();
        this.handleInitialLoad();
    }

    setupElements() {
        // Crear hamburguesa si no existe
        if (!this.header.querySelector('.hamburger-btn')) {
            this.hamburgerBtn = document.createElement('button');
            this.hamburgerBtn.className = 'hamburger-btn';
            this.hamburgerBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
            this.hamburgerBtn.setAttribute('aria-label', 'Menú');
            this.hamburgerBtn.setAttribute('type', 'button');
            this.header.insertBefore(this.hamburgerBtn, this.header.firstChild);
        } else {
            this.hamburgerBtn = this.header.querySelector('.hamburger-btn');
        }

        // Crear overlay si no existe
        if (!document.querySelector('.mobile-overlay')) {
            this.overlay = document.createElement('div');
            this.overlay.className = 'mobile-overlay';
            this.body.appendChild(this.overlay);
        } else {
            this.overlay = document.querySelector('.mobile-overlay');
        }

        this.updateMenuVisibility();
    }

    attachEventListeners() {
        // Click en hamburguesa
        if (this.hamburgerBtn) {
            this.hamburgerBtn.addEventListener('click', e => this.toggleMenu(e), false);
        }

        // Click en overlay - IMPORTANTE para cerrar
        if (this.overlay) {
            this.overlay.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closeMenu();
            }, false);
        }

        // Click en enlace del menú
        this.sidebar.addEventListener('click', e => {
            const enlace = e.target.closest('a');
            if (enlace && this.isMobile && this.isMenuOpen) {
                this.closeMenu();
            }
        }, false);

        // Resize con debounce
        window.addEventListener('resize', () => this.handleResize(), false);

        // Cerrar menú con ESC
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
            }
        }, false);

        // Click fuera del menú en dispositivos móviles
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && this.isMobile) {
                const clickedInSidebar = this.sidebar.contains(e.target);
                const clickedInButton = this.hamburgerBtn && this.hamburgerBtn.contains(e.target);
                if (!clickedInSidebar && !clickedInButton) {
                    this.closeMenu();
                }
            }
        }, true);
    }

    handleInitialLoad() {
        this.isMobile = window.innerWidth <= 575;
        this.updateMenuVisibility();
    }

    handleResize() {
        // Debounce del resize
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
            const wasMobile = this.isMobile;
            this.isMobile = window.innerWidth <= 575;

            if (wasMobile !== this.isMobile) {
                this.closeMenu();
                this.updateMenuVisibility();
            }
        }, 250);
    }

    toggleMenu(e) {
        e.stopPropagation();
        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        if (!this.isMobile) return;
        
        this.isMenuOpen = true;
        this.sidebar.classList.add('mobile-open');
        this.body.classList.add('menu-open');
        if (this.overlay) this.overlay.classList.add('show');
        this.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        
        this.sidebar.focus();
    }

    closeMenu() {
        this.isMenuOpen = false;
        this.sidebar.classList.remove('mobile-open');
        this.body.classList.remove('menu-open');
        if (this.overlay) this.overlay.classList.remove('show');
        this.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        
        if (this.hamburgerBtn) {
            this.hamburgerBtn.focus();
        }
    }

    updateMenuVisibility() {
        if (this.isMobile) {
            if (this.hamburgerBtn) this.hamburgerBtn.style.display = 'flex';
            this.sidebar.classList.remove('mobile-open');
            if (this.overlay) this.overlay.classList.remove('show');
        } else {
            if (this.hamburgerBtn) this.hamburgerBtn.style.display = 'none';
            this.closeMenu();
            this.sidebar.style.left = '0';
        }
    }
}

// ============================================
// USER MENU MEJORADO
// ============================================

class UserMenuManager {
    constructor() {
        this.userMenuBtn = document.getElementById('userMenuBtn');
        this.userDropdown = document.getElementById('userDropdown');
        this.isOpen = false;
        
        if (this.userMenuBtn && this.userDropdown) {
            this.init();
        }
    }

    init() {
        // Click en botón de usuario
        this.userMenuBtn.addEventListener('click', e => this.toggle(e), false);

        // Click fuera del dropdown
        document.addEventListener('click', e => {
            if (!this.userDropdown.contains(e.target) && !this.userMenuBtn.contains(e.target)) {
                this.close();
            }
        }, false);

        // Prevenir cierre cuando se clickea dentro
        this.userDropdown.addEventListener('click', e => {
            e.stopPropagation();
        }, false);

        // Cerrar con ESC
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        }, false);

        // Items del dropdown
        const items = this.userDropdown.querySelectorAll('a, button');
        items.forEach(item => {
            item.addEventListener('click', () => this.close(), false);
        });
    }

    toggle(e) {
        e.stopPropagation();
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.isOpen = true;
        this.userDropdown.classList.add('show');
        this.userMenuBtn.setAttribute('aria-expanded', 'true');
    }

    close() {
        this.isOpen = false;
        this.userDropdown.classList.remove('show');
        this.userMenuBtn.setAttribute('aria-expanded', 'false');
    }
}

// ============================================
// BÚSQUEDA OPTIMIZADA
// ============================================

class SearchManager {
    constructor() {
        this.searchInput = document.querySelector('#buscar-input');
        this.searchBtn = document.querySelector('.btn_buscar');
        this.searchTimer = null;
        
        if (this.searchInput) {
            this.init();
        }
    }

    init() {
        // Enter en input
        this.searchInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.performSearch();
            }
        }, false);

        // Click en botón
        if (this.searchBtn) {
            this.searchBtn.addEventListener('click', () => this.performSearch(), false);
        }

        // Focus smoothscroll (solo móvil)
        this.searchInput.addEventListener('focus', () => {
            if (window.innerWidth <= 575) {
                setTimeout(() => {
                    this.searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            }
        }, false);
    }

    performSearch() {
        const query = this.searchInput.value.trim();
        if (query.length > 0) {
            console.log('Buscando:', query);
            // Implementar lógica de búsqueda aquí
        }
    }
}

// ============================================
// LAZY LOADING EFICIENTE
// ============================================

class LazyLoadManager {
    constructor() {
        if ('IntersectionObserver' in window) {
            this.init();
        }
    }

    init() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        delete img.dataset.src;
                    }
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });

        // Observar nuevas imágenes dinamicamente
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeName === 'IMG' && node.dataset.src) {
                        imageObserver.observe(node);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar todos los managers
    const menuManager = new MenuManager();
    const userMenuManager = new UserMenuManager();
    const searchManager = new SearchManager();
    const lazyLoadManager = new LazyLoadManager();

    // Hacer accesibles globalmente si es necesario
    window.menuManager = menuManager;
    window.userMenuManager = userMenuManager;

    console.log('✅ Sistema de menú inicializado correctamente');
}, { passive: true });

// ============================================
// UTILITIES
// ============================================

// Función helper para cerrar todos los menús
function closeAllMenus() {
    if (window.menuManager) window.menuManager.closeMenu();
    if (window.userMenuManager) window.userMenuManager.close();
}

// Hacer disponible globalmente
window.closeAllMenus = closeAllMenus;
