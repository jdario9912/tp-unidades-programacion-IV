from typing import TYPE_CHECKING, Optional
from src.modules.producto.links import ProductoCategoria
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from producto.models import Producto

class Categoria(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(unique=True, index=True)
    descripcion: str

    productos: list["Producto"] = Relationship(
        back_populates="categorias", link_model=ProductoCategoria
    )