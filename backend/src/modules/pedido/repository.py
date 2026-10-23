from typing import Optional, Sequence

from sqlalchemy.orm import selectinload
from sqlmodel import Session, select

from .models import HistorialEstadoPedido, Pedido
from src.core.repository import RepositoryBase

class PedidoRepository(RepositoryBase[Pedido]):
    def __init__(self, session: Session) -> None:
            super().__init__(session, Pedido)

    def get_by_id_con_detalles(self, id: int) -> Optional[Pedido]:
        statement = (
            self.activos()
            .where(Pedido.id == id)
            .options(selectinload(Pedido.detalles))
        )
        return self.session.exec(statement).first()

    def listar_con_detalles(
        self, skip: int = 0, limit: int = 10, estado: Optional[str] = None
    ) -> Sequence[Pedido]:
        statement = self.activos().options(selectinload(Pedido.detalles))

        if estado:
            statement = statement.where(Pedido.estado_codigo == estado)

        statement = statement.order_by(Pedido.created_at.desc()).offset(skip).limit(limit)
        return self.session.exec(statement).all()


class HistorialEstadoPedidoRepository:
    """Append-only: solo expone add."""

    def __init__(self, session: Session) -> None:
        self.session = session

    def add(self, registro: HistorialEstadoPedido) -> HistorialEstadoPedido:
        self.session.add(registro)
        self.session.flush()
        return registro

    def listar_de_pedido(self, pedido_id: int) -> Sequence[HistorialEstadoPedido]:
        statement = (
            select(HistorialEstadoPedido)
            .where(HistorialEstadoPedido.pedido_id == pedido_id)
            .order_by(HistorialEstadoPedido.created_at, HistorialEstadoPedido.id)
        )
        return self.session.exec(statement).all()
