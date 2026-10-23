from pydantic import BaseModel, ConfigDict, Field


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
