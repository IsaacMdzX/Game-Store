from app import db
import datetime


class MagicLinkToken(db.Model):
    __tablename__ = 'magic_link_tokens'

    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(128), unique=True, nullable=False)
    email = db.Column(db.String(200), nullable=False)
    user_id = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.TIMESTAMP, default=db.func.current_timestamp())
    expires_at = db.Column(db.TIMESTAMP, nullable=False)
    used = db.Column(db.Boolean, default=False)

    def is_expired(self):
        try:
            return datetime.datetime.utcnow() > self.expires_at
        except Exception:
            return False

    def mark_used(self):
        self.used = True
        db.session.add(self)
        db.session.commit()
