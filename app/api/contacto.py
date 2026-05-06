from flask import Blueprint, request, jsonify, current_app
from app import db
from app.models.contacto import ContactMessage
import re
import threading
import time
import smtplib
import ssl
from app.utils.datetime_utils import utc_now_naive, format_datetime_mx

bp = Blueprint('contacto', __name__, url_prefix='/api')

def is_valid_email(email):
    """Valida si el email tiene un formato correcto"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def _open_smtp_connection():
    server = current_app.config.get('MAIL_SERVER')
    port = int(current_app.config.get('MAIL_PORT') or 0)
    use_tls = bool(current_app.config.get('MAIL_USE_TLS'))
    use_ssl = bool(current_app.config.get('MAIL_USE_SSL', False))
    timeout = float(current_app.config.get('MAIL_TIMEOUT', 10))

    if not server or not port:
        raise RuntimeError('Configuración MAIL_SERVER/MAIL_PORT incompleta')

    context = ssl.create_default_context()
    if use_ssl:
        smtp = smtplib.SMTP_SSL(server, port, timeout=timeout, context=context)
    else:
        smtp = smtplib.SMTP(server, port, timeout=timeout)

    smtp.ehlo()
    if use_tls and not use_ssl:
        smtp.starttls(context=context)
        smtp.ehlo()

    username = current_app.config.get('MAIL_USERNAME')
    password = current_app.config.get('MAIL_PASSWORD')
    if username and password:
        smtp.login(username, password)
    return smtp

def send_email(subject, recipients, html_body, text_body=None, connection=None):
    """Envía un email vía SMTP con timeout explícito.

    Nota: Flask-Mail 0.9.1 no soporta MAIL_TIMEOUT; por eso usamos smtplib directamente.
    """

    try:
        from flask_mail import Message
        sender = current_app.config.get('MAIL_DEFAULT_SENDER')
        msg = Message(subject=subject, recipients=recipients, html=html_body, sender=sender)
        if text_body:
            msg.body = text_body

        start = time.perf_counter()
        smtp = connection
        close_smtp = False
        if smtp is None:
            smtp = _open_smtp_connection()
            close_smtp = True

        from_addr = str(msg.sender)
        to_addrs = [str(r) for r in msg.recipients]
        smtp.sendmail(from_addr, to_addrs, msg.as_bytes())

        if close_smtp:
            try:
                smtp.quit()
            except Exception:
                try:
                    smtp.close()
                except Exception:
                    pass

        elapsed = time.perf_counter() - start
        print(f"[MAIL] Enviado a {recipients} en {elapsed:.2f}s", flush=True)
        return True
    except Exception as e:
        print(f"Error enviando email: {e}", flush=True)
        return False

def send_emails_async(app, admin_email_data, user_email_data, contact_id):
    """Envía emails en segundo plano usando threading"""
    with app.app_context():
        try:
            # Reusar una única conexión SMTP para ambos envíos (reduce handshake/latencia)
            smtp = _open_smtp_connection()
            try:
                # Email al administrador
                send_email(
                    subject=admin_email_data['subject'],
                    recipients=admin_email_data['recipients'],
                    html_body=admin_email_data['html_body'],
                    connection=smtp,
                )
                # Email al usuario
                send_email(
                    subject=user_email_data['subject'],
                    recipients=user_email_data['recipients'],
                    html_body=user_email_data['html_body'],
                    connection=smtp,
                )
            finally:
                try:
                    smtp.quit()
                except Exception:
                    try:
                        smtp.close()
                    except Exception:
                        pass
            print(f"✅ Emails enviados para el mensaje de contacto ID {contact_id}")
        except Exception as e:
            print(f"⚠️ Error enviando emails en background: {e}")

@bp.route('/contacto', methods=['POST'])
def submit_contact():
    """
    Recibe el formulario de contacto y:
    1. Guarda el mensaje en la base de datos
    2. Envía un email de notificación (si Flask-Mail está disponible)
    """
    try:
        data = request.get_json()

        # Validar que no falten campos
        if not data:
            return jsonify({'error': 'No se recibieron datos'}), 400

        nombre = data.get('nombre', '').strip()
        email = data.get('email', '').strip()
        asunto = data.get('asunto', '').strip()
        mensaje = data.get('mensaje', '').strip()

        # Validaciones
        if not nombre or len(nombre) < 2:
            return jsonify({'error': 'El nombre debe tener al menos 2 caracteres'}), 400

        if not email or not is_valid_email(email):
            return jsonify({'error': 'El email no es válido'}), 400

        if not asunto or len(asunto) < 3:
            return jsonify({'error': 'El asunto debe tener al menos 3 caracteres'}), 400

        if not mensaje or len(mensaje) < 10:
            return jsonify({'error': 'El mensaje debe tener al menos 10 caracteres'}), 400

        # Crear registro en base de datos
        contact_message = ContactMessage(
            nombre=nombre,
            email=email,
            asunto=asunto,
            mensaje=mensaje,
            fecha_creacion=utc_now_naive()
        )

        db.session.add(contact_message)
        db.session.commit()

        # Email del administrador
        admin_email = 'info@gamestore.com'

        # Email para el administrador
        email_admin_html = f"""
        <h2>Nuevo Mensaje de Contacto</h2>
        <p><strong>De:</strong> {nombre}</p>
        <p><strong>Email de contacto:</strong> <a href="mailto:{email}">{email}</a></p>
        <p><strong>Asunto:</strong> {asunto}</p>
        <p><strong>Fecha:</strong> {format_datetime_mx(contact_message.fecha_creacion, '%d/%m/%Y %H:%M:%S', 'No disponible')}</p>
        <hr>
        <p><strong>Mensaje:</strong></p>
        <p>{mensaje.replace(chr(10), '<br>')}</p>
        <hr>
        """

        # Email de confirmación para el usuario
        email_user_html = f"""
        <h2>¡Gracias por tu mensaje!</h2>
        <p>Hola {nombre},</p>
        <p>Hemos recibido tu mensaje y nos pondremos en contacto contigo pronto.</p>
        <p><strong>Asunto:</strong> {asunto}</p>
        <p><strong>Fecha:</strong> {format_datetime_mx(contact_message.fecha_creacion, '%d/%m/%Y %H:%M:%S', 'No disponible')}</p>
        <hr>
        <p>Equipo Game Store</p>
        """

        # Enviar emails en segundo plano (no bloquear la respuesta)
        admin_email_data = {
            'subject': f'Nuevo mensaje de contacto: {asunto}',
            'recipients': [admin_email],
            'html_body': email_admin_html
        }
        user_email_data = {
            'subject': 'Hemos recibido tu mensaje - Game Store',
            'recipients': [email],
            'html_body': email_user_html
        }

        # Iniciar hilo para enviar emails en segundo plano
        thread = threading.Thread(
            target=send_emails_async,
            args=(current_app._get_current_object(), admin_email_data, user_email_data, contact_message.id)
        )
        thread.daemon = True
        thread.start()

        # Responder inmediatamente (los emails se envían en segundo plano)
        return jsonify({
            'success': True,
            'message': '¡Gracias por tu mensaje! Te hemos enviado una confirmación a tu email.',
            'contact_id': contact_message.id
        }), 200

    except Exception as e:
        print(f"Error en submit_contact: {e}")
        return jsonify({'error': f'Error al procesar el mensaje: {str(e)}'}), 500
