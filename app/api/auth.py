from flask import Blueprint, jsonify, session
from app.models.usuario import Usuario

bp = Blueprint('auth', __name__)

@bp.route('/api/usuario/actual', methods=['GET'])
def usuario_actual():
    """
    Endpoint optimizado para obtener datos del usuario actual.
    Primero intenta usar datos de la sesión, luego consulta BD si es necesario.
    """
    try:
        # Si no hay user_id en sesión, usuario no autenticado
        if 'user_id' not in session:
            return jsonify({'error': 'No autenticado'}), 401
        
        # OPTIMIZACIÓN: Usar datos de la sesión que ya están disponibles
        # Esto evita un query a la BD cada vez
        user_id = session.get('user_id')
        username = session.get('username')
        user_role = session.get('user_role')
        
        # Si tenemos al menos username y role en la sesión, devolver eso
        if username and user_role is not None:
            return jsonify({
                'id': user_id,
                'username': username,
                'email': '',  # No necesitamos el email para el menú
                'role': user_role
            }), 200
        
        # Si falta algo en la sesión, consultamos la BD (caso raro)
        usuario = Usuario.query.get(user_id)
        if not usuario:
            # Limpiar sesión si usuario no existe
            session.clear()
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        # Actualizar sesión con datos faltantes
        session['username'] = usuario.nombre_usuario
        session['user_role'] = usuario.rol_id
        
        return jsonify({
            'id': usuario.id_usuario,
            'username': usuario.nombre_usuario,
            'email': usuario.correo,
            'role': usuario.rol_id
        }), 200
        
    except Exception as e:
        print(f"Error en usuario_actual: {e}")
        return jsonify({'error': 'Error interno del servidor'}), 500

@bp.route('/api/logout', methods=['POST'])
def logout():
    try:
        session.clear()
        return jsonify({'success': True}), 200
    except Exception as e:
        print(f"Error en logout: {e}")
        return jsonify({'error': 'Error al cerrar sesión'}), 500
