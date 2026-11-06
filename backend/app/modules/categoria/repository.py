from typing import Optional, Sequence

from .models import Categoria
from app.core.repository import RepositoryBase
from sqlmodel import Session, func

class CategoriaRepository(RepositoryBase[Categoria]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Categoria)

    def get_by_nombre(self, nombre: str) -> Optional[Categoria]:
        statement = self.activos().where(func.lower(Categoria.nombre) == nombre.strip().lower())
        return self.session.exec(statement).first()

    def listar(
        self, skip: int = 0, limit: int = 10, search: Optional[str] = None
    ) -> Sequence[Categoria]:
        statement = self.activos().order_by(Categoria.id)

        if search:
            statement = statement.where(func.lower(Categoria.nombre).contains(search.strip().lower()))

        statement = statement.offset(skip).limit(limit)
        return self.session.exec(statement).all()