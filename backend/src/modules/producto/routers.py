from fastapi import APIRouter, Path, Query, status
from typing import List
from . import schemas, services
from src.core.database import SessionDep

router = APIRouter(prefix="/productos", tags=["Productos"])

@router.post(
    "/", response_model=schemas.ProductoRead, status_code=status.HTTP_201_CREATED
)
def alta_producto(session: SessionDep,producto: schemas.ProductoCreate):
    return services.crear(session, producto)


@router.get(
    "/", response_model=List[schemas.ProductoRead], status_code=status.HTTP_200_OK
)
def listar_productos(session: SessionDep, skip: int = Query(0, ge=0), limit: int = Query(10, le=50)):
    return services.obtener_todos(session, skip, limit)


@router.get(
    "/{id}", response_model=schemas.ProductoReadConCategorias, status_code=status.HTTP_200_OK
)
def detalle_producto(session: SessionDep, id: int = Path(..., gt=0)):
    return services.obtener_por_id(session, id)


@router.put(
    "/{id}", response_model=schemas.ProductoRead, status_code=status.HTTP_200_OK
)
def actualizar_producto(session: SessionDep, producto: schemas.ProductoCreate, id: int = Path(..., gt=0)):
    return services.actualizar_total(session, id, producto)


@router.put(
    "/{id}/deshabilitar",
    response_model=schemas.ProductoRead,
    status_code=status.HTTP_200_OK,
)
def deshabilitar_producto(session: SessionDep, id: int = Path(..., gt=0)):
    return services.deshabilitar(session, id)


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def borrar_producto(session: SessionDep, id: int = Path(..., gt=0)):
    return services.borrar(session, id)

@router.put(
    "/{producto_id}/categorias/{categoria_id}",
    response_model=schemas.ProductoReadConCategorias,
    status_code=status.HTTP_200_OK,
)
def asignar_categoria_a_producto(session: SessionDep, producto_id: int= Path(..., gt=0), categoria_id: int= Path(..., gt=0)):
    return services.asignar_categoria(session, producto_id, categoria_id)

@router.delete(
    "/{producto_id}/categorias/{categoria_id}",
    response_model=schemas.ProductoReadConCategorias,
    status_code=status.HTTP_200_OK,
)
def remover_categoria_de_producto(session: SessionDep, producto_id: int= Path(..., gt=0), categoria_id: int= Path(..., gt=0)):
    return services.quitar_categoria(session, producto_id, categoria_id)