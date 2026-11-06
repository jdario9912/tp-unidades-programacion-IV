from typing import List

from sqlmodel import Session

from .errors import FormaPagoNoEncontradaError
from .schemas import EstadoPedidoRead, FormaPagoRead, RolRead
from .unit_of_work import CatalogoUnitOfWork


class CatalogoService:
    def __init__(self, session: Session) -> None:
        self._session = session

    def listar_estados(self) -> List[EstadoPedidoRead]:
        with CatalogoUnitOfWork(self._session) as uow:
            return [EstadoPedidoRead.model_validate(e) for e in uow.estados.listar()]

    def listar_formas_pago(self, incluir_inactivas: bool = False) -> List[FormaPagoRead]:
        with CatalogoUnitOfWork(self._session) as uow:
            return [FormaPagoRead.model_validate(f) for f in uow.formas_pago.listar(incluir_inactivas)]

    def obtener_forma_pago(self, codigo: str) -> FormaPagoRead:
        with CatalogoUnitOfWork(self._session) as uow:
            forma_pago = uow.formas_pago.get_by_codigo(codigo.upper())
            if not forma_pago:
                raise FormaPagoNoEncontradaError(codigo)

            return FormaPagoRead.model_validate(forma_pago)

    def listar_roles(self) -> List[RolRead]:
        with CatalogoUnitOfWork(self._session) as uow:
            return [RolRead.model_validate(r) for r in uow.roles.listar()]
