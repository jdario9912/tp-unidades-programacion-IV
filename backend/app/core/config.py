from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    Configuración cargada desde variables de entorno o archivo .env.

    Orden de prioridad (pydantic-settings):
      1. Variables de entorno del sistema
      2. Archivo .env
      3. Defaults declarados en la clase
    """

    # Para desarrollo local se acepta SQLite: sqlite:///./foodstore.db
    DATABASE_URL: str
    # Obligatoria: se lee del .env.
    SECRET_KEY: str = Field(min_length=32)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    # Con cookies no se puede usar "*": el navegador exige el origen exacto.
    FRONTEND_ORIGIN: str = "http://localhost:5173"
    # En True solo con HTTPS: el navegador no manda cookies Secure por HTTP.
    COOKIE_SECURE: bool = False

    ADMIN_USER: str = "admin"
    ADMIN_EMAIL: str = "admin@foodstore.com"
    ADMIN_PASSWORD: str = "Admin1234!"

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        # Ignorar variables extra del .env que no sean campos declarados
        "extra": "ignore",
    }


settings = Settings()
