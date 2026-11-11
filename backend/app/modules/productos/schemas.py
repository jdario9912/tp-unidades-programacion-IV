from typing import Optional

from sqlmodel import Field, SQLModel

from app.modules.categorias.schemas import CategoriaRead


class ProductoCreate(SQLModel):
    nombre: str = Field(..., min_length=1, max_length=150, schema_extra={"examples": ["Hamburguesa clásica"]})
    descripcion: Optional[str] = Field(None, schema_extra={"examples": ["Carne, queso, lechuga y tomate"]})
    precio_base: float = Field(..., ge=0, schema_extra={"examples": [8500.0]})
    imagen_url: Optional[str] = Field(None, schema_extra={"examples": ["https://example.com/hamburguesa.jpg"]})
    stock: int = Field(0, ge=0, schema_extra={"examples": [20]})
    disponible: bool = Field(True, schema_extra={"examples": [True]})
    categoria_id: int = Field(..., gt=0, schema_extra={"examples": [1]})


class ProductoUpdate(SQLModel):
    """Actualización parcial: solo cambian los campos enviados."""

    nombre: Optional[str] = Field(None, min_length=1, max_length=150)
    descripcion: Optional[str] = None
    precio_base: Optional[float] = Field(None, ge=0)
    imagen_url: Optional[str] = None
    stock: Optional[int] = Field(None, ge=0)
    disponible: Optional[bool] = None
    categoria_id: Optional[int] = Field(None, gt=0)


class ProductoStockUpdate(SQLModel):
    stock: Optional[int] = Field(None, ge=0, schema_extra={"examples": [15]})
    disponible: Optional[bool] = Field(None, schema_extra={"examples": [True]})


class ProductoRead(SQLModel):
    id: int = Field(..., schema_extra={"examples": [1]})
    nombre: str
    descripcion: Optional[str] = None
    precio_base: float
    imagen_url: Optional[str] = None
    stock: int
    disponible: bool
    activo: bool
    categoria_id: int
    categoria: CategoriaRead


class ProductosPaginados(SQLModel):
    total: int = Field(..., schema_extra={"examples": [42]})
    items: list[ProductoRead]
