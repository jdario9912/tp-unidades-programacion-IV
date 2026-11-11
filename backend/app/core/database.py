from typing import Annotated, Generator

from fastapi import Depends
from sqlmodel import SQLModel, Session, create_engine

from .config import settings

# SQLite no deja usar una conexión desde otro hilo; FastAPI atiende en un pool de hilos.
connect_args = {"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(settings.DATABASE_URL, connect_args=connect_args)


def session_factory() -> Session:
    """Sesión nueva para un Unit of Work. Quien la abre la cierra."""
    return Session(engine)


def get_session() -> Generator[Session, None, None]:
    """Sesión por request para las dependencias de autenticación."""
    with session_factory() as session:
        yield session


def create_all_tables() -> None:
    # Registra las tablas en el metadata antes de crearlas.
    import app.modules.usuarios.models  # noqa: F401
    import app.modules.categorias.models  # noqa: F401
    import app.modules.productos.models  # noqa: F401
    import app.modules.pedidos.models  # noqa: F401

    SQLModel.metadata.create_all(engine)


SessionDep = Annotated[Session, Depends(get_session)]
