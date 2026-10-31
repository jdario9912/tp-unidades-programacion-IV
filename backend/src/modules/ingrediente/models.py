from typing import Optional
from src.core.models import TimestampMixin
from sqlmodel import Field

class Ingrediente(TimestampMixin, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    # Sin unique a nivel DB: un ingrediente eliminado (soft delete) no debe
    # impedir crear otro con el mismo nombre. La unicidad se valida en el servicio.
    nombre: str = Field(index=True)
