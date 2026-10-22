from datetime import datetime

from pydantic import BaseModel, Field


class TimestampRead(BaseModel):
    created_at: datetime = Field(..., description="Fecha de creación del registro")
    updated_at: datetime = Field(..., description="Fecha de la última modificación")
