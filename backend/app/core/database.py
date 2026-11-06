from typing import Annotated, Generator

from fastapi.params import Depends
from sqlmodel import SQLModel, Session, create_engine
from .config import settings

engine = create_engine(settings.DATABASE_URL, echo=True)

def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session

def crear_tablas() -> None:
    SQLModel.metadata.create_all(engine)


SessionDep = Annotated[Session, Depends(get_session)]