from typing import TYPE_CHECKING, Optional
from src.core.models import TimestampMixin
from src.modules.producto.links import ProductoCategoria
from sqlmodel import Field, Relationship

if TYPE_CHECKING:
    from src.modules.producto.models import Producto

class Categoria(TimestampMixin, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    # Sin unique a nivel DB: una categoría eliminada (soft delete) no debe
    # impedir crear otra con el mismo nombre. La unicidad se valida en el servicio.
    nombre: str = Field(index=True)
    descripcion: str = Field(default="")

    productos: list["Producto"] = Relationship(
        back_populates="categorias", link_model=ProductoCategoria
    )