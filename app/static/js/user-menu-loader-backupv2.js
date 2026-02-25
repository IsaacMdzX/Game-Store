// ============================================
// MENÚ DE USUARIO - VERSIÓN MEJORADA
// ============================================

class UserMenuLoader {
    constructor() {
        console.log('[UserMenu] Inicializando...');
        this.userMenuBtn = document.getElementById('userMenuBtn');
        this.userDropdown = document.getElementById('userDropdown');
        this.dropdownContent = this.userDropdown ? this.userDropdown.querySelector('.dropdown-content') : null;
        this.currentUser = null;
        this.cacheKey = 'userMenuCache';
        this.cacheDuration = 5 * 60 * 1000;
        
        if (this.userMenuBtn && this.userDropdown && this.dropdownContent) {
            console.log('[UserMenu] Elementos encontrados, inicializando...');
            this.init();
        } else {
            console.warn('[UserMenu] Elementos no encontrados:', {
                btn: !!this.userMenuBtn,
                dropdown: !!this.userDropdown,
                content: !!this.dropdownContent
            });
        }
    }

    init() {
        // PRIMERO: Setup listeners INMEDIATAMENTE
        this.setupEventListeners();
        
        // SEGUNDO: Cargar datos en background
        this.loadUserDataAsync();
    }

    getCachedData() {
        try {
            const cached = sessionStorage.getItem(this.cacheKey);
            if (!cached) return null;
            
            const data = JSON.parse(cached);
            if (Date.now() - data.timestamp < this.cacheDuration) {
                console.log('[UserMenu] Usando cache');
                return data.user;
            }
            sessionStorage.removeItem(this.cacheKey);
        } catch (error) {
            console.log('[UserMenu] Error lectura cache:', error);
        }
        return null;
    }

    cacheData(user) {
        try {
            sessionStorage.setItem(this.cacheKey, JSON.stringify({
                user: user,
                timestamp: Date.now()
            }));
        } catch (error) {
            console.log('[UserMenu] Error guardando cache:', error);
        }
    }

    loadUserDataAsync() {
        // Primero: Usar caché si existe
        const cached = this.getCachedData();
        if (cached) {
            this.currentUser = cached;
            this.renderMenu();
            // Actualizar en background asincronamente
            this.fetchUserData();
            return;
        }

        // Si no hay caché, hacer fetch
        this.fetchUserData();
    }

    async fetchUserData() {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 2000);
            
            const response = await fetch('/api/usuario/actual', {
                method: 'GET',
                credentials: 'same-origin',
                signal: controller.signal
            });
            
            clearTimeout(timeout);

            if (response.ok) {
                this.currentUser = await response.json();
                this.cacheData(this.currentUser);
                this.renderMenu();
                console.log('[UserMenu] Usuario cargado:', this.currentUser.username);
            }
        } catch (error) {
            console.log('[UserMenu] Fetch timeout/error:', error.message);
            this.renderMenu();
        }
    }

    renderMenu() {
        if (!this.dropdownContent) {
            console.warn('[UserMenu] dropdownContent no encontrado');
            return;
        }

        let html = '';

        if (this.currentUser && this.currentUser.username) {
            // Usuario logueado
            html = `
                <div class="user-info">
                    <i class="fa-solid fa-user-circle"></i>
                    <div>
                        <p class="user-name">${this.currentUser.username}</p>
                    </div>
                </div>
                <hr style="margin: 8px 0; opacity: 0.2;">
                <a href="#" id="logoutBtn" class="dropdown-item"><i class="fa-solid fa-sign-out-alt"></i> Cerrar Sesión</a>
            `;
        } else {
            // Usuario no logueado
            html = `
                <a href="/login" class="dropdown-item"><i class="fa-solid fa-sign-in-alt"></i> Iniciar Sesión</a>
                <a href="/registro" class="dropdown-item"><i class="fa-solid fa-user-plus"></i> Registrarse</a>
            `;
        }
        
        this.dropdownContent.innerHTML = html;
        
        // Agregar listener al botón de logout si existe
        const logoutBtn = this.dropdownContent.querySelector('#logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
    }

    setupEventListeners() {
        if (!this.userMenuBtn || !this.userDropdown) return;

        // Click en botón
        this.userMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log('[UserMenu] Click en botón');
            this.userDropdown.classList.toggle('show');
        }, false);

        // Click fuera
        document.addEventListener('click', (e) => {
            if (this.userDropdown && !this.userDropdown.contains(e.target) && !this.userMenuBtn.contains(e.target)) {
                this.userDropdown.classList.remove('show');
            }
        }, false);

        // ESC para cerrar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.userDropdown) {
                this.userDropdown.classList.remove('show');
            }
        }, false);

        // Cerrar al hacer click en link
        this.userDropdown.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href && !link.href.includes('#')) {
                setTimeout(() => {
                    if (this.userDropdown) {
                        this.userDropdown.classList.remove('show');
                    }
                }, 50);
            }
        }, false);
    }

    async logout() {
        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
                credentials: 'same-origin'
            });

            if (response.ok) {
                sessionStorage.removeItem(this.cacheKey);
                window.location.href = '/login';
            }
        } catch (error) {
            window.location.href = '/';
        }
    }
}

// Inicializar cuando esté disponible el DOM
console.log('[UserMenu] Script cargado, readyState:', document.readyState);

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('[UserMenu] DOMContentLoaded disparado');
        window.userMenuLoader = new UserMenuLoader();
    }, { passive: true });
} else {
    console.log('[UserMenu] DOM ya está listo');
    window.userMenuLoader = new UserMenuLoader();
}
