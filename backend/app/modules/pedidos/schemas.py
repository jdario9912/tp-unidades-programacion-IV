from datetime import datetime
from typing import Literal, Optional

from pydantic import field_validator
from sqlmodel import Field, SQLModel

from app.core.fechas import como_utc

EstadoPedido = Literal["PENDIENTE", "EN_PREPARACION", "ENTREGADO", "CANCELADO"]
FormaPago = Literal["EFECTIVO", "TRANSFERENCIA"]


class ItemPedidoCreate(SQLModel):
    producto_id: int = Field(..., gt=0, schema_extra={"examples": [1]})
    cantidad: int = Field(..., ge=1, schema_extra={"examples": [2]})


class PedidoCreate(SQLModel):
    """El usuario sale de la sesión; el estado inicial y el total los define el backend."""

    items: list[ItemPedidoCreate] = Field(..., min_length=1)
    forma_pago: FormaPago = Field(..., schema_extra={"examples": ["EFECTIVO"]})
    direccion_entrega: str = Field(..., min_length=5, max_length=200, schema_extra={"examples": ["Av. San Martín 1234"]})
    notas: Optional[str] = Field(None, max_length=500, schema_extra={"examples": ["Tocar timbre 2B"]})


class DetallePedidoRead(SQLModel):
    producto_id: int
    nombre_producto: str
    precio_unitario: float
    cantidad: int
    subtotal: float


class PedidoRead(SQLModel):
    id: int
    usuario_id: int
    estado: EstadoPedido
    forma_pago: FormaPago
    direccion_entrega: str
    notas: Optional[str] = None
    total: float
    created_at: datetime
    updated_at: datetime
    items: list[DetallePedidoRead]

    _fechas_utc = field_validator("created_at", "updated_at")(como_utc)


class PedidosPaginados(SQLModel):
    total: int
    items: list[PedidoRead]


class CambioEstado(SQLModel):
    estado: EstadoPedido = Field(..., schema_extra={"examples": ["EN_PREPARACION"]})


class ResumenPedidos(SQLModel):
    pendientes: int
    en_preparacion: int
    entregados: int
    cancelados: int
    pedidos_hoy: int
    ingresos_entregados: float
