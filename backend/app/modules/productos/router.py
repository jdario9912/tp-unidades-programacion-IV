from typing import Annotated, Optional

from fastapi import APIRouter, Depends, Path, Query, status

from app.core.deps import requiere_admin
from app.core.schemas import error_responses
from .schemas import (
    ProductoCreate,
    ProductoRead,
    ProductosPaginados,
    ProductoStockUpdate,
    ProductoUpdate,
)
from .service import ProductoService
from .unit_of_work import ProductoUnitOfWork

# Lecturas públicas; escrituras solo para admin.
router = APIRouter(prefix="/productos", tags=["Productos"])


def get_producto_service() -> ProductoService:
    return ProductoService(ProductoUnitOfWork())


ProductoServiceDep = Annotated[ProductoService, Depends(get_producto_service)]


@router.get(
    "",
    response_model=ProductosPaginados,
    status_code=status.HTTP_200_OK,
    summary="Listar productos",
    description="Lista paginada de productos activos, con búsqueda por nombre y filtros.",
)
def listar_productos(
    svc: ProductoServiceDep,
    skip: int = Query(0, ge=0, description="Cantidad de registros a saltear"),
    limit: int = Query(20, ge=1, le=100, description="Cantidad máxima de registros a devolver"),
    search: Optional[str] = Query(None, description="Busca por nombre, sin distinguir mayúsculas"),
    categoria_id: Optional[int] = Query(None, gt=0, description="Filtra por categoría"),
    disponible: Optional[bool] = Query(None, description="Filtra por disponibilidad"),
):
    return svc.listar(skip, limit, search, categoria_id, disponible)


@router.get(
    "/{id}",
    response_model=ProductoRead,
    status_code=status.HTTP_200_OK,
    summary="Obtener producto",
    description="Devuelve un producto activo con su categoría. Si no existe o fue dado de baja responde 404.",
    responses=error_responses(404),
)
def detalle_producto(svc: ProductoServiceDep, id: int = Path(..., gt=0, description="Id del producto")):
    return svc.obtener(id)


@router.post(
    "",
    dependencies=[requiere_admin],
    response_model=ProductoRead,
    status_code=status.HTTP_201_CREATED,
    summary="Crear producto",
    description="Crea un producto en la categoría indicada. 404 si la categoría no existe o está dada de baja.",
    responses=error_responses(404),
)
def crear_producto(producto: ProductoCreate, svc: ProductoServiceDep):
    return svc.crear(producto)


@router.put(
    "/{id}",
    dependencies=[requiere_admin],
    response_model=ProductoRead,
    status_code=status.HTTP_200_OK,
    summary="Actualizar producto",
    description=(
        "Actualiza los campos enviados y conserva los demás. "
        "404 si el producto o la nueva categoría no existen o están dados de baja."
    ),
    responses=error_responses(404),
)
def actualizar_producto(
    producto: ProductoUpdate,
    svc: ProductoServiceDep,
    id: int = Path(..., gt=0, description="Id del producto"),
):
    return svc.actualizar(id, producto)


@router.patch(
    "/{id}/stock",
    dependencies=[requiere_admin],
    response_model=ProductoRead,
    status_code=status.HTTP_200_OK,
    summary="Actualizar stock y disponibilidad",
    description="Cambia `stock` y/o `disponible`.",
    responses=error_responses(404),
)
def actualizar_stock(
    data: ProductoStockUpdate,
    svc: ProductoServiceDep,
    id: int = Path(..., gt=0, description="Id del producto"),
):
    return svc.actualizar_stock(id, data)


@router.delete(
    "/{id}",
    dependencies=[requiere_admin],
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Eliminar producto",
    description="Baja lógica (`activo = false`).",
    responses=error_responses(404),
)
def eliminar_producto(svc: ProductoServiceDep, id: int = Path(..., gt=0, description="Id del producto")):
    svc.eliminar(id)
