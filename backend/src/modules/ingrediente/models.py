from typing import TYPE_CHECKING, Optional
from src.core.models import TimestampMixin
from src.modules.producto.links import ProductoIngrediente
from sqlmodel import Field, Relationship

if TYPE_CHECKING:
    from src.modules.producto.models import Producto

class Ingrediente(TimestampMixin, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    # Sin unique a nivel DB: un ingrediente eliminado (soft delete) no debe
    # impedir crear otro con el mismo nombre. La unicidad se valida en el servicio.
    nombre: str = Field(index=True)

    productos: list["Producto"] = Relationship(
        back_populates="ingredientes", link_model=ProductoIngrediente
    )
