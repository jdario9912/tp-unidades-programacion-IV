from datetime import timedelta
from typing import Optional

from jose import JWTError, jwt
from passlib.context import CryptContext

from .config import settings
from .fechas import utc_now

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """Devuelve el hash bcrypt (60 caracteres) de la contraseña."""
    return pwd_context.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    return pwd_context.verify(password, hashed_password)


def create_access_token(usuario_id: int) -> str:
    """
    JWT con el id del usuario en `sub`. El rol no va en el token:
    se lee de la base en cada request, así un cambio tiene efecto inmediato.
    """
    expira = utc_now() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": str(usuario_id), "exp": expira}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_access_token(token: str) -> Optional[int]:
    """Devuelve el id del usuario, o None si el token es inválido o venció."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return int(payload["sub"])
    except (JWTError, KeyError, ValueError):
        return None
