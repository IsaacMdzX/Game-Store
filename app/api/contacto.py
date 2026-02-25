from flask import Blueprint, request, jsonify, current_app
from app import db, mail
from app.models.contacto import ContactMessage
from datetime import datetime
import re
import threading

bp = Blueprint('contacto', __name__, url_prefix='/api')

def is_valid_email(email):
    """Valida si el email tiene un formato correcto"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def send_email(subject, recipients, html_body):
    """Helper function para enviar emails si Flask-Mail está disponible"""
    if mail is None:
        print(f"⚠️ Flask-Mail no está disponible. No se puede enviar email a {recipients}")
        return False
    
    try:
        from flask_mail import Message
        msg = Message(subject=subject, recipients=recipients, html=html_body)
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Error enviando email: {e}")
        return False

def send_emails_async(app, admin_email_data, user_email_data, contact_id):
    """Envía emails en segundo plano usando threading"""
    with app.app_context():
        try:
            # Email al administrador
            send_email(
                subject=admin_email_data['subject'],
                recipients=admin_email_data['recipients'],
                html_body=admin_email_data['html_body']
            )
            # Email al usuario
            send_email(
                subject=user_email_data['subject'],
                recipients=user_email_data['recipients'],
                html_body=user_email_data['html_body']
            )
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
            fecha_creacion=datetime.utcnow()
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
        <p><strong>Fecha:</strong> {contact_message.fecha_creacion.strftime('%d/%m/%Y %H:%M:%S')}</p>
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
        <p><strong>Fecha:</strong> {contact_message.fecha_creacion.strftime('%d/%m/%Y %H:%M:%S')}</p>
        <hr>
        <p>Equipo Game Store</p>
        """
        
        # Enviar emails en segundo plano (no bloquear la respuesta)
        if mail is not None:
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
