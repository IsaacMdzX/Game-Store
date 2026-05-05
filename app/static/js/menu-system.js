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
                width: min(520px, calc(100vw - 24px));
                max-height: min(84vh, 760px);
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

            .chatbot-font-btn,
            .chatbot-reset-btn {
                border: 1px solid rgba(255, 255, 255, 0.42);
                background: rgba(255, 255, 255, 0.16);
                color: #fff;
                width: 44px;
                height: 44px;
                border-radius: 10px;
                cursor: pointer;
                font-size: 16px;
                font-weight: 700;
                transition: transform 0.18s ease, background 0.2s ease, border-color 0.2s ease;
            }

            .chatbot-reset-btn:hover {
                background: rgba(255, 255, 255, 0.24);
                border-color: rgba(255, 255, 255, 0.7);
            }

            .chatbot-reset-btn:active {
                transform: scale(0.95);
            }

            .chatbot-reset-btn.is-spinning i {
                animation: chatbot-reset-spin 0.55s linear 1;
            }

            @keyframes chatbot-reset-spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
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
                flex-direction: column;
                gap: 10px;
                padding: 0 18px 16px;
                border-top: 1px solid rgba(168, 85, 247, 0.18);
                margin-top: 6px;
                padding-top: 12px;
                height: 220px;
                min-height: 220px;
                max-height: 220px;
                flex: 0 0 220px;
                overflow-y: auto;
            }

            .chatbot-suggestions.show {
                display: flex;
            }

            .chatbot-menu-toggle-wrap {
                padding: 0 18px 12px;
                display: flex;
                justify-content: flex-start;
            }

            .chatbot-menu-toggle {
                border: 1px solid rgba(216, 180, 254, 0.95);
                background: linear-gradient(135deg, #6d28d9, #7c3aed);
                color: #ffffff;
                border-radius: 999px;
                padding: 10px 16px;
                font-size: 14px;
                font-weight: 700;
                cursor: pointer;
                transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
                box-shadow: 0 8px 20px rgba(76, 29, 149, 0.4);
            }

            .chatbot-menu-toggle:hover {
                transform: translateY(-1px);
                background: linear-gradient(135deg, #7c3aed, #8b5cf6);
                box-shadow: 0 12px 24px rgba(76, 29, 149, 0.5);
            }

            .chatbot-chip {
                border: 1px solid rgba(168, 85, 247, 0.28);
                background: rgba(255, 255, 255, 0.05);
                color: #f3e8ff;
                border-radius: 10px;
                padding: 11px 12px;
                font-size: 15px;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.18s ease, background 0.18s ease, border-color 0.18s ease;
                width: 100%;
                text-align: left;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .chatbot-chip::before {
                content: attr(data-emoji);
                font-size: 16px;
                line-height: 1;
                flex: 0 0 auto;
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
                border-radius: 12px;
                padding: 8px;
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
                flex-direction: column;
                gap: 6px;
                padding-left: 0;
            }

            .chatbot-submenu.show {
                display: flex;
            }

            .chatbot-subchip {
                border: 1px solid rgba(168, 85, 247, 0.32);
                background: rgba(255, 255, 255, 0.08);
                color: #f3e8ff;
                border-radius: 10px;
                padding: 9px 11px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.18s ease, background 0.18s ease, border-color 0.18s ease;
                text-align: left;
                display: flex;
                align-items: center;
                gap: 9px;
            }

            .chatbot-subchip::before {
                content: attr(data-emoji);
                font-size: 14px;
                line-height: 1;
                flex: 0 0 auto;
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
            .chatbot-panel.chatbot-large-text .chatbot-font-btn,
            .chatbot-panel.chatbot-large-text .chatbot-reset-btn {
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
                background: linear-gradient(135deg, #6d28d9, #7c3aed) !important;
                color: #ffffff !important;
                border-color: #8b5cf6 !important;
                box-shadow: 0 8px 20px rgba(76, 29, 149, 0.32) !important;
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
                    height: min(82dvh, 720px);
                    max-height: min(82dvh, 720px);
                    border-radius: 18px;
                }

                .chatbot-messages {
                    min-height: 0;
                    padding: 14px;
                    gap: 10px;
                }

                .chatbot-suggestions {
                    height: 180px;
                    min-height: 180px;
                    max-height: 180px;
                    flex: 0 0 180px;
                }

                .chatbot-header {
                    padding: 14px 14px;
                }

                .chatbot-title {
                    font-size: 16px;
                }

                .chatbot-font-btn,
                .chatbot-reset-btn,
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
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    gap: 6px;
                    padding-left: 0;
                }

                .chatbot-subchip {
                    width: 100%;
                    text-align: left;
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
        this.resetChatBtn = null;
        this.menuToggleBtn = null;
        this.isMenuVisible = false;
        this.productResultsPageSize = 5;
        this.pendingProductSearchState = null;
        this.lastBotMessageKey = '';
        this.lastBotMessageRepeatCount = 0;
        this.suggestions = [
            { label: 'Pagos' },
            { label: 'Métodos de pago' },
            { label: 'Pedidos' },
            { label: 'Envíos' },
            { label: 'Número de guía' },
            { label: 'Devoluciones' },
            { label: 'Garantía' },
            { label: 'Cuenta' },
            { label: 'Favoritos' },
            { label: 'Consolas' },
            { label: 'Controles' },
            { label: 'Accesorios' },
            { label: 'Juegos' },
            { label: 'Precios' },
            { label: 'Horarios' },
            { label: 'Ubicación' },
            { label: 'Quiénes somos' },
            { label: 'Contacto' }
        ];
        this.createWidget();
    }

    getWelcomeMessage() {
        return '¡Hola! Soy GameStore Assistant 👋 Estoy aquí para ayudarte con pagos, pedidos, envíos, devoluciones, cuenta, favoritos y productos (consolas, juegos, controles y accesorios).';
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
                    <button type="button" class="chatbot-reset-btn" aria-label="Reiniciar chat" title="Reiniciar chat">
                        <i class="fa-solid fa-arrows-rotate"></i>
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
        this.resetChatBtn = this.panel.querySelector('.chatbot-reset-btn');
        this.menuToggleBtn = this.panel.querySelector('.chatbot-menu-toggle');
        this.applyFontSizePreference();

        this.messagesContainer.addEventListener('click', (event) => this.handleMessagesContainerClick(event));

        this.renderSuggestions();

        if (this.isPageReloadNavigation()) {
            this.clearConversationState();
        }

        const restored = this.restoreConversationState();
        if (!restored) {
            this.addMessage('bot', this.getWelcomeMessage());
            this.setMenuVisibility(false);
            this.saveConversationState();
        }

        this.toggleBtn.addEventListener('click', () => this.togglePanel());
        this.fontToggleBtn.addEventListener('click', () => this.toggleFontSizePreference());
        if (this.resetChatBtn) {
            this.resetChatBtn.addEventListener('click', () => {
                this.playResetButtonAnimation();
                this.resetConversation();
            });
        }
        this.menuToggleBtn.addEventListener('click', () => this.toggleOptionsMenu());
        this.panel.querySelector('.chatbot-close').addEventListener('click', () => this.closePanel());
        this.panel.querySelector('.chatbot-input-wrap').addEventListener('submit', (event) => {
            event.preventDefault();
            this.handleUserMessage(this.input.value);
        });

        document.addEventListener('click', (event) => this.handleOutsideChatbotClick(event));
        document.addEventListener('keydown', (event) => this.handleChatbotEscapeKey(event));
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
                parentBtn.setAttribute('data-emoji', this.getSuggestionEmoji(item.label));
                parentBtn.setAttribute('aria-expanded', 'false');

                const submenu = document.createElement('div');
                submenu.className = 'chatbot-submenu';

                item.children.forEach((childLabel) => {
                    const childBtn = document.createElement('button');
                    childBtn.type = 'button';
                    childBtn.className = 'chatbot-subchip';
                    childBtn.textContent = childLabel;
                    childBtn.setAttribute('data-emoji', this.getSuggestionEmoji(childLabel));
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
            chip.setAttribute('data-emoji', this.getSuggestionEmoji(item.label));
            chip.addEventListener('click', () => {
                this.handleUserMessage(item.label);
                this.setMenuVisibility(false);
                window.setTimeout(() => this.scrollConversationToBottom(), 120);
            });
            container.appendChild(chip);
        });
    }

    getSuggestionEmoji(label) {
        const normalized = this.normalizeQuery(label || '');
        if (/\b(pago|pagos|metodo|metodos|paypal|tarjeta)\b/.test(normalized)) return '💳';
        if (/\b(pedido|pedidos|guia|guia|rastreo)\b/.test(normalized)) return '📦';
        if (/\b(envio|envios|envíos|devolucion|devoluciones|garantia|garantía)\b/.test(normalized)) return '🚚';
        if (/\b(cuenta|perfil|login|sesion|sesión)\b/.test(normalized)) return '👤';
        if (/\b(favorito|favoritos|deseos)\b/.test(normalized)) return '❤️';
        if (/\b(consola|consolas|juego|juegos|control|controles|accesorio|accesorios|producto|productos|precios)\b/.test(normalized)) return '🎮';
        if (/\b(horario|horarios|ubicacion|ubicación)\b/.test(normalized)) return '🕒';
        if (/\b(quienes|quiénes|somos|contacto|soporte|ayuda)\b/.test(normalized)) return '💬';
        return '✨';
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

    handleOutsideChatbotClick(event) {
        if (!this.panel || !this.toggleBtn) return;
        if (!this.panel.classList.contains('show')) return;

        const clickedInsidePanel = this.panel.contains(event.target);
        const clickedToggleButton = this.toggleBtn.contains(event.target);

        if (!clickedInsidePanel && !clickedToggleButton) {
            this.closePanel();
        }
    }

    handleChatbotEscapeKey(event) {
        if (event.key !== 'Escape') return;
        if (!this.panel || !this.panel.classList.contains('show')) return;
        this.closePanel();
    }

    playResetButtonAnimation() {
        if (!this.resetChatBtn) return;

        this.resetChatBtn.classList.remove('is-spinning');
        void this.resetChatBtn.offsetWidth;
        this.resetChatBtn.classList.add('is-spinning');

        window.setTimeout(() => {
            if (this.resetChatBtn) {
                this.resetChatBtn.classList.remove('is-spinning');
            }
        }, 600);
    }

    resetConversation() {
        if (!this.messagesContainer) return;

        this.messagesContainer.innerHTML = '';
        this.pendingProductSearchState = null;
        this.lastBotMessageKey = '';
        this.lastBotMessageRepeatCount = 0;
        this.conversationContext = {
            lastIntents: [],
            lastActions: [],
            turns: 0
        };
        this.isConversationClosed = false;

        if (this.menuToggleBtn) {
            this.menuToggleBtn.style.display = '';
        }

        this.renderSuggestions();
        this.setMenuVisibility(false);
        this.addMessage('bot', this.getWelcomeMessage());
        this.saveConversationState();

        if (this.input) {
            this.input.value = '';
            this.input.focus();
        }
    }

    handleUserMessage(text) {
        const message = text.trim();
        if (!message) return;

        if (this.isConversationClosed) {
            this.addMessage('bot', 'Esta conversación quedó cerrada y se mantiene guardada en esta página. Si quieres reiniciarla, usa el botón de reinicio del chat.');
            this.saveConversationState();
            return;
        }


        this.addMessage('user', message);
        this.input.value = '';

        const normalizedMsg = this.normalizeQuery(message);

        if (/^(menu|menú|ver menu|ver menú|mostrar menu|mostrar menú|opciones|ver opciones|mostrar opciones)$/.test(normalizedMsg)) {
            this.addMessage('bot', '¡Claro! Te despliego el menú de opciones para que elijas lo que necesitas.');
            this.setMenuVisibility(true);
            this.saveConversationState();
            return;
        }

        if (/^(cerrar menu|cerrar menú|ocultar menu|ocultar menú|esconder menu|esconder menú)$/.test(normalizedMsg)) {
            this.addMessage('bot', 'Listo, oculté el menú de opciones. Si lo necesitas nuevamente, solo escribe "menú".');
            this.setMenuVisibility(false);
            this.saveConversationState();
            return;
        }

        if (/^(ver mas|ver más|mas opciones|más opciones|mostrar mas|mostrar más)$/.test(normalizedMsg)) {
            if (!this.pendingProductSearchState || !Array.isArray(this.pendingProductSearchState.products)) {
                this.addMessage('bot', 'No tengo más resultados por mostrar. Haz una nueva búsqueda y te enseño opciones.');
                return;
            }

            const page = this.getProductResultsPage(
                this.pendingProductSearchState.products,
                this.pendingProductSearchState.offset || 0,
                this.productResultsPageSize
            );

            if (page.pageProducts.length === 0) {
                this.addMessage('bot', 'Ya te mostré todas las opciones encontradas. Si quieres, busca otra marca o producto.');
                this.pendingProductSearchState = null;
                return;
            }

            const responseText = this.buildProductSearchResponse(
                page.pageProducts,
                this.pendingProductSearchState.queryUsed,
                page.startIndex,
                this.pendingProductSearchState.products.length,
                page.hasMore
            );
            this.addMessage('bot', responseText);

            const actions = this.buildProductSearchActions(page.pageProducts);
            if (actions.length > 0) {
                this.renderQuickActions(actions);
            }

            this.pendingProductSearchState.offset = page.nextOffset;
            if (!page.hasMore) {
                this.pendingProductSearchState = null;
            }

            return;
        }

        const hasRecognizedIntent = this.getIntentCatalog().some(intent => intent.pattern.test(normalizedMsg));
        const shouldTryCatalogSearch = this.shouldTryProductSearch(message, normalizedMsg, hasRecognizedIntent);

        if (shouldTryCatalogSearch) {
            this.searchProductsInCatalog(message, normalizedMsg)
                .then((result) => {
                    if (!result || !result.products || result.products.length === 0) {
                        this.pendingProductSearchState = null;
                        this.processStandardIntent(message);
                        return;
                    }

                    const firstPage = this.getProductResultsPage(result.products, 0, this.productResultsPageSize);
                    const shouldPaginate = result.mode !== 'single' && result.products.length > this.productResultsPageSize;

                    if (shouldPaginate) {
                        this.pendingProductSearchState = {
                            products: result.products,
                            queryUsed: result.queryUsed,
                            offset: firstPage.nextOffset
                        };
                    } else {
                        this.pendingProductSearchState = null;
                    }

                    const responseText = this.buildProductSearchResponse(
                        firstPage.pageProducts,
                        result.queryUsed,
                        firstPage.startIndex,
                        result.products.length,
                        shouldPaginate && firstPage.hasMore
                    );
                    this.addMessage('bot', responseText);

                    const actions = this.buildProductSearchActions(firstPage.pageProducts);
                    if (actions.length > 0) {
                        this.renderQuickActions(actions);
                    }

                    const syntheticPayload = {
                        text: responseText,
                        intents: [{ id: 'productos' }],
                        actions
                    };

                    this.trackFaqQuestion(message, syntheticPayload);
                    this.updateConversationContext(syntheticPayload);
                    this.saveConversationState();
                })
                .catch((err) => {
                    console.error('Error en búsqueda inteligente de catálogo:', err);
                    this.addMessage('bot', 'No pude consultar el catálogo en este momento. Puedes intentar de nuevo o hablar con soporte humano.');
                    this.renderQuickActions([
                        { label: 'Ir a Contactanos', url: '/contactanos' },
                        { label: 'Ver juegos', url: '/juegos' }
                    ]);
                    this.saveConversationState();
                });
            return;
        }

        this.processStandardIntent(message);
    }

    shouldTryProductSearch(rawMessage, normalizedMsg, hasRecognizedIntent) {
        const explicitSearchIntent = /\b(tienes|tienen|busco|buscar|quiero|precio|cuanto cuesta|cuánto cuesta|disponible|disponibilidad|stock|hay|venden|mostrar)\b/.test(normalizedMsg);
        const brandOrPlatformMention = /\b(playstation|pleystation|play station|pley station|ps4|ps5|xbox|nintendo|switch|steam deck|pc gamer)\b/.test(normalizedMsg);
        const productFamilyMention = /\b(consola|consolas|juego|juegos|control|controles|accesorio|accesorios|audifono|audifonos|headset|mouse|teclado)\b/.test(normalizedMsg);

        if (explicitSearchIntent || brandOrPlatformMention) return true;
        if (!hasRecognizedIntent && productFamilyMention && normalizedMsg.length >= 4) return true;

        const compact = normalizedMsg.replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
        const tokens = compact.split(' ').filter(Boolean);
        const meaningfulTokens = tokens.filter(token => token.length >= 3);

        return !hasRecognizedIntent && meaningfulTokens.length >= 2;
    }

    normalizeBrandAliases(normalizedMsg) {
        return normalizedMsg
            .replace(/\bplay\s*station\b/g, 'playstation')
            .replace(/\bpley\s*station\b/g, 'playstation')
            .replace(/\bpleystation\b/g, 'playstation')
            .replace(/\bplaystion\b/g, 'playstation')
            .replace(/\bplay\b\s*\bstaition\b/g, 'playstation')
            .replace(/\bxbx\b/g, 'xbox')
            .replace(/\bnintentdo\b/g, 'nintendo');
    }

    buildProductSearchQueries(rawMessage, normalizedMsg) {
        const normalizedWithAliases = this.normalizeBrandAliases(normalizedMsg);
        const cleaned = normalizedWithAliases
            .replace(/\b(tienes|tienen|busco|buscar|quiero|precio|precio de|cuanto cuesta|cuánto cuesta|hay|venden|mostrar|por favor|gracias|hola|holi|ola|alo|de|del|la|el|los|las|un|una|me|podrias|podrías)\b/g, ' ')
            .replace(/[^a-z0-9\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        const queries = [];
        const addQuery = (value) => {
            const q = (value || '').trim();
            if (!q || q.length < 2) return;
            if (!queries.includes(q)) queries.push(q);
        };

        addQuery(cleaned);

        const aliasSignals = [
            { pattern: /\bplaystation\b|\bps4\b|\bps5\b/, query: 'playstation' },
            { pattern: /\bxbox\b|\bseries x\b|\bseries s\b/, query: 'xbox' },
            { pattern: /\bnintendo\b|\bswitch\b/, query: 'nintendo switch' },
            { pattern: /\bsteam deck\b|\bsteam\b/, query: 'steam' }
        ];

        aliasSignals.forEach(signal => {
            if (signal.pattern.test(normalizedWithAliases)) {
                addQuery(signal.query);
            }
        });

        const originalCompact = this.normalizeBrandAliases(this.normalizeQuery(rawMessage)).replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
        addQuery(originalCompact);

        return queries.slice(0, 5);
    }

    extractMeaningfulProductTerms(text) {
        const normalized = this.normalizeBrandAliases(this.normalizeQuery(text));
        const stopWords = /\b(tienes|tienen|busco|buscar|quiero|precio|precio de|cuanto|cuánto|cuesta|hay|venden|mostrar|por|favor|gracias|hola|holi|ola|alo|de|del|la|el|los|las|un|una|me|podrias|podrías|info|informacion|información|disponible|disponibilidad|stock)\b/g;
        return normalized
            .replace(stopWords, ' ')
            .replace(/[^a-z0-9\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .split(' ')
            .filter(Boolean);
    }

    classifySearchIntent(normalizedMsg) {
        const brandTerms = new Set(['playstation', 'ps4', 'ps5', 'xbox', 'nintendo', 'switch', 'steam', 'pc', 'gamer']);
        const categoryTerms = new Set(['consola', 'consolas', 'juego', 'juegos', 'control', 'controles', 'accesorio', 'accesorios']);
        const tokens = this.extractMeaningfulProductTerms(normalizedMsg);

        const brandCount = tokens.filter(t => brandTerms.has(t)).length;
        const categoryCount = tokens.filter(t => categoryTerms.has(t)).length;
        const specificCount = tokens.filter(t => !brandTerms.has(t) && !categoryTerms.has(t)).length;

        const looksLikeSpecificModel = /\b(ps[45]|xbox|nintendo|switch)\s*[a-z0-9]{2,}\b/.test(normalizedMsg);
        const isBrandOnly = brandCount > 0 && specificCount === 0;
        const isSpecific = specificCount > 0 || looksLikeSpecificModel;

        return {
            isBrandOnly,
            isSpecific,
            tokens
        };
    }

    scoreProductMatch(product, normalizedMsg, queryUsed) {
        const productName = this.normalizeBrandAliases(this.normalizeQuery(product.nombre || product.descripcion || ''));
        if (!productName) return 0;

        const queryTerms = this.extractMeaningfulProductTerms(queryUsed || normalizedMsg);
        if (queryTerms.length === 0) return 0;

        const fullQuery = queryTerms.join(' ');
        let score = 0;

        if (productName === fullQuery) score += 150;
        if (productName.includes(fullQuery)) score += 90;

        let matchedTerms = 0;
        queryTerms.forEach(term => {
            if (productName.includes(term)) {
                matchedTerms += 1;
                score += 15;
            }
        });

        if (matchedTerms === queryTerms.length) score += 40;
        if (queryTerms.length >= 2 && matchedTerms >= 2) score += 20;

        return score;
    }

    rankProductsForQuery(products, normalizedMsg, queryUsed) {
        return [...products]
            .map(product => ({ product, score: this.scoreProductMatch(product, normalizedMsg, queryUsed) }))
            .sort((a, b) => b.score - a.score)
            .map(entry => entry.product);
    }

    async fetchProductsByQuery(query) {
        const response = await fetch(`/api/productos?buscar=${encodeURIComponent(query)}`);
        if (!response.ok) return [];

        const data = await response.json();
        const rawProducts = Array.isArray(data) ? data : (data.productos || []);
        if (!Array.isArray(rawProducts)) return [];

        return rawProducts;
    }

    async searchProductsInCatalog(rawMessage, normalizedMsg) {
        const queries = this.buildProductSearchQueries(rawMessage, normalizedMsg);
        if (queries.length === 0) {
            return { products: [], queryUsed: '', mode: 'list' };
        }

        const merged = [];
        const seenIds = new Set();
        let queryUsed = '';

        for (const query of queries) {
            const products = await this.fetchProductsByQuery(query);
            if (!queryUsed && products.length > 0) {
                queryUsed = query;
            }

            products.forEach(product => {
                const productId = product.id || product.id_producto || `${product.nombre || ''}-${product.precio || ''}`;
                if (seenIds.has(productId)) return;
                seenIds.add(productId);
                merged.push(product);
            });

            if (merged.length >= 20) break;
        }

        const limited = merged.slice(0, 20);
        const usedQuery = queryUsed || queries[0];
        const classification = this.classifySearchIntent(normalizedMsg);
        const ranked = this.rankProductsForQuery(limited, normalizedMsg, usedQuery);

        if (classification.isSpecific && ranked.length > 0) {
            const topProduct = ranked[0];
            const topScore = this.scoreProductMatch(topProduct, normalizedMsg, usedQuery);
            if (topScore >= 55) {
                return {
                    products: [topProduct],
                    queryUsed: usedQuery,
                    mode: 'single'
                };
            }
        }

        return {
            products: ranked,
            queryUsed: usedQuery,
            mode: classification.isBrandOnly ? 'list' : 'list'
        };
    }

    getProductResultsPage(products, offset = 0, limit = 5) {
        const safeOffset = Math.max(0, Number(offset) || 0);
        const safeLimit = Math.max(1, Number(limit) || 5);
        const pageProducts = products.slice(safeOffset, safeOffset + safeLimit);
        const nextOffset = safeOffset + pageProducts.length;
        const hasMore = nextOffset < products.length;

        return {
            pageProducts,
            startIndex: safeOffset,
            nextOffset,
            hasMore
        };
    }

    buildProductSearchResponse(products, queryUsed, startIndex = 0, totalCount = 0, hasMore = false) {
        if (!products || products.length === 0) {
            return 'No encontré productos relacionados en este momento.';
        }

        const total = totalCount > 0 ? totalCount : products.length;

        if (total === 1 && products.length === 1) {
            const p = products[0];
            const price = Number(p.precio !== undefined ? p.precio : p.precio_venta || 0);
            const stock = Number(p.stock || 0);
            const availability = stock > 0 ? `✅ Disponible (${stock} en stock)` : '❌ Agotado';
            return `Opciones encontradas para "${queryUsed}":\n\n1) ${p.nombre || p.descripcion || 'Producto'}\n   • Precio: $${price.toFixed(2)}\n   • Disponibilidad: ${availability}`;
        }

        let text = `Opciones encontradas para "${queryUsed}" (${total}):\n\n`;
        products.forEach((p, index) => {
            const price = Number(p.precio !== undefined ? p.precio : p.precio_venta || 0);
            const stock = Number(p.stock || 0);
            const availability = stock > 0 ? `✅ ${stock} en stock` : '❌ Agotado';
            const listNumber = startIndex + index + 1;
            text += `${listNumber}) ${p.nombre || p.descripcion || 'Producto'}\n   • Precio: $${price.toFixed(2)}\n   • Disponibilidad: ${availability}\n\n`;
        });

        if (hasMore) {
            text += 'Escribe "ver más" para mostrar más opciones.';
        }

        return text.trim();
    }

    buildProductSearchActions(products) {
        const actions = [];
        const seen = new Set();

        const resolveUrlByCategory = (categoryName = '') => {
            const normalizedCategory = this.normalizeQuery(categoryName);
            if (normalizedCategory.includes('consola')) return '/consolas';
            if (normalizedCategory.includes('control')) return '/controles';
            if (normalizedCategory.includes('accesorio')) return '/accesorios';
            if (normalizedCategory.includes('juego')) return '/juegos';
            return '/juegos';
        };

        products.slice(0, 4).forEach((product) => {
            const category = product.categoria || product.nombre_categoria || '';
            const url = resolveUrlByCategory(category);
            const key = `${category}|${url}`;
            if (seen.has(key)) return;
            seen.add(key);

            const label = category ? `Ver ${category}` : 'Ver productos';
            actions.push({ label, url });
        });

        return actions.slice(0, 3);
    }

    processStandardIntent(message) {

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
        if (type === 'bot') {
            const nonRepeatedText = this.getNonRepeatedBotText(text);
            const friendlyText = this.makeFriendlyBotText(nonRepeatedText);
            const escaped = document.createElement('div');
            escaped.textContent = friendlyText;
            message.innerHTML = escaped.innerHTML
                .replace(/\n/g, '<br>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        } else {
            message.textContent = text;
        }
        this.messagesContainer.appendChild(message);
        this.scrollConversationToBottom();
        this.saveConversationState();
    }

    getNonRepeatedBotText(text) {
        const current = String(text || '').trim();
        const key = this.normalizeQuery(current).replace(/\s+/g, ' ').trim();
        if (!key) return current;

        if (key === this.lastBotMessageKey) {
            this.lastBotMessageRepeatCount += 1;
            if (this.lastBotMessageRepeatCount >= 2) {
                return 'Ya te compartí esta información. Si quieres, te lo explico de otra forma o te llevo directo a una opción para resolverlo más rápido.';
            }
            return current;
        }

        this.lastBotMessageKey = key;
        this.lastBotMessageRepeatCount = 0;
        return current;
    }

    getFallbackQuickActions() {
        return [
            { label: 'Ver juegos', url: '/juegos' },
            { label: 'Ver consolas', url: '/consolas' },
            { label: 'Ver accesorios', url: '/accesorios' },
            { label: 'Ir a Contactanos', url: '/contactanos' }
        ];
    }

    hasEmoji(text) {
        if (!text) return false;
        return /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(text);
    }

    makeFriendlyBotText(text) {
        const raw = String(text || '').trim();
        if (!raw) return '😊 ¡Estoy aquí para ayudarte! 💜';

        const normalized = this.normalizeQuery(raw);

        let friendly = raw
            .replace(/^No logre entender/i, 'No te preocupes 😊, no logré entender')
            .replace(/^No logré entender/i, 'No te preocupes 😊, no logré entender')
            .replace(/^Parece que escribiste algo sin sentido/i, 'Todo bien 😊, parece que tu mensaje no se entendió del todo')
            .replace(/^No encontre/i, 'No te preocupes 😊, no encontré')
            .replace(/^No encontré/i, 'No te preocupes 😊, no encontré');

        let introEmoji = '😊';
        let endingEmoji = '💜';

        if (/\b(pago|pagos|tarjeta|debito|debito|credito|credito|paypal|carrito|checkout)\b/.test(normalized)) {
            introEmoji = '💳';
            endingEmoji = '✨';
        } else if (/\b(envio|envios|envios|entrega|despacho|domicilio|guia|rastreo|tracking)\b/.test(normalized)) {
            introEmoji = '🚚';
            endingEmoji = '📦';
        } else if (/\b(precio|precios|costo|costos|oferta|descuento|valor)\b/.test(normalized)) {
            introEmoji = '💸';
            endingEmoji = '🏷️';
        } else if (/\b(juego|juegos|consola|consolas|control|controles|accesorio|accesorios|producto|productos|catalogo|catalogo|stock)\b/.test(normalized)) {
            introEmoji = '🎮';
            endingEmoji = '🕹️';
        } else if (/\b(horario|horarios|atencion|info|informacion|ubicacion|tienda)\b/.test(normalized)) {
            introEmoji = '🕒';
            endingEmoji = '📍';
        } else if (/\b(contacto|soporte|ayuda|problema|error)\b/.test(normalized)) {
            introEmoji = '🤝';
            endingEmoji = '💬';
        }

        if (!this.hasEmoji(friendly)) {
            friendly = `${introEmoji} ${friendly}`;
        }

        if (!friendly.endsWith(endingEmoji)) {
            friendly = `${friendly} ${endingEmoji}`;
        }

        return friendly;
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
            .replace(/([a-z])\1{2,}/g, '$1')
            .replace(/([aeiou])\1+\b/g, '$1')
            .trim();
    }

    isLikelyNonsenseQuery(normalizedQuery) {
        if (!normalizedQuery) return true;

        const compact = normalizedQuery.replace(/[^a-z0-9]/g, '');
        if (!compact) return true;

        if (compact.length <= 2) return true;

        const numbersOnly = compact.replace(/[^0-9]/g, '');
        if (numbersOnly.length > 0 && numbersOnly.length >= compact.length * 0.7) {
            return true;
        }

        const tokensRaw = normalizedQuery.split(/\s+/).filter(Boolean);
        const hasAlphanumericNoise = tokensRaw.some(token => {
            if (/\b(ps4|ps5|xbox360|xboxone|2d|3d|4k|8k)\b/i.test(token)) return false;
            const cleanToken = token.replace(/[^a-z0-9]/gi, '');
            if (cleanToken.length < 4) return false;
            return /[a-z]{2,}[0-9]+[a-z]{1,}/i.test(cleanToken) || /[0-9]+[a-z]{2,}[0-9]+/i.test(cleanToken);
        });
        if (hasAlphanumericNoise) return true;

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

        const knownWords = /\b(hola|buenas|quiero|necesito|como|cómo|que|qué|cual|cuál|cuando|cuándo|donde|dónde|ayuda|precio|precios|pedido|pedidos|pago|pagos|envio|envios|envíos|carrito|contacto|perfil|juego|juegos|accesorio|accesorios|consola|consolas|control|controles|quienes|quiénes|somos|ubicacion|ubicación|favorito|favoritos|queja|quejas|comentario|comentarios|info|informacion|información|tienda)\b/;
        const hasKnownWord = knownWords.test(normalizedQuery);

        if (!hasKnownWord && tokens.length === 1 && letterOnly.length >= 3 && letterOnly.length <= 7) {
            return true;
        }

        if (!hasKnownWord && tokens.length <= 2 && letterOnly.length <= 10) {
            const hasOnlyShortFragments = lettersOnlyTokens.every(token => token.length <= 5);
            if (hasOnlyShortFragments) return true;
        }

        if (!hasKnownWord && letterOnly.length >= 8) {
            const suspiciousWords = lettersOnlyTokens.filter((token) => token.length >= 4).length;
            if (suspiciousWords >= 1) return true;
        }

        return false;
    }

    getNonsenseReply() {
        const replies = [
            'No logré entender bien tu mensaje 😅. ¿Me lo puedes explicar con más detalle? Por ejemplo: pagos, pedidos, envíos, productos o contacto.',
            'Parece que escribiste algo sin sentido, por favor redacta correctamente tu pregunta o elige una opción del menú.'
        ];
        return replies[Math.floor(Math.random() * replies.length)];
    }

    isOutOfStoreQuery(normalizedQuery) {
        if (!normalizedQuery) return false;

        const domainKeywords = /\b(tienda|gamestore|game store|juego|juegos|consola|consolas|control|controles|accesorio|accesorios|producto|productos|catalogo|catálogo|precio|precios|stock|disponible|disponibilidad|pedido|pedidos|carrito|pago|pagos|envio|envios|envíos|contacto|garantia|garantía|favoritos|cuenta|login|ubicacion|ubicación|horario|horarios|informacion|información|info|venden|vende|tienen)\b/;
        if (domainKeywords.test(normalizedQuery)) return false;

        const externalTopicKeywords = /\b(clima|tiempo hoy|temperatura|pronostico|pronóstico|noticias|politica|política|presidente|elecciones|futbol|fútbol|partido|champions|real madrid|barcelona|musica|música|pelicula|película|serie|netflix|spotify|receta|cocina|medicina|doctor|salud|sintoma|síntoma|abogado|legal|ley|impuestos|criptomoneda|bitcoin|ethereum|codigo|código|programacion|programación|python|javascript|java|c\+\+|matematica|matemática|derivada|integral|capital de|pais|país|historia universal)\b/;
        if (externalTopicKeywords.test(normalizedQuery)) return true;

        const genericQuestionButNoDomain = /\b(que|qué|como|cómo|cuando|cuándo|donde|dónde|cual|cuál|quien|quién|por que|por qué)\b/.test(normalizedQuery);
        return genericQuestionButNoDomain;
    }

    getOutOfStoreReply() {
        const replies = [
            'Soy GameStore Assistant, estoy para resolver dudas relacionadas con nuestra tienda. Por favor especifica tu duda sobre productos, pedidos, pagos, envíos o cuenta.',
            'Soy GameStore Assistant y este chat solo resuelve consultas de nuestra tienda. Por favor especifica tu duda y te ayudo de inmediato.',
            'Soy GameStore Assistant. No resuelvo preguntas externas a la tienda; por favor especifica tu duda relacionada con Game Store (productos, stock, pedidos o pagos).'
        ];
        return replies[Math.floor(Math.random() * replies.length)];
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

    isPageReloadNavigation() {
        try {
            if (window.performance && typeof window.performance.getEntriesByType === 'function') {
                const navEntries = window.performance.getEntriesByType('navigation');
                if (Array.isArray(navEntries) && navEntries.length > 0) {
                    return navEntries[0].type === 'reload';
                }
            }

            if (window.performance && window.performance.navigation) {
                return window.performance.navigation.type === 1;
            }
        } catch (error) {
            return false;
        }

        return false;
    }

    clearConversationState() {
        try {
            sessionStorage.removeItem(this.sessionStorageKey);
        } catch (error) {
            // no-op
        }

        try {
            localStorage.removeItem(this.localStorageKey);
        } catch (error) {
            // no-op
        }

        try {
            const parsed = window.name ? JSON.parse(window.name) : {};
            if (parsed && typeof parsed === 'object' && parsed[this.windowStateKey]) {
                delete parsed[this.windowStateKey];
                window.name = JSON.stringify(parsed);
            }
        } catch (error) {
            // no-op
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
                pattern: /\b(hola|holi|ola|alo|buenas|buen dia|buen día|buenas tardes|buenas noches|hey|que tal|hi|hello)\b/,
                response: '¡Hola! Qué bueno tenerte por aquí. Dime qué necesitas y te ayudo enseguida.'
            },
            {
                id: 'ayuda',
                pattern: /\b(ayuda|ayudame|ayúdame|necesito ayuda|help|help me)\b/,
                response: 'Claro, ¿con qué necesitas ayuda? Dime tu duda o elige una opción del menú.'
            },
            {
                id: 'despedida',
                pattern: /\b(chao|chau|adios|adiós|hasta luego|nos vemos|bye|me voy|gracias bye|eso es todo)\b/,
                response: 'Soy GameStore Assistant, fue un placer atenderte y resolver tus dudas. Aquí seguiré si me necesitas.'
            },
            {
                id: 'pagos',
                pattern: /\b(pago|pagos|pagar|metodo de pago|metodos de pago|método de pago|métodos de pago|tarjeta|debito|débito|credito|crédito|paypal|checkout|transaccion|transacción|pasarela|cobro)\b/,
                response: 'Métodos de pago disponibles:\n\n💳 Tarjeta de crédito\n💳 Tarjeta de débito\n🔵 PayPal\n\nPuedes elegirlos de forma segura en el carrito al finalizar tu compra.'
            },
            {
                id: 'metodos_pago',
                pattern: /\b(metodo de pago|metodos de pago|método de pago|métodos de pago|como pagar|cómo pagar|pago seguro|seguro pagar)\b/,
                response: 'Métodos de pago disponibles:\n\n💳 Tarjeta de crédito\n💳 Tarjeta de débito\n🔵 PayPal\n\nPuedes elegir el método en el carrito al finalizar tu compra.'
            },
            {
                id: 'tarjetas_aceptadas',
                pattern: /\b(aceptan tarjetas|aceptan todo tipo de tarjetas|aceptan todo tipo tarjeta|aceptan visa|aceptan mastercard|tarjetas aceptadas|pagan con tarjeta|puedo pagar con tarjeta|se puede pagar con tarjeta|visa y mastercard|visa mastercard)\b/,
                response: 'Aceptamos tarjetas Visa y Mastercard:\n💳 Tarjetas de débito\n💳 Tarjetas de crédito\n\nAdemás aceptamos pagos directamente con 🔵 PayPal.'
            },
            {
                id: 'pedidos',
                pattern: /\b(pedido|pedidos|orden|ordenes|órdenes|compra|compras|estado|seguimiento|tracking|rastreo|guia|guía)\b/,
                response: 'Puedes revisar tu pedido desde la sección Pedidos. Ahí verás estado, fecha, productos y total actualizado.'
            },
            {
                id: 'numero_guia',
                pattern: /\b(numero de guia|número de guía|codigo de rastreo|código de rastreo|track id|guia de envio|guía de envío)\b/,
                response: 'Tu número de guía aparece cuando el pedido ya fue despachado. Lo puedes ver en la sección Pedidos dentro del detalle de compra.'
            },
            {
                id: 'pedido_retrasado',
                pattern: /\b(pedido retrasado|pedido retrazado|pedido retarzado|pedido se retrasa|pedido se retrasa|pedido se retarza|pedido se retraza|mi pedido se retrasa|mi pedido se retrasa|mi pedido esta retrasado|mi pedido está retrasado|mi pedido esta retarzado|mi pedido está retarzado|mi pedido se demoro|mi pedido se demoró|mi pedido demora|mi pedido tarda|mi pedido no llega|que pasa si mi pedido se retrasa|qué pasa si mi pedido se retrasa)\b/,
                response: 'Tranquilo, si tu pedido está retrasado mantén la calma, estamos haciendo todo lo posible para que tu pedido llegue lo antes posible. Si surge algún inconveniente nos pondremos en contacto contigo y si quieres más información contáctanos.'
            },
            {
                id: 'envios',
                pattern: /\b(envio|envíos|envios|entrega|domicilio|llega|despacho|shipping|direccion|dirección|reparto)\b/,
                response: 'Con gusto te ayudo con envíos. Antes de pagar, revisa bien tu dirección y luego consulta el avance en Pedidos.'
            },
            {
                id: 'tiempo_envio',
                pattern: /\b(cuanto tarda|cuánto tarda|tiempo de envio|tiempo de envío|dias de entrega|días de entrega|cuando llega|cuándo llega)\b/,
                response: 'El tiempo de entrega depende de la zona. Te recomiendo revisar el cálculo final en el carrito y luego seguir el estado en Pedidos.'
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
                id: 'garantia',
                pattern: /\b(garantia|garantía|garantias|garantías)\b/,
                response: 'Si necesitas validar garantía, te ayudamos desde soporte. Escríbenos por Contacto con tu número de pedido y el detalle del problema.'
            },
            {
                id: 'cuenta',
                pattern: /\b(cuenta|login|iniciar sesion|registro|registrar|contrasena|contraseña|perfil|mis datos|usuario|correo|email|acceso)\b/,
                response: 'Con tu cuenta puedes iniciar sesión, registrarte y actualizar tus datos desde Perfil. Si tienes problemas de acceso, te guío para recuperarlo.'
            },
            {
                id: 'problemas_login',
                pattern: /\b(no puedo iniciar sesion|no puedo iniciar sesión|no puedo entrar|olvide mi contrasena|olvidé mi contraseña|recuperar contraseña|recuperar contrasena|error login|problema de acceso)\b/,
                response: 'Si tienes problemas para entrar, intenta recuperar contraseña desde Login. Si no funciona, te ayudamos desde Contacto con tu correo de cuenta.'
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
                id: 'que_venden',
                pattern: /\b(que venden|qué venden|que vende|qué vende|que tienen|qué tienen|que venden aqui|qué venden aquí)\b/,
                response: 'Somos una tienda de videojuegos donde vendemos todo para los amantes del gaming. Si quieres, te muestro nuestras categorías principales para que explores lo que buscas.'
            },
            {
                id: 'productos',
                pattern: /\b(producto|productos|catalogo|catálogo|tienda|stock|disponible|disponibilidad)\b/,
                response: 'Puedes explorar productos por categorías y revisar disponibilidad directamente en cada tarjeta.'
            },
            {
                id: 'precios',
                pattern: /\b(precio|precios|cuanto|cuánto|valor|vale|coste|costo|costos|oferta|ofertas|descuento|descuentos|promocion|promociones|barato|barata)\b/,
                response: 'Los precios de cada producto son visibles en cada producto. Te llevaré a la página de inicio para que los revises.'
            },
            {
                id: 'precios_juegos',
                pattern: /\b(precio de juego|precio juegos|cuanto cuesta juego|cuánto cuesta juego|juegos en oferta)\b/,
                response: 'Para precios exactos de juegos, puedes escribir el nombre del título y te ayudo a buscarlo en el catálogo.'
            },
            {
                id: 'contacto',
                pattern: /\b(contacto|soporte|telefono|teléfono|correo|email|whatsapp|asesor|atencion|atención)\b/,
                response: 'Si necesitas soporte, te puedo llevar a Contáctanos. Si es por un pedido, incluye el número para atenderte más rápido.'
            },
            {
                id: 'informacion_general',
                pattern: /\b(info|informacion|información|informacion tienda|información tienda|datos de la tienda|sobre la tienda|info tienda)\b/,
                response: '🕒 Horarios de atención:\n\n• Atención al cliente: Lunes a viernes, de 11:00 AM a 6:00 PM.\n• Tienda física: Lunes a viernes, de 11:00 AM a 7:00 PM.\n• Tienda en línea: Disponible 24/7 para tus compras.\n\n📍 Si quieres, también te puedo guiar a nuestra sección de ubicación.'
            },
            {
                id: 'horarios',
                pattern: /\b(horario|horarios|atencion al cliente|atención al cliente|cuando abren|cuándo abren|cuando cierran|cuándo cierran)\b/,
                response: '🕒 Horarios de atención:\n\n• Atención al cliente: Lunes a viernes, de 11:00 AM a 6:00 PM.\n• Tienda física: Lunes a viernes, de 11:00 AM a 7:00 PM.\n• Tienda en línea: Disponible 24/7 para tus compras.\n\n📍 Si quieres, también te puedo guiar a nuestra sección de ubicación.'
            },
            {
                id: 'canje_codigo',
                pattern: /\b(canjear codigo|canjear código|codigo digital|código digital|redeem code|canje)\b/,
                response: 'Para canjear códigos digitales, ve a la tienda oficial de tu plataforma y usa la opción de "Canjear código" con tu clave.'
            },
            {
                id: 'quejas',
                pattern: /\b(queja|quejas|reclamacion|reclamo|reclamos|comentario|comentarios|opinion|opiniones|opinio|sugerencia|sugerencias|pesimo|mal servicio)\b/i,
                response: 'Ya sea que tengas una queja, comentario o sugerencia, nos encantaría escucharte. Para darle el mejor seguimiento, por favor escríbenos directamente en la sección de Contacto.'
            },
            {
                id: 'favoritos',
                pattern: /\b(favoritos|favorito|lista de deseos|deseos|wishlist|apartados|guardados)\b/i,
                response: 'En tu Lista de Deseos (Favoritos) puedes guardar los productos que te gusten para comprarlos después. Puedes acceder a ella desde el corazón en la barra de navegación o tu perfil.'
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
            metodos_pago: { label: 'Ir al carrito', url: '/carrito' },
            tarjetas_aceptadas: { label: 'Ir al carrito', url: '/carrito' },
            pedidos: { label: 'Ir a pedidos', url: '/pedidos' },
            numero_guia: { label: 'Ver mis pedidos', url: '/pedidos' },
            pedido_retrasado: { label: 'Ir a Contactanos', url: '/contactanos' },
            envios: { label: 'Ir a dirección', url: '/perfil/direccion' },
            tiempo_envio: { label: 'Ir al carrito', url: '/carrito' },
            carrito: { label: 'Abrir carrito', url: '/carrito' },
            devoluciones: { label: 'Ir a contacto', url: '/contactanos' },
            garantia: { label: 'Ir a contacto', url: '/contactanos' },
            cuenta: { label: 'Ir a mis datos', url: '/perfil/mis-datos' },
            problemas_login: { label: 'Iniciar sesión', url: '/login' },
            contacto: { label: 'Ir a Contactanos', url: '/contactanos' },
            informacion_general: { label: 'Ver quiénes somos', url: '/quienes-somos' },
            horarios: { label: 'Ir a contacto', url: '/contactanos' },
            canje_codigo: { label: 'Ir a contacto', url: '/contactanos' },
            quejas: { label: 'Ir a contacto', url: '/contactanos' },
            favoritos: { label: 'Mis favoritos', url: '/favoritos' },
            que_venden: { label: 'Ver juegos', url: '/juegos' },
            cat_consolas: { label: 'Ver consolas', url: '/consolas' },
            cat_accesorios: { label: 'Ver accesorios', url: '/accesorios' },
            cat_controles: { label: 'Ver controles', url: '/controles' },
            cat_juegos: { label: 'Ver juegos', url: '/juegos' },
            productos: { label: 'Ver juegos', url: '/juegos' },
            precios: { label: 'Ir a inicio', url: '/' },
            precios_juegos: { label: 'Ver juegos', url: '/juegos' },
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
        const hasGenericProducts = intents.some(intent => intent.id === 'productos' || intent.id === 'que_venden');

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

    getIntentDomain(intentId) {
        const domains = {
            pagos: 'payments',
            metodos_pago: 'payments',
            tarjetas_aceptadas: 'payments',
            carrito: 'payments',
            pedidos: 'orders',
            numero_guia: 'orders',
            pedido_retrasado: 'orders',
            envios: 'orders',
            tiempo_envio: 'orders',
            devoluciones: 'orders',
            garantia: 'orders',
            cuenta: 'account',
            problemas_login: 'account',
            favoritos: 'account',
            cat_consolas: 'catalog',
            cat_accesorios: 'catalog',
            cat_controles: 'catalog',
            cat_juegos: 'catalog',
            productos: 'catalog',
            precios: 'catalog',
            precios_juegos: 'catalog',
            recomendacion: 'catalog',
            informacion_general: 'info',
            horarios: 'info',
            ubicacion: 'info',
            quienes_somos: 'info',
            contacto: 'info',
            canje_codigo: 'info',
            seguridad: 'info',
            quejas: 'info',
            problema: 'info',
            ayuda: 'info',
            que_venden: 'catalog'
        };

        return domains[intentId] || 'other';
    }

    getIntentPromptLabel(intentId) {
        const labels = {
            pagos: 'Métodos de pago',
            metodos_pago: 'Métodos de pago',
            tarjetas_aceptadas: 'Tarjetas aceptadas',
            carrito: 'Carrito',
            pedidos: 'Estado de pedidos',
            numero_guia: 'Número de guía',
            pedido_retrasado: 'Pedido retrasado',
            envios: 'Información de envíos',
            tiempo_envio: 'Tiempo de entrega',
            devoluciones: 'Devoluciones',
            garantia: 'Garantía',
            cuenta: 'Cuenta y perfil',
            problemas_login: 'Problemas de acceso',
            favoritos: 'Favoritos',
            cat_consolas: 'Consolas',
            cat_accesorios: 'Accesorios',
            cat_controles: 'Controles',
            cat_juegos: 'Juegos',
            productos: 'Productos',
            precios: 'Precios',
            precios_juegos: 'Precios de juegos',
            recomendacion: 'Recomendaciones',
            informacion_general: 'Información de la tienda',
            horarios: 'Horarios',
            ubicacion: 'Ubicación',
            quienes_somos: 'Quiénes somos',
            contacto: 'Contacto',
            canje_codigo: 'Canje de códigos',
            seguridad: 'Seguridad',
            quejas: 'Quejas y sugerencias',
            problema: 'Soporte de problemas',
            ayuda: 'Ayuda general',
            que_venden: 'Qué vendemos'
        };

        return labels[intentId] || 'Esta opción';
    }

    shouldAskForClarification(normalizedQuery, intents) {
        if (!Array.isArray(intents) || intents.length < 2) return false;

        if (/\b(y|ademas|además|tambien|también)\b/.test(normalizedQuery)) return false;

        const top = intents.slice(0, 2);
        const domainA = this.getIntentDomain(top[0].id);
        const domainB = this.getIntentDomain(top[1].id);
        if (domainA === domainB) return false;

        const words = normalizedQuery.split(/\s+/).filter(Boolean);
        const hasExplicitQuestion = /\b(como|cómo|donde|dónde|cuando|cuándo|cual|cuál|que|qué)\b/.test(normalizedQuery);

        return words.length <= 6 && !hasExplicitQuestion;
    }

    buildClarificationPayload(normalizedQuery, intents) {
        if (!this.shouldAskForClarification(normalizedQuery, intents)) return null;

        const options = intents.slice(0, 2);
        const labels = options.map(intent => this.getIntentPromptLabel(intent.id));

        return {
            text: `Para ayudarte mejor, ¿qué necesitas primero?\n\n• ${labels[0]}\n• ${labels[1]}`,
            intents: options
        };
    }

    buildLowConfidencePayload(normalizedQuery, intents) {
        if (!Array.isArray(intents) || intents.length !== 1) return null;

        const onlyIntent = intents[0];
        const broadIntents = new Set(['productos', 'contacto']);
        if (!broadIntents.has(onlyIntent.id)) return null;

        const words = normalizedQuery.split(/\s+/).filter(Boolean);
        if (words.length > 2) return null;

        if (onlyIntent.id === 'productos') {
            return {
                text: 'Para ayudarte mejor, dime qué te interesa ver: juegos, consolas, controles o accesorios.',
                intents: []
            };
        }

        return {
            text: '¿Necesitas ayuda de contacto por pedidos, pagos o soporte? Así te guío mejor.',
            intents: [{ id: 'contacto' }]
        };
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
                    text: this.getNonsenseReply(),
                    intents: [],
                    normalizedQuery
                };
            }

            if (this.isOutOfStoreQuery(normalizedQuery)) {
                return {
                    text: this.getOutOfStoreReply(),
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

        const nonMetaDomainIntents = ['ayuda', 'quejas', 'favoritos', 'pagos', 'metodos_pago', 'tarjetas_aceptadas', 'pedidos', 'numero_guia', 'pedido_retrasado', 'envios', 'tiempo_envio', 'carrito', 'devoluciones', 'garantia', 'cuenta', 'problemas_login', 'cat_consolas', 'cat_accesorios', 'cat_controles', 'cat_juegos', 'precios', 'precios_juegos', 'contacto', 'informacion_general', 'horarios', 'canje_codigo', 'productos', 'que_venden', 'ubicacion', 'quienes_somos', 'recomendacion', 'seguridad', 'problema'];
        const hasDomainIntent = uniqueById.some(intent => nonMetaDomainIntents.includes(intent.id));

        let filteredIntents = uniqueById;
        if (hasDomainIntent) {
            filteredIntents = uniqueById.filter(intent => intent.id !== 'saludo' && intent.id !== 'agradecimiento');
        }

        const hasPaymentIntent = filteredIntents.some(intent => intent.id === 'pagos');
        const hasPaymentMethodsIntent = filteredIntents.some(intent => intent.id === 'metodos_pago');
        const hasAcceptedCardsIntent = filteredIntents.some(intent => intent.id === 'tarjetas_aceptadas');

        if (hasAcceptedCardsIntent) {
            filteredIntents = filteredIntents.filter(intent => intent.id !== 'pagos' && intent.id !== 'metodos_pago');
        }

        if (hasPaymentIntent && hasPaymentMethodsIntent) {
            filteredIntents = filteredIntents.filter(intent => intent.id !== 'pagos');
        }

        if (hasPaymentIntent && !/\b(contacto|soporte|asesor|telefono|teléfono|correo|email|whatsapp)\b/.test(normalizedQuery)) {
            filteredIntents = filteredIntents.filter(intent => intent.id !== 'contacto');
        }

        const priorityOrder = ['despedida', 'ayuda', 'quejas', 'problema', 'favoritos', 'problemas_login', 'tarjetas_aceptadas', 'pagos', 'metodos_pago', 'pedido_retrasado', 'pedidos', 'numero_guia', 'envios', 'tiempo_envio', 'carrito', 'devoluciones', 'garantia', 'cuenta', 'informacion_general', 'cat_consolas', 'cat_accesorios', 'cat_controles', 'cat_juegos', 'precios', 'precios_juegos', 'quienes_somos', 'recomendacion', 'contacto', 'horarios', 'canje_codigo', 'ubicacion', 'seguridad', 'que_venden', 'productos', 'saludo', 'agradecimiento'];
        filteredIntents.sort((a, b) => priorityOrder.indexOf(a.id) - priorityOrder.indexOf(b.id));

        const delayedOrderIntent = filteredIntents.find(intent => intent.id === 'pedido_retrasado');
        if (delayedOrderIntent) {
            return {
                text: delayedOrderIntent.response,
                intents: [delayedOrderIntent],
                normalizedQuery
            };
        }

        const hasPriceIntent = filteredIntents.some(intent => intent.id === 'precios');
        const onlyGenericPriceRelated = filteredIntents.every(intent => ['precios', 'contacto', 'saludo', 'agradecimiento'].includes(intent.id));

        if (hasPriceIntent && onlyGenericPriceRelated) {
            const pricesIntent = intents.find(intent => intent.id === 'precios');
            const contactIntent = intents.find(intent => intent.id === 'contacto');
            const explicitIntents = [pricesIntent, contactIntent].filter(Boolean);

            return {
                text: 'Los precios son visibles en cada producto, recuerda revisar el total al proceder con el pago. Si tienes alguna duda sobre los precios, puedes contactarnos.',
                intents: explicitIntents,
                normalizedQuery
            };
        }

        const clarificationPayload = this.buildClarificationPayload(normalizedQuery, filteredIntents);
        if (clarificationPayload) {
            return {
                text: clarificationPayload.text,
                intents: clarificationPayload.intents,
                normalizedQuery
            };
        }

        const lowConfidencePayload = this.buildLowConfidencePayload(normalizedQuery, filteredIntents);
        if (lowConfidencePayload) {
            return {
                text: lowConfidencePayload.text,
                intents: lowConfidencePayload.intents,
                normalizedQuery
            };
        }

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
        const resolvedIntents = resolved.intents || [];
        const hasPriceIntent = resolvedIntents.some(intent => intent.id === 'precios');
        const onlyGenericPriceIntent = hasPriceIntent && resolvedIntents.every(intent => ['precios', 'saludo', 'agradecimiento'].includes(intent.id));

        if (onlyGenericPriceIntent) {
            return {
                text: resolved.text,
                actions: [{ label: 'Ir a inicio', url: '/' }],
                autoNavigateUrl: null,
                intents: resolvedIntents,
                closeConversation: false
            };
        }

        const hasFarewell = resolvedIntents.some(intent => intent.id === 'despedida');

        if (hasFarewell) {
            return {
                text: resolved.text,
                actions: [],
                autoNavigateUrl: null,
                intents: resolvedIntents,
                closeConversation: true
            };
        }

        const actions = this.resolveActionsFromIntents(resolvedIntents).slice(0, 4);
        const fallbackActions = resolvedIntents.length === 0 ? this.getFallbackQuickActions() : [];
        const finalActions = actions.length > 0 ? actions : fallbackActions;
        const directNavigate = actions.length > 0 && this.isDirectNavigationCommand(resolved.normalizedQuery || '');

        if (!directNavigate) {
            return {
                text: resolved.text,
                actions: finalActions,
                autoNavigateUrl: null,
                intents: resolvedIntents,
                closeConversation: false
            };
        }

        const primaryAction = actions[0];
        return {
            text: `${resolved.text} Te llevo ahora a "${primaryAction.label}"...`,
            actions: [],
            autoNavigateUrl: primaryAction.url,
            intents: resolvedIntents,
            closeConversation: false
        };
    }

    runSmokeTests() {
        const tests = [
            {
                name: 'Métodos de pago sin duplicado',
                query: 'metodos de pago',
                check: (payload) => {
                    const intentIds = (payload.intents || []).map(intent => intent.id);
                    return intentIds.includes('metodos_pago') && !intentIds.includes('pagos');
                }
            },
            {
                name: 'Precios muestra botón inicio',
                query: 'precios',
                check: (payload) => Array.isArray(payload.actions) && payload.actions.some(action => action.url === '/') && !payload.autoNavigateUrl
            },
            {
                name: 'Desambiguación en consulta ambigua corta',
                query: 'pago envio',
                check: (payload) => /que necesitas primero|qué necesitas primero/i.test(payload.text || '')
            },
            {
                name: 'Baja confianza para precios genéricos',
                query: 'precio',
                check: (payload) => /de que quieres precios|de qué quieres precios/i.test(payload.text || '')
            },
            {
                name: 'Detección de nonsense',
                query: 'sdxa12z',
                check: (payload) => /no logre entender|no logré entender|sin sentido/i.test(this.normalizeQuery(payload.text || ''))
            }
        ];

        const results = tests.map((test) => {
            try {
                const payload = this.getResponsePayload(test.query);
                const passed = Boolean(test.check(payload));
                return {
                    test: test.name,
                    query: test.query,
                    passed,
                    intents: (payload.intents || []).map(intent => intent.id).join(', '),
                    text: (payload.text || '').slice(0, 120)
                };
            } catch (error) {
                return {
                    test: test.name,
                    query: test.query,
                    passed: false,
                    intents: '',
                    text: error && error.message ? error.message : 'Error inesperado'
                };
            }
        });

        const passed = results.filter(item => item.passed).length;
        const total = results.length;

        console.group('🧪 Chatbot Smoke Tests');
        console.table(results);
        console.log(`Resultado: ${passed}/${total} pruebas aprobadas`);
        console.groupEnd();

        return {
            passed,
            total,
            failed: total - passed,
            results
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
    window.runChatbotSmokeTests = () => chatbotManager.runSmokeTests();
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
