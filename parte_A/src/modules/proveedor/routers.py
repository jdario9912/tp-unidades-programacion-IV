from fastapi import APIRouter, Path, Query, status
from typing import List

from src.database import SessionDep

from . import schemas, services

router = APIRouter(prefix="/proveedores", tags=["Proveedores"])

@router.post(
    "/", response_model=schemas.ProveedorRead, status_code=status.HTTP_201_CREATED
)
def alta_proveedor(session: SessionDep, proveedor: schemas.ProveedorCreate):
    return services.crear(session, proveedor)

@router.get(
    "/", response_model=List[schemas.ProveedorRead], status_code=status.HTTP_200_OK
)
def listar_proveedores(session: SessionDep, skip: int = Query(0, ge=0), limit: int = Query(10, le=50)):
    return services.obtener_todos(session, skip, limit)

@router.get(
    "/{id}", response_model=schemas.ProveedorRead, status_code=status.HTTP_200_OK
)
def detalle_proveedor(session: SessionDep, id: int = Path(..., gt=0)):
    return services.obtener_por_id(session, id)

@router.put(
    "/{id}", response_model=schemas.ProveedorRead, status_code=status.HTTP_200_OK
)
def actualizar_proveedor(session: SessionDep, proveedor: schemas.ProveedorUpdate, id: int = Path(..., gt=0)):
    return services.actualizar(session, id, proveedor)

@router.put(
    "/{id}/desactivar", response_model=schemas.ProveedorRead, status_code=status.HTTP_200_OK
)
def desactivar_proveedor(session: SessionDep, id: int = Path(..., gt=0)):
    return services.desactivar(session, id)