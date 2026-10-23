from sqlmodel import SQLModel, Field


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
