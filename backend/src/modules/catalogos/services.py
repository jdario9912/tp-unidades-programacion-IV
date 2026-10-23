from typing import List

from sqlmodel import Session

from .errors import (
    FormaPagoDuplicadaError,
    FormaPagoEnUsoError,
    FormaPagoNoEncontradaError,
    FormaPagoYaActivaError,
    FormaPagoYaInactivaError,
)
from .models import FormaPago
from .schemas import EstadoPedidoRead, FormaPagoCreate, FormaPagoRead, FormaPagoUpdate
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

    def crear_forma_pago(self, data: FormaPagoCreate) -> FormaPagoRead:
        with CatalogoUnitOfWork(self._session) as uow:
            if uow.formas_pago.get_by_codigo(data.codigo):
                raise FormaPagoDuplicadaError(data.codigo)

            forma_pago = uow.formas_pago.add(FormaPago.model_validate(data))
            resultado = FormaPagoRead.model_validate(forma_pago)
        return resultado

    def actualizar_forma_pago(self, codigo: str, data: FormaPagoUpdate) -> FormaPagoRead:
        with CatalogoUnitOfWork(self._session) as uow:
            forma_pago = uow.formas_pago.get_by_codigo(codigo.upper())
            if not forma_pago:
                raise FormaPagoNoEncontradaError(codigo)

            for key, value in data.model_dump(exclude_unset=True, exclude_none=True).items():
                setattr(forma_pago, key, value)

            forma_pago = uow.formas_pago.add(forma_pago)
            resultado = FormaPagoRead.model_validate(forma_pago)
        return resultado

    def activar_forma_pago(self, codigo: str) -> FormaPagoRead:
        with CatalogoUnitOfWork(self._session) as uow:
            forma_pago = uow.formas_pago.get_by_codigo(codigo.upper())
            if not forma_pago:
                raise FormaPagoNoEncontradaError(codigo)

            if forma_pago.activo:
                raise FormaPagoYaActivaError(forma_pago.codigo)

            forma_pago.activo = True
            forma_pago = uow.formas_pago.add(forma_pago)
            resultado = FormaPagoRead.model_validate(forma_pago)
        return resultado

    def desactivar_forma_pago(self, codigo: str) -> FormaPagoRead:
        with CatalogoUnitOfWork(self._session) as uow:
            forma_pago = uow.formas_pago.get_by_codigo(codigo.upper())
            if not forma_pago:
                raise FormaPagoNoEncontradaError(codigo)

            if not forma_pago.activo:
                raise FormaPagoYaInactivaError(forma_pago.codigo)

            forma_pago.activo = False
            forma_pago = uow.formas_pago.add(forma_pago)
            resultado = FormaPagoRead.model_validate(forma_pago)
        return resultado

    def borrar_forma_pago(self, codigo: str) -> None:
        with CatalogoUnitOfWork(self._session) as uow:
            forma_pago = uow.formas_pago.get_by_codigo(codigo.upper())
            if not forma_pago:
                raise FormaPagoNoEncontradaError(codigo)

            if uow.formas_pago.en_uso(forma_pago.codigo):
                raise FormaPagoEnUsoError(forma_pago.codigo)

            uow.formas_pago.delete(forma_pago)
