from typing import TYPE_CHECKING, Optional
from src.core.models import TimestampMixin
from .links import ProductoCategoria
from sqlmodel import Field, Relationship, Column, ARRAY, String

if TYPE_CHECKING:
    from src.modules.categoria.models import Categoria

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