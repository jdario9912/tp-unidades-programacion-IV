from typing import Annotated, List, Optional

from fastapi import APIRouter, Depends, Path, Query, status

from src.core.database import SessionDep
from src.core.schemas import error_responses
from . import schemas, services

router = APIRouter(prefix="/productos", tags=["Productos"])


def get_producto_service(session: SessionDep) -> services.ProductoService:
    return services.ProductoService(session)


ProductoServiceDep = Annotated[services.ProductoService, Depends(get_producto_service)]


@router.post(
    "/",
    response_model=schemas.ProductoRead,
    status_code=status.HTTP_201_CREATED,
    summary="Crear producto",
    description="Crea un nuevo producto. El nombre no puede repetirse entre los productos activos.",
    responses=error_responses(409),
)
def alta_producto(producto: schemas.ProductoCreate, svc: ProductoServiceDep):
    return svc.crear(producto)


@router.get(
    "/",
    response_model=List[schemas.ProductoReadConCategorias],
    status_code=status.HTTP_200_OK,
    summary="Listar productos",
    description="Lista paginada de productos activos con sus categorías. Los productos eliminados no se incluyen.",
)
def listar_productos(
    svc: ProductoServiceDep,
    skip: int = Query(0, ge=0, description="Cantidad de registros a saltear"),
    limit: int = Query(10, le=50, description="Cantidad máxima de registros a devolver"),
    search: Optional[str] = Query(None, description="Busca productos por nombre"),
):
    return svc.obtener_todos(skip, limit, search)


@router.get(
    "/{id}",
    response_model=schemas.ProductoReadConCategorias,
    status_code=status.HTTP_200_OK,
    summary="Obtener producto",
    description="Devuelve un producto con sus categorías. Si no existe o fue eliminado responde 404.",
    responses=error_responses(404),
)
def detalle_producto(svc: ProductoServiceDep, id: int = Path(..., gt=0, description="Id del producto")):
    return svc.obtener_por_id(id)


@router.put(
    "/{id}",
    response_model=schemas.ProductoRead,
    status_code=status.HTTP_200_OK,
    summary="Actualizar producto",
    description="Reemplaza todos los datos de un producto.",
    responses=error_responses(404),
)
def actualizar_producto(
    svc: ProductoServiceDep,
    producto: schemas.ProductoCreate,
    id: int = Path(..., gt=0, description="Id del producto"),
):
    return svc.actualizar_total(id, producto)


@router.put(
    "/{id}/deshabilitar",
    response_model=schemas.ProductoRead,
    status_code=status.HTTP_200_OK,
    summary="Deshabilitar producto",
    description="Marca el producto como no disponible. Responde 409 si ya estaba deshabilitado.",
    responses=error_responses(404, 409),
)
def deshabilitar_producto(svc: ProductoServiceDep, id: int = Path(..., gt=0, description="Id del producto")):
    return svc.deshabilitar(id)


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Eliminar producto",
    description=(
        "Elimina lógicamente el producto (soft delete: se completa `deleted_at`) "
        "y quita sus asociaciones con categorías."
    ),
    responses=error_responses(404),
)
def borrar_producto(svc: ProductoServiceDep, id: int = Path(..., gt=0, description="Id del producto")):
    svc.borrar(id)


@router.post(
    "/{id}/categorias",
    response_model=schemas.ProductoCategoriaRead,
    status_code=status.HTTP_201_CREATED,
    summary="Asociar categoría a producto",
    description=(
        "Asocia una categoría al producto. El par (producto, categoría) es único: "
        "si ya están asociados responde 409."
    ),
    responses=error_responses(404, 409),
)
def asociar_categoria(
    svc: ProductoServiceDep,
    data: schemas.ProductoCategoriaCreate,
    id: int = Path(..., gt=0, description="Id del producto"),
):
    return svc.asignar_categoria(id, data)


@router.get(
    "/{id}/categorias",
    response_model=List[schemas.CategoriaAsignadaRead],
    status_code=status.HTTP_200_OK,
    summary="Listar categorías de un producto",
    description="Devuelve las categorías activas asociadas al producto.",
    responses=error_responses(404),
)
def listar_categorias_de_producto(svc: ProductoServiceDep, id: int = Path(..., gt=0, description="Id del producto")):
    return svc.listar_categorias(id)


@router.delete(
    "/{id}/categorias/{categoria_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Desasociar categoría de producto",
    description="Quita la asociación entre el producto y la categoría. Si no estaban asociados responde 404.",
    responses=error_responses(404),
)
def desasociar_categoria(
    svc: ProductoServiceDep,
    id: int = Path(..., gt=0, description="Id del producto"),
    categoria_id: int = Path(..., gt=0, description="Id de la categoría"),
):
    svc.quitar_categoria(id, categoria_id)
