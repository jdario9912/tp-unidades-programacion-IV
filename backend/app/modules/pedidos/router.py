from typing import Annotated, Optional

from fastapi import APIRouter, Depends, Path, Query, status

from app.core.deps import CurrentUserDep, requiere_admin
from app.core.schemas import error_responses
from .schemas import (
    CambioEstado,
    EstadoPedido,
    PedidoCreate,
    PedidoRead,
    PedidosPaginados,
    ResumenPedidos,
)
from .service import PedidoService
from .unit_of_work import PedidoUnitOfWork

# Toda ruta requiere sesión activa. No hay edición ni borrado de pedidos (RN-05).
router = APIRouter(prefix="/pedidos", tags=["Pedidos"])


def get_pedido_service() -> PedidoService:
    return PedidoService(PedidoUnitOfWork())


PedidoServiceDep = Annotated[PedidoService, Depends(get_pedido_service)]


@router.post(
    "",
    response_model=PedidoRead,
    status_code=status.HTTP_201_CREATED,
    summary="Crear pedido",
    description=(
        "Crea el pedido desde el carrito (RN-01) en una sola transacción: valida cada producto, "
        "descuenta el stock y copia nombre y precio en las líneas. Nace en PENDIENTE.\n\n"
        "- **404**: algún producto no existe o está dado de baja.\n"
        "- **400**: stock insuficiente, producto no disponible o repetido."
    ),
    responses=error_responses(400, 404),
)
def crear_pedido(pedido: PedidoCreate, usuario: CurrentUserDep, svc: PedidoServiceDep):
    return svc.crear(pedido, usuario)


@router.get(
    "",
    response_model=PedidosPaginados,
    status_code=status.HTTP_200_OK,
    summary="Listar pedidos",
    description="El admin ve todos los pedidos; el resto, solo los propios. Del más reciente al más antiguo.",
)
def listar_pedidos(
    usuario: CurrentUserDep,
    svc: PedidoServiceDep,
    skip: int = Query(0, ge=0, description="Cantidad de registros a saltear"),
    limit: int = Query(20, ge=1, le=100, description="Cantidad máxima de registros a devolver"),
    estado: Optional[EstadoPedido] = Query(None, description="Filtra por estado"),
):
    return svc.listar(usuario, skip, limit, estado)


# Se declara antes de /{id}.
@router.get(
    "/resumen",
    dependencies=[requiere_admin],
    response_model=ResumenPedidos,
    status_code=status.HTTP_200_OK,
    summary="Resumen de pedidos",
    description="Indicadores del panel: cantidad por estado, pedidos de hoy e ingresos de los entregados.",
)
def resumen_pedidos(svc: PedidoServiceDep):
    return svc.resumen()


@router.get(
    "/{id}",
    response_model=PedidoRead,
    status_code=status.HTTP_200_OK,
    summary="Obtener pedido",
    description="Detalle con sus líneas. Solo para el dueño o el admin.",
    responses=error_responses(403, 404),
)
def detalle_pedido(
    usuario: CurrentUserDep, svc: PedidoServiceDep, id: int = Path(..., gt=0, description="Id del pedido")
):
    return svc.obtener(id, usuario)


@router.patch(
    "/{id}/estado",
    dependencies=[requiere_admin],
    response_model=PedidoRead,
    status_code=status.HTTP_200_OK,
    summary="Cambiar estado del pedido",
    description=(
        "Transiciones válidas: PENDIENTE → EN_PREPARACION | CANCELADO y "
        "EN_PREPARACION → ENTREGADO | CANCELADO. ENTREGADO y CANCELADO son terminales. "
        "Al cancelar se restituye el stock en la misma transacción."
    ),
    responses=error_responses(400, 404),
)
def cambiar_estado_pedido(
    data: CambioEstado, svc: PedidoServiceDep, id: int = Path(..., gt=0, description="Id del pedido")
):
    return svc.cambiar_estado(id, data)


@router.patch(
    "/{id}/cancelar",
    response_model=PedidoRead,
    status_code=status.HTTP_200_OK,
    summary="Cancelar pedido propio",
    description="El dueño cancela su pedido mientras está PENDIENTE. Se restituye el stock.",
    responses=error_responses(400, 403, 404),
)
def cancelar_pedido(
    usuario: CurrentUserDep, svc: PedidoServiceDep, id: int = Path(..., gt=0, description="Id del pedido")
):
    return svc.cancelar(id, usuario)
