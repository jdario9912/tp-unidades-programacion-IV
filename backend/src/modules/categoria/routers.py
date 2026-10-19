from typing import Annotated, List

from fastapi import APIRouter, Depends, Path, Query, status

from src.core.database import SessionDep
from . import schemas, services

router = APIRouter(prefix="/categorias", tags=["Categorías"])


def get_categoria_service(session: SessionDep) -> services.CategoriaService:
    return services.CategoriaService(session)


CategoriaServiceDep = Annotated[services.CategoriaService, Depends(get_categoria_service)]


@router.post(
    "/", response_model=schemas.CategoriaRead, status_code=status.HTTP_201_CREATED
)
def alta_categoria(categoria: schemas.CategoriaCreate, svc: CategoriaServiceDep):
    return svc.crear(categoria)


@router.get(
    "/", response_model=List[schemas.CategoriaRead], status_code=status.HTTP_200_OK
)
def listar_categorias(svc: CategoriaServiceDep, skip: int = Query(0, ge=0), limit: int = Query(10, le=50)):
    return svc.obtener_todas(skip, limit)


@router.get(
    "/{id}", response_model=schemas.CategoriaRead, status_code=status.HTTP_200_OK
)
def detalle_categoria(svc: CategoriaServiceDep, id: int = Path(..., gt=0)):
    return svc.obtener_por_id(id)


@router.put(
    "/{id}", response_model=schemas.CategoriaRead, status_code=status.HTTP_200_OK
)
def actualizar_categoria(svc: CategoriaServiceDep, categoria: schemas.CategoriaCreate, id: int = Path(..., gt=0)):
    return svc.actualizar(id, categoria)


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def borrar(svc: CategoriaServiceDep, id: int = Path(..., gt=0)):
    return svc.borrar(id)
