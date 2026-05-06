// Modelo de Usuario para Backbone
// Notificación global tipo "toast" (si no existe en la página)
if (typeof window.showNotification !== 'function') {
    window.showNotification = function(message, type = 'success') {
        try {
            var existingNotification = document.querySelector('.notification');
            if (existingNotification) {
                existingNotification.remove();
            }

            var notification = document.createElement('div');
            notification.className = 'notification notification-' + type;
            notification.textContent = message;

            document.body.appendChild(notification);

            setTimeout(function() {
                notification.classList.add('show');
            }, 10);

            setTimeout(function() {
                notification.classList.remove('show');
                setTimeout(function() {
                    notification.remove();
                }, 300);
            }, 3000);
        } catch (err) {
            // fallback silencioso
        }
    };
}

var Usuario = Backbone.Model.extend({
    defaults: {
        username: '',
        email: '',
        recaptcha_token: '',
        password: '',
        confirm_password: ''
    },

    url: '/api/registro',

    validate: function(attrs) {
        var errors = [];

        if (!attrs.username) {
            errors.push({ field: 'username', message: 'Ingresa un nombre de usuario.' });
        } else if (attrs.username.length < 6) {
            errors.push({ field: 'username', message: 'El nombre de usuario debe tener al menos 6 caracteres.' });
        }

        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!attrs.email) {
            errors.push({ field: 'email', message: 'Ingresa tu email.' });
        } else if (!emailRegex.test(attrs.email)) {
            errors.push({ field: 'email', message: 'Ingresa un email válido.' });
        }

        if (!attrs.password) {
            errors.push({ field: 'password', message: 'Ingresa una contraseña.' });
        } else if (attrs.password.length < 8) {
            errors.push({ field: 'password', message: 'La contraseña debe tener al menos 8 caracteres.' });
        }

        if (!attrs.confirm_password) {
            errors.push({ field: 'confirm_password', message: 'Confirma tu contraseña.' });
        } else if (attrs.password && attrs.password !== attrs.confirm_password) {
            errors.push({ field: 'confirm_password', message: 'Las contraseñas no coinciden.' });
        }

        if (!attrs.recaptcha_token) {
            errors.push({ field: 'recaptcha', message: 'Completa la verificación reCAPTCHA.' });
        }

        return errors.length > 0 ? errors : undefined;
    }
});

// Vista del Formulario de Registro
var RegistroView = Backbone.View.extend({
    el: '#registro-form',

    events: {
        'submit': 'registrarUsuario',
        'input #username': 'limpiarError',
        'input #email': 'limpiarError',
        'input #password': 'limpiarError',
        'input #confirm-password': 'limpiarError',
        'click #toggle-registro-password-btn': 'togglePasswordPrincipal',
        'click #toggle-confirm-password-btn': 'togglePasswordConfirmacion'
    },

    initialize: function() {
        this.usuario = new Usuario();
        this.alertTimeout = null;
        this.listenTo(this.usuario, 'invalid', this.mostrarErrores);
        this.listenTo(this.usuario, 'sync', this.registroExitoso);
        this.listenTo(this.usuario, 'error', this.registroFallido);
    },

    notificar: function(message, type) {
        // En REGISTRO, mostrar el mensaje dentro del formulario (encima del botón)
        // para evitar toasts flotantes que se ven distintos entre entornos.
        var normalizedType = (type || 'info');
        if (normalizedType === 'success') {
            this.mostrarExito(message);
        } else if (normalizedType === 'info') {
            this.mostrarInfo(message);
        } else {
            this.mostrarErrorGeneral(message);
        }
    },

    registrarUsuario: function(e) {
        e.preventDefault();

        var recaptchaToken = '';
        try {
            if (window.grecaptcha && typeof window.grecaptcha.getResponse === 'function') {
                recaptchaToken = (window.grecaptcha.getResponse() || '').trim();
            } else {
                var textarea = document.querySelector('textarea[name="g-recaptcha-response"]');
                recaptchaToken = textarea ? (textarea.value || '').trim() : '';
            }
        } catch (err) {
            recaptchaToken = '';
        }

        var datos = {
            username: this.$('#username').val().trim(),
            email: this.$('#email').val().trim(),
            recaptcha_token: recaptchaToken,
            password: this.$('#password').val(),
            confirm_password: this.$('#confirm-password').val()
        };

        this.limpiarTodosErrores();
        this.usuario.set(datos);

        if (this.usuario.isValid()) {
            this.mostrarCargando(true);
            this.usuario.save();
        }
    },

    mostrarAlertaCamposRequeridos: function() {
        this.mostrarErrorGeneral('Por favor completa los campos solicitados antes de crear la cuenta.');
    },

    mostrarErrores: function(model, errors) {
        this.mostrarCargando(false);

        // Marcar campos con error, pero SIN escribir mensajes dentro del formulario.
        // Los mensajes se muestran como notificación global.
        var errorList = Array.isArray(errors) ? errors.filter(Boolean) : [];
        errorList.forEach((err) => {
            if (!err || !err.field) {
                return;
            }

            if (err.field === 'username') {
                this.marcarCampoError('#username');
            } else if (err.field === 'email') {
                this.marcarCampoError('#email');
            } else if (err.field === 'password') {
                this.marcarCampoError('#password');
            } else if (err.field === 'confirm_password') {
                this.marcarCampoError('#confirm-password');
            } else if (err.field === 'recaptcha') {
                // reCAPTCHA: no hay input para marcar, se notifica global
            }
        });

        // Determinar mensaje preferido
        var preferred = errorList.find((e) => e && e.field !== 'recaptcha') || errorList[0];
        var message = (preferred && preferred.message) ? preferred.message : null;

        // Si el usuario no llenó nada, mantener el mensaje clásico
        var allEmpty = true;
        try {
            var usernameVal = (this.$('#username').val() || '').trim();
            var emailVal = (this.$('#email').val() || '').trim();
            var passVal = (this.$('#password').val() || '').trim();
            var confirmVal = (this.$('#confirm-password').val() || '').trim();
            allEmpty = !usernameVal && !emailVal && !passVal && !confirmVal;
        } catch (err) {
            allEmpty = false;
        }

        if (allEmpty) {
            this.notificar('Por favor completa todos los campos requeridos.', 'error');
            return;
        }

        if (message) {
            this.notificar(message, 'error');
        } else {
            this.notificar('Por favor completa los campos solicitados antes de crear la cuenta.', 'error');
        }
    },

    marcarCampoError: function(inputSelector) {
        var $input = inputSelector ? this.$(inputSelector) : null;
        if ($input && $input.length) {
            $input.addClass('error-input');
        }
    },

    mostrarErrorGeneral: function(mensaje) {
        var $alert = this.$('#registro-alert');
        if (!$alert.length) {
            if (typeof window.showNotification === 'function') {
                window.showNotification(mensaje, 'error');
            }
            return;
        }

        $alert
            .stop(true, true)
            .removeClass('is-success is-info')
            .addClass('is-error')
            .text(mensaje)
            .show();

        if (this.alertTimeout) {
            clearTimeout(this.alertTimeout);
        }
        this.alertTimeout = setTimeout(function() {
            $alert.fadeOut(180);
        }, 3000);
    },

    registroExitoso: function() {
        this.mostrarCargando(false);
        this.mostrarExito('¡Cuenta creada exitosamente! Redirigiendo...');

        try {
            if (window.grecaptcha && typeof window.grecaptcha.reset === 'function') {
                window.grecaptcha.reset();
            }
        } catch (err) {}

        setTimeout(function() {
            window.location.href = '/login';
        }, 2000);
    },

    registroFallido: function(model, response) {
        this.mostrarCargando(false);
        var mensaje = response && response.responseJSON && response.responseJSON.error
            ? response.responseJSON.error
            : 'No se pudo crear la cuenta. Verifica los datos e intenta nuevamente.';
        this.notificar(mensaje, 'error');
    },

    mostrarInfo: function(mensaje) {
        var $alert = this.$('#registro-alert');
        if (!$alert.length) {
            if (typeof window.showNotification === 'function') {
                window.showNotification(mensaje, 'info');
            }
            return;
        }

        $alert
            .stop(true, true)
            .removeClass('is-error is-success')
            .addClass('is-info')
            .text(mensaje)
            .show();

        if (this.alertTimeout) {
            clearTimeout(this.alertTimeout);
        }
        this.alertTimeout = setTimeout(function() {
            $alert.fadeOut(180);
        }, 3000);
    },

    mostrarCargando: function(mostrar) {
        var $btn = this.$('#registro-btn');
        if (mostrar) {
            $btn.html('<i class="fa-solid fa-spinner fa-spin"></i> Creando cuenta...');
            $btn.prop('disabled', true);
        } else {
            $btn.html('<i class="fa-solid fa-user-plus"></i> Crear Cuenta');
            $btn.prop('disabled', false);
        }
    },

    mostrarExito: function(mensaje) {
        var $alert = this.$('#registro-alert');
        $alert
            .stop(true, true)
            .removeClass('is-error is-info')
            .addClass('is-success')
            .text(mensaje)
            .show();

        if (this.alertTimeout) {
            clearTimeout(this.alertTimeout);
        }
        this.alertTimeout = setTimeout(function() {
            $alert.fadeOut(180);
        }, 3000);
    },

    limpiarError: function(e) {
        var $input = $(e.target);
        $input.removeClass('error-input');

        // Los spans de error no siempre son "siblings" (password tiene wrapper)
        var describedBy = ($input.attr('aria-describedby') || '').trim();
        if (describedBy) {
            describedBy.split(/\s+/).forEach(function(id) {
                if (id) {
                    $('#' + id).text('');
                }
            });
        }
    },

    limpiarTodosErrores: function() {
        if (this.alertTimeout) {
            clearTimeout(this.alertTimeout);
            this.alertTimeout = null;
        }
        this.$('#registro-alert').hide().text('').removeClass('is-error is-success is-info');
        this.$('.error-input').removeClass('error-input');
        this.$('.error-message').text('');

        try {
            var existingNotification = document.querySelector('.notification');
            if (existingNotification) {
                existingNotification.remove();
            }
        } catch (err) {}
    },

    togglePasswordPrincipal: function(e) {
        e.preventDefault();
        this.toggleCampoPassword('#password', '#toggle-registro-password-btn');
    },

    togglePasswordConfirmacion: function(e) {
        e.preventDefault();
        this.toggleCampoPassword('#confirm-password', '#toggle-confirm-password-btn');
    },

    toggleCampoPassword: function(selectorInput, selectorBoton) {
        var $input = this.$(selectorInput);
        var $btn = this.$(selectorBoton);
        var visible = $input.attr('type') === 'password';
        $input.attr('type', visible ? 'text' : 'password');

        var $icon = this.$(selectorBoton + ' i');
        $icon.removeClass('fa-eye fa-eye-slash').addClass(visible ? 'fa-eye-slash' : 'fa-eye');

        $btn.toggleClass('password-visible', visible);
        $btn.addClass('icon-animating');
        setTimeout(function() {
            $btn.removeClass('icon-animating');
        }, 240);

        $btn
            .attr('aria-label', visible ? 'Ocultar contraseña' : 'Mostrar contraseña')
            .attr('title', visible ? 'Ocultar contraseña' : 'Mostrar contraseña');
    }
});

// Inicializar cuando el DOM esté listo
$(document).ready(function() {
    new RegistroView();
});

// Callbacks para limpiar/mostrar mensaje de reCAPTCHA
window.onRecaptchaSuccess = function() {
    $('#recaptcha-error').text('');
};

window.onRecaptchaExpired = function() {
    $('#recaptcha-error').text('La verificación expiró. Intenta nuevamente.');
};
