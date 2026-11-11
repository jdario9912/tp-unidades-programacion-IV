from sqlmodel import Field, SQLModel


class MensajeRead(SQLModel):
    message: str = Field(..., schema_extra={"examples": ["Login exitoso"]})
