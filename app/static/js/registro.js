// Modelo de Usuario para Backbone
var Usuario = Backbone.Model.extend({
    defaults: {
        username: '',
        email: '',
        captcha_text: '',
        password: '',
        confirm_password: ''
    },

    url: '/api/registro',

    validate: function(attrs) {
        var errors = [];

        if (!attrs.username || attrs.username.length < 6) {
            errors.push('complete_required');
        }

        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!attrs.email || !emailRegex.test(attrs.email)) {
            errors.push('complete_required');
        }

        if (!attrs.captcha_text || attrs.captcha_text.length < 3) {
            errors.push('complete_required');
        }

        if (!attrs.password || attrs.password.length < 8) {
            errors.push('complete_required');
        }

        if (attrs.password !== attrs.confirm_password) {
            errors.push('complete_required');
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
        'input #captcha-text': 'limpiarError',
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

    registrarUsuario: function(e) {
        e.preventDefault();

        var datos = {
            username: this.$('#username').val().trim(),
            email: this.$('#email').val().trim(),
            captcha_text: this.$('#captcha-text').val().trim(),
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
        this.mostrarAlertaCamposRequeridos();
    },

    mostrarErrorGeneral: function(mensaje) {
        var $alert = this.$('#registro-alert');
        if (!$alert.length) {
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

        setTimeout(function() {
            window.location.href = '/login';
        }, 2000);
    },

    registroFallido: function(model, response) {
        this.mostrarCargando(false);
        var mensaje = response && response.responseJSON && response.responseJSON.error
            ? response.responseJSON.error
            : 'No se pudo crear la cuenta. Verifica los datos e intenta nuevamente.';
        this.mostrarErrorGeneral(mensaje);
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
        $input.siblings('.error-message').text('');
    },

    limpiarTodosErrores: function() {
        if (this.alertTimeout) {
            clearTimeout(this.alertTimeout);
            this.alertTimeout = null;
        }
        this.$('#registro-alert').hide().text('').removeClass('is-error is-success is-info');
        this.$('.error-input').removeClass('error-input');
        this.$('.error-message').text('');
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
