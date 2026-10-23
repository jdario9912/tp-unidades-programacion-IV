from typing import Annotated, List, Optional

from fastapi import APIRouter, Depends, Path, Query, status

from src.core.database import SessionDep
from src.core.schemas import error_responses
from . import schemas, services

router = APIRouter(prefix="/pedidos", tags=["Pedidos"])


def get_pedido_service(session: SessionDep) -> services.PedidoService:
    return services.PedidoService(session)


PedidoServiceDep = Annotated[services.PedidoService, Depends(get_pedido_service)]


@router.post(
    "/",
    response_model=schemas.PedidoRead,
    status_code=status.HTTP_201_CREATED,
    summary="Crear pedido",
    description=(
        "Crea un pedido en estado PENDIENTE con sus detalles. El backend copia nombre y precio "
        "de cada producto (snapshot), calcula subtotal y total, y registra la primera fila del "
        "historial de estados. Todo ocurre en una sola transacción: si algo falla no se guarda nada.\n\n"
        "- **404**: la forma de pago o algún producto no existe.\n"
        "- **409**: la forma de pago está inactiva, algún producto no está disponible "
        "o el total resulta negativo."
    ),
    responses=error_responses(404, 409),
)
def alta_pedido(pedido: schemas.PedidoCreate, svc: PedidoServiceDep):
    return svc.crear(pedido)


@router.get(
    "/",
    response_model=List[schemas.PedidoRead],
    status_code=status.HTTP_200_OK,
    summary="Listar pedidos",
    description="Lista paginada de pedidos activos con sus detalles, del más reciente al más antiguo.",
)
def listar_pedidos(
    svc: PedidoServiceDep,
    skip: int = Query(0, ge=0, description="Cantidad de registros a saltear"),
    limit: int = Query(10, le=50, description="Cantidad máxima de registros a devolver"),
    estado: Optional[str] = Query(None, description="Filtra por código de estado", examples=["PENDIENTE"]),
):
    return svc.obtener_todos(skip, limit, estado)


@router.get(
    "/{id}",
    response_model=schemas.PedidoRead,
    status_code=status.HTTP_200_OK,
    summary="Obtener pedido",
    description="Devuelve un pedido con sus detalles. Si no existe o fue eliminado responde 404.",
    responses=error_responses(404),
)
def detalle_pedido(svc: PedidoServiceDep, id: int = Path(..., gt=0, description="Id del pedido")):
    return svc.obtener_por_id(id)


@router.patch(
    "/{id}",
    response_model=schemas.PedidoRead,
    status_code=status.HTTP_200_OK,
    summary="Actualizar pedido",
    description=(
        "Modifica la forma de pago y/o las notas. Solo se permite mientras el pedido está PENDIENTE; "
        "en otro estado responde 409."
    ),
    responses=error_responses(404, 409),
)
def actualizar_pedido(
    svc: PedidoServiceDep,
    pedido: schemas.PedidoUpdate,
    id: int = Path(..., gt=0, description="Id del pedido"),
):
    return svc.actualizar(id, pedido)


@router.patch(
    "/{id}/estado",
    response_model=schemas.PedidoRead,
    status_code=status.HTTP_200_OK,
    summary="Cambiar estado del pedido",
    description=(
        "Pasa el pedido a otro estado y registra la transición en el historial.\n\n"
        "Transiciones permitidas: PENDIENTE → CONFIRMADO → EN_PREP → EN_CAMINO → ENTREGADO, "
        "y CANCELADO desde PENDIENTE, CONFIRMADO o EN_PREP. ENTREGADO y CANCELADO son terminales.\n\n"
        "- **404**: el pedido o el estado no existen.\n"
        "- **409**: la transición no está permitida."
    ),
    responses=error_responses(404, 409),
)
def cambiar_estado_pedido(
    svc: PedidoServiceDep,
    data: schemas.PedidoEstadoUpdate,
    id: int = Path(..., gt=0, description="Id del pedido"),
):
    return svc.cambiar_estado(id, data)


@router.get(
    "/{id}/historial",
    response_model=List[schemas.HistorialEstadoPedidoRead],
    status_code=status.HTTP_200_OK,
    summary="Historial de estados",
    description="Devuelve las transiciones de estado del pedido en orden cronológico.",
    responses=error_responses(404),
)
def historial_pedido(svc: PedidoServiceDep, id: int = Path(..., gt=0, description="Id del pedido")):
    return svc.listar_historial(id)


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Eliminar pedido",
    description="Elimina lógicamente el pedido (soft delete: se completa `deleted_at`).",
    responses=error_responses(404),
)
def borrar_pedido(svc: PedidoServiceDep, id: int = Path(..., gt=0, description="Id del pedido")):
    svc.borrar(id)
