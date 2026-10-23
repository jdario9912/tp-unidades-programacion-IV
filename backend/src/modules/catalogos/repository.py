from typing import Optional, Sequence

from sqlmodel import Session, select

from .models import EstadoPedido, FormaPago


class EstadoPedidoRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def get_by_codigo(self, codigo: str) -> Optional[EstadoPedido]:
        return self.session.get(EstadoPedido, codigo)

    def listar(self) -> Sequence[EstadoPedido]:
        return self.session.exec(select(EstadoPedido).order_by(EstadoPedido.orden)).all()


class FormaPagoRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def get_by_codigo(self, codigo: str) -> Optional[FormaPago]:
        return self.session.get(FormaPago, codigo)

    def listar_activas(self) -> Sequence[FormaPago]:
        statement = select(FormaPago).where(FormaPago.activo).order_by(FormaPago.codigo)
        return self.session.exec(statement).all()
