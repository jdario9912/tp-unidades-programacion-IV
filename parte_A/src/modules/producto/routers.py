from fastapi import APIRouter, HTTPException, Path, Query, status
from typing import List
from . import schemas, services
from src.database import SessionDep

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
    "/{id}", response_model=schemas.ProductoRead, status_code=status.HTTP_200_OK
)
def detalle_producto(session: SessionDep, id: int = Path(..., gt=0)):
    return services.obtener_por_id(session, id)


@router.put(
    "/{id}", response_model=schemas.ProductoRead, status_code=status.HTTP_200_OK
)
def actualizar_producto(session: SessionDep, producto: schemas.ProductoCreate, id: int = Path(..., gt=0)):
    return services.actualizar_total(session, id, producto)


@router.put(
    "/{id}/desactivar",
    response_model=schemas.ProductoRead,
    status_code=status.HTTP_200_OK,
)
def borrado_logico(session: SessionDep, id: int = Path(..., gt=0)):
    return services.desactivar(session, id)


@router.get(
    "/{id}/stock",
    response_model=schemas.ProductoStockResponse,
    status_code=status.HTTP_200_OK,
)
def consultar_stock(session: SessionDep, id: int = Path(..., gt=0)):
    return services.obtener_estado_stock(session, id)

@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def borrar_producto(session: SessionDep, id: int = Path(..., gt=0)):
    return services.borrar(session, id)