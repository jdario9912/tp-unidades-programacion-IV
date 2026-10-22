from datetime import datetime

from pydantic import BaseModel, Field


class TimestampRead(BaseModel):
    created_at: datetime = Field(..., description="Fecha de creación del registro")
    updated_at: datetime = Field(..., description="Fecha de la última modificación")


class ErrorResponse(BaseModel):
    detail: str = Field(..., examples=["No se encontró un recurso con el id 1"])


def error_responses(*status_codes: int) -> dict[int | str, dict]:
    """Genera el bloque `responses` de Swagger para los códigos de error dados."""
    descripciones = {
        404: "Recurso no encontrado",
        409: "Conflicto con el estado actual del recurso",
    }
    return {
        code: {"model": ErrorResponse, "description": descripciones[code]}
        for code in status_codes
    }
