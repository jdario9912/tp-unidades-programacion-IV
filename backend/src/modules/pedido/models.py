from datetime import datetime
from decimal import Decimal
from typing import Any, Optional

from sqlalchemy import BigInteger, CheckConstraint, SmallInteger, Text, DateTime, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import SQLModel, Field, Relationship

from src.core.models import TimestampMixin, utc_now


class EstadoPedido(SQLModel, table=True):
    """Catálogo de estados (PENDIENTE, CONFIRMADO, EN_PREP, EN_CAMINO, ENTREGADO, CANCELADO)."""

    codigo: str = Field(primary_key=True, max_length=20)
    descripcion: str = Field(max_length=80)
    orden: int
    es_terminal: bool


class FormaPago(SQLModel, table=True):
    """Catálogo de formas de pago."""

    codigo: str = Field(primary_key=True, max_length=30)
    descripcion: str = Field(max_length=80)
    activo: bool = Field(default=True, sa_column_kwargs={"server_default": "true"})


class Pedido(TimestampMixin, table=True):
    id: Optional[int] = Field(default=None, primary_key=True, sa_type=BigInteger)
    estado_codigo: str = Field(foreign_key="estadopedido.codigo", max_length=20)
    forma_pago_codigo: str = Field(foreign_key="formapago.codigo", max_length=30)
    # subtotal y total no se guardan: se calculan a partir de los detalles (ver PedidoRead).
    descuento: Decimal = Field(
        default=Decimal("0"), max_digits=10, decimal_places=2, sa_column_kwargs={"server_default": "0"}
    )
    costo_envio: Decimal = Field(
        default=Decimal("0"), max_digits=10, decimal_places=2, sa_column_kwargs={"server_default": "0"}
    )
    notas: Optional[str] = Field(default=None, sa_type=Text)

    detalles: list["DetallePedido"] = Relationship(back_populates="pedido")


class DetallePedido(SQLModel, table=True):
    """Ítem del pedido. Fila inmutable: sin updated_at ni deleted_at."""

    __table_args__ = (
        CheckConstraint("cantidad >= 1", name="ck_detalle_cantidad_minima"),
        CheckConstraint("precio_unitario_snap >= 0", name="ck_detalle_precio_no_negativo"),
    )

    pedido_id: Optional[int] = Field(
        default=None, foreign_key="pedido.id", primary_key=True, ondelete="CASCADE", sa_type=BigInteger
    )
    producto_id: int = Field(foreign_key="producto.id", primary_key=True, ondelete="RESTRICT")
    cantidad: int = Field(sa_type=SmallInteger)

    nombre_producto_snap: str = Field(max_length=150)
    precio_unitario_snap: Decimal = Field(max_digits=10, decimal_places=2)
    subtotal_snap: Decimal = Field(max_digits=10, decimal_places=2)

    personalizacion: Optional[dict[str, Any]] = Field(default=None, sa_type=JSONB)

    created_at: datetime = Field(
        default_factory=utc_now,
        sa_type=DateTime(timezone=True),
        nullable=False,
        sa_column_kwargs={"server_default": func.now()},
    )

    pedido: Optional[Pedido] = Relationship(back_populates="detalles")
