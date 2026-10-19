from typing import Optional

from .models import Categoria
from src.core.repository import RepositoryBase
from sqlmodel import Session, func, select

class CategoriaRepository(RepositoryBase[Categoria]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Categoria)

    def get_by_nombre(self, nombre: str) -> Optional[Categoria]:
        statement = select(Categoria).where(func.lower(Categoria.nombre) == nombre.lower())
        return self.session.exec(statement).first()