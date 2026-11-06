from pydantic import BaseModel, Field, ConfigDict
from typing import Optional

from app.core.schemas import TimestampRead

class CategoriaBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    nombre: str = Field(
        ..., min_length=1, description="Nombre único de la categoría", examples=["Electrodomésticos"]
    )
    descripcion: str = Field(
        "",
        description="Descripción de la categoría",
        examples=["Categoría de productos electrónicos y electrodomésticos para el hogar."],
    )


class CategoriaCreate(CategoriaBase):
    pass


class CategoriaUpdate(BaseModel):
    nombre: Optional[str] = Field(None, examples=["Electrodomésticos"])
    descripcion: Optional[str] = Field(None, min_length=3)


class CategoriaRead(TimestampRead, CategoriaBase):
    id: int = Field(..., description="Identificador de la categoría", examples=[1])
