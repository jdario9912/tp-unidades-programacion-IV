from pydantic import BaseModel, Field, ConfigDict
from typing import Optional

from app.core.schemas import TimestampRead

class IngredienteBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    nombre: str = Field(
        ..., min_length=1, description="Nombre único del ingrediente", examples=["Harina"]
    )


class IngredienteCreate(IngredienteBase):
    pass


class IngredienteUpdate(BaseModel):
    nombre: Optional[str] = Field(None, examples=["Harina"])


class IngredienteRead(TimestampRead, IngredienteBase):
    id: int = Field(..., description="Identificador del ingrediente", examples=[1])
