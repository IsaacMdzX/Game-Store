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
        this.highlightAdminFaqLink();
        this.optimizeImages();
        this.observeNewImages();
        this.attachEventListeners();
        this.handleInitialLoad();
    }

    highlightAdminFaqLink() {
        const path = (window.location.pathname || '').toLowerCase();
        if (!path.startsWith('/admin/chatbot-faqs')) return;

        const faqLink = this.sidebar.querySelector('a[href="/admin/chatbot-faqs"]');
        if (!faqLink) return;

        this.sidebar.querySelectorAll('a.enlace_barra_lateral_fijo').forEach((link) => {
            link.classList.remove('enlace_barra_lateral_fijo');
            if (!link.classList.contains('enlace_barra_lateral')) {
                link.classList.add('enlace_barra_lateral');
            }
        });

        faqLink.classList.remove('enlace_barra_lateral');
        faqLink.classList.add('enlace_barra_lateral_fijo');
    }

    optimizeImages(root = document) {
        const images = root.querySelectorAll ? root.querySelectorAll('img') : [];
        images.forEach((img, index) => {
            if (!img.getAttribute('decoding')) {
                img.setAttribute('decoding', 'async');
            }

            if (img.hasAttribute('loading') || img.hasAttribute('data-eager')) {
                return;
            }

            const isLogo = img.classList.contains('logo');
            const isPriority = index < 2;

            if (isLogo || isPriority) {
                img.setAttribute('loading', 'eager');
                return;
            }

            img.setAttribute('loading', 'lazy');
        });
    }

    observeNewImages() {
        if (!window.MutationObserver) return;

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (!(node instanceof Element)) return;
                    if (node.tagName === 'IMG') {
                        this.optimizeImages(node.parentElement || document);
                        return;
                    }
                    if (node.querySelectorAll) {
                        this.optimizeImages(node);
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
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
// THEME MANAGER (MODO DÍA / MODO NOCHE)
// ============================================

class ThemeManager {
    constructor() {
        this.storageKey = 'gamestore-theme';
        this.defaultTheme = 'dark';
        this.currentTheme = this.getStoredTheme();
        this.toggleBtn = null;

        this.injectThemeStyles();
        this.applyTheme(this.currentTheme);
        this.createToggleButton();
    }

    getStoredTheme() {
        const storedTheme = localStorage.getItem(this.storageKey);
        if (storedTheme === 'light' || storedTheme === 'dark') {
            return storedTheme;
        }
        return this.defaultTheme;
    }

    applyTheme(theme) {
        const selectedTheme = theme === 'light' ? 'light' : 'dark';
        this.currentTheme = selectedTheme;
        document.documentElement.setAttribute('data-theme', selectedTheme);
        localStorage.setItem(this.storageKey, selectedTheme);
        this.updateToggleUi();
    }

    toggleTheme() {
        const nextTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(nextTheme);
    }

    createToggleButton() {
        const currentPath = window.location.pathname.toLowerCase();
        const isAuthPage = currentPath.includes('/login') ||
                          currentPath.includes('/registro') ||
                          currentPath.includes('/registroadmin');

        if (isAuthPage) return;

        this.toggleBtn = document.createElement('button');
        this.toggleBtn.className = 'theme-toggle-btn';
        this.toggleBtn.id = 'themeToggleBtn';
        this.toggleBtn.setAttribute('type', 'button');
        this.toggleBtn.setAttribute('aria-label', 'Cambiar modo de color');
        this.toggleBtn.setAttribute('aria-live', 'polite');
        this.toggleBtn.setAttribute('role', 'switch');
        this.toggleBtn.addEventListener('click', () => this.toggleTheme(), false);

        const status = document.createElement('span');
        status.className = 'theme-toggle-status';
        this.toggleBtn.appendChild(status);

        const track = document.createElement('span');
        track.className = 'theme-switch-track';

        const thumb = document.createElement('span');
        thumb.className = 'theme-switch-thumb';

        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-moon';
        thumb.appendChild(icon);
        track.appendChild(thumb);
        this.toggleBtn.appendChild(track);

        const label = document.createElement('span');
        label.className = 'theme-toggle-label';
        label.textContent = 'Tema';
        this.toggleBtn.appendChild(label);

        const notificationsBtn = document.getElementById('mostrarNotificaciones');
        const headerIcons = document.querySelector('.encabezado .iconos, .iconos');

        if (notificationsBtn && notificationsBtn.parentNode) {
            notificationsBtn.replaceWith(this.toggleBtn);
        } else if (headerIcons) {
            headerIcons.insertBefore(this.toggleBtn, headerIcons.firstChild);
        } else {
            document.body.appendChild(this.toggleBtn);
        }

        this.updateToggleUi();
    }

    updateToggleUi() {
        if (!this.toggleBtn) return;

        const icon = this.toggleBtn.querySelector('i');
        const label = this.toggleBtn.querySelector('.theme-toggle-label');
        const status = this.toggleBtn.querySelector('.theme-toggle-status');
        const isLight = this.currentTheme === 'light';

        if (icon) {
            icon.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        }

        if (label) {
            label.textContent = 'Tema';
        }

        if (status) {
            status.textContent = isLight ? 'Día' : 'Noche';
        }

        this.toggleBtn.classList.toggle('light-active', isLight);
        this.toggleBtn.setAttribute('title', isLight ? 'Cambiar a modo noche' : 'Cambiar a modo día');
        this.toggleBtn.setAttribute('aria-checked', isLight ? 'true' : 'false');
        this.toggleBtn.setAttribute('aria-label', isLight ? 'Modo día activado. Cambiar a modo noche' : 'Modo noche activado. Cambiar a modo día');
    }

    injectThemeStyles() {
        if (document.getElementById('gamestore-theme-styles')) return;

        const style = document.createElement('style');
        style.id = 'gamestore-theme-styles';
        style.textContent = `
            .theme-toggle-btn {
                position: relative;
                z-index: 1;
                border: 1px solid rgba(255, 255, 255, 0.12);
                border-radius: 999px;
                padding: 7px 10px 7px 12px;
                background: rgba(255, 255, 255, 0.08);
                color: #fff;
                box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
                display: inline-flex;
                align-items: center;
                gap: 10px;
                cursor: pointer;
                font-weight: 600;
                font-size: 12px;
                min-height: 40px;
                min-width: 40px;
                transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, border-color 0.2s ease;
            }

            .theme-toggle-btn:hover {
                transform: translateY(-2px);
                background: rgba(255, 255, 255, 0.14);
                border-color: rgba(255, 255, 255, 0.2);
                box-shadow: 0 10px 22px rgba(0, 0, 0, 0.22);
            }

            .theme-toggle-btn .theme-toggle-label {
                color: inherit;
                font-size: 11px;
                line-height: 1;
                opacity: 0.78;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }

            .theme-toggle-status {
                font-size: 12px;
                font-weight: 700;
                min-width: 38px;
                text-align: right;
            }

            .theme-switch-track {
                position: relative;
                width: 46px;
                height: 24px;
                border-radius: 999px;
                background: rgba(15, 23, 42, 0.34);
                border: 1px solid rgba(255, 255, 255, 0.1);
                display: inline-flex;
                align-items: center;
                padding: 2px;
                transition: background 0.2s ease, border-color 0.2s ease;
            }

            .theme-switch-thumb {
                width: 18px;
                height: 18px;
                border-radius: 999px;
                background: #ffffff;
                color: #58009A;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                transform: translateX(0);
                transition: transform 0.2s ease, background 0.2s ease, color 0.2s ease;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
            }

            .theme-switch-thumb i {
                font-size: 10px;
                color: inherit;
                padding: 0;
            }

            .theme-toggle-btn.light-active .theme-switch-track {
                background: rgba(168, 85, 247, 0.34);
                border-color: rgba(216, 180, 254, 0.5);
            }

            .theme-toggle-btn.light-active .theme-switch-thumb {
                transform: translateX(22px);
                background: #ffffff;
                color: #d97706;
            }

            .chatbot-toggle-btn {
                position: fixed;
                right: 16px;
                bottom: 16px;
                z-index: 2500;
                border: none;
                border-radius: 999px;
                padding: 14px 18px;
                background: linear-gradient(135deg, #58009A 0%, #8b5cf6 100%);
                color: #fff;
                box-shadow: 0 10px 30px rgba(88, 0, 154, 0.35);
                display: inline-flex;
                align-items: center;
                gap: 10px;
                cursor: pointer;
                font-weight: 600;
                font-size: 16px;
                min-height: 56px;
                min-width: 56px;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            }

            .chatbot-toggle-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 14px 34px rgba(88, 0, 154, 0.45);
            }

            .chatbot-panel {
                position: fixed;
                right: 16px;
                bottom: 88px;
                width: min(460px, calc(100vw - 24px));
                max-height: min(78vh, 700px);
                background: linear-gradient(180deg, #2b2b31 0%, #222229 100%);
                border: 1px solid rgba(168, 85, 247, 0.35);
                border-radius: 22px;
                box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
                z-index: 2499;
                display: none;
                overflow: hidden;
            }

            .chatbot-panel.show {
                display: flex;
                flex-direction: column;
            }

            .chatbot-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
                padding: 18px 20px;
                background: linear-gradient(135deg, #58009A 0%, #8b5cf6 100%);
                color: #fff;
            }

            .chatbot-title {
                display: flex;
                align-items: center;
                gap: 10px;
                font-weight: 700;
                font-size: 18px;
            }

            .chatbot-header-actions {
                display: inline-flex;
                align-items: center;
                gap: 8px;
            }

            .chatbot-font-btn {
                border: 1px solid rgba(255, 255, 255, 0.42);
                background: rgba(255, 255, 255, 0.16);
                color: #fff;
                width: 44px;
                height: 44px;
                border-radius: 10px;
                cursor: pointer;
                font-size: 16px;
                font-weight: 700;
            }

            .chatbot-font-btn.active {
                background: rgba(255, 255, 255, 0.28);
                border-color: rgba(255, 255, 255, 0.7);
            }

            .chatbot-close {
                border: none;
                background: rgba(255, 255, 255, 0.16);
                color: #fff;
                width: 44px;
                height: 44px;
                border-radius: 10px;
                cursor: pointer;
                font-size: 16px;
            }

            .chatbot-messages {
                padding: 18px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 14px;
                background: transparent;
                flex: 1 1 auto;
                min-height: 180px;
            }

            .chatbot-message {
                max-width: 92%;
                padding: 14px 16px;
                border-radius: 16px;
                line-height: 1.6;
                font-size: 17px;
            }

            .chatbot-message.bot {
                align-self: flex-start;
                background: rgba(139, 92, 246, 0.26);
                color: #ffffff;
                border: 1px solid rgba(192, 132, 252, 0.45);
            }

            .chatbot-message.user {
                align-self: flex-end;
                background: rgba(236, 72, 153, 0.3);
                color: #ffffff;
                border: 1px solid rgba(244, 114, 182, 0.45);
            }

            .chatbot-suggestions {
                display: none;
                grid-template-columns: repeat(3, minmax(0, 1fr));
                gap: 8px;
                padding: 0 18px 16px;
                border-top: 1px solid rgba(168, 85, 247, 0.18);
                margin-top: 6px;
                padding-top: 12px;
                max-height: 210px;
                overflow-y: auto;
            }

            .chatbot-suggestions.show {
                display: grid;
            }

            .chatbot-menu-toggle-wrap {
                padding: 0 18px 12px;
                display: flex;
                justify-content: flex-start;
            }

            .chatbot-menu-toggle {
                border: 1px solid rgba(168, 85, 247, 0.45);
                background: linear-gradient(135deg, rgba(168, 85, 247, 0.28), rgba(139, 92, 246, 0.24));
                color: #f5f3ff;
                border-radius: 999px;
                padding: 10px 16px;
                font-size: 14px;
                font-weight: 700;
                cursor: pointer;
                transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
                box-shadow: 0 6px 16px rgba(88, 0, 154, 0.18);
            }

            .chatbot-menu-toggle:hover {
                transform: translateY(-1px);
                background: linear-gradient(135deg, rgba(168, 85, 247, 0.36), rgba(139, 92, 246, 0.3));
                box-shadow: 0 10px 22px rgba(88, 0, 154, 0.25);
            }

            .chatbot-chip {
                border: 1px solid rgba(168, 85, 247, 0.28);
                background: rgba(255, 255, 255, 0.05);
                color: #f3e8ff;
                border-radius: 999px;
                padding: 10px 14px;
                font-size: 15px;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.18s ease, background 0.18s ease, border-color 0.18s ease;
                width: 100%;
                text-align: center;
            }

            .chatbot-chip:hover {
                transform: translateY(-1px);
                background: rgba(168, 85, 247, 0.18);
                border-color: rgba(192, 132, 252, 0.6);
            }

            .chatbot-menu-group {
                display: flex;
                flex-direction: column;
                gap: 8px;
                width: 100%;
                background: rgba(76, 29, 149, 0.12);
                border: 1px solid rgba(168, 85, 247, 0.28);
                border-radius: 14px;
                padding: 10px;
            }

            .chatbot-chip-parent {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 8px;
                width: 100%;
                padding-right: 12px;
            }

            .chatbot-chip-parent::after {
                content: '▾';
                font-size: 12px;
                transition: transform 0.2s ease;
            }

            .chatbot-chip-parent.expanded::after {
                transform: rotate(180deg);
            }

            .chatbot-submenu {
                display: none;
                flex-wrap: wrap;
                gap: 8px;
                padding-left: 4px;
            }

            .chatbot-submenu.show {
                display: flex;
            }

            .chatbot-subchip {
                border: 1px solid rgba(168, 85, 247, 0.32);
                background: rgba(255, 255, 255, 0.08);
                color: #f3e8ff;
                border-radius: 999px;
                padding: 9px 12px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.18s ease, background 0.18s ease, border-color 0.18s ease;
            }

            .chatbot-subchip:hover {
                transform: translateY(-1px);
                background: rgba(168, 85, 247, 0.22);
                border-color: rgba(192, 132, 252, 0.65);
            }

            .chatbot-quick-actions {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-top: 10px;
            }

            .chatbot-action-btn {
                border: 1px solid rgba(168, 85, 247, 0.4);
                background: rgba(168, 85, 247, 0.18);
                color: #f5f3ff;
                border-radius: 999px;
                padding: 8px 12px;
                font-size: 14px;
                font-weight: 700;
                cursor: pointer;
            }

            .chatbot-action-btn:hover {
                background: rgba(168, 85, 247, 0.3);
            }

            .chatbot-input-wrap {
                display: flex;
                gap: 10px;
                padding: 18px;
                border-top: 1px solid rgba(168, 85, 247, 0.18);
                align-items: center;
            }

            .chatbot-input {
                flex: 1;
                min-width: 0;
                width: 100%;
                border-radius: 14px;
                border: 1px solid rgba(168, 85, 247, 0.22);
                background: rgba(255, 255, 255, 0.06);
                color: #ffffff;
                padding: 14px 16px;
                font-size: 16px;
            }

            .chatbot-send {
                border: none;
                border-radius: 14px;
                min-width: 56px;
                min-height: 56px;
                background: linear-gradient(135deg, #ec4899 0%, #d946ef 100%);
                color: #fff;
                cursor: pointer;
                font-size: 18px;
            }

            .chatbot-panel.chatbot-large-text .chatbot-title {
                font-size: 20px;
            }

            .chatbot-panel.chatbot-large-text .chatbot-message {
                font-size: 19px;
                line-height: 1.7;
            }

            .chatbot-panel.chatbot-large-text .chatbot-chip {
                font-size: 16px;
                padding: 12px 16px;
            }

            .chatbot-panel.chatbot-large-text .chatbot-input {
                font-size: 18px;
                padding: 16px 18px;
            }

            .chatbot-panel.chatbot-large-text .chatbot-send,
            .chatbot-panel.chatbot-large-text .chatbot-close,
            .chatbot-panel.chatbot-large-text .chatbot-font-btn {
                min-width: 58px;
                min-height: 58px;
                font-size: 20px;
            }

            *:focus-visible {
                outline: 3px solid #a855f7 !important;
                outline-offset: 2px !important;
            }

            .theme-toggle-btn:focus-visible,
            .chatbot-toggle-btn:focus-visible,
            button:focus-visible,
            a:focus-visible,
            input:focus-visible,
            select:focus-visible,
            textarea:focus-visible {
                box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.35) !important;
            }

            html[data-theme='light'] body,
            html[data-theme='light'] body > main,
            html[data-theme='light'] main,
            html[data-theme='light'] .principal,
            html[data-theme='light'] .main-content {
                background: #ffffff !important;
                color: #111827 !important;
            }

            html[data-theme='light'] .barra_lateral {
                background: linear-gradient(#d9b8ff, #ffffff) !important;
                border-right: 1px solid #e6e8f0;
            }

            html[data-theme='light'] header,
            html[data-theme='light'] .encabezado {
                background: linear-gradient(#ffffff, #f2f4fb) !important;
                border-bottom: 1px solid #e6e8f0;
            }

            html[data-theme='light'] .container,
            html[data-theme='light'] .producto,
            html[data-theme='light'] .user-dropdown,
            html[data-theme='light'] .pago-contenedor,
            html[data-theme='light'] .resumen-pedido-pago,
            html[data-theme='light'] .card,
            html[data-theme='light'] .card-ubicacion,
            html[data-theme='light'] .pedido-card,
            html[data-theme='light'] .pedido-item,
            html[data-theme='light'] .dashboard-card,
            html[data-theme='light'] .form-card,
            html[data-theme='light'] .table-container {
                background: #ffffff !important;
                color: #111827 !important;
                border: 2px solid #e2e8f0 !important;
                box-shadow: 0 4px 12px rgba(17, 24, 39, 0.05) !important;
            }

            html[data-theme='light'] .producto:hover {
                border-color: #8b5cf6 !important;
                box-shadow: 0 12px 30px rgba(139, 92, 246, 0.15) !important;
            }

            html[data-theme='light'] h1,
            html[data-theme='light'] h2,
            html[data-theme='light'] h3,
            html[data-theme='light'] h4,
            html[data-theme='light'] h5,
            html[data-theme='light'] h6,
            html[data-theme='light'] p,
            html[data-theme='light'] span,
            html[data-theme='light'] label,
            html[data-theme='light'] .label,
            html[data-theme='light'] .description,
            html[data-theme='light'] .categoria,
            html[data-theme='light'] .dropdown-item,
            html[data-theme='light'] .preguntaxd {
                color: #111827 !important;
            }

            html[data-theme='light'] a,
            html[data-theme='light'] .enlace_barra_lateral,
            html[data-theme='light'] .enlace_barra_lateral_fijo,
            html[data-theme='light'] nav h3,
            html[data-theme='light'] .dropdown-item i,
            html[data-theme='light'] .barra_lateral i,
            html[data-theme='light'] .iconos > i,
            html[data-theme='light'] .user-menu-btn {
                color: #1f0a47 !important;
            }

            html[data-theme='light'] .enlace_barra_lateral:hover,
            html[data-theme='light'] .enlace_barra_lateral_fijo:hover,
            html[data-theme='light'] .dropdown-item:hover {
                background-color: #58009A !important;
                color: #ffffff !important;
            }

            html[data-theme='light'] .enlace_barra_lateral:hover i,
            html[data-theme='light'] .enlace_barra_lateral_fijo:hover i,
            html[data-theme='light'] .dropdown-item:hover i {
                color: #ffffff !important;
            }

            html[data-theme='light'] input,
            html[data-theme='light'] textarea,
            html[data-theme='light'] select,
            html[data-theme='light'] .input-field,
            html[data-theme='light'] .buscador input {
                background: #ffffff !important;
                color: #111827 !important;
                border: 2px solid #9ca3af !important;
            }

            html[data-theme='light'] input::placeholder,
            html[data-theme='light'] textarea::placeholder,
            html[data-theme='light'] .input-field::placeholder,
            html[data-theme='light'] .buscador input::placeholder {
                color: #6b7280 !important;
            }

            html[data-theme='light'] .producto .precio,
            html[data-theme='light'] .accent,
            html[data-theme='light'] .text-purple,
            html[data-theme='light'] .carrito-count {
                color: #58009A !important;
            }

            html[data-theme='light'] .carrito-page {
                background: #f8f9ff !important;
                color: #111827 !important;
                border: 1px solid #dbe1f0;
                border-radius: 14px;
            }

            html[data-theme='light'] .carrito-page h1,
            html[data-theme='light'] .carrito-page .subtitulo,
            html[data-theme='light'] .carrito-header h3,
            html[data-theme='light'] .item-info h4,
            html[data-theme='light'] .item-precio-unitario,
            html[data-theme='light'] .cantidad-value,
            html[data-theme='light'] .resumen-card h4,
            html[data-theme='light'] .resumen-linea,
            html[data-theme='light'] .resumen-linea span,
            html[data-theme='light'] .item-total .total-price {
                color: #111827 !important;
            }

            html[data-theme='light'] .carrito-con-items,
            html[data-theme='light'] .carrito-item,
            html[data-theme='light'] .carrito-resumen,
            html[data-theme='light'] .resumen-card,
            html[data-theme='light'] .carrito-vacio {
                background: #ffffff !important;
                border-color: #d6dded !important;
                box-shadow: 0 8px 22px rgba(15, 23, 42, 0.08) !important;
            }

            html[data-theme='light'] .carrito-header {
                background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%) !important;
                color: #ffffff !important;
            }

            html[data-theme='light'] .carrito-item:hover {
                background: #f5f7ff !important;
                border-color: #8b5cf6 !important;
            }

            html[data-theme='light'] .item-cantidad {
                background: #f3f4f8 !important;
                border: 1px solid #d4d9e6;
            }

            html[data-theme='light'] .btn-cantidad {
                background: #ffffff !important;
                color: #58009A !important;
                border: 1px solid #8b5cf6 !important;
            }

            html[data-theme='light'] .btn-cantidad:hover:not(:disabled) {
                background: #ede9fe !important;
                border-color: #7c3aed !important;
            }

            html[data-theme='light'] .btn-eliminar {
                background: #fee2e2 !important;
                color: #b91c1c !important;
                border: 1px solid #fecaca;
            }

            html[data-theme='light'] .btn-eliminar:hover {
                background: #fecaca !important;
                color: #991b1b !important;
            }

            html[data-theme='light'] .resumen-linea.total,
            html[data-theme='light'] .resumen-linea.total strong,
            html[data-theme='light'] .item-total .total-price {
                color: #58009A !important;
            }

            html[data-theme='light'] .btn-pagar,
            html[data-theme='light'] .btn-seguir-comprando,
            html[data-theme='light'] .carrito-vacio .btn {
                color: #ffffff !important;
            }

            html[data-theme='light'] .btn-pagar i,
            html[data-theme='light'] .btn-seguir-comprando i,
            html[data-theme='light'] .carrito-header i,
            html[data-theme='light'] .btn-cantidad i,
            html[data-theme='light'] .btn-eliminar i {
                color: inherit !important;
            }

            html[data-theme='light'] .iconos i,
            html[data-theme='light'] .btn_notificaciones i,
            html[data-theme='light'] .icon.carrito-link i,
            html[data-theme='light'] .user-menu-btn i {
                color: #2e1065 !important;
            }

            html[data-theme='light'] .theme-toggle-btn {
                background: #ffffff !important;
                color: #2e1065 !important;
                border: 1px solid #d6deec !important;
                box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08) !important;
            }

            html[data-theme='light'] .theme-toggle-btn:hover {
                background: #f8faff !important;
                border-color: #c4b5fd !important;
            }

            html[data-theme='light'] .theme-switch-track {
                background: #ede9fe !important;
                border-color: #d8b4fe !important;
            }

            html[data-theme='light'] .theme-switch-thumb {
                background: #ffffff !important;
                color: #7c3aed !important;
            }

            html[data-theme='light'] .theme-toggle-btn.light-active .theme-switch-thumb {
                color: #d97706 !important;
            }

            html[data-theme='light'] .carousel-container {
                background: transparent !important;
                border: none !important;
                box-shadow: none !important;
            }

            html[data-theme='light'] .carousel-slide {
                box-shadow: none !important;
            }

            html[data-theme='light'] .carousel-slide::after {
                background: radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.18), transparent 55%) !important;
            }

            html[data-theme='light'] .carousel-slide .slide-content h2,
            html[data-theme='light'] .carousel-slide .slide-content p,
            html[data-theme='light'] .carousel-slide .slide-content span {
                color: #ffffff !important;
                text-shadow: 0 2px 12px rgba(0, 0, 0, 0.18);
            }

            html[data-theme='light'] .carousel-slide .slide-content p {
                color: rgba(255, 255, 255, 0.92) !important;
            }

            html[data-theme='light'] .slide-image {
                background: transparent !important;
                border: none !important;
                border-radius: 0 !important;
                padding: 0 !important;
                backdrop-filter: none !important;
            }

            html[data-theme='light'] .slide-image img {
                filter: drop-shadow(0 18px 30px rgba(0, 0, 0, 0.35)) !important;
            }

            html[data-theme='light'] .btn-comprar {
                background: #ffffff !important;
                color: #7c3aed !important;
                box-shadow: none !important;
            }

            html[data-theme='light'] .btn-comprar:hover {
                box-shadow: none !important;
            }

            html[data-theme='light'] .dot {
                background: rgba(255, 255, 255, 0.5) !important;
            }

            html[data-theme='light'] .dot.active {
                background: #ffffff !important;
            }

            html[data-theme='light'] .chatbot-panel {
                background: #ffffff !important;
                border: 1px solid #d5deee !important;
                box-shadow: 0 20px 50px rgba(15, 23, 42, 0.16) !important;
            }

            html[data-theme='light'] .chatbot-message.bot {
                background: #ede9fe !important;
                color: #2e1065 !important;
                border-color: #c4b5fd !important;
            }

            html[data-theme='light'] .chatbot-message.user {
                background: #fce7f3 !important;
                color: #9d174d !important;
                border-color: #f472b6 !important;
            }

            html[data-theme='light'] .chatbot-chip {
                background: #f8faff !important;
                color: #4c1d95 !important;
                border-color: #d6deec !important;
            }

            html[data-theme='light'] .chatbot-menu-group {
                background: #f7f4ff !important;
                border-color: #ddd6fe !important;
            }

            html[data-theme='light'] .chatbot-subchip {
                background: #f5f3ff !important;
                color: #5b21b6 !important;
                border-color: #d8b4fe !important;
            }

            html[data-theme='light'] .chatbot-menu-toggle {
                background: linear-gradient(135deg, #ede9fe, #ddd6fe) !important;
                color: #4c1d95 !important;
                border-color: #c4b5fd !important;
            }

            html[data-theme='light'] .chatbot-suggestions {
                border-top-color: #ddd6fe !important;
            }

            html[data-theme='light'] .chatbot-action-btn {
                background: #ede9fe !important;
                color: #4c1d95 !important;
                border-color: #c4b5fd !important;
            }

            html[data-theme='light'] .chatbot-input {
                background: #ffffff !important;
                color: #111827 !important;
                border-color: #d6deec !important;
            }

            html[data-theme='light'] .no-favoritos,
            html[data-theme='light'] .no-autenticado,
            html[data-theme='light'] .no-pedidos,
            html[data-theme='light'] .pedido-item,
            html[data-theme='light'] .perfil-card-centrado,
            html[data-theme='light'] .card-informacion {
                background: #ffffff !important;
                color: #111827 !important;
                border-color: #d3dbec !important;
                box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08) !important;
            }

            html[data-theme='light'] .no-favoritos h3,
            html[data-theme='light'] .no-favoritos p,
            html[data-theme='light'] .no-autenticado h3,
            html[data-theme='light'] .no-autenticado p,
            html[data-theme='light'] .no-pedidos h2,
            html[data-theme='light'] .no-pedidos p,
            html[data-theme='light'] .pedido-item .product-title,
            html[data-theme='light'] .pedido-item .pedido-fecha,
            html[data-theme='light'] .pedido-item .pedido-meta,
            html[data-theme='light'] .pedido-item .pedido-price,
            html[data-theme='light'] .titulo-centrado,
            html[data-theme='light'] .nombre-usuario,
            html[data-theme='light'] .numero-cliente,
            html[data-theme='light'] .dato-label,
            html[data-theme='light'] .dato-valor,
            html[data-theme='light'] .accion-texto,
            html[data-theme='light'] .contenido-info h2,
            html[data-theme='light'] .contenido-info p,
            html[data-theme='light'] .contenido-info li,
            html[data-theme='light'] .contenido-info li strong {
                color: #111827 !important;
            }

            html[data-theme='light'] .no-favoritos i,
            html[data-theme='light'] .no-autenticado i,
            html[data-theme='light'] .no-pedidos i,
            html[data-theme='light'] .contenido-info h2 i {
                color: #7c3aed !important;
            }

            html[data-theme='light'] .separador {
                background: #d6dbe7 !important;
            }

            html[data-theme='light'] .accion-item-simple {
                background: #f3f4f8 !important;
                border-color: #d2d8e6 !important;
            }

            html[data-theme='light'] .accion-item-simple:hover {
                background: #ede9fe !important;
                border-color: #8b5cf6 !important;
                box-shadow: 0 8px 20px rgba(124, 58, 237, 0.2) !important;
            }

            html[data-theme='light'] .dato-input {
                background: #ffffff !important;
                color: #111827 !important;
                border: 1px solid #cfd6e6 !important;
            }

            html[data-theme='light'] .dato-input::placeholder {
                color: #6b7280 !important;
            }

            html[data-theme='light'] .form-contacto,
            html[data-theme='light'] .card-contacto {
                background: #ffffff !important;
                border: 1px solid #d5deee !important;
                box-shadow: 0 10px 26px rgba(15, 23, 42, 0.08) !important;
            }

            html[data-theme='light'] .formulario-contacto h2,
            html[data-theme='light'] .texto-contacto h3 {
                color: #6d28d9 !important;
            }

            html[data-theme='light'] .grupo-formulario label,
            html[data-theme='light'] .texto-contacto p,
            html[data-theme='light'] .texto-contacto small,
            html[data-theme='light'] .texto-contacto a {
                color: #374151 !important;
            }

            html[data-theme='light'] .redes-sociales a {
                background: #f3f4f8 !important;
                border: 1px solid #d4d9e6 !important;
                color: #6d28d9 !important;
            }

            html[data-theme='light'] .redes-sociales a:hover {
                color: #ffffff !important;
            }

            html[data-theme='light'] .btn-enviar,
            html[data-theme='light'] .btn-ver-mapa {
                color: #ffffff !important;
            }

            html[data-theme='light'] .principal > h1,
            html[data-theme='light'] .principal > div > p,
            html[data-theme='light'] .section-header h2,
            html[data-theme='light'] .chart-header h3,
            html[data-theme='light'] .modal-header h2,
            html[data-theme='light'] .no-data-message h3,
            html[data-theme='light'] .stat-value,
            html[data-theme='light'] .stat-label,
            html[data-theme='light'] .chart-legend-label,
            html[data-theme='light'] .chart-legend-value,
            html[data-theme='light'] .activity-title,
            html[data-theme='light'] .activity-description,
            html[data-theme='light'] .activity-time,
            html[data-theme='light'] .loading-container,
            html[data-theme='light'] .no-data-message p,
            html[data-theme='light'] .error-message {
                color: #111827 !important;
            }

            html[data-theme='light'] .stats-grid,
            html[data-theme='light'] .dashboard-grid,
            html[data-theme='light'] .filtros-container,
            html[data-theme='light'] .filtros-pedidos,
            html[data-theme='light'] .productos-admin-container {
                background: transparent !important;
            }

            html[data-theme='light'] .stat-card,
            html[data-theme='light'] .chart-card,
            html[data-theme='light'] .activity-card,
            html[data-theme='light'] .table-container,
            html[data-theme='light'] .loading-container,
            html[data-theme='light'] .no-data-message,
            html[data-theme='light'] .modal-content,
            html[data-theme='light'] .modal-body {
                background: #ffffff !important;
                border: 1px solid #d5deee !important;
                box-shadow: 0 10px 26px rgba(15, 23, 42, 0.08) !important;
            }

            html[data-theme='light'] .search-input,
            html[data-theme='light'] .filtro-select,
            html[data-theme='light'] .chart-select {
                background: #ffffff !important;
                color: #111827 !important;
                border: 1px solid #cdd6e6 !important;
            }

            html[data-theme='light'] .search-button,
            html[data-theme='light'] .btn-secondary {
                background: #f3f4f8 !important;
                color: #4c1d95 !important;
                border: 1px solid #cfd6e6 !important;
            }

            html[data-theme='light'] .search-button:hover,
            html[data-theme='light'] .btn-secondary:hover {
                background: #ede9fe !important;
                border-color: #a78bfa !important;
            }

            html[data-theme='light'] .badge {
                background: #ede9fe !important;
                color: #6d28d9 !important;
                border: 1px solid #c4b5fd !important;
            }

            html[data-theme='light'] .table-container table,
            html[data-theme='light'] .table-container th,
            html[data-theme='light'] .table-container td,
            html[data-theme='light'] .table-container tr,
            html[data-theme='light'] .data-table,
            html[data-theme='light'] .data-table th,
            html[data-theme='light'] .data-table td,
            html[data-theme='light'] .detail-info p,
            html[data-theme='light'] .detail-info strong,
            html[data-theme='light'] .section-title,
            html[data-theme='light'] .totals-section p,
            html[data-theme='light'] #modal-usuario small {
                color: #111827 !important;
                border-color: #d6deec !important;
            }

            html[data-theme='light'] .table-container thead th {
                background: #f3f4f8 !important;
                color: #1f2937 !important;
            }

            html[data-theme='light'] .table-container tbody tr:hover {
                background: #f8faff !important;
            }

            html[data-theme='light'] .data-table {
                background: #ffffff !important;
                border: 1px solid #d6deec !important;
            }

            html[data-theme='light'] .data-table th {
                background: #f3f4f8 !important;
                color: #1f2937 !important;
            }

            html[data-theme='light'] .data-table td {
                border-bottom: 1px solid #e2e8f0 !important;
            }

            html[data-theme='light'] .section-title {
                border-bottom: 2px solid #d6deec !important;
                color: #6d28d9 !important;
            }

            html[data-theme='light'] .totals-section {
                border-top: 2px solid #d6deec !important;
            }

            html[data-theme='light'] .modal {
                background-color: rgba(15, 23, 42, 0.32) !important;
            }

            html[data-theme='light'] .chart-legend-item {
                background: #f8faff !important;
                border: 1px solid #dee5f2 !important;
            }

            html[data-theme='light'] .modal-header {
                border-bottom: 1px solid #e2e8f0 !important;
            }

            html[data-theme='light'] .modal-close {
                color: #6b7280 !important;
            }

            html[data-theme='light'] .modal-close:hover {
                color: #1f2937 !important;
            }

            html[data-theme='light'] .status-badge,
            html[data-theme='light'] .estado-badge,
            html[data-theme='light'] .estado-pedido {
                border: 1px solid transparent !important;
            }

            html[data-theme='light'] .status-badge.pendiente,
            html[data-theme='light'] .estado-badge.pendiente,
            html[data-theme='light'] .estado-pedido.pendiente {
                background: #fff7ed !important;
                color: #b45309 !important;
                border-color: #fdba74 !important;
            }

            html[data-theme='light'] .status-badge.procesando,
            html[data-theme='light'] .estado-badge.procesando,
            html[data-theme='light'] .estado-pedido.procesando {
                background: #eff6ff !important;
                color: #1d4ed8 !important;
                border-color: #93c5fd !important;
            }

            html[data-theme='light'] .status-badge.completado,
            html[data-theme='light'] .estado-badge.completado,
            html[data-theme='light'] .estado-pedido.completado,
            html[data-theme='light'] .status-badge.activo,
            html[data-theme='light'] .estado-badge.activo {
                background: #ecfdf5 !important;
                color: #047857 !important;
                border-color: #6ee7b7 !important;
            }

            html[data-theme='light'] .status-badge.cancelado,
            html[data-theme='light'] .estado-badge.cancelado,
            html[data-theme='light'] .estado-pedido.cancelado,
            html[data-theme='light'] .status-badge.inactivo,
            html[data-theme='light'] .estado-badge.inactivo {
                background: #fef2f2 !important;
                color: #b91c1c !important;
                border-color: #fca5a5 !important;
            }

            html[data-theme='light'] .titulo-seccion {
                -webkit-text-fill-color: initial !important;
                color: #c026d3 !important;
                background: none !important;
            }

            @media (prefers-reduced-motion: reduce) {
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                    scroll-behavior: auto !important;
                }
            }

            @media (forced-colors: active) {
                .theme-toggle-btn,
                .chatbot-toggle-btn,
                button,
                a,
                input,
                select,
                textarea {
                    forced-color-adjust: auto;
                }
            }

            @media (max-width: 575px) {
                .theme-toggle-btn {
                    padding: 9px 12px;
                }

                .chatbot-toggle-btn {
                    right: 10px;
                    bottom: calc(10px + env(safe-area-inset-bottom));
                    padding: 12px 15px;
                    font-size: 15px;
                    min-height: 52px;
                }

                .chatbot-panel {
                    left: 8px;
                    right: 8px;
                    bottom: calc(72px + env(safe-area-inset-bottom));
                    width: auto;
                    height: min(78dvh, 680px);
                    max-height: min(78dvh, 680px);
                    border-radius: 18px;
                }

                .chatbot-messages {
                    min-height: 0;
                    padding: 14px;
                    gap: 10px;
                }

                .chatbot-suggestions {
                    max-height: 30vh;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                }

                .chatbot-header {
                    padding: 14px 14px;
                }

                .chatbot-title {
                    font-size: 16px;
                }

                .chatbot-font-btn,
                .chatbot-close {
                    width: 40px;
                    height: 40px;
                    min-width: 40px;
                    min-height: 40px;
                }

                .chatbot-message {
                    font-size: 16px;
                    line-height: 1.5;
                    max-width: 96%;
                    padding: 12px 13px;
                }

                .chatbot-chip {
                    font-size: 14px;
                }

                .chatbot-subchip {
                    font-size: 14px;
                }

                .chatbot-action-btn {
                    font-size: 14px;
                    padding: 9px 13px;
                }

                .chatbot-menu-toggle {
                    font-size: 14px;
                    padding: 9px 14px;
                }

                .chatbot-menu-toggle-wrap {
                    padding: 0 14px 10px;
                }

                .chatbot-menu-group {
                    padding: 9px;
                    gap: 9px;
                }

                .chatbot-chip-parent {
                    width: 100%;
                    justify-content: space-between;
                }

                .chatbot-submenu.show {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    width: 100%;
                    gap: 8px;
                    padding-left: 0;
                }

                .chatbot-subchip {
                    width: 100%;
                    text-align: center;
                    padding: 10px 8px;
                    line-height: 1.25;
                }

                .chatbot-input-wrap {
                    padding: 12px 14px calc(12px + env(safe-area-inset-bottom));
                    gap: 8px;
                }

                .chatbot-input {
                    font-size: 16px;
                    padding: 12px 13px;
                    min-width: 0;
                    width: 100%;
                }

                .chatbot-send {
                    min-width: 48px;
                    min-height: 48px;
                    flex: 0 0 48px;
                }

                .chatbot-panel.chatbot-large-text .chatbot-message {
                    font-size: 18px;
                }

                .chatbot-panel.chatbot-large-text .chatbot-input {
                    font-size: 17px;
                }

                .theme-toggle-btn .theme-toggle-label {
                    display: none;
                }

                .theme-toggle-status {
                    min-width: auto;
                    font-size: 11px;
                }
            }

            @media (max-width: 420px) {
                .chatbot-toggle-btn {
                    width: 52px;
                    height: 52px;
                    padding: 0;
                    justify-content: center;
                    border-radius: 999px;
                }

                .chatbot-toggle-btn span {
                    display: none;
                }

                .chatbot-panel {
                    left: 6px;
                    right: 6px;
                    bottom: calc(70px + env(safe-area-inset-bottom));
                    width: auto;
                    height: min(76dvh, 640px);
                    max-height: min(76dvh, 640px);
                    border-radius: 16px;
                }

                .chatbot-input-wrap {
                    padding: 10px 12px calc(10px + env(safe-area-inset-bottom));
                    gap: 8px;
                }

                .chatbot-input {
                    font-size: 16px;
                    padding: 11px 12px;
                    min-width: 0;
                    width: 100%;
                }

                .chatbot-send {
                    min-width: 46px;
                    min-height: 46px;
                    flex: 0 0 46px;
                    border-radius: 12px;
                    font-size: 16px;
                }

                .chatbot-suggestions {
                    max-height: 160px;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                }

                .chatbot-submenu.show {
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 7px;
                }

                .chatbot-subchip {
                    font-size: 14px;
                    padding: 9px 7px;
                }
            }
        `;

        document.head.appendChild(style);
    }
}

class ChatbotManager {
    constructor() {
        this.fontSizeStorageKey = 'gamestore-chatbot-large-text';
        this.sessionStorageKey = 'gamestore-chatbot-session-state';
        this.localStorageKey = 'gamestore-chatbot-persisted-state';
        this.windowStateKey = '__gamestore_chatbot_state__';

        this.isLargeText = this.getStoredFontSizePreference();
        this.conversationContext = {
            lastIntents: [],
            lastActions: [],
            turns: 0
        };
        this.isConversationClosed = false;
        this.toggleBtn = null;
        this.panel = null;
        this.messagesContainer = null;
        this.input = null;
        this.fontToggleBtn = null;
        this.menuToggleBtn = null;
        this.isMenuVisible = false;
        this.suggestions = [
            { label: 'Pagos' },
            { label: 'Pedidos' },
            { label: 'Consolas' },
            { label: 'Controles' },
            { label: 'Accesorios' },
            { label: 'Juegos' },
            { label: 'Precios' },
            { label: 'Contacto' }
        ];
        this.createWidget();
    }

    getWelcomeMessage() {
        return '¡Hola! 👋 Estoy aquí para ayudarte con lo que necesites de la tienda: pagos, pedidos, envíos, precios o encontrar productos como consolas, juegos, controles y accesorios.';
    }

    getStoredFontSizePreference() {
        return localStorage.getItem(this.fontSizeStorageKey) === 'true';
    }

    applyFontSizePreference() {
        if (!this.panel) return;

        this.panel.classList.toggle('chatbot-large-text', this.isLargeText);

        if (!this.fontToggleBtn) return;

        this.fontToggleBtn.classList.toggle('active', this.isLargeText);
        this.fontToggleBtn.setAttribute('aria-pressed', this.isLargeText ? 'true' : 'false');
        this.fontToggleBtn.setAttribute('title', this.isLargeText ? 'Desactivar texto grande' : 'Activar texto grande');
        this.fontToggleBtn.setAttribute('aria-label', this.isLargeText ? 'Texto grande activado. Desactivar' : 'Activar texto grande');
    }

    toggleFontSizePreference() {
        this.isLargeText = !this.isLargeText;
        localStorage.setItem(this.fontSizeStorageKey, this.isLargeText ? 'true' : 'false');
        this.applyFontSizePreference();
    }

    isAuthPage() {
        const currentPath = window.location.pathname.toLowerCase();
        return currentPath.includes('/login') ||
               currentPath.includes('/registro') ||
               currentPath.includes('/registroadmin') ||
               currentPath.includes('/admin');
    }

    createWidget() {
        if (this.isAuthPage()) return;

        this.toggleBtn = document.createElement('button');
        this.toggleBtn.className = 'chatbot-toggle-btn';
        this.toggleBtn.type = 'button';
        this.toggleBtn.setAttribute('aria-label', 'Abrir chatbot de ayuda');
        this.toggleBtn.innerHTML = '<i class="fa-solid fa-comments"></i><span>Chatbot</span>';

        this.panel = document.createElement('section');
        this.panel.className = 'chatbot-panel';
        this.panel.setAttribute('aria-label', 'Chatbot de ayuda');
        this.panel.innerHTML = `
            <div class="chatbot-header">
                <div class="chatbot-title">
                    <i class="fa-solid fa-robot"></i>
                    <span>Asistente Game Store</span>
                </div>
                <div class="chatbot-header-actions">
                    <button type="button" class="chatbot-font-btn" aria-label="Activar texto grande" aria-pressed="false">
                        A+
                    </button>
                    <button type="button" class="chatbot-close" aria-label="Cerrar chatbot">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>
            <div class="chatbot-messages"></div>
            <div class="chatbot-menu-toggle-wrap">
                <button type="button" class="chatbot-menu-toggle" aria-expanded="false">Ver menú</button>
            </div>
            <div class="chatbot-suggestions"></div>
            <form class="chatbot-input-wrap">
                <input class="chatbot-input" type="text" placeholder="Escribe tu pregunta..." aria-label="Escribe tu pregunta al chatbot">
                <button type="submit" class="chatbot-send" aria-label="Enviar mensaje">
                    <i class="fa-solid fa-paper-plane"></i>
                </button>
            </form>
        `;

        document.body.appendChild(this.toggleBtn);
        document.body.appendChild(this.panel);

        this.messagesContainer = this.panel.querySelector('.chatbot-messages');
        this.input = this.panel.querySelector('.chatbot-input');
        this.fontToggleBtn = this.panel.querySelector('.chatbot-font-btn');
        this.menuToggleBtn = this.panel.querySelector('.chatbot-menu-toggle');
        this.applyFontSizePreference();

        this.messagesContainer.addEventListener('click', (event) => this.handleMessagesContainerClick(event));

        this.renderSuggestions();

        const restored = this.restoreConversationState();
        if (!restored) {
            this.addMessage('bot', this.getWelcomeMessage());
            this.setMenuVisibility(false);
            this.saveConversationState();
        }

        this.toggleBtn.addEventListener('click', () => this.togglePanel());
        this.fontToggleBtn.addEventListener('click', () => this.toggleFontSizePreference());
        this.menuToggleBtn.addEventListener('click', () => this.toggleOptionsMenu());
        this.panel.querySelector('.chatbot-close').addEventListener('click', () => this.closePanel());
        this.panel.querySelector('.chatbot-input-wrap').addEventListener('submit', (event) => {
            event.preventDefault();
            this.handleUserMessage(this.input.value);
        });
    }

    renderSuggestions() {
        const container = this.panel.querySelector('.chatbot-suggestions');
        container.innerHTML = '';

        this.suggestions.forEach((item) => {
            if (item.children && item.children.length > 0) {
                const group = document.createElement('div');
                group.className = 'chatbot-menu-group';

                const parentBtn = document.createElement('button');
                parentBtn.type = 'button';
                parentBtn.className = 'chatbot-chip chatbot-chip-parent';
                parentBtn.textContent = item.label;
                parentBtn.setAttribute('aria-expanded', 'false');

                const submenu = document.createElement('div');
                submenu.className = 'chatbot-submenu';

                item.children.forEach((childLabel) => {
                    const childBtn = document.createElement('button');
                    childBtn.type = 'button';
                    childBtn.className = 'chatbot-subchip';
                    childBtn.textContent = childLabel;
                    childBtn.addEventListener('click', () => {
                        this.handleUserMessage(childLabel);
                        this.setMenuVisibility(false);
                        window.setTimeout(() => this.scrollConversationToBottom(), 120);
                    });
                    submenu.appendChild(childBtn);
                });

                parentBtn.addEventListener('click', () => {
                    const willShow = !submenu.classList.contains('show');
                    submenu.classList.toggle('show', willShow);
                    parentBtn.classList.toggle('expanded', willShow);
                    parentBtn.setAttribute('aria-expanded', willShow ? 'true' : 'false');
                });

                group.appendChild(parentBtn);
                group.appendChild(submenu);
                container.appendChild(group);
                return;
            }

            const chip = document.createElement('button');
            chip.type = 'button';
            chip.className = 'chatbot-chip';
            chip.textContent = item.label;
            chip.addEventListener('click', () => {
                this.handleUserMessage(item.label);
                this.setMenuVisibility(false);
                window.setTimeout(() => this.scrollConversationToBottom(), 120);
            });
            container.appendChild(chip);
        });
    }

    setMenuVisibility(visible) {
        this.isMenuVisible = Boolean(visible);
        const suggestionsContainer = this.panel?.querySelector('.chatbot-suggestions');
        if (suggestionsContainer) {
            suggestionsContainer.classList.toggle('show', this.isMenuVisible);
        }

        if (this.menuToggleBtn) {
            this.menuToggleBtn.textContent = this.isMenuVisible ? 'Ocultar menú' : 'Ver menú';
            this.menuToggleBtn.setAttribute('aria-expanded', this.isMenuVisible ? 'true' : 'false');
        }

        if (!this.isMenuVisible) {
            window.requestAnimationFrame(() => this.scrollConversationToBottom());
        }

        this.saveConversationState();
    }

    toggleOptionsMenu() {
        this.setMenuVisibility(!this.isMenuVisible);
    }

    hideAllOptions() {
        const suggestionsContainer = this.panel?.querySelector('.chatbot-suggestions');
        if (suggestionsContainer) {
            suggestionsContainer.innerHTML = '';
        }

        if (this.menuToggleBtn) {
            this.menuToggleBtn.style.display = 'none';
        }

        this.setMenuVisibility(false);
        this.saveConversationState();
    }

    togglePanel() {
        const isOpen = this.panel.classList.toggle('show');
        this.toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        if (isOpen) {
            this.input.focus();
        }
    }

    closePanel() {
        this.panel.classList.remove('show');
        this.toggleBtn.setAttribute('aria-expanded', 'false');
        this.saveConversationState();
    }

    handleUserMessage(text) {
        const message = text.trim();
        if (!message) return;

        if (this.isConversationClosed) {
            this.addMessage('bot', 'Esta conversación quedó cerrada y se mantiene guardada en esta página. Si quieres reiniciarla, recarga la página.');
            this.saveConversationState();
            return;
        }

        this.addMessage('user', message);
        this.input.value = '';
        window.setTimeout(() => {
            const responsePayload = this.getResponsePayload(message);
            this.addMessage('bot', responsePayload.text);

            this.trackFaqQuestion(message, responsePayload);

            this.updateConversationContext(responsePayload);

            if (responsePayload.closeConversation) {
                this.isConversationClosed = true;
                this.hideAllOptions();
                this.saveConversationState();
                return;
            }

            if (responsePayload.actions.length > 0) {
                this.renderQuickActions(responsePayload.actions);
            }

            if (responsePayload.autoNavigateUrl) {
                window.setTimeout(() => {
                    window.location.href = responsePayload.autoNavigateUrl;
                }, 800);
            }

            this.saveConversationState();
        }, 180);
    }

    async trackFaqQuestion(question, responsePayload) {
        try {
            const intents = responsePayload?.intents || [];
            const topIntent = intents.length > 0 ? intents[0].id : null;

            await fetch('/api/chatbot/faq-track', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    question,
                    top_intent: topIntent,
                    page_path: window.location.pathname
                })
            });
        } catch (error) {
            console.warn('No se pudo registrar FAQ del chatbot:', error);
        }
    }

    addMessage(type, text) {
        const message = document.createElement('div');
        message.className = `chatbot-message ${type}`;
        message.textContent = text;
        this.messagesContainer.appendChild(message);
        this.scrollConversationToBottom();
        this.saveConversationState();
    }

    scrollConversationToBottom() {
        if (!this.messagesContainer) return;
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    renderQuickActions(actions) {
        if (!actions || actions.length === 0) return;

        const wrap = document.createElement('div');
        wrap.className = 'chatbot-message bot';

        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'chatbot-quick-actions';

        actions.slice(0, 3).forEach((action) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'chatbot-action-btn';
            btn.textContent = action.label;
            btn.setAttribute('aria-label', `Ir a ${action.label}`);
            btn.setAttribute('data-action-url', action.url);
            actionsContainer.appendChild(btn);
        });

        wrap.appendChild(actionsContainer);
        this.messagesContainer.appendChild(wrap);
        this.scrollConversationToBottom();
        this.saveConversationState();
    }

    handleMessagesContainerClick(event) {
        const actionBtn = event.target.closest('.chatbot-action-btn[data-action-url]');
        if (!actionBtn) return;

        const targetUrl = actionBtn.getAttribute('data-action-url');
        if (!targetUrl) return;

        window.location.href = targetUrl;
    }

    normalizeQuery(text) {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim();
    }

    isLikelyNonsenseQuery(normalizedQuery) {
        if (!normalizedQuery) return true;

        const compact = normalizedQuery.replace(/[^a-z0-9]/g, '');
        if (!compact) return true;

        if (/(.)\1{4,}/.test(compact)) return true;
        if (/asdf|qwer|zxcv|poiuy|lkjh|mnbv/i.test(compact)) return true;

        const tokens = normalizedQuery.split(/\s+/).filter(Boolean);
        const lettersOnlyTokens = tokens.map((token) => token.replace(/[^a-z]/g, '')).filter(Boolean);

        const hasLargeConsonantCluster = lettersOnlyTokens.some((token) => /[bcdfghjklmnñpqrstvwxyz]{5,}/i.test(token));
        if (hasLargeConsonantCluster) return true;

        const letterOnly = compact.replace(/[^a-z]/g, '');
        if (letterOnly.length >= 5) {
            const vowels = (letterOnly.match(/[aeiou]/g) || []).length;
            const vowelRatio = vowels / letterOnly.length;
            if (vowelRatio < 0.28) return true;
        }

        const knownWords = /\b(hola|buenas|quiero|necesito|como|cómo|que|qué|cual|cuál|cuando|cuándo|donde|dónde|ayuda|precio|precios|pedido|pedidos|pago|pagos|envio|envios|envíos|carrito|contacto|perfil|juego|juegos|accesorio|accesorios|consola|consolas|control|controles|quienes|quiénes|somos|ubicacion|ubicación)\b/;
        const hasKnownWord = knownWords.test(normalizedQuery);

        if (!hasKnownWord && letterOnly.length >= 8) {
            const suspiciousWords = lettersOnlyTokens.filter((token) => token.length >= 4).length;
            if (suspiciousWords >= 1) return true;
        }

        return false;
    }

    isFollowUpQuery(normalizedQuery) {
        if (!normalizedQuery) return false;

        if (normalizedQuery.length <= 4) return true;

        return /\b(y|tambien|tambien quiero|de eso|de eso mismo|de ese|de esa|eso|mas|mas info|otro|otra)\b/.test(normalizedQuery);
    }

    isAffirmativeQuery(normalizedQuery) {
        return /\b(si|sí|dale|ok|oka|perfecto|de una|hazlo|hágalo|vamos|listo|claro)\b/.test(normalizedQuery);
    }

    getCurrentPageContext() {
        const path = window.location.pathname.toLowerCase();

        const pageMap = [
            { match: '/consolas', intentId: 'cat_consolas', label: 'Consolas' },
            { match: '/accesorios', intentId: 'cat_accesorios', label: 'Accesorios' },
            { match: '/controles', intentId: 'cat_controles', label: 'Controles' },
            { match: '/juegos', intentId: 'cat_juegos', label: 'Juegos' },
            { match: '/carrito', intentId: 'carrito', label: 'Carrito' },
            { match: '/pedidos', intentId: 'pedidos', label: 'Pedidos' },
            { match: '/perfil/direccion', intentId: 'envios', label: 'Dirección de envío' },
            { match: '/contactanos', intentId: 'contacto', label: 'Contacto' }
        ];

        return pageMap.find(page => path.includes(page.match)) || null;
    }

    shouldInjectPageContextIntent(normalizedQuery, matchedIntents, pageContext) {
        if (!pageContext) return false;

        const hasPageIntent = matchedIntents.some(intent => intent.id === pageContext.intentId);
        if (hasPageIntent) return false;

        const specificCategoryIds = ['cat_consolas', 'cat_accesorios', 'cat_controles', 'cat_juegos'];
        const hasOtherSpecificCategory = matchedIntents.some(intent =>
            specificCategoryIds.includes(intent.id) && intent.id !== pageContext.intentId
        );
        if (hasOtherSpecificCategory) return false;

        const contextWords = /\b(aqui|acá|aca|esta pagina|en esta pagina|este producto|estos productos|de aqui|de aca)\b/.test(normalizedQuery);
        const genericCommerceWords = /\b(precio|precios|recomienda|recomendacion|recomendación|opciones|info|informacion|información|disponible|stock|catalogo|catálogo)\b/.test(normalizedQuery);

        if (contextWords || genericCommerceWords) return true;

        const domainIntentIds = ['precios', 'productos', 'recomendacion'];
        return matchedIntents.some(intent => domainIntentIds.includes(intent.id));
    }

    addPageContextPrefix(baseText, intents, normalizedQuery) {
        const pageContext = this.getCurrentPageContext();
        if (!pageContext) return baseText;

        const hasContextIntent = intents.some(intent => intent.id === pageContext.intentId);
        if (!hasContextIntent) return baseText;

        const mentionsCurrentPage = /\b(aqui|acá|aca|esta pagina|en esta pagina|estos|estas|este)\b/.test(normalizedQuery);
        const asksAboutPriceOrOptions = /\b(precio|precios|recomienda|opciones|disponible|stock)\b/.test(normalizedQuery);

        if (!mentionsCurrentPage && !asksAboutPriceOrOptions) return baseText;

        return `Veo que estás en ${pageContext.label}. ${baseText}`;
    }

    formatAsContinuation(text) {
        if (!text) return '';
        return text.charAt(0).toLowerCase() + text.slice(1);
    }

    buildNaturalCombinedResponse(intents, normalizedQuery = '') {
        if (!intents || intents.length === 0) {
            return 'Cuéntame con confianza qué necesitas y te ayudo paso a paso. Por ejemplo: pago, pedido, consola, accesorios o contacto.';
        }

        if (intents.length === 1) {
            return this.addPageContextPrefix(intents[0].response, intents, normalizedQuery);
        }

        const primary = intents[0];
        const secondary = intents[1];
        let response = primary.response;

        if (secondary) {
            response += ` Además, ${this.formatAsContinuation(secondary.response)}`;
        }

        if (intents.length > 2) {
            response += ' Si quieres, lo resolvemos por partes para que sea más rápido y claro.';
        }

        return this.addPageContextPrefix(response, intents, normalizedQuery);
    }

    updateConversationContext(payload) {
        this.conversationContext.turns += 1;
        this.conversationContext.lastIntents = (payload.intents || []).map(intent => intent.id);
        this.conversationContext.lastActions = payload.actions || [];
        this.saveConversationState();
    }

    saveConversationState() {
        if (!this.messagesContainer) return;

        const state = {
            messagesHtml: this.messagesContainer.innerHTML,
            conversationContext: this.conversationContext,
            isConversationClosed: this.isConversationClosed,
            isMenuVisible: this.isMenuVisible,
            menuToggleHidden: this.menuToggleBtn ? this.menuToggleBtn.style.display === 'none' : false
        };

        try {
            sessionStorage.setItem(this.sessionStorageKey, JSON.stringify(state));
        } catch (error) {
            console.warn('No se pudo guardar estado del chatbot en sesión:', error);
        }

        try {
            this.saveStateInWindowName(state);
        } catch (error) {
            console.warn('No se pudo guardar respaldo del chatbot en window.name:', error);
        }

        try {
            localStorage.setItem(this.localStorageKey, JSON.stringify(state));
        } catch (error) {
            console.warn('No se pudo guardar respaldo del chatbot en localStorage:', error);
        }
    }

    restoreConversationState() {
        try {
            const state = this.getPersistedConversationState();
            if (!state || typeof state !== 'object') return false;

            if (state.messagesHtml && this.messagesContainer) {
                this.messagesContainer.innerHTML = state.messagesHtml;
            }

            if (state.conversationContext && typeof state.conversationContext === 'object') {
                this.conversationContext = {
                    lastIntents: Array.isArray(state.conversationContext.lastIntents) ? state.conversationContext.lastIntents : [],
                    lastActions: Array.isArray(state.conversationContext.lastActions) ? state.conversationContext.lastActions : [],
                    turns: Number(state.conversationContext.turns || 0)
                };
            }

            this.isConversationClosed = Boolean(state.isConversationClosed);

            if (this.menuToggleBtn) {
                this.menuToggleBtn.style.display = state.menuToggleHidden ? 'none' : '';
            }

            if (!this.isConversationClosed) {
                const suggestionsContainer = this.panel?.querySelector('.chatbot-suggestions');
                if (suggestionsContainer && suggestionsContainer.children.length === 0) {
                    this.renderSuggestions();
                }
            }

            this.setMenuVisibility(Boolean(state.isMenuVisible));
            this.scrollConversationToBottom();

            return true;
        } catch (error) {
            console.warn('No se pudo restaurar estado del chatbot en sesión:', error);
            return false;
        }
    }

    getPersistedConversationState() {
        let state = null;

        try {
            const raw = sessionStorage.getItem(this.sessionStorageKey);
            if (raw) {
                state = JSON.parse(raw);
            }
        } catch (error) {
            state = null;
        }

        if (state && typeof state === 'object') {
            return state;
        }

        try {
            const localRaw = localStorage.getItem(this.localStorageKey);
            if (localRaw) {
                const localState = JSON.parse(localRaw);
                if (localState && typeof localState === 'object') {
                    return localState;
                }
            }
        } catch (error) {
            // no-op
        }

        try {
            return this.readStateFromWindowName();
        } catch (error) {
            return null;
        }
    }

    readStateFromWindowName() {
        const rawWindowName = window.name || '';
        if (!rawWindowName) return null;

        const parsed = JSON.parse(rawWindowName);
        if (!parsed || typeof parsed !== 'object') return null;

        const state = parsed[this.windowStateKey];
        if (!state || typeof state !== 'object') return null;

        return state;
    }

    saveStateInWindowName(state) {
        let parsed = {};

        try {
            parsed = window.name ? JSON.parse(window.name) : {};
            if (!parsed || typeof parsed !== 'object') {
                parsed = {};
            }
        } catch (error) {
            parsed = {};
        }

        parsed[this.windowStateKey] = state;
        window.name = JSON.stringify(parsed);
    }

    getIntentCatalog() {
        return [
            {
                id: 'saludo',
                pattern: /\b(hola|holi|buenas|buen dia|buen día|buenas tardes|buenas noches|hey|que tal|hi|hello)\b/,
                response: '¡Hola! Qué bueno tenerte por aquí. Dime qué necesitas y te ayudo enseguida.'
            },
            {
                id: 'despedida',
                pattern: /\b(chao|chau|adios|adiós|hasta luego|nos vemos|bye|me voy|gracias bye|eso es todo)\b/,
                response: '¡Listo! Fue un gusto ayudarte. Cuando quieras, aquí estaré para ti.'
            },
            {
                id: 'pagos',
                pattern: /\b(pago|pagos|pagar|tarjeta|debito|débito|credito|crédito|paypal|checkout|transaccion|transacción|pasarela|cobro)\b/,
                response: 'Para pagar, solo ve al carrito y continúa al checkout con PayPal. Si el pago falla, intenta de nuevo y verifica conexión, datos y saldo.'
            },
            {
                id: 'pedidos',
                pattern: /\b(pedido|pedidos|orden|ordenes|órdenes|compra|compras|estado|seguimiento|tracking|rastreo|guia|guía)\b/,
                response: 'Puedes revisar tu pedido desde la sección Pedidos. Ahí verás estado, fecha, productos y total actualizado.'
            },
            {
                id: 'envios',
                pattern: /\b(envio|envíos|envios|entrega|domicilio|llega|despacho|shipping|direccion|dirección|reparto)\b/,
                response: 'Con gusto te ayudo con envíos. Antes de pagar, revisa bien tu dirección y luego consulta el avance en Pedidos.'
            },
            {
                id: 'carrito',
                pattern: /\b(carrito|carro|agregar|anadir|añadir|quitar|eliminar|cantidad|subtotal|total|vaciar carrito)\b/,
                response: 'En el carrito puedes ajustar cantidades, quitar productos y confirmar el total antes de pagar.'
            },
            {
                id: 'devoluciones',
                pattern: /\b(devolucion|devoluciones|reembolso|garantia|garantía|cambio|cancelar|cancelacion|cancelación|devolver)\b/,
                response: 'Para devoluciones o reembolsos, lo ideal es escribir a soporte con tu número de pedido y motivo para darte una solución rápida.'
            },
            {
                id: 'cuenta',
                pattern: /\b(cuenta|login|iniciar sesion|registro|registrar|contrasena|contraseña|perfil|mis datos|usuario|correo|email|acceso)\b/,
                response: 'Con tu cuenta puedes iniciar sesión, registrarte y actualizar tus datos desde Perfil. Si tienes problemas de acceso, te guío para recuperarlo.'
            },
            {
                id: 'cat_consolas',
                pattern: /\b(consola|consolas|playstation|ps4|ps5|xbox|nintendo|switch)\b/,
                response: 'Perfecto, te ayudo con consolas. Te puedo llevar directo a esa categoría para que compares modelos y precios.'
            },
            {
                id: 'cat_accesorios',
                pattern: /\b(accesorio|accesorios|audifono|audífono|headset|soporte|cargador|funda|cable|mousepad)\b/,
                response: 'Buenísimo, te ayudo con accesorios. Si quieres, te llevo a la categoría para ver opciones y precios actuales.'
            },
            {
                id: 'cat_controles',
                pattern: /\b(control|controles|joystick|gamepad|mando)\b/,
                response: 'Claro, te ayudo con controles. Te puedo llevar a esa categoría para que compares opciones rápidamente.'
            },
            {
                id: 'cat_juegos',
                pattern: /\b(juego|juegos|videojuego|videojuegos|titulos|títulos)\b/,
                response: 'Si buscas juegos, te llevo a la categoría para que revises títulos y detalles en cada tarjeta.'
            },
            {
                id: 'productos',
                pattern: /\b(producto|productos|catalogo|catálogo|tienda|stock|disponible|disponibilidad)\b/,
                response: 'Puedes explorar productos por categorías y revisar disponibilidad directamente en cada tarjeta.'
            },
            {
                id: 'precios',
                pattern: /\b(precio|precios|cuanto|cuánto|valor|vale|coste|costo|oferta|ofertas|descuento|descuentos|promocion|promociones|barato|barata)\b/,
                response: 'Sobre precios, te recomiendo validar el valor final en el carrito, porque ahí verás el monto real antes de pagar.'
            },
            {
                id: 'contacto',
                pattern: /\b(contacto|soporte|telefono|teléfono|correo|email|whatsapp|asesor|atencion|atención)\b/,
                response: 'Si necesitas soporte, te puedo llevar a Contáctanos. Si es por un pedido, incluye el número para atenderte más rápido.'
            },
            {
                id: 'ubicacion',
                pattern: /\b(ubicacion|ubicación|donde estan|donde están|direccion de tienda|tienda fisica|tienda física|mapa)\b/,
                response: 'Si quieres, te llevo a Ubicación para que veas el mapa y datos de referencia de la tienda.'
            },
            {
                id: 'quienes_somos',
                pattern: /\b(quienes son|quienes son|quienes somos|quienes-somos|quien es game store|sobre ustedes|sobre nosotros|historia de la tienda)\b/,
                response: 'Claro, te llevo al apartado de Quiénes Somos para que conozcas mejor la tienda.'
            },
            {
                id: 'recomendacion',
                pattern: /\b(recomienda|recomendacion|recomendación|que me recomiendas|sugerencia|sugerencias|cual compro|cuál compro)\b/,
                response: '¡Claro! Te puedo recomendar según lo que buscas. Dime si prefieres consola, juegos o accesorios y tu presupuesto aproximado.'
            },
            {
                id: 'seguridad',
                pattern: /\b(seguro|segura|seguridad|confiable|confiar|fraude|estafa)\b/,
                response: 'Entiendo tu preocupación. Lo ideal es revisar todo en carrito antes de pagar y usar siempre los canales oficiales de la tienda.'
            },
            {
                id: 'problema',
                pattern: /\b(no funciona|error|problema|falla|fallando|bug|no puedo|no me deja)\b/,
                response: 'Vamos a solucionarlo. Cuéntame exactamente qué intentaste hacer y en qué paso falló para guiarte mejor.'
            },
            {
                id: 'agradecimiento',
                pattern: /\b(gracias|muchas gracias|ok gracias|perfecto)\b/,
                response: '¡Con gusto! Si quieres, sigo contigo para resolver lo que te falte.'
            }
        ];
    }

    getIntentActionMap() {
        return {
            pagos: { label: 'Ir al carrito', url: '/carrito' },
            pedidos: { label: 'Ir a pedidos', url: '/pedidos' },
            envios: { label: 'Ir a dirección', url: '/perfil/direccion' },
            carrito: { label: 'Abrir carrito', url: '/carrito' },
            devoluciones: { label: 'Ir a contacto', url: '/contactanos' },
            cuenta: { label: 'Ir a mis datos', url: '/perfil/mis-datos' },
            contacto: { label: 'Ir a contacto', url: '/contactanos' },
            cat_consolas: { label: 'Ver consolas', url: '/consolas' },
            cat_accesorios: { label: 'Ver accesorios', url: '/accesorios' },
            cat_controles: { label: 'Ver controles', url: '/controles' },
            cat_juegos: { label: 'Ver juegos', url: '/juegos' },
            productos: { label: 'Ver juegos', url: '/juegos' },
            precios: { label: 'Ver juegos', url: '/juegos' },
            ubicacion: { label: 'Ver ubicación', url: '/ubicacion' },
            quienes_somos: { label: 'Ver quiénes somos', url: '/quienes-somos' },
            recomendacion: { label: 'Ver consolas', url: '/consolas' },
            problema: { label: 'Ir a contacto', url: '/contactanos' }
        };
    }

    isDirectNavigationCommand(normalizedQuery) {
        return /\b(ir|abre|abrir|llevar|llevame|entrar|ver|mostrar|quiero ir|redirige)\b/.test(normalizedQuery);
    }

    resolveActionsFromIntents(intents) {
        const actionMap = this.getIntentActionMap();
        const actions = [];
        const seen = new Set();
        const specificCategoryIds = ['cat_consolas', 'cat_accesorios', 'cat_controles', 'cat_juegos'];
        const hasSpecificCategory = intents.some(intent => specificCategoryIds.includes(intent.id));
        const hasGenericProducts = intents.some(intent => intent.id === 'productos');

        if (hasSpecificCategory) {
            const primaryCategoryIntent = intents.find(intent => specificCategoryIds.includes(intent.id));
            const primaryAction = primaryCategoryIntent ? actionMap[primaryCategoryIntent.id] : null;
            return primaryAction ? [primaryAction] : [];
        }

        if (hasGenericProducts) {
            return [
                { label: 'Ver juegos', url: '/juegos' },
                { label: 'Ver consolas', url: '/consolas' },
                { label: 'Ver controles', url: '/controles' },
                { label: 'Ver accesorios', url: '/accesorios' }
            ];
        }

        intents.forEach((intent) => {
            const action = actionMap[intent.id];
            if (!action) return;
            const key = `${action.label}|${action.url}`;
            if (seen.has(key)) return;
            seen.add(key);
            actions.push(action);
        });

        return actions;
    }

    composeIntentResponse(query) {
        const normalizedQuery = this.normalizeQuery(query);
        const intents = this.getIntentCatalog();
        let matched = intents.filter(intent => intent.pattern.test(normalizedQuery));
        const pageContext = this.getCurrentPageContext();

        const asksPrice = /\b(precio|precios|cuanto|cuánto|valor|vale|coste|costo)\b/.test(normalizedQuery);
        const lastIntents = this.conversationContext.lastIntents || [];

        if (matched.length === 0 && this.isFollowUpQuery(normalizedQuery) && lastIntents.length > 0) {
            matched = intents.filter(intent => lastIntents.includes(intent.id));
        }

        if (asksPrice && matched.length > 0 && !matched.some(intent => intent.id === 'precios')) {
            const pricesIntent = intents.find(intent => intent.id === 'precios');
            if (pricesIntent) matched.push(pricesIntent);
        }

        if (asksPrice && matched.length === 0 && lastIntents.length > 0) {
            matched = intents.filter(intent => lastIntents.includes(intent.id));
            const pricesIntent = intents.find(intent => intent.id === 'precios');
            if (pricesIntent) matched.push(pricesIntent);
        }

        if (this.shouldInjectPageContextIntent(normalizedQuery, matched, pageContext)) {
            const pageIntent = intents.find(intent => intent.id === pageContext.intentId);
            if (pageIntent) {
                matched.push(pageIntent);
            }
        }

        if (matched.length === 0) {
            if (this.isLikelyNonsenseQuery(normalizedQuery)) {
                return {
                    text: 'No logré entender bien tu mensaje 😅. ¿Me lo puedes explicar con más detalle? Por ejemplo: pagos, pedidos, envíos, productos o contacto.',
                    intents: [],
                    normalizedQuery
                };
            }

            return {
                text: 'Te entiendo. Para ayudarte mejor, dime qué necesitas resolver ahora mismo: pago, pedido, envío, consola, accesorios, precios o contacto.',
                intents: [],
                normalizedQuery
            };
        }

        const uniqueById = [];
        const seen = new Set();
        matched.forEach((intent) => {
            if (!seen.has(intent.id)) {
                seen.add(intent.id);
                uniqueById.push(intent);
            }
        });

        const nonMetaDomainIntents = ['pagos', 'pedidos', 'envios', 'carrito', 'devoluciones', 'cuenta', 'cat_consolas', 'cat_accesorios', 'cat_controles', 'cat_juegos', 'precios', 'contacto', 'productos', 'ubicacion', 'quienes_somos', 'recomendacion', 'seguridad', 'problema'];
        const hasDomainIntent = uniqueById.some(intent => nonMetaDomainIntents.includes(intent.id));

        let filteredIntents = uniqueById;
        if (hasDomainIntent) {
            filteredIntents = uniqueById.filter(intent => intent.id !== 'saludo' && intent.id !== 'agradecimiento');
        }

        const hasPaymentIntent = filteredIntents.some(intent => intent.id === 'pagos');
        if (hasPaymentIntent && !/\b(contacto|soporte|asesor|telefono|teléfono|correo|email|whatsapp)\b/.test(normalizedQuery)) {
            filteredIntents = filteredIntents.filter(intent => intent.id !== 'contacto');
        }

        const priorityOrder = ['despedida', 'problema', 'pagos', 'pedidos', 'envios', 'carrito', 'devoluciones', 'cuenta', 'cat_consolas', 'cat_accesorios', 'cat_controles', 'cat_juegos', 'precios', 'quienes_somos', 'recomendacion', 'contacto', 'ubicacion', 'seguridad', 'productos', 'saludo', 'agradecimiento'];
        filteredIntents.sort((a, b) => priorityOrder.indexOf(a.id) - priorityOrder.indexOf(b.id));

        const farewellIntent = filteredIntents.find(intent => intent.id === 'despedida');
        if (farewellIntent) {
            return {
                text: farewellIntent.response,
                intents: [farewellIntent],
                normalizedQuery
            };
        }

        if (filteredIntents.length === 1) {
            return {
                text: this.addPageContextPrefix(filteredIntents[0].response, filteredIntents, normalizedQuery),
                intents: filteredIntents,
                normalizedQuery
            };
        }

        return {
            text: this.buildNaturalCombinedResponse(filteredIntents, normalizedQuery),
            intents: filteredIntents,
            normalizedQuery
        };
    }

    getResponsePayload(text) {
        const normalizedQuery = this.normalizeQuery(text);

        if (this.isAffirmativeQuery(normalizedQuery) && this.conversationContext.lastActions.length > 0) {
            const directAction = this.conversationContext.lastActions[0];
            return {
                text: `Perfecto, te llevo a "${directAction.label}" ahora mismo.`,
                actions: [],
                autoNavigateUrl: directAction.url,
                intents: []
            };
        }

        const resolved = this.composeIntentResponse(text);
        const hasFarewell = (resolved.intents || []).some(intent => intent.id === 'despedida');

        if (hasFarewell) {
            return {
                text: resolved.text,
                actions: [],
                autoNavigateUrl: null,
                intents: resolved.intents || [],
                closeConversation: true
            };
        }

        const actions = this.resolveActionsFromIntents(resolved.intents || []).slice(0, 4);
        const directNavigate = actions.length > 0 && this.isDirectNavigationCommand(resolved.normalizedQuery || '');

        if (!directNavigate) {
            return {
                text: resolved.text,
                actions,
                autoNavigateUrl: null,
                intents: resolved.intents || [],
                closeConversation: false
            };
        }

        const primaryAction = actions[0];
        return {
            text: `${resolved.text} Te llevo ahora a "${primaryAction.label}"...`,
            actions: [],
            autoNavigateUrl: primaryAction.url,
            intents: resolved.intents || [],
            closeConversation: false
        };
    }
}

// ============================================
// ACCESSIBILITY MANAGER (MEJORAS AAA GLOBALES)
// ============================================

class AccessibilityManager {
    constructor() {
        this.injectAccessibilityStyles();
        this.addSkipLink();
        this.enhanceLandmarks();
        this.enhanceControls();
        this.enhanceDynamicRegions();
        this.markDecorativeIcons();
    }

    injectAccessibilityStyles() {
        if (document.getElementById('gamestore-a11y-styles')) return;

        const style = document.createElement('style');
        style.id = 'gamestore-a11y-styles';
        style.textContent = `
            .skip-link {
                position: absolute;
                top: 8px;
                left: 8px;
                transform: translateY(-140%);
                background: #58009A;
                color: #ffffff;
                padding: 10px 14px;
                border-radius: 8px;
                z-index: 4000;
                text-decoration: none;
                font-weight: 700;
                border: 2px solid #ffffff;
            }

            .skip-link:focus,
            .skip-link:focus-visible {
                transform: translateY(0);
            }
        `;

        document.head.appendChild(style);
    }

    addSkipLink() {
        if (document.querySelector('.skip-link')) return;

        const main = document.querySelector('main');
        if (!main) return;

        if (!main.id) {
            main.id = 'main-content';
        }

        const skipLink = document.createElement('a');
        skipLink.className = 'skip-link';
        skipLink.href = `#${main.id}`;
        skipLink.textContent = 'Saltar al contenido principal';

        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    enhanceLandmarks() {
        const nav = document.querySelector('nav.barra_lateral');
        if (nav && !nav.getAttribute('aria-label')) {
            nav.setAttribute('aria-label', 'Navegación principal');
        }

        const header = document.querySelector('header.encabezado');
        if (header && !header.getAttribute('aria-label')) {
            header.setAttribute('aria-label', 'Barra superior');
        }
    }

    enhanceControls() {
        const searchInput = document.getElementById('buscar-input');
        if (searchInput && !searchInput.getAttribute('aria-label')) {
            searchInput.setAttribute('aria-label', 'Buscar producto');
        }

        const searchBtn = document.getElementById('btn-buscar');
        if (searchBtn && !searchBtn.getAttribute('aria-label')) {
            searchBtn.setAttribute('aria-label', 'Buscar');
            searchBtn.setAttribute('title', 'Buscar');
        }

        const notificationsBtn = document.getElementById('mostrarNotificaciones');
        if (notificationsBtn && !notificationsBtn.getAttribute('aria-label')) {
            notificationsBtn.setAttribute('aria-label', 'Mostrar notificaciones');
            notificationsBtn.setAttribute('title', 'Mostrar notificaciones');
        }

        const userMenuBtn = document.getElementById('userMenuBtn');
        if (userMenuBtn) {
            userMenuBtn.setAttribute('aria-label', 'Abrir menú de usuario');
            userMenuBtn.setAttribute('aria-haspopup', 'menu');
            userMenuBtn.setAttribute('aria-expanded', userMenuBtn.getAttribute('aria-expanded') || 'false');
        }

        const carritoLink = document.querySelector('.carrito-link');
        if (carritoLink && !carritoLink.getAttribute('aria-label')) {
            carritoLink.setAttribute('aria-label', 'Abrir carrito de compras');
        }
    }

    enhanceDynamicRegions() {
        const productosContainer = document.getElementById('productos-container');
        if (productosContainer) {
            productosContainer.setAttribute('aria-live', 'polite');
            productosContainer.setAttribute('aria-busy', 'false');
        }

        const carritoContainer = document.getElementById('carrito-container');
        if (carritoContainer) {
            carritoContainer.setAttribute('aria-live', 'polite');
            carritoContainer.setAttribute('aria-busy', 'false');
        }
    }

    markDecorativeIcons() {
        document.querySelectorAll('i.fa-solid, i.fa-regular, i.fa-brands').forEach((icon) => {
            if (!icon.getAttribute('aria-hidden')) {
                icon.setAttribute('aria-hidden', 'true');
            }
        });
    }
}

// ============================================
// SEGURIDAD SESIÓN EN NAVEGACIÓN ATRÁS/ADELANTE
// ============================================

window.addEventListener('pageshow', (event) => {
    const navigationEntry = performance.getEntriesByType('navigation')[0];
    const isBackForward = navigationEntry && navigationEntry.type === 'back_forward';

    if (event.persisted || isBackForward) {
        window.location.reload();
    }
});

// ============================================
// INICIALIZACIÓN
// ============================================

function initializeStickyHeaderEffect() {
    const header = document.querySelector('.encabezado');
    if (!header) return;

    const updateHeaderState = () => {
        header.classList.toggle('header-scrolled', window.scrollY > 8);
    };

    updateHeaderState();
    window.addEventListener('scroll', updateHeaderState, { passive: true });
}

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar todos los managers
    const accessibilityManager = new AccessibilityManager();
    const themeManager = new ThemeManager();
    const chatbotManager = new ChatbotManager();
    const menuManager = new MenuManager();
    const userMenuManager = new UserMenuManager();
    const searchManager = new SearchManager();
    const lazyLoadManager = new LazyLoadManager();
    initializeStickyHeaderEffect();

    // Hacer accesibles globalmente si es necesario
    window.accessibilityManager = accessibilityManager;
    window.themeManager = themeManager;
    window.chatbotManager = chatbotManager;
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
