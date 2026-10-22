from datetime import datetime
from decimal import Decimal
from typing import Any, Optional

from pydantic import BaseModel, Field, ConfigDict, field_validator

from src.core.schemas import TimestampRead


class DetallePedidoCreate(BaseModel):
    producto_id: int = Field(..., gt=0, description="Id del producto", examples=[1])
    cantidad: int = Field(..., ge=1, le=32767, description="Cantidad, mínimo 1", examples=[2])
    personalizacion: Optional[dict[str, Any]] = Field(
        None,
        description="Ingredientes removidos/agregados",
        examples=[{"quitar": ["cebolla"], "agregar": ["queso"]}],
    )


class DetallePedidoRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    producto_id: int = Field(..., examples=[1])
    cantidad: int = Field(..., examples=[2])
    nombre_producto_snap: str = Field(..., description="Nombre del producto al momento de la compra")
    precio_unitario_snap: Decimal = Field(..., description="Precio unitario al momento de la compra", examples=["750.00"])
    subtotal_snap: Decimal = Field(..., description="precio_unitario_snap * cantidad", examples=["1500.00"])
    personalizacion: Optional[dict[str, Any]] = None
    created_at: datetime


class PedidoCreate(BaseModel):
    """
    Datos que envía el cliente. El subtotal, descuento, costo de envío
    y total los calcula el backend.
    """

    estado_codigo: str = Field(
        ..., min_length=1, max_length=20, description="Código del estado (EstadoPedido)", examples=["PENDIENTE", "CONFIRMADO", "EN_PREP", "EN_CAMINO", "ENTREGADO", "CANCELADO"]
    )
    forma_pago_codigo: str = Field(
        ..., min_length=1, max_length=30, description="Código de la forma de pago", examples=["EFECTIVO"]
    )
    notas: Optional[str] = Field(None, description="Notas del pedido", examples=["Sin cebolla, por favor"])
    detalles: list[DetallePedidoCreate] = Field(..., min_length=1, description="Ítems del pedido (al menos uno)")

    @field_validator("detalles")
    @classmethod
    def productos_sin_repetir(cls, detalles: list[DetallePedidoCreate]) -> list[DetallePedidoCreate]:
        ids = [d.producto_id for d in detalles]
        if len(ids) != len(set(ids)):
            raise ValueError("Un producto no puede repetirse en el pedido; usá la cantidad")
        return detalles


class PedidoUpdate(BaseModel):
    estado_codigo: Optional[str] = Field(None, min_length=1, max_length=20, examples=["CONFIRMADO"])
    forma_pago_codigo: Optional[str] = Field(None, min_length=1, max_length=30, examples=["TARJETA"])
    notas: Optional[str] = None


class PedidoRead(TimestampRead):
    model_config = ConfigDict(from_attributes=True)

    id: int = Field(..., description="Identificador del pedido", examples=[1])
    estado_codigo: str = Field(..., description="Código del estado actual", examples=["PENDIENTE"])
    forma_pago_codigo: str = Field(..., description="Código de la forma de pago", examples=["EFECTIVO"])
    subtotal: Decimal = Field(..., description="Suma de los ítems, calculada por el backend", examples=["1500.00"])
    descuento: Decimal = Field(..., description="Descuento aplicado", examples=["0.00"])
    costo_envio: Decimal = Field(..., description="Costo de envío", examples=["300.00"])
    total: Decimal = Field(..., ge=0, description="subtotal - descuento + costo_envio", examples=["1800.00"])
    notas: Optional[str] = Field(None, description="Notas del pedido")
    detalles: list[DetallePedidoRead] = Field(default=[], description="Ítems del pedido")
