from typing import Generic, Type, Sequence, TypeVar
from sqlmodel import Session, select

from .models import TimestampMixin, utc_now

ModelT = TypeVar("ModelT", bound=TimestampMixin)

class RepositoryBase(Generic[ModelT]):
    def __init__(self, session: Session, model: Type[ModelT]):
        self.session = session
        self.model = model

    def activos(self):
        """Select base que excluye los registros eliminados (deleted_at != NULL)."""
        return select(self.model).where(self.model.deleted_at.is_(None))

    def get_by_id(self, record_id: int) -> ModelT | None:
        instance = self.session.get(self.model, record_id)
        if instance is None or instance.deleted_at is not None:
            return None
        return instance

    def get_all(self, offset: int = 0, limit: int = 20) -> Sequence[ModelT]:
        return self.session.exec(
            self.activos().offset(offset).limit(limit)
        ).all()

    def add(self, instance: ModelT) -> ModelT:
        self.session.add(instance)
        self.session.flush()  # obtiene el ID sin hacer commit
        self.session.refresh(instance)
        return instance

    def delete(self, instance: ModelT) -> None:
        """Soft delete: marca el registro con deleted_at en lugar de borrarlo."""
        instance.deleted_at = utc_now()
        self.session.add(instance)
        self.session.flush()
