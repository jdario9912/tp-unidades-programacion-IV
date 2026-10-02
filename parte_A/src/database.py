from typing import Annotated, Generator

from fastapi.params import Depends
from sqlmodel import SQLModel, Session, create_engine

DATABASE_URL="postgresql://user:password@localhost:5432/tienda"

engine = create_engine(DATABASE_URL, echo=True)

def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session

def crear_tablas() -> None:
    SQLModel.metadata.create_all(engine)


SessionDep = Annotated[Session, Depends(get_session)]