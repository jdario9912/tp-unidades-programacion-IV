from typing import Generic, Optional, Sequence, Type, TypeVar

from sqlmodel import Session, SQLModel, select

T = TypeVar("T", bound=SQLModel)


class BaseRepository(Generic[T]):
    """Consultas comunes. Sin reglas de negocio: la baja lógica la decide el Service."""

    def __init__(self, session: Session, model: Type[T]) -> None:
        self.session = session
        self.model = model

    def get_by_id(self, record_id: int) -> Optional[T]:
        return self.session.get(self.model, record_id)

    def get_all(self, skip: int = 0, limit: int = 100) -> Sequence[T]:
        return self.session.exec(select(self.model).offset(skip).limit(limit)).all()

    def add(self, instance: T) -> T:
        self.session.add(instance)
        self.session.flush()  # obtiene el ID sin hacer commit
        self.session.refresh(instance)
        return instance

    def delete(self, instance: T) -> None:
        self.session.delete(instance)
        self.session.flush()
