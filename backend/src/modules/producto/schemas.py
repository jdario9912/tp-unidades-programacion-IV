from pydantic import BaseModel, Field
from typing import Optional

from src.modules.categoria.schemas import CategoriaRead


class ProductoBase(BaseModel):
    nombre: str = Field(..., min_length=1, example="Silla de Oficina")
    descripcion: str = Field(..., min_length=1, example="Silla ergonómica con soporte lumbar")
    precio_base: float = Field(gt=0, example=150.50)
    imagen_url: str = Field(..., min_length=1, example="https://example.com/silla.jpg")
    disponible: bool = Field(default=True, example=True)


class ProductoCreate(ProductoBase):
    pass  # Exige todos los campos obligatorios de Base


class ProductoUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    precio_base: Optional[float] = Field(None, gt=0)
    imagen_url: Optional[str] = None
    disponible: Optional[bool] = None


class ProductoRead(ProductoBase):
    id: int

class ProductoReadConCategorias(ProductoRead):
    categorias: list[CategoriaRead] = []
