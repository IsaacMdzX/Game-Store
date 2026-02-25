// ============================================
// MENÚ DE USUARIO - VERSIÓN ULTRA-SIMPLE
// ============================================

(function() {
    'use strict';
    
    function initUserMenu() {
        const userMenuBtn = document.getElementById('userMenuBtn');
        const userDropdown = document.getElementById('userDropdown');
        const dropdownContent = document.querySelector('.dropdown-content');
        
        if (!userMenuBtn || !userDropdown || !dropdownContent) {
            console.warn('[UserMenu] Elementos no encontrados');
            return;
        }
        
        // ===== MOSTRAR MENÚ POR DEFECTO INMEDIATAMENTE =====
        function showDefaultMenu() {
            dropdownContent.innerHTML = `
                <a href="/login" class="dropdown-item"><i class="fa-solid fa-sign-in-alt"></i> Iniciar Sesión</a>
                <a href="/registro" class="dropdown-item"><i class="fa-solid fa-user-plus"></i> Registrarse</a>
            `;
        }
        
        // Mostrar menú por defecto inmediatamente
        showDefaultMenu();
        
        // ===== EVENT LISTENERS =====
        // Toggle dropdown al hacer click en botón
        userMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
        });
        
        // Cerrar dropdown al hacer click fuera
        document.addEventListener('click', (e) => {
            if (userDropdown.classList.contains('show') && 
                !userDropdown.contains(e.target) && 
                !userMenuBtn.contains(e.target)) {
                userDropdown.classList.remove('show');
            }
        });
        
        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && userDropdown.classList.contains('show')) {
                userDropdown.classList.remove('show');
            }
        });
        
        // Cerrar al hacer click en un link
        dropdownContent.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link) {
                setTimeout(() => {
                    userDropdown.classList.remove('show');
                }, 100);
            }
        });
        
        // ===== CARGAR DATOS DE USUARIO EN BACKGROUND =====
        async function loadUserData() {
            try {
                const response = await fetch('/api/usuario/actual', {
                    method: 'GET',
                    credentials: 'same-origin'
                });
                
                if (response.ok) {
                    const user = await response.json();
                    
                    // Actualizar menú con datos del usuario
                    if (user && user.username) {
                        dropdownContent.innerHTML = `
                            <div class="user-info">
                                <i class="fa-solid fa-user-circle"></i>
                                <div>
                                    <p class="user-name">${user.username}</p>
                                </div>
                            </div>
                            <hr style="margin: 8px 0; opacity: 0.2;">
                            <a href="/perfil" class="dropdown-item"><i class="fa-solid fa-user"></i> Mi Perfil</a>
                            <a href="#" id="logoutBtn" class="dropdown-item"><i class="fa-solid fa-sign-out-alt"></i> Cerrar Sesión</a>
                        `;
                        
                        // Agregar listener al botón logout
                        const logoutBtn = dropdownContent.querySelector('#logoutBtn');
                        if (logoutBtn) {
                            logoutBtn.addEventListener('click', (e) => {
                                e.preventDefault();
                                logout();
                            });
                        }
                    }
                }
            } catch (error) {
                console.log('[UserMenu] Error cargando usuario:', error);
                // Si hay error, el menú por defecto ya está mostrado
            }
        }
        
        // Cargar datos asincronamente
        setTimeout(loadUserData, 100);
        
        // ===== LOGOUT =====
        async function logout() {
            try {
                await fetch('/api/logout', {
                    method: 'POST',
                    credentials: 'same-origin'
                });
                window.location.href = '/';
            } catch (error) {
                console.log('[UserMenu] Error en logout:', error);
                window.location.href = '/';
            }
        }
    }
    
    // Inicializar cuando DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUserMenu);
    } else {
        initUserMenu();
    }
})();
