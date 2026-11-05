from typing import Optional

from sqlalchemy import BigInteger, Index, Text, text
from sqlmodel import SQLModel, Field

from src.core.models import TimestampMixin
from .links import UsuarioRol  # noqa: F401


class Usuario(TimestampMixin, table=True):
    # El email es único solo entre usuarios activos: un usuario eliminado
    # (soft delete) no debe impedir registrar otro con el mismo email.
    __table_args__ = (
        Index(
            "uq_usuario_email_activo",
            "email",
            unique=True,
            postgresql_where=text("deleted_at IS NULL"),
        ),
    )

    id: Optional[int] = Field(default=None, primary_key=True, sa_type=BigInteger)
    nombre: str = Field(max_length=80)
    apellido: str = Field(max_length=80)
    email: str = Field(max_length=254)
    celular: Optional[str] = Field(default=None, max_length=20)
    password_hash: str = Field(max_length=60)


class Rol(SQLModel, table=True):
    """Catálogo de roles. Sin auditoría ni soft delete, igual que EstadoPedido y FormaPago."""

    id: Optional[int] = Field(default=None, primary_key=True, sa_type=BigInteger)
    nombre: str = Field(unique=True, max_length=50)
    descripcion: Optional[str] = Field(default=None, sa_type=Text)
