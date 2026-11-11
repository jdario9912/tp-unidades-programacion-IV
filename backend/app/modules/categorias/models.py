from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.modules.productos.models import Producto


class Categoria(SQLModel, table=True):
    """
    Baja lógica con activo = false. No libera el nombre único ni oculta sus
    productos: para retirarla del catálogo se dan de baja también sus productos.
    """

    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(unique=True, index=True, max_length=100)
    descripcion: Optional[str] = Field(default=None)
    activo: bool = Field(default=True)

    productos: list["Producto"] = Relationship(back_populates="categoria")
