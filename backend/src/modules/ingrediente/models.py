from sqlmodel import SQLModel, Field
from typing import Optional

class Ingrediente(SQLModel, table = True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(unique=True, index=True)