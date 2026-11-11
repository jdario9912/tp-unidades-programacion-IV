from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING, Optional

from sqlalchemy import DateTime, Enum as SAEnum
from sqlmodel import Field, Relationship, SQLModel

from app.core.fechas import utc_now

if TYPE_CHECKING:
    from app.modules.pedidos.models import Pedido


class Rol(str, Enum):
    ADMIN = "admin"
    USER = "user"


class Usuario(SQLModel, table=True):
    """Baja lógica con disabled: el admin lo desactiva y lo puede volver a activar."""

    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True, max_length=50)
    full_name: str = Field(max_length=100)
    email: str = Field(unique=True, index=True, max_length=254)
    hashed_password: str
    # se guarda el valor ("admin" / "user"), no el nombre del miembro
    role: Rol = Field(
        default=Rol.USER,
        sa_type=SAEnum(Rol, name="rol", values_callable=lambda rol: [r.value for r in rol]),
    )
    disabled: bool = Field(default=False)
    created_at: datetime = Field(default_factory=utc_now, sa_type=DateTime(timezone=True))

    pedidos: list["Pedido"] = Relationship(back_populates="usuario")
