from typing import Optional, Sequence

from .models import Ingrediente
from src.core.repository import RepositoryBase
from sqlmodel import Session, func

class IngredienteRepository(RepositoryBase[Ingrediente]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Ingrediente)

    def get_by_nombre(self, nombre: str) -> Optional[Ingrediente]:
        statement = self.activos().where(func.lower(Ingrediente.nombre) == nombre.strip().lower())
        return self.session.exec(statement).first()

    def listar(
        self, skip: int = 0, limit: int = 10, search: Optional[str] = None
    ) -> Sequence[Ingrediente]:
        statement = self.activos().order_by(Ingrediente.id)

        if search:
            statement = statement.where(func.lower(Ingrediente.nombre).contains(search.strip().lower()))

        statement = statement.offset(skip).limit(limit)
        return self.session.exec(statement).all()
