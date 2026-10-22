from datetime import datetime

from sqlalchemy import DateTime, false, func
from sqlmodel import SQLModel, Field

from src.core.models import utc_now


class ProductoCategoria(SQLModel, table=True):
    producto_id: int | None = Field(
        default=None, foreign_key="producto.id", primary_key=True, ondelete="CASCADE"
    )
    categoria_id: int | None = Field(
        default=None, foreign_key="categoria.id", primary_key=True, ondelete="CASCADE"
    )
    es_principal: bool = Field(
        default=False, nullable=False, sa_column_kwargs={"server_default": false()}
    )
    # Solo created_at: la asociación no se modifica y se borra físicamente.
    # server_default cubre los inserts hechos a través de la relación.
    created_at: datetime = Field(
        default_factory=utc_now,
        sa_type=DateTime(timezone=True),
        nullable=False,
        sa_column_kwargs={"server_default": func.now()},
    )
