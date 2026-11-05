from datetime import datetime
from typing import Optional

from sqlalchemy import BigInteger, DateTime, func
from sqlmodel import SQLModel, Field

from src.core.models import utc_now


class UsuarioRol(SQLModel, table=True):
    usuario_id: int | None = Field(
        default=None, foreign_key="usuario.id", primary_key=True, ondelete="CASCADE", sa_type=BigInteger
    )
    rol_id: int | None = Field(
        default=None, foreign_key="rol.id", primary_key=True, ondelete="CASCADE", sa_type=BigInteger
    )
    # Nulo cuando el rol lo asigna el registro.
    asignado_por_id: Optional[int] = Field(
        default=None, foreign_key="usuario.id", nullable=True, ondelete="SET NULL", sa_type=BigInteger
    )
    # Nulo significa sin vencimiento.
    expires_at: Optional[datetime] = Field(
        default=None, sa_type=DateTime(timezone=True), nullable=True
    )
    # Igual que ProductoIngrediente: solo created_at y borrado físico.
    created_at: datetime = Field(
        default_factory=utc_now,
        sa_type=DateTime(timezone=True),
        nullable=False,
        sa_column_kwargs={"server_default": func.now()},
    )
