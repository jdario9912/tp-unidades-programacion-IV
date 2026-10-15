from pydantic import BaseModel, Field
from typing import Optional


class ProveedorBase(BaseModel):
    codigo: str = Field(min_length=1, pattern=r"^[A-Z]{3}-\d{2}$", example="PRO-01")
    razon_social: str = Field(min_length=4, example="Ejemplo S.A.")
    cuit: str = Field(min_length=11, max_length=15, example="30-12345678-9")
    email: str = Field(default="", example="contacto@ejemplo.com")
    telefono: str = Field(default="", example="011-1234-5678")
    activo: bool = True

class ProveedorCreate(ProveedorBase):
    pass

class ProveedorRead(ProveedorBase):
    id: int

class ProveedorUpdate(BaseModel):
    codigo: Optional[str] = Field(None, min_length=1)
    razon_social: Optional[str] = Field(None, min_length=4)
    cuit: Optional[str] = Field(None, min_length=11, max_length=15)
    email: Optional[str] = Field(None, example="contacto@ejemplo.com")
    telefono: Optional[str] = Field(None, example="011-1234-5678")
    activo: Optional[bool] = Field(None)