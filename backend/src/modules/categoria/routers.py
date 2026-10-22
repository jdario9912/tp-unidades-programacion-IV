from typing import Annotated, List, Optional

from fastapi import APIRouter, Depends, Path, Query, status

from src.core.database import SessionDep
from src.core.schemas import error_responses
from . import schemas, services

router = APIRouter(prefix="/categorias", tags=["Categorías"])


def get_categoria_service(session: SessionDep) -> services.CategoriaService:
    return services.CategoriaService(session)


CategoriaServiceDep = Annotated[services.CategoriaService, Depends(get_categoria_service)]


@router.post(
    "/",
    response_model=schemas.CategoriaRead,
    status_code=status.HTTP_201_CREATED,
    summary="Crear categoría",
    description="Crea una nueva categoría. El nombre no puede repetirse entre las categorías activas.",
    responses=error_responses(409),
)
def alta_categoria(categoria: schemas.CategoriaCreate, svc: CategoriaServiceDep):
    return svc.crear(categoria)


@router.get(
    "/",
    response_model=List[schemas.CategoriaRead],
    status_code=status.HTTP_200_OK,
    summary="Listar categorías",
    description="Lista paginada de categorías activas.",
)
def listar_categorias(
    svc: CategoriaServiceDep,
    skip: int = Query(0, ge=0, description="Cantidad de registros a saltear"),
    limit: int = Query(10, le=50, description="Cantidad máxima de registros a devolver"),
    search: Optional[str] = Query(None, description="Busca categorías por nombre"),
):
    return svc.obtener_todas(skip, limit, search)


@router.get(
    "/{id}",
    response_model=schemas.CategoriaRead,
    status_code=status.HTTP_200_OK,
    summary="Obtener categoría",
    description="Devuelve una categoría por id. Si no existe o fue eliminada responde 404.",
    responses=error_responses(404),
)
def detalle_categoria(svc: CategoriaServiceDep, id: int = Path(..., gt=0, description="Id de la categoría")):
    return svc.obtener_por_id(id)


@router.put(
    "/{id}",
    response_model=schemas.CategoriaRead,
    status_code=status.HTTP_200_OK,
    summary="Actualizar categoría",
    description="Reemplaza los datos de una categoría.",
    responses=error_responses(404, 409),
)
def actualizar_categoria(
    svc: CategoriaServiceDep,
    categoria: schemas.CategoriaCreate,
    id: int = Path(..., gt=0, description="Id de la categoría"),
):
    return svc.actualizar(id, categoria)


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Eliminar categoría",
    description=(
        "Elimina lógicamente la categoría (soft delete: se completa `deleted_at`). "
        "No se puede eliminar si está asociada a algún producto."
    ),
    responses=error_responses(404, 409),
)
def borrar(svc: CategoriaServiceDep, id: int = Path(..., gt=0, description="Id de la categoría")):
    svc.borrar(id)
