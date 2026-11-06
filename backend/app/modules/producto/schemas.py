from datetime import datetime

from pydantic import BaseModel, Field, ConfigDict
from typing import Optional

from app.core.schemas import TimestampRead
from app.modules.categoria.schemas import CategoriaRead
from app.modules.ingrediente.schemas import IngredienteRead


class ProductoBase(BaseModel):
    nombre: str = Field(
        ..., min_length=1, description="Nombre del producto", examples=["Silla de Oficina"]
    )
    descripcion: str = Field(
        ..., min_length=1, description="Descripción del producto", examples=["Silla ergonómica con soporte lumbar"]
    )
    precio_base: float = Field(..., gt=0, description="Precio base, mayor a 0", examples=[150.50])
    imagenes_url: list[str] = Field(
        default_factory=list,
        description="URLs de las imágenes del producto. Puede estar vacía",
        examples=[["https://example.com/silla.jpg"]],
    )
    disponible: bool = Field(default=True, description="Indica si el producto está a la venta", examples=[True])


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

    id: int = Field(..., description="Identificador del producto", examples=[1])

class ProductoReadConCategorias(ProductoRead):
    categorias: list[CategoriaRead] = Field(default=[], description="Categorías asignadas al producto")
    ingredientes: list[IngredienteRead] = Field(default=[], description="Ingredientes del producto")


class ProductoCategoriaCreate(BaseModel):
    categoria_id: int = Field(..., gt=0, description="Id de la categoría a asociar", examples=[1])
    es_principal: bool = Field(default=False, description="Marca la categoría como principal del producto")


class ProductoCategoriaRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    producto_id: int = Field(..., examples=[1])
    categoria_id: int = Field(..., examples=[1])
    es_principal: bool
    created_at: datetime = Field(..., description="Fecha de la asociación")


class CategoriaAsignadaRead(CategoriaRead):
    es_principal: bool = Field(..., description="Si es la categoría principal del producto")


class ProductoIngredienteCreate(BaseModel):
    ingrediente_id: int = Field(..., gt=0, description="Id del ingrediente a asociar", examples=[1])


class ProductoIngredienteRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    producto_id: int = Field(..., examples=[1])
    ingrediente_id: int = Field(..., examples=[1])
    created_at: datetime = Field(..., description="Fecha de la asociación")
