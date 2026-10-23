from typing import List

from sqlmodel import Session

from .schemas import EstadoPedidoRead, FormaPagoRead
from .unit_of_work import CatalogoUnitOfWork


class CatalogoService:
    def __init__(self, session: Session) -> None:
        self._session = session

    def listar_estados(self) -> List[EstadoPedidoRead]:
        with CatalogoUnitOfWork(self._session) as uow:
            return [EstadoPedidoRead.model_validate(e) for e in uow.estados.listar()]

    def listar_formas_pago(self) -> List[FormaPagoRead]:
        with CatalogoUnitOfWork(self._session) as uow:
            return [FormaPagoRead.model_validate(f) for f in uow.formas_pago.listar_activas()]
