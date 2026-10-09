from sqlmodel import SQLModel, Field


class ProductoCategoria(SQLModel, table=True):
    producto_id: int | None = Field(
        default=None, foreign_key="producto.id", primary_key=True
    )
    categoria_id: int | None = Field(
        default=None, foreign_key="categoria.id", primary_key=True
    )