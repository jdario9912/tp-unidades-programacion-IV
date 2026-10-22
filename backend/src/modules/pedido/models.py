from decimal import Decimal
from typing import Optional

from sqlalchemy import CheckConstraint, Text
from sqlmodel import SQLModel, Field

from src.core.models import TimestampMixin


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
    __table_args__ = (
        CheckConstraint("total >= 0", name="ck_pedido_total_no_negativo"),
    )

    id: Optional[int] = Field(default=None, primary_key=True)
    estado_codigo: str = Field(foreign_key="estadopedido.codigo", max_length=20)
    forma_pago_codigo: str = Field(foreign_key="formapago.codigo", max_length=30)

    # Snapshot monetario: lo calcula el backend, no lo envía el cliente.
    subtotal: Decimal = Field(max_digits=10, decimal_places=2)
    descuento: Decimal = Field(
        default=Decimal("0"), max_digits=10, decimal_places=2, sa_column_kwargs={"server_default": "0"}
    )
    costo_envio: Decimal = Field(
        default=Decimal("0"), max_digits=10, decimal_places=2, sa_column_kwargs={"server_default": "0"}
    )
    total: Decimal = Field(max_digits=10, decimal_places=2)

    notas: Optional[str] = Field(default=None, sa_type=Text)
