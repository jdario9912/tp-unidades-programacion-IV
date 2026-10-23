from typing import Optional, Sequence

from sqlmodel import Session, select

from src.modules.pedido.models import Pedido
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

    def add(self, forma_pago: FormaPago) -> FormaPago:
        self.session.add(forma_pago)
        self.session.flush()
        self.session.refresh(forma_pago)
        return forma_pago

    def en_uso(self, codigo: str) -> bool:
        statement = select(Pedido.id).where(Pedido.forma_pago_codigo == codigo).limit(1)
        return self.session.exec(statement).first() is not None

    def delete(self, forma_pago: FormaPago) -> None:
        self.session.delete(forma_pago)
        self.session.flush()
