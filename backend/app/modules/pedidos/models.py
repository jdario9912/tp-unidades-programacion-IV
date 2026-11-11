from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import DateTime
from sqlmodel import Field, Relationship, SQLModel

from app.core.fechas import utc_now

if TYPE_CHECKING:
    from app.modules.productos.models import Producto
    from app.modules.usuarios.models import Usuario

ESTADO_PENDIENTE = "PENDIENTE"
ESTADO_EN_PREPARACION = "EN_PREPARACION"
ESTADO_ENTREGADO = "ENTREGADO"
ESTADO_CANCELADO = "CANCELADO"


class Pedido(SQLModel, table=True):
    """No se borra: se cancela. total es la suma de los subtotales, fijo desde la creación."""

    id: Optional[int] = Field(default=None, primary_key=True)
    # Se toma de la sesión, nunca del cuerpo de la petición.
    usuario_id: int = Field(foreign_key="usuario.id", index=True)
    estado: str = Field(default=ESTADO_PENDIENTE, max_length=20, index=True)
    forma_pago: str = Field(max_length=20)
    direccion_entrega: str = Field(max_length=200)
    notas: Optional[str] = Field(default=None)
    total: float = Field(default=0)
    created_at: datetime = Field(default_factory=utc_now, sa_type=DateTime(timezone=True))
    updated_at: datetime = Field(
        default_factory=utc_now,
        sa_type=DateTime(timezone=True),
        sa_column_kwargs={"onupdate": utc_now},
    )

    usuario: Optional["Usuario"] = Relationship(back_populates="pedidos")
    items: list["DetallePedido"] = Relationship(back_populates="pedido")


class DetallePedido(SQLModel, table=True):
    """Línea inmutable: copia el nombre y el precio del producto al crear el pedido."""

    id: Optional[int] = Field(default=None, primary_key=True)
    pedido_id: int = Field(foreign_key="pedido.id", index=True)
    producto_id: int = Field(foreign_key="producto.id")
    cantidad: int
    nombre_producto: str = Field(max_length=150)
    precio_unitario: float
    subtotal: float

    pedido: Optional[Pedido] = Relationship(back_populates="items")
    producto: Optional["Producto"] = Relationship(back_populates="detalles")
