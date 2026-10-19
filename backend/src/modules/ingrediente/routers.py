from typing import Annotated, List, Optional

from fastapi import APIRouter, Depends, Path, Query, status

from src.core.database import SessionDep
from . import schemas, services

router = APIRouter(prefix="/ingredientes", tags=["Ingredientes"])


def get_ingrediente_service(session: SessionDep) -> services.IngredienteService:
    return services.IngredienteService(session)

IngredienteServiceDep = Annotated[services.IngredienteService, Depends(get_ingrediente_service)]

@router.post(
        "/", response_model=schemas.IngredienteRead, status_code=status.HTTP_201_CREATED
)
def crear(ingrediente: schemas.IngredienteCreate, svc: IngredienteServiceDep):
    return svc.crear(ingrediente)

@router.get(
    "/", response_model=List[schemas.IngredienteRead], status_code=status.HTTP_200_OK
)
def listar_ingredientes(
    svc: IngredienteServiceDep,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, le=50),
    search: Optional[str] = Query(None, description="Busca ingredientes por nombre"),
):
    return svc.obtener_todos(skip, limit, search)


@router.get(
    "/{id}", response_model=schemas.IngredienteRead, status_code=status.HTTP_200_OK
)
def detalle_ingrediente(svc: IngredienteServiceDep, id: int = Path(..., gt=0)):
    return svc.obtener_por_id(id)


@router.put(
    "/{id}", response_model=schemas.IngredienteRead, status_code=status.HTTP_200_OK
)
def actualizar_ingrediente(svc: IngredienteServiceDep, ingrediente: schemas.IngredienteCreate, id: int = Path(..., gt=0)):
    return svc.actualizar(id, ingrediente)


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def borrar(svc: IngredienteServiceDep, id: int = Path(..., gt=0)):
    return svc.borrar(id)