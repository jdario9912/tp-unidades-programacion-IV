from sqlmodel import Session

from src.core.unit_of_work import UnitOfWork
from src.modules.categoria.repository import CategoriaRepository
from .repository import ProductoCategoriaRepository, ProductoRepository


class ProductoUnitOfWork(UnitOfWork):
    def __init__(self, session: Session) -> None:
        super().__init__(session)
        self.productos = ProductoRepository(session)
        self.categorias = CategoriaRepository(session)
        self.asociaciones = ProductoCategoriaRepository(session)
