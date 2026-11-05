from typing import Optional

from sqlalchemy import BigInteger, Text
from sqlmodel import SQLModel, Field

from src.core.models import TimestampMixin
from .links import UsuarioRol  # noqa: F401


class Usuario(TimestampMixin, table=True):
    """deleted_at con valor indica un usuario desactivado; se puede volver a activar."""

    id: Optional[int] = Field(default=None, primary_key=True, sa_type=BigInteger)
    nombre: str = Field(max_length=80)
    apellido: str = Field(max_length=80)
    # Único entre todos los usuarios, también los desactivados, porque pueden reactivarse.
    email: str = Field(unique=True, max_length=254)
    celular: Optional[str] = Field(default=None, max_length=20)
    password_hash: str = Field(max_length=60)


class Rol(SQLModel, table=True):
    """Catálogo de roles. Sin auditoría ni soft delete, igual que EstadoPedido y FormaPago."""

    id: Optional[int] = Field(default=None, primary_key=True, sa_type=BigInteger)
    nombre: str = Field(unique=True, max_length=50)
    descripcion: Optional[str] = Field(default=None, sa_type=Text)
