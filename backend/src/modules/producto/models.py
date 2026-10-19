from typing import TYPE_CHECKING, Optional
from .links import ProductoCategoria
from sqlmodel import SQLModel, Field, Relationship, Column, ARRAY, String

if TYPE_CHECKING:
    from categoria.models import Categoria

class Producto(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str
    descripcion: str
    precio_base: float
    imagen_urls: list[str] = Field(default_factory=list, sa_column=Column(ARRAY(String)))
    disponible: bool = True

    categorias: list["Categoria"] = Relationship(
        back_populates="productos", link_model=ProductoCategoria
    )