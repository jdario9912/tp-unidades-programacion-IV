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

    def listar(self, incluir_inactivas: bool = False) -> Sequence[FormaPago]:
        statement = select(FormaPago).order_by(FormaPago.codigo)
        if not incluir_inactivas:
            statement = statement.where(FormaPago.activo)
        return self.session.exec(statement).all()
