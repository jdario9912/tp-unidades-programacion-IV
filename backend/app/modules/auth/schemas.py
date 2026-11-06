from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from app.modules.usuario.schemas import UserPublic


class UserAdmin(UserPublic):
    activo: bool = Field(..., description="False si el usuario está desactivado", examples=[True])
    deleted_at: Optional[datetime] = Field(None, description="Fecha de desactivación")


class MensajeRead(BaseModel):
    detail: str = Field(..., examples=["Sesión iniciada"])
