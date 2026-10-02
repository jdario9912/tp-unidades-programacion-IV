from typing import Optional
from sqlmodel import SQLModel, Field

class Categoria(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    codigo: str = Field(unique=True, index=True)
    descripcion: str
    activo: bool = True