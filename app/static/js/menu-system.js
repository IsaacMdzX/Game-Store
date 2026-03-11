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
        this.optimizeImages();
        this.observeNewImages();
        this.attachEventListeners();
        this.handleInitialLoad();
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
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                padding: 0 18px 16px;
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
            }

            .chatbot-input {
                flex: 1;
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
                    right: 8px;
                    bottom: 10px;
                    padding: 12px 14px;
                    font-size: 15px;
                    min-height: 52px;
                }

                .chatbot-panel {
                    right: 8px;
                    bottom: 76px;
                    width: calc(100vw - 16px);
                    max-height: 80vh;
                }

                .chatbot-header {
                    padding: 16px 16px;
                }

                .chatbot-title {
                    font-size: 17px;
                }

                .chatbot-font-btn,
                .chatbot-close {
                    width: 42px;
                    height: 42px;
                    min-width: 42px;
                    min-height: 42px;
                }

                .chatbot-message {
                    font-size: 18px;
                    line-height: 1.6;
                    max-width: 96%;
                }

                .chatbot-chip {
                    font-size: 16px;
                }

                .chatbot-action-btn {
                    font-size: 15px;
                    padding: 9px 13px;
                }

                .chatbot-input {
                    font-size: 18px;
                }

                .chatbot-send {
                    min-width: 52px;
                    min-height: 52px;
                }

                .chatbot-panel.chatbot-large-text .chatbot-message {
                    font-size: 19px;
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
                    right: 6px;
                    bottom: 74px;
                    width: calc(100vw - 12px);
                    border-radius: 16px;
                }
            }
        `;

        document.head.appendChild(style);
    }
}

class ChatbotManager {
    constructor() {
        this.fontSizeStorageKey = 'gamestore-chatbot-large-text';
        this.isLargeText = this.getStoredFontSizePreference();
        this.toggleBtn = null;
        this.panel = null;
        this.messagesContainer = null;
        this.input = null;
        this.fontToggleBtn = null;
        this.suggestions = ['Pagos', 'Pedidos', 'Envíos', 'Cuenta', 'Carrito', 'Contacto'];
        this.createWidget();
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
               currentPath.includes('/registroadmin');
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
        this.applyFontSizePreference();

        this.addMessage('bot', 'Hola, soy el asistente de Game Store. Puedo ayudarte con envíos, pagos, devoluciones y contacto.');
        this.renderSuggestions();

        this.toggleBtn.addEventListener('click', () => this.togglePanel());
        this.fontToggleBtn.addEventListener('click', () => this.toggleFontSizePreference());
        this.panel.querySelector('.chatbot-close').addEventListener('click', () => this.closePanel());
        this.panel.querySelector('.chatbot-input-wrap').addEventListener('submit', (event) => {
            event.preventDefault();
            this.handleUserMessage(this.input.value);
        });
    }

    renderSuggestions() {
        const container = this.panel.querySelector('.chatbot-suggestions');
        container.innerHTML = this.suggestions.map(item => `
            <button type="button" class="chatbot-chip">${item}</button>
        `).join('');

        container.querySelectorAll('.chatbot-chip').forEach(chip => {
            chip.addEventListener('click', () => this.handleUserMessage(chip.textContent));
        });
    }

    togglePanel() {
        const isOpen = this.panel.classList.toggle('show');
        this.toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        if (isOpen) this.input.focus();
    }

    closePanel() {
        this.panel.classList.remove('show');
        this.toggleBtn.setAttribute('aria-expanded', 'false');
    }

    handleUserMessage(text) {
        const message = text.trim();
        if (!message) return;

        this.addMessage('user', message);
        this.input.value = '';
        window.setTimeout(() => {
            const responsePayload = this.getResponsePayload(message);
            this.addMessage('bot', responsePayload.text);

            if (responsePayload.actions.length > 0) {
                this.renderQuickActions(responsePayload.actions);
            }

            if (responsePayload.autoNavigateUrl) {
                window.setTimeout(() => {
                    window.location.href = responsePayload.autoNavigateUrl;
                }, 800);
            }
        }, 180);
    }

    addMessage(type, text) {
        const message = document.createElement('div');
        message.className = `chatbot-message ${type}`;
        message.textContent = text;
        this.messagesContainer.appendChild(message);
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
            btn.addEventListener('click', () => {
                window.location.href = action.url;
            });
            actionsContainer.appendChild(btn);
        });

        wrap.appendChild(actionsContainer);
        this.messagesContainer.appendChild(wrap);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    normalizeQuery(text) {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim();
    }

    getIntentCatalog() {
        return [
            {
                id: 'saludo',
                pattern: /\b(hola|buenas|hey|que tal|hi)\b/,
                response: '¡Hola! Te ayudo con pagos, pedidos, envíos, cuenta, carrito y contacto.'
            },
            {
                id: 'pagos',
                pattern: /\b(pago|pagos|pagar|tarjeta|debito|credito|paypal|mercadopago|checkout|transaccion)\b/,
                response: 'Pagos: puedes finalizar compra desde el carrito y elegir PayPal. Si un pago falla, intenta nuevamente o cambia de método.'
            },
            {
                id: 'pedidos',
                pattern: /\b(pedido|pedidos|orden|ordenes|compra|compras|estado|seguimiento)\b/,
                response: 'Pedidos: revisa el estado en la sección Pedidos. Ahí verás fecha, productos, total y estado actualizado de tu orden.'
            },
            {
                id: 'envios',
                pattern: /\b(envio|envios|entrega|domicilio|llega|despacho|shipping|direccion)\b/,
                response: 'Envíos: asegúrate de tener bien tu dirección de envío antes de pagar. El avance de entrega lo puedes consultar en Pedidos.'
            },
            {
                id: 'carrito',
                pattern: /\b(carrito|carro|agregar|quitar|cantidad|subtotal|total)\b/,
                response: 'Carrito: puedes ajustar cantidades, eliminar productos y validar el total antes de ir al checkout.'
            },
            {
                id: 'devoluciones',
                pattern: /\b(devolucion|devoluciones|reembolso|garantia|cambio|cancelar|cancelacion)\b/,
                response: 'Devoluciones/Reembolsos: contacta soporte con tu número de pedido y motivo para que te guíen según el caso.'
            },
            {
                id: 'cuenta',
                pattern: /\b(cuenta|login|iniciar sesion|registro|registrar|contrasena|perfil|mis datos|usuario|correo|email)\b/,
                response: 'Cuenta: puedes iniciar sesión, registrarte y actualizar tus datos desde perfil. Si olvidaste acceso, intenta con tu correo correcto y vuelve a ingresar.'
            },
            {
                id: 'productos',
                pattern: /\b(producto|productos|juego|juegos|consola|consolas|accesorio|accesorios|control|controles|stock|disponible)\b/,
                response: 'Productos: puedes explorar por categorías (juegos, consolas, controles y accesorios) y revisar disponibilidad directamente en cada tarjeta.'
            },
            {
                id: 'precios',
                pattern: /\b(precio|precios|oferta|ofertas|descuento|descuentos|promocion|promociones)\b/,
                response: 'Precios/Ofertas: verifica el valor final en carrito antes de pagar, ahí se refleja el total real de tu compra.'
            },
            {
                id: 'contacto',
                pattern: /\b(contacto|soporte|ayuda|telefono|correo|email|whatsapp|asesor)\b/,
                response: 'Contacto: usa la sección Contáctanos para enviar tu caso. Si reportas un pedido, incluye el número para atención más rápida.'
            },
            {
                id: 'agradecimiento',
                pattern: /\b(gracias|muchas gracias|ok gracias|perfecto)\b/,
                response: '¡Con gusto! Si quieres, dime exactamente qué necesitas: pago, envío, pedido, cuenta o carrito.'
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
            productos: { label: 'Ver juegos', url: '/juegos' },
            precios: { label: 'Ver juegos', url: '/juegos' }
        };
    }

    isDirectNavigationCommand(normalizedQuery) {
        return /\b(ir|abre|abrir|llevar|llevame|entrar|ver|mostrar|quiero ir|redirige)\b/.test(normalizedQuery);
    }

    resolveActionsFromIntents(intents) {
        const actionMap = this.getIntentActionMap();
        const actions = [];
        const seen = new Set();

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
        const matched = intents.filter(intent => intent.pattern.test(normalizedQuery));

        if (matched.length === 0) {
            return {
                text: 'Te puedo ayudar con: pagos, pedidos, envíos, carrito, cuenta y contacto. Escribe una palabra clave como "pago", "pedido" o "devolución".',
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

        const priorityOrder = ['pagos', 'pedidos', 'envios', 'carrito', 'devoluciones', 'cuenta', 'contacto', 'productos', 'precios', 'saludo', 'agradecimiento'];
        uniqueById.sort((a, b) => priorityOrder.indexOf(a.id) - priorityOrder.indexOf(b.id));

        let text = '';
        if (uniqueById.length === 1) {
            text = uniqueById[0].response;
            return {
                text,
                intents: uniqueById,
                normalizedQuery
            };
        }

        const topResponses = uniqueById.slice(0, 3).map(intent => `• ${intent.response}`);
        text = `Entendí varias consultas relacionadas. Te resumo lo más importante:\n${topResponses.join('\n')}`;

        return {
            text,
            intents: uniqueById,
            normalizedQuery
        };
    }

    getResponsePayload(text) {
        const resolved = this.composeIntentResponse(text);
        const actions = this.resolveActionsFromIntents(resolved.intents || []).slice(0, 3);
        const directNavigate = actions.length > 0 && this.isDirectNavigationCommand(resolved.normalizedQuery || '');

        if (!directNavigate) {
            return {
                text: resolved.text,
                actions,
                autoNavigateUrl: null
            };
        }

        const primaryAction = actions[0];
        return {
            text: `${resolved.text} Te llevo ahora a "${primaryAction.label}"...`,
            actions: [],
            autoNavigateUrl: primaryAction.url
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
