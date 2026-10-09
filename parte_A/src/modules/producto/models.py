from typing import TYPE_CHECKING, Optional
from links import ProductoCategoria
from sqlmodel import SQLModel, Field

if TYPE_CHECKING:
    from categoria.models import Categoria

class Producto(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str
    descripcion: str
    precio_base: str
    imagen_url: str
    disponible: bool = True

    categorias: list["Categoria"] = Relationship(
        back_populates="productos", link_model=ProductoCategoria
    )