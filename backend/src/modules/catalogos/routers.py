from typing import Annotated, List

from fastapi import APIRouter, Depends, Path, Query, status

from src.core.database import SessionDep
from src.core.schemas import error_responses
from . import schemas, services

router = APIRouter(prefix="/catalogos", tags=["Catálogos"])


def get_catalogo_service(session: SessionDep) -> services.CatalogoService:
    return services.CatalogoService(session)


CatalogoServiceDep = Annotated[services.CatalogoService, Depends(get_catalogo_service)]


@router.get(
    "/estados-pedido",
    response_model=List[schemas.EstadoPedidoRead],
    status_code=status.HTTP_200_OK,
    summary="Listar estados de pedido",
    description="Devuelve los estados posibles de un pedido, ordenados según el flujo.",
)
def listar_estados_pedido(svc: CatalogoServiceDep):
    return svc.listar_estados()


@router.get(
    "/formas-pago",
    response_model=List[schemas.FormaPagoRead],
    status_code=status.HTTP_200_OK,
    summary="Listar formas de pago",
    description=(
        "Devuelve las formas de pago activas, que son las que se pueden usar al crear un pedido. "
    ),
)
def listar_formas_pago(
    svc: CatalogoServiceDep,
    incluir_inactivas: bool = Query(False, description="Incluye las formas de pago desactivadas"),
):
    return svc.listar_formas_pago(incluir_inactivas)


@router.get(
    "/formas-pago/{codigo}",
    response_model=schemas.FormaPagoRead,
    status_code=status.HTTP_200_OK,
    summary="Obtener forma de pago",
    description="Devuelve una forma de pago, activa o no. Si no existe responde 404.",
    responses=error_responses(404),
)
def detalle_forma_pago(svc: CatalogoServiceDep, codigo: str = Path(..., max_length=30, description="Código")):
    return svc.obtener_forma_pago(codigo)


@router.post(
    "/formas-pago",
    response_model=schemas.FormaPagoRead,
    status_code=status.HTTP_201_CREATED,
    summary="Crear forma de pago",
    description="Crea una forma de pago. El código se guarda en mayúsculas y no puede repetirse (409).",
    responses=error_responses(409),
)
def alta_forma_pago(svc: CatalogoServiceDep, data: schemas.FormaPagoCreate):
    return svc.crear_forma_pago(data)


@router.patch(
    "/formas-pago/{codigo}",
    response_model=schemas.FormaPagoRead,
    status_code=status.HTTP_200_OK,
    summary="Actualizar forma de pago",
    description=(
        "Modifica la descripción. El código no se puede cambiar; para activar o desactivar "
        "se usan sus propios endpoints."
    ),
    responses=error_responses(404),
)
def actualizar_forma_pago(
    svc: CatalogoServiceDep,
    data: schemas.FormaPagoUpdate,
    codigo: str = Path(..., max_length=30, description="Código"),
):
    return svc.actualizar_forma_pago(codigo, data)


@router.put(
    "/formas-pago/{codigo}/activar",
    response_model=schemas.FormaPagoRead,
    status_code=status.HTTP_200_OK,
    summary="Activar forma de pago",
    description="Habilita la forma de pago para pedidos nuevos. Responde 409 si ya estaba activa.",
    responses=error_responses(404, 409),
)
def activar_forma_pago(svc: CatalogoServiceDep, codigo: str = Path(..., max_length=30, description="Código")):
    return svc.activar_forma_pago(codigo)


@router.put(
    "/formas-pago/{codigo}/desactivar",
    response_model=schemas.FormaPagoRead,
    status_code=status.HTTP_200_OK,
    summary="Desactivar forma de pago",
    description=(
        "Impide usar la forma de pago en pedidos nuevos; los pedidos existentes no cambian. "
        "Responde 409 si ya estaba inactiva."
    ),
    responses=error_responses(404, 409),
)
def desactivar_forma_pago(svc: CatalogoServiceDep, codigo: str = Path(..., max_length=30, description="Código")):
    return svc.desactivar_forma_pago(codigo)


@router.delete(
    "/formas-pago/{codigo}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Eliminar forma de pago",
    description=(
        "Elimina físicamente la forma de pago (es un catálogo, no tiene soft delete). "
        "Si algún pedido la usa responde 409: en ese caso hay que desactivarla."
    ),
    responses=error_responses(404, 409),
)
def borrar_forma_pago(svc: CatalogoServiceDep, codigo: str = Path(..., max_length=30, description="Código")):
    svc.borrar_forma_pago(codigo)
