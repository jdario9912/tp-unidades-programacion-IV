from typing import Optional, Sequence

from sqlalchemy.orm import selectinload
from sqlmodel import Session, func

from src.core.repository import RepositoryBase
from .models import Producto


class ProductoRepository(RepositoryBase[Producto]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Producto)

    def get_by_nombre(self, nombre: str) -> Optional[Producto]:
        statement = self.activos().where(func.lower(Producto.nombre) == nombre.lower())
        return self.session.exec(statement).first()

    def get_by_id_con_categorias(self, id: int) -> Optional[Producto]:
        statement = (
            self.activos()
            .where(Producto.id == id)
            .options(selectinload(Producto.categorias))
        )
        return self.session.exec(statement).first()

    def listar_con_categorias(
        self, skip: int = 0, limit: int = 10, search: Optional[str] = None
    ) -> Sequence[Producto]:
        statement = (
            self.activos()
            .order_by(Producto.id)
            .options(selectinload(Producto.categorias))
        )

        if search:
            statement = statement.where(func.lower(Producto.nombre).contains(search.strip().lower()))

        statement = statement.offset(skip).limit(limit)
        return self.session.exec(statement).all()
