from datetime import timedelta
from typing import Optional

import bcrypt
import jwt

from .config import settings
from .models import utc_now


def hash_password(password: str) -> str:
    """Devuelve el hash bcrypt (60 caracteres) de la contraseña."""
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))


def crear_access_token(usuario_id: int) -> str:
    """
    JWT con el id del usuario en `sub`. Los roles no van en el token:
    se leen de la base en cada request, así un cambio tiene efecto inmediato.
    """
    expira = utc_now() + timedelta(minutes=settings.access_token_expire_minutes)
    payload = {"sub": str(usuario_id), "exp": expira}
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def decodificar_access_token(token: str) -> Optional[int]:
    """Devuelve el id del usuario, o None si el token es inválido o venció."""
    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        return int(payload["sub"])
    except (jwt.InvalidTokenError, KeyError, ValueError):
        return None
