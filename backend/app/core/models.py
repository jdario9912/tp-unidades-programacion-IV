from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import DateTime
from sqlmodel import SQLModel, Field


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class TimestampMixin(SQLModel):
    """
    Campos de auditoría comunes a todos los modelos.

    - created_at: fecha de creación del registro.
    - updated_at: se actualiza automáticamente en cada UPDATE.
    - deleted_at: None mientras el registro está activo. Si tiene valor,
      el registro se considera eliminado (soft delete) y no se expone en la API.
    """

    created_at: datetime = Field(
        default_factory=utc_now, sa_type=DateTime(timezone=True), nullable=False
    )
    updated_at: datetime = Field(
        default_factory=utc_now,
        sa_type=DateTime(timezone=True),
        nullable=False,
        sa_column_kwargs={"onupdate": utc_now},
    )
    deleted_at: Optional[datetime] = Field(
        default=None, sa_type=DateTime(timezone=True), nullable=True
    )
