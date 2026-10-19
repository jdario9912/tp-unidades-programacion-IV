from src.core.unit_of_work import UnitOfWork
from sqlmodel import Session
from .repository import CategoriaRepository

class CategoriaUnitOfWork(UnitOfWork):
    def __init__(self, session: Session) -> None:
        super().__init__(session)
        self.categorias = CategoriaRepository(session)