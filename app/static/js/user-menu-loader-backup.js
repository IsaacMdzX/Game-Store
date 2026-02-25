// ============================================
// MENÚ DE USUARIO - VERSIÓN ULTRA-RÁPIDA
// Abre instantáneamente sin esperas
// ============================================

class UserMenuLoader {
    constructor() {
        this.userMenuBtn = document.getElementById('userMenuBtn');
        this.userDropdown = document.getElementById('userDropdown');
        this.dropdownContent = this.userDropdown ? this.userDropdown.querySelector('.dropdown-content') : null;
        this.currentUser = null;
        this.cacheKey = 'userMenuCache';
        this.cacheDuration = 5 * 60 * 1000;
        
        if (this.userMenuBtn && this.userDropdown) {
            this.init();
        }
    }

    init() {
        // PRIMERO: Setup listeners INMEDIATAMENTE (sin esperar nada)
        this.setupEventListeners();
        
        // SEGUNDO: Cargar datos en background (sin bloquear UI)
        this.loadUserDataAsync();
    }

    getCachedData() {
        try {
            const cached = sessionStorage.getItem(this.cacheKey);
            if (!cached) return null;
            
            const data = JSON.parse(cached);
            if (Date.now() - data.timestamp < this.cacheDuration) {
                return data.user;
            }
            sessionStorage.removeItem(this.cacheKey);
        } catch (error) {
            console.log('Error lectura cache:', error);
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
            console.log('Error guardando cache:', error);
        }
    }

    async loadUserDataAsync() {
        // Primero: intentar caché
        const cached = this.getCachedData();
        if (cached) {
            this.currentUser = cached;
            this.renderMenu();
            // Actualizar en background asincronamente
            this.fetchUserData();
            return;
        }

        // Si no hay caché, hacer fetch con timeout muy corto
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
            }
        } catch (error) {
            console.log('userMenu: timeout or error (ok)', error.message);
            // Sin hacer nada - el menú ya está abierto con opciones
        }
    }

    renderMenu() {
        if (!this.dropdownContent) return;

        let html = '';

        // Si el usuario está logueado, mostrar su nombre y botón de cerrar sesión
        if (this.currentUser && this.currentUser.username) {
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
            // Si no está logueado, mostrar opciones de iniciar sesión y registrarse
            html = `
                <a href="/login" class="dropdown-item"><i class="fa-solid fa-sign-in-alt"></i> Iniciar Sesión</a>
                <a href="/registro" class="dropdown-item"><i class="fa-solid fa-user-plus"></i> Registrarse</a>
            `;
        }
        
        this.dropdownContent.innerHTML = html;
        
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

        // Click en botón - ABRE INSTANTÁNEAMENTE
        this.userMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.userDropdown.classList.toggle('show');
        }, false);

        // Click fuera
        document.addEventListener('click', (e) => {
            if (!this.userDropdown.contains(e.target) && !this.userMenuBtn.contains(e.target)) {
                this.userDropdown.classList.remove('show');
            }
        }, false);

        // ESC para cerrar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.userDropdown.classList.remove('show');
            }
        }, false);

        // Cerrar al hacer click en link
        this.userDropdown.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href && !link.href.includes('#')) {
                setTimeout(() => {
                    this.userDropdown.classList.remove('show');
                }, 50);
            }
        }, false);
    }

    async logout() {
        try {
            sessionStorage.removeItem(this.cacheKey);
            await fetch('/api/logout', {
                method: 'POST',
                credentials: 'same-origin'
            });
            window.location.href = '/login';
        } catch (error) {
            window.location.href = '/';
        }
    }
}

// Inicializar INMEDIATAMENTE cuando esté disponible
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.userMenuLoader = new UserMenuLoader();
    }, { passive: true });
} else {
    window.userMenuLoader = new UserMenuLoader();
}
