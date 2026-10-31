from pydantic import BaseModel, Field, ConfigDict
from typing import Optional

class IngredienteBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    nombre: str = Field(..., min_length=1, example="Harinas")

class IngredienteCreate(IngredienteBase):
    pass

class IngredienteUpdate(BaseModel):
    nombre: Optional[str] = Field(None, example="Harinas")

class IngredienteRead(IngredienteBase):
    id: int