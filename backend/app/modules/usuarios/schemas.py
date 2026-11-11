from datetime import datetime

from pydantic import EmailStr, field_validator
from sqlmodel import Field, SQLModel

from app.core.fechas import como_utc
from .models import Rol


class UserCreate(SQLModel):
    username: str = Field(..., min_length=3, max_length=50, schema_extra={"examples": ["juanperez"]})
    full_name: str = Field(..., min_length=1, max_length=100, schema_extra={"examples": ["Juan Pérez"]})
    email: EmailStr = Field(..., max_length=254, schema_extra={"examples": ["juan@mail.com"]})
    # bcrypt solo usa los primeros 72 bytes de la contraseña.
    password: str = Field(..., min_length=8, max_length=72, schema_extra={"examples": ["secreto123"]})

    @field_validator("username", "email")
    @classmethod
    def en_minusculas(cls, valor: str) -> str:
        return valor.strip().lower()


class UserPublic(SQLModel):
    """Nunca incluye hashed_password."""

    id: int = Field(..., schema_extra={"examples": [1]})
    username: str = Field(..., schema_extra={"examples": ["juanperez"]})
    full_name: str = Field(..., schema_extra={"examples": ["Juan Pérez"]})
    email: str = Field(..., schema_extra={"examples": ["juan@mail.com"]})
    role: Rol = Field(..., schema_extra={"examples": ["user"]})
    disabled: bool = Field(..., schema_extra={"examples": [False]})
    created_at: datetime

    _fecha_utc = field_validator("created_at")(como_utc)
