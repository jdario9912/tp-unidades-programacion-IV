from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, Field, ConfigDict

from src.core.schemas import TimestampRead


class PedidoCreate(BaseModel):
    """
    Datos que envía el cliente. El estado inicial, subtotal, descuento,
    costo de envío y total los calcula el backend.
    """

    forma_pago_codigo: str = Field(
        ..., min_length=1, max_length=30, description="Código de la forma de pago", examples=["EFECTIVO"]
    )
    notas: Optional[str] = Field(None, description="Notas del pedido", examples=["Sin cebolla, por favor"])


class PedidoUpdate(BaseModel):
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
