from typing import Annotated, List, Optional

from fastapi import APIRouter, Depends, Path, Query, status

from src.core.database import SessionDep
from src.core.schemas import error_responses
from . import schemas, services

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])


def get_usuario_service(session: SessionDep) -> services.UsuarioService:
    return services.UsuarioService(session)


UsuarioServiceDep = Annotated[services.UsuarioService, Depends(get_usuario_service)]


@router.post(
    "/",
    response_model=schemas.UserPublic,
    status_code=status.HTTP_201_CREATED,
    summary="Registrar usuario",
    description=(
        "Crea un usuario con el rol CLIENTE. El email no puede repetirse. "
        "La contraseña se guarda hasheada y nunca se devuelve."
    ),
    responses=error_responses(409),
)
def alta_usuario(usuario: schemas.UserCreate, svc: UsuarioServiceDep):
    return svc.crear(usuario)


@router.get(
    "/",
    response_model=List[schemas.UserPublic],
    status_code=status.HTTP_200_OK,
    summary="Listar usuarios",
    description="Lista paginada de usuarios activos con sus roles vigentes.",
)
def listar_usuarios(
    svc: UsuarioServiceDep,
    skip: int = Query(0, ge=0, description="Cantidad de registros a saltear"),
    limit: int = Query(10, le=50, description="Cantidad máxima de registros a devolver"),
    search: Optional[str] = Query(None, description="Busca usuarios por nombre, apellido o email"),
):
    return svc.obtener_todos(skip, limit, search)


@router.get(
    "/roles",
    response_model=List[schemas.RolRead],
    status_code=status.HTTP_200_OK,
    summary="Listar roles",
    description="Devuelve el catálogo de roles.",
)
def listar_roles(svc: UsuarioServiceDep):
    return svc.listar_roles()


@router.get(
    "/{id}",
    response_model=schemas.UserPublic,
    status_code=status.HTTP_200_OK,
    summary="Obtener usuario",
    description="Devuelve un usuario por id. Si no existe o fue eliminado responde 404.",
    responses=error_responses(404),
)
def detalle_usuario(svc: UsuarioServiceDep, id: int = Path(..., gt=0, description="Id del usuario")):
    return svc.obtener_por_id(id)


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Eliminar usuario",
    description="Elimina lógicamente el usuario.",
    responses=error_responses(404),
)
def borrar(svc: UsuarioServiceDep, id: int = Path(..., gt=0, description="Id del usuario")):
    svc.borrar(id)
