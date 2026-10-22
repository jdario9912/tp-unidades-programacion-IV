from typing import Optional

from .models import FormaPago, HistorialEstadoPedido, Pedido
from src.core.repository import RepositoryBase
from sqlmodel import Session

class PedidoRepository(RepositoryBase[Pedido]):
    def __init__(self, session: Session) -> None:
            super().__init__(session, Pedido)


class FormaPagoRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def get_by_codigo(self, codigo: str) -> Optional[FormaPago]:
        return self.session.get(FormaPago, codigo)


class HistorialEstadoPedidoRepository:
    """Append-only: solo expone add."""

    def __init__(self, session: Session) -> None:
        self.session = session

    def add(self, registro: HistorialEstadoPedido) -> HistorialEstadoPedido:
        self.session.add(registro)
        self.session.flush()
        return registro
