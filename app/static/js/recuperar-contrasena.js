document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('password-reset-form');
    const emailInput = document.getElementById('reset-email');
    const codeInput = document.getElementById('reset-code');
    const passwordInput = document.getElementById('reset-password');
    const confirmInput = document.getElementById('reset-confirm-password');
    const sendCodeBtn = document.getElementById('send-reset-code-btn');
    const confirmBtn = document.getElementById('confirm-reset-btn');
    const alertBox = document.getElementById('reset-alert');

    if (!form || !emailInput || !codeInput || !passwordInput || !confirmInput || !sendCodeBtn || !confirmBtn || !alertBox) {
        return;
    }

    let alertTimeout = null;

    const showAlert = (message, type = 'error') => {
        alertBox.classList.remove('is-error', 'is-success', 'is-info');
        if (type === 'success') {
            alertBox.classList.add('is-success');
        } else if (type === 'info') {
            alertBox.classList.add('is-info');
        } else {
            alertBox.classList.add('is-error');
        }

        alertBox.textContent = message;
        alertBox.style.display = 'block';

        if (alertTimeout) {
            clearTimeout(alertTimeout);
        }
        alertTimeout = setTimeout(() => {
            alertBox.style.display = 'none';
        }, 3000);
    };

    const setLoading = (button, loadingText, isLoading) => {
        button.disabled = isLoading;
        if (isLoading) {
            button.dataset.originalText = button.innerHTML;
            button.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${loadingText}`;
        } else if (button.dataset.originalText) {
            button.innerHTML = button.dataset.originalText;
        }
    };

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    sendCodeBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = emailInput.value.trim().toLowerCase();
        if (!validateEmail(email)) {
            showAlert('Ingresa un email válido.');
            return;
        }

        setLoading(sendCodeBtn, 'Enviando código...', true);
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 12000);
            const res = await fetch('/api/password-reset/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                showAlert(data.error || 'No se pudo enviar el código.');
                return;
            }
            showAlert(data.message || 'Si el correo existe, enviamos un código.', 'info');
        } catch (err) {
            if (err && err.name === 'AbortError') {
                showAlert('La solicitud tardó demasiado. Intenta nuevamente.');
            } else {
                showAlert('Error de conexión. Intenta nuevamente.');
            }
        } finally {
            setLoading(sendCodeBtn, 'Enviando código...', false);
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim().toLowerCase();
        const code = codeInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmInput.value;

        if (!validateEmail(email) || !code || !password || !confirmPassword) {
            showAlert('Completa todos los campos requeridos.');
            return;
        }

        if (password.length < 8) {
            showAlert('La contraseña debe tener al menos 8 caracteres.');
            return;
        }

        if (password !== confirmPassword) {
            showAlert('Las contraseñas no coinciden.');
            return;
        }

        setLoading(confirmBtn, 'Cambiando contraseña...', true);
        try {
            const res = await fetch('/api/password-reset/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    code,
                    password,
                    confirm_password: confirmPassword
                })
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                showAlert(data.error || 'No se pudo cambiar la contraseña.');
                return;
            }

            showAlert('Contraseña actualizada. Redirigiendo al login...', 'success');
            setTimeout(() => {
                window.location.href = '/login';
            }, 1200);
        } catch (err) {
            showAlert('Error de conexión. Intenta nuevamente.');
        } finally {
            setLoading(confirmBtn, 'Cambiando contraseña...', false);
        }
    });

    const togglePassword = (input, button) => {
        const visible = input.type === 'password';
        input.type = visible ? 'text' : 'password';
        const icon = button.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-eye', 'fa-eye-slash');
            icon.classList.add(visible ? 'fa-eye-slash' : 'fa-eye');
        }
        button.setAttribute('aria-label', visible ? 'Ocultar contraseña' : 'Mostrar contraseña');
        button.setAttribute('title', visible ? 'Ocultar contraseña' : 'Mostrar contraseña');
    };

    const toggleMain = document.getElementById('toggle-reset-password-btn');
    const toggleConfirm = document.getElementById('toggle-reset-confirm-password-btn');

    if (toggleMain) {
        toggleMain.addEventListener('click', (e) => {
            e.preventDefault();
            togglePassword(passwordInput, toggleMain);
        });
    }

    if (toggleConfirm) {
        toggleConfirm.addEventListener('click', (e) => {
            e.preventDefault();
            togglePassword(confirmInput, toggleConfirm);
        });
    }
});
