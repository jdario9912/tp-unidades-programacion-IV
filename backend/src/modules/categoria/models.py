from typing import TYPE_CHECKING, Optional
from src.modules.producto.links import ProductoCategoria
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from src.modules.producto.models import Producto

class Categoria(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(unique=True, index=True)
    descripcion: str = Field(default="")

    productos: list["Producto"] = Relationship(
        back_populates="categorias", link_model=ProductoCategoria
    )