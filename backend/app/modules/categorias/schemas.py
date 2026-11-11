from typing import Optional

from sqlmodel import Field, SQLModel


class CategoriaCreate(SQLModel):
    nombre: str = Field(..., min_length=2, max_length=100, schema_extra={"examples": ["Hamburguesas"]})
    descripcion: Optional[str] = Field(None, schema_extra={"examples": ["Hamburguesas caseras con papas"]})


class CategoriaUpdate(SQLModel):
    """Actualización parcial: solo cambian los campos enviados."""

    nombre: Optional[str] = Field(None, min_length=2, max_length=100, schema_extra={"examples": ["Hamburguesas"]})
    descripcion: Optional[str] = Field(None, schema_extra={"examples": ["Hamburguesas caseras con papas"]})


class CategoriaRead(SQLModel):
    id: int = Field(..., schema_extra={"examples": [1]})
    nombre: str = Field(..., schema_extra={"examples": ["Hamburguesas"]})
    descripcion: Optional[str] = Field(None, schema_extra={"examples": ["Hamburguesas caseras con papas"]})
    activo: bool = Field(..., schema_extra={"examples": [True]})
