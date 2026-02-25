from app import db
from datetime import datetime

class ContactMessage(db.Model):
    __tablename__ = 'mensajes_contacto'
    
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(200), nullable=False)
    asunto = db.Column(db.String(300), nullable=False)
    mensaje = db.Column(db.Text, nullable=False)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)
    leido = db.Column(db.Boolean, default=False)
    respondido = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f'<ContactMessage {self.id} - {self.asunto}>'
