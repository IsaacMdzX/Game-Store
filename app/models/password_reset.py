from app import db


class PasswordResetCode(db.Model):
    __tablename__ = 'password_reset_codes'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('usuarios.id_usuario'), nullable=False)
    email = db.Column(db.String(200), nullable=False, index=True)
    code = db.Column(db.String(10), nullable=False)
    created_at = db.Column(db.TIMESTAMP, default=db.func.current_timestamp())
    expires_at = db.Column(db.TIMESTAMP, nullable=False)
    used = db.Column(db.Boolean, default=False)
