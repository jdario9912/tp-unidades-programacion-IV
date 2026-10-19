from pydantic import BaseModel, Field, ConfigDict
from typing import Optional

class CategoriaBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    nombre: str = Field(..., min_length=1, example="Electrodomésticos")
    descripcion: str = Field("", example="Categoría de productos electrónicos y electrodomésticos para el hogar.")


class CategoriaCreate(CategoriaBase):
    pass


class CategoriaUpdate(BaseModel):
    nombre: Optional[str] = Field(None, example="Electrodomésticos")
    descripcion: Optional[str] = Field(None, min_length=3)


class CategoriaRead(CategoriaBase):
    id: int
