import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))


def _get_database_uri():
    return (
        os.environ.get("DATABASE_URL")
        or os.environ.get("SQLALCHEMY_DATABASE_URI")
        or f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}"
    )


def _get_engine_options(database_uri):
    if database_uri.startswith("postgres") and "localhost" not in database_uri:
        return {"connect_args": {"sslmode": "require"}}
    return {}


class BaseConfig:
    SECRET_KEY = os.environ.get("SECRET_KEY", "fallback-secret-key-for-dev")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MERCADOPAGO_ACCESS_TOKEN = os.environ.get("MERCADOPAGO_ACCESS_TOKEN")
    MERCADOPAGO_PUBLIC_KEY = os.environ.get("MERCADOPAGO_PUBLIC_KEY")
    # reCAPTCHA
    RECAPTCHA_SITE_KEY = os.environ.get("RECAPTCHA_SITE_KEY")
    RECAPTCHA_SECRET_KEY = os.environ.get("RECAPTCHA_SECRET_KEY")

    # Twilio (opcional)
    TWILIO_ACCOUNT_SID = os.environ.get("TWILIO_ACCOUNT_SID")
    TWILIO_AUTH_TOKEN = os.environ.get("TWILIO_AUTH_TOKEN")
    TWILIO_FROM_NUMBER = os.environ.get("TWILIO_FROM_NUMBER")
    # Código de país por defecto para números sin prefijo (ej: '54' para Argentina)
    TWILIO_DEFAULT_COUNTRY_CODE = os.environ.get("TWILIO_DEFAULT_COUNTRY_CODE")

    # Email Configuration
    MAIL_SERVER = os.environ.get("MAIL_SERVER", "smtp.gmail.com")
    MAIL_PORT = int(os.environ.get("MAIL_PORT", 587))
    MAIL_USE_TLS = os.environ.get("MAIL_USE_TLS", True)
    MAIL_USERNAME = os.environ.get("MAIL_USERNAME")
    MAIL_PASSWORD = os.environ.get("MAIL_PASSWORD")
    MAIL_DEFAULT_SENDER = os.environ.get("MAIL_DEFAULT_SENDER", "noreply@gamestore.com")


class DevelopmentConfig(BaseConfig):
    SQLALCHEMY_DATABASE_URI = _get_database_uri()
    SQLALCHEMY_ENGINE_OPTIONS = _get_engine_options(SQLALCHEMY_DATABASE_URI)


class ProductionConfig(BaseConfig):
    SQLALCHEMY_DATABASE_URI = _get_database_uri()
    SQLALCHEMY_ENGINE_OPTIONS = _get_engine_options(SQLALCHEMY_DATABASE_URI)
