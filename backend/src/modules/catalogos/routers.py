from typing import Annotated, List

from fastapi import APIRouter, Depends, status

from src.core.database import SessionDep
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
    description="Devuelve las formas de pago activas, que son las que se pueden usar al crear un pedido.",
)
def listar_formas_pago(svc: CatalogoServiceDep):
    return svc.listar_formas_pago()
