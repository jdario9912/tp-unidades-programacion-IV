from typing import TYPE_CHECKING, Optional
from app.core.models import TimestampMixin
from .links import ProductoCategoria, ProductoIngrediente
from sqlmodel import Field, Relationship, Column, ARRAY, String

if TYPE_CHECKING:
    from app.modules.categoria.models import Categoria
    from app.modules.ingrediente.models import Ingrediente

class Producto(TimestampMixin, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str
    descripcion: str
    precio_base: float
    imagenes_url: list[str] = Field(
        default_factory=list, sa_column=Column(ARRAY(String), nullable=False)
    )
    disponible: bool = True

    categorias: list["Categoria"] = Relationship(
        back_populates="productos", link_model=ProductoCategoria
    )
    ingredientes: list["Ingrediente"] = Relationship(
        back_populates="productos", link_model=ProductoIngrediente
    )