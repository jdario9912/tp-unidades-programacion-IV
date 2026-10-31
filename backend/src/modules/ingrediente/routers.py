from typing import Annotated, List, Optional

from fastapi import APIRouter, Depends, Path, Query, status

from src.core.database import SessionDep
from src.core.schemas import error_responses
from . import schemas, services

router = APIRouter(prefix="/ingredientes", tags=["Ingredientes"])


def get_ingrediente_service(session: SessionDep) -> services.IngredienteService:
    return services.IngredienteService(session)


IngredienteServiceDep = Annotated[services.IngredienteService, Depends(get_ingrediente_service)]


@router.post(
    "/",
    response_model=schemas.IngredienteRead,
    status_code=status.HTTP_201_CREATED,
    summary="Crear ingrediente",
    description="Crea un nuevo ingrediente. El nombre no puede repetirse.",
    responses=error_responses(409),
)
def alta_ingrediente(ingrediente: schemas.IngredienteCreate, svc: IngredienteServiceDep):
    return svc.crear(ingrediente)


@router.get(
    "/",
    response_model=List[schemas.IngredienteRead],
    status_code=status.HTTP_200_OK,
    summary="Listar ingredientes",
    description="Lista paginada de ingredientes activos.",
)
def listar_ingredientes(
    svc: IngredienteServiceDep,
    skip: int = Query(0, ge=0, description="Cantidad de registros a saltear"),
    limit: int = Query(10, le=50, description="Cantidad máxima de registros a devolver"),
    search: Optional[str] = Query(None, description="Busca ingredientes por nombre"),
):
    return svc.obtener_todos(skip, limit, search)


@router.get(
    "/{id}",
    response_model=schemas.IngredienteRead,
    status_code=status.HTTP_200_OK,
    summary="Obtener ingrediente",
    description="Devuelve un ingrediente por id. Si no existe o fue eliminado responde 404.",
    responses=error_responses(404),
)
def detalle_ingrediente(svc: IngredienteServiceDep, id: int = Path(..., gt=0, description="Id del ingrediente")):
    return svc.obtener_por_id(id)


@router.put(
    "/{id}",
    response_model=schemas.IngredienteRead,
    status_code=status.HTTP_200_OK,
    summary="Actualizar ingrediente",
    description="Reemplaza los datos de un ingrediente.",
    responses=error_responses(404, 409),
)
def actualizar_ingrediente(
    svc: IngredienteServiceDep,
    ingrediente: schemas.IngredienteCreate,
    id: int = Path(..., gt=0, description="Id del ingrediente"),
):
    return svc.actualizar(id, ingrediente)


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Eliminar ingrediente",
    description=(
        "Elimina lógicamente el ingrediente. "
        "No se puede eliminar si está asociado a algún producto."
    ),
    responses=error_responses(404, 409),
)
def borrar(svc: IngredienteServiceDep, id: int = Path(..., gt=0, description="Id del ingrediente")):
    svc.borrar(id)
