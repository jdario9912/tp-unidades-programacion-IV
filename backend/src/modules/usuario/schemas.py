from typing import List, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from src.core.schemas import TimestampRead


class UserBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    nombre: str = Field(..., min_length=1, max_length=80, examples=["Juan"])
    apellido: str = Field(..., min_length=1, max_length=80, examples=["Pérez"])
    email: EmailStr = Field(..., max_length=254, description="Email único del usuario", examples=["juan@mail.com"])
    celular: Optional[str] = Field(None, max_length=20, examples=["2615551234"])


class UserCreate(UserBase):
    # bcrypt solo usa los primeros 72 bytes de la contraseña.
    password: str = Field(..., min_length=8, max_length=72, examples=["secreto123"])

    @field_validator("email")
    @classmethod
    def email_en_minusculas(cls, email: str) -> str:
        return email.strip().lower()


class UserPublic(TimestampRead, UserBase):
    id: int = Field(..., description="Identificador del usuario", examples=[1])
    roles: List[str] = Field(default_factory=list, description="Nombres de los roles vigentes", examples=[["user"]])

