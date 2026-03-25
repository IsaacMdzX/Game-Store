document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const loginInput = document.getElementById('login-input');
    const passwordInput = document.getElementById('login-password');
    const loginButton = document.getElementById('login-btn');
    const togglePasswordButton = document.getElementById('toggle-login-password-btn');

    if (!form || !loginInput || !passwordInput || !loginButton) return;

    const clearAlerts = () => {
        document.querySelectorAll('.error-alerta, .exito-alerta').forEach((node) => node.remove());
    };

    const showAlert = (message, className) => {
        clearAlerts();
        const alert = document.createElement('div');
        alert.className = className;
        alert.textContent = message;
        loginButton.parentElement?.before(alert);
    };

    const setLoading = (isLoading) => {
        loginButton.disabled = isLoading;
        loginButton.innerHTML = isLoading
            ? '<i class="fa-solid fa-spinner fa-spin"></i> Iniciando sesión...'
            : '<i class="fa-solid fa-right-to-bracket"></i> Iniciar Sesión';
    };

    const clearFieldErrors = () => {
        loginInput.classList.remove('error-input');
        passwordInput.classList.remove('error-input');
        const loginErr = document.getElementById('login-input-error');
        const passErr = document.getElementById('password-error');
        if (loginErr) loginErr.textContent = '';
        if (passErr) passErr.textContent = '';
    };

    const validate = () => {
        clearFieldErrors();
        const loginValue = loginInput.value.trim();
        const passwordValue = passwordInput.value;
        let hasError = false;

        if (!loginValue) {
            hasError = true;
            loginInput.classList.add('error-input');
            const loginErr = document.getElementById('login-input-error');
            if (loginErr) loginErr.textContent = 'Ingresa tu usuario o email';
        }

        if (!passwordValue) {
            hasError = true;
            passwordInput.classList.add('error-input');
            const passErr = document.getElementById('password-error');
            if (passErr) passErr.textContent = 'Ingresa tu contraseña';
        }

        return !hasError;
    };

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (!validate()) return;

        setLoading(true);
        clearAlerts();

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    login_input: loginInput.value.trim(),
                    password: passwordInput.value,
                }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok || !data.success) {
                showAlert(data.error || 'Error al iniciar sesión. Intenta nuevamente.', 'error-alerta');
                return;
            }

            showAlert('¡Sesión iniciada! Redirigiendo...', 'exito-alerta');
            window.setTimeout(() => {
                window.location.href = data.redirect_url || '/';
            }, 900);
        } catch (error) {
            showAlert('Error de conexión. Intenta nuevamente.', 'error-alerta');
        } finally {
            setLoading(false);
        }
    });

    [loginInput, passwordInput].forEach((input) => {
        input.addEventListener('input', () => {
            clearFieldErrors();
            clearAlerts();
        });
    });

    if (togglePasswordButton) {
        togglePasswordButton.addEventListener('click', (event) => {
            event.preventDefault();
            const visible = passwordInput.type === 'password';
            passwordInput.type = visible ? 'text' : 'password';

            const icon = togglePasswordButton.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-eye', 'fa-eye-slash');
                icon.classList.add(visible ? 'fa-eye-slash' : 'fa-eye');
            }

            togglePasswordButton.setAttribute('aria-label', visible ? 'Ocultar contraseña' : 'Mostrar contraseña');
            togglePasswordButton.setAttribute('title', visible ? 'Ocultar contraseña' : 'Mostrar contraseña');
        });
    }
});
