from typing import Optional, Sequence

from sqlalchemy.orm import selectinload
from sqlmodel import Session, func, select

from app.core.base_repository import BaseRepository
from .models import Producto


class ProductoRepository(BaseRepository[Producto]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Producto)

    def get_for_update(self, id: int) -> Optional[Producto]:
        """Bloquea la fila hasta el commit para que dos pedidos no descuenten el mismo stock."""
        statement = select(Producto).where(Producto.id == id).with_for_update()
        return self.session.exec(statement).first()

    def search(
        self,
        skip: int = 0,
        limit: int = 20,
        search: Optional[str] = None,
        categoria_id: Optional[int] = None,
        disponible: Optional[bool] = None,
    ) -> tuple[int, Sequence[Producto]]:
        """Productos activos que cumplen los filtros: devuelve el total y la página pedida."""
        filtros = [Producto.activo]
        if search:
            filtros.append(func.lower(Producto.nombre).contains(search.strip().lower()))
        if categoria_id is not None:
            filtros.append(Producto.categoria_id == categoria_id)
        if disponible is not None:
            filtros.append(Producto.disponible == disponible)

        total = self.session.exec(select(func.count()).select_from(Producto).where(*filtros)).one()
        statement = (
            select(Producto)
            .where(*filtros)
            .options(selectinload(Producto.categoria))
            .order_by(Producto.id)
            .offset(skip)
            .limit(limit)
        )
        return total, self.session.exec(statement).all()
