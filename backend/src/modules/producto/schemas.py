from pydantic import BaseModel, Field, ConfigDict
from typing import Optional

from src.core.schemas import TimestampRead
from src.modules.categoria.schemas import CategoriaRead


class ProductoBase(BaseModel):
    nombre: str = Field(..., min_length=1, example="Silla de Oficina")
    descripcion: str = Field(..., min_length=1, example="Silla ergonómica con soporte lumbar")
    precio_base: float = Field(gt=0, example=150.50)
    imagenes_url: list[str] = Field(default_factory=list, example=["https://example.com/silla.jpg"])
    disponible: bool = Field(default=True, example=True)


class ProductoCreate(ProductoBase):
    pass  # Exige todos los campos obligatorios de Base


class ProductoUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    precio_base: Optional[float] = Field(None, gt=0)
    imagenes_url: Optional[list[str]] = None
    disponible: Optional[bool] = None


class ProductoRead(TimestampRead, ProductoBase):
    model_config = ConfigDict(from_attributes=True)

    id: int

class ProductoReadConCategorias(ProductoRead):
    categorias: list[CategoriaRead] = []
