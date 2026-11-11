from typing import Annotated, List

from fastapi import APIRouter, Depends, Path, status

from app.core.deps import AdminDep, requiere_admin
from app.core.schemas import error_responses
from .schemas import UserPublic
from .service import UsuarioService
from .unit_of_work import UsuarioUnitOfWork

router = APIRouter(prefix="/admin/usuarios", tags=["Usuarios"], dependencies=[requiere_admin])


def get_usuario_service() -> UsuarioService:
    return UsuarioService(UsuarioUnitOfWork())


UsuarioServiceDep = Annotated[UsuarioService, Depends(get_usuario_service)]


@router.get(
    "",
    response_model=List[UserPublic],
    status_code=status.HTTP_200_OK,
    summary="Listar usuarios",
    description="Lista todos los usuarios, activos y desactivados.",
)
def listar_usuarios(svc: UsuarioServiceDep):
    return svc.listar()


@router.post(
    "/{id}/activar",
    response_model=UserPublic,
    status_code=status.HTTP_200_OK,
    summary="Activar usuario",
    description="Alta lógica (`disabled = false`). Responde 200 aunque ya estuviera activo.",
    responses=error_responses(404),
)
def activar_usuario(svc: UsuarioServiceDep, id: int = Path(..., gt=0, description="Id del usuario")):
    return svc.activar(id)


@router.post(
    "/{id}/desactivar",
    response_model=UserPublic,
    status_code=status.HTTP_200_OK,
    summary="Desactivar usuario",
    description=(
        "Baja lógica (`disabled = true`). El usuario ya no puede iniciar sesión ni usar rutas protegidas. "
        "Responde 200 aunque ya estuviera desactivado y 400 si el admin intenta desactivarse a sí mismo."
    ),
    responses=error_responses(400, 404),
)
def desactivar_usuario(
    admin: AdminDep, svc: UsuarioServiceDep, id: int = Path(..., gt=0, description="Id del usuario")
):
    return svc.desactivar(id, admin)
