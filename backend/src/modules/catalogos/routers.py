from typing import Annotated, List

from fastapi import APIRouter, Depends, Path, Query, status

from src.core.database import SessionDep
from src.core.schemas import error_responses
from src.modules.auth.dependencies import requiere_sesion
from . import schemas, services

# Catálogos de solo lectura: se cargan con el seed y no tienen endpoints de escritura.
router = APIRouter(prefix="/catalogos", tags=["Catálogos"], dependencies=[requiere_sesion])


def get_catalogo_service(session: SessionDep) -> services.CatalogoService:
    return services.CatalogoService(session)


CatalogoServiceDep = Annotated[services.CatalogoService, Depends(get_catalogo_service)]


@router.get(
    "/estados-pedido",
    response_model=List[schemas.EstadoPedidoRead],
    status_code=status.HTTP_200_OK,
    summary="Listar estados de pedido",
    description="Devuelve los estados posibles de un pedido, ordenados según el flujo.",
    responses=error_responses(400, 401),
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
    responses=error_responses(400, 401),
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
    responses=error_responses(400, 401, 404),
)
def detalle_forma_pago(svc: CatalogoServiceDep, codigo: str = Path(..., max_length=30, description="Código")):
    return svc.obtener_forma_pago(codigo)


@router.get(
    "/roles",
    response_model=List[schemas.RolRead],
    status_code=status.HTTP_200_OK,
    summary="Listar roles",
    description="Devuelve el catálogo de roles.",
    responses=error_responses(400, 401),
)
def listar_roles(svc: CatalogoServiceDep):
    return svc.listar_roles()
