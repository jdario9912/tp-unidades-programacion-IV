from sqlmodel import Session

from app.core.unit_of_work import UnitOfWork
from app.modules.categoria.repository import CategoriaRepository
from app.modules.ingrediente.repository import IngredienteRepository
from .repository import ProductoCategoriaRepository, ProductoIngredienteRepository, ProductoRepository


class ProductoUnitOfWork(UnitOfWork):
    def __init__(self, session: Session) -> None:
        super().__init__(session)
        self.productos = ProductoRepository(session)
        self.categorias = CategoriaRepository(session)
        self.asociaciones = ProductoCategoriaRepository(session)
        self.ingredientes = IngredienteRepository(session)
        self.asociaciones_ingredientes = ProductoIngredienteRepository(session)
