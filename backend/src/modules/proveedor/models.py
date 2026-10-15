from typing import Optional
from sqlmodel import SQLModel, Field

class Proveedor(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    codigo: str = Field(unique=True, index=True)
    razon_social: str
    email: str
    cuit: str
    telefono: str
    activo: bool = True