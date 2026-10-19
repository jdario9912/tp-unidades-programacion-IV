from typing import Optional

from .models import Ingrediente
from src.core.repository import RepositoryBase
from sqlmodel import Session, func, select

class IngredienteRepository(RepositoryBase[Ingrediente]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Ingrediente)

    def get_by_nombre(self, nombre: str) -> Optional[Ingrediente]:
        statement = select(Ingrediente).where(func.lower(Ingrediente.nombre) == nombre.lower())
        return self.session.exec(statement).first()