from fastapi import APIRouter, HTTPException, Path, Query, status
from typing import List

from src.core.database import SessionDep
from . import schemas, services

router = APIRouter(prefix="/categorias", tags=["Categorías"])


@router.post(
    "/", response_model=schemas.CategoriaRead, status_code=status.HTTP_201_CREATED
)
def alta_categoria(session: SessionDep,categoria: schemas.CategoriaCreate):
    return services.crear(session, categoria)


@router.get(
    "/", response_model=List[schemas.CategoriaRead], status_code=status.HTTP_200_OK
)
def listar_categorias(session: SessionDep, skip: int = Query(0, ge=0), limit: int = Query(10, le=50)):
    return services.obtener_todas(session, skip, limit)


@router.get(
    "/{id}", response_model=schemas.CategoriaRead, status_code=status.HTTP_200_OK
)
def detalle_categoria(session: SessionDep, id: int = Path(..., gt=0)):
    return services.obtener_por_id(session, id)


@router.put(
    "/{id}", response_model=schemas.CategoriaRead, status_code=status.HTTP_200_OK
)
def actualizar_categoria(session: SessionDep, categoria: schemas.CategoriaCreate, id: int = Path(..., gt=0)):
    return services.actualizar(session, id, categoria)


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def borrar(session: SessionDep, id: int = Path(..., gt=0)):
    return services.borrar(session, id)
