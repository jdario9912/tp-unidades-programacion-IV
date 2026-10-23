from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator


class EstadoPedidoRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    codigo: str = Field(..., examples=["PENDIENTE"])
    descripcion: str = Field(..., examples=["Pendiente"])
    orden: int = Field(..., description="Posición en el flujo del pedido", examples=[1])
    es_terminal: bool = Field(..., description="Si es true, el pedido ya no cambia de estado", examples=[False])


class FormaPagoRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    codigo: str = Field(..., examples=["EFECTIVO"])
    descripcion: str = Field(..., examples=["Efectivo"])
    activo: bool = Field(..., examples=[True])


class FormaPagoCreate(BaseModel):
    codigo: str = Field(
        ...,
        min_length=1,
        max_length=30,
        pattern=r"^[A-Za-z0-9_]+$",
        description="Código único; se guarda en mayúsculas. Solo letras, números y guion bajo",
        examples=["TARJETA_CREDITO"],
    )
    descripcion: str = Field(..., min_length=1, max_length=80, examples=["Tarjeta de crédito"])
    activo: bool = Field(True, description="Si es false no se puede usar en pedidos nuevos", examples=[True])

    @field_validator("codigo")
    @classmethod
    def codigo_en_mayusculas(cls, codigo: str) -> str:
        return codigo.upper()


class FormaPagoUpdate(BaseModel):
    """
    El código es la clave primaria y no se modifica.
    `activo` se cambia con los endpoints de activar/desactivar.
    """

    descripcion: Optional[str] = Field(None, min_length=1, max_length=80, examples=["Tarjeta de crédito"])
