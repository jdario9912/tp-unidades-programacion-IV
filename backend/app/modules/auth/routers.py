from typing import Annotated, List, Optional

from fastapi import APIRouter, Depends, Path, Query, Response, status
from fastapi.security import OAuth2PasswordRequestForm

from app.core.config import settings
from app.core.database import SessionDep
from app.core.schemas import error_responses
from app.modules.usuario.schemas import UserCreate, UserPublic
from . import schemas, services
from .dependencies import COOKIE_NAME, AdminDep, CurrentUserDep

router = APIRouter(prefix="/api/v1/auth", tags=["Autenticación"])


def get_auth_service(session: SessionDep) -> services.AuthService:
    return services.AuthService(session)


AuthServiceDep = Annotated[services.AuthService, Depends(get_auth_service)]


@router.post(
    "/register",
    response_model=UserPublic,
    status_code=status.HTTP_201_CREATED,
    summary="Registrar usuario",
    description=(
        "Crea un usuario con el rol user. El email no puede repetirse. "
        "La contraseña se guarda con hash bcrypt y nunca se devuelve."
    ),
    responses=error_responses(409),
)
def registrar(usuario: UserCreate, svc: AuthServiceDep):
    return svc.registrar(usuario)


@router.post(
    "/token",
    response_model=schemas.MensajeRead,
    status_code=status.HTTP_200_OK,
    summary="Iniciar sesión",
    description=(
        "Recibe las credenciales como formulario OAuth2; el campo `username` lleva el email. "
        f"Entrega el JWT en la cookie HttpOnly `{COOKIE_NAME}`."
    ),
    responses=error_responses(400, 401),
)
def login(
    response: Response,
    form: Annotated[OAuth2PasswordRequestForm, Depends()],
    svc: AuthServiceDep,
):
    token = svc.autenticar(form.username, form.password)
    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        httponly=True,
        samesite="lax",
        secure=settings.cookie_secure,
        max_age=settings.access_token_expire_minutes * 60,
        path="/",
    )
    return {"detail": "Sesión iniciada"}


@router.post(
    "/logout",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Cerrar sesión",
    description="Borra la cookie de sesión en el navegador.",
)
def logout(response: Response):
    response.delete_cookie(
        key=COOKIE_NAME, path="/", httponly=True, samesite="lax", secure=settings.cookie_secure
    )


@router.get(
    "/me",
    response_model=UserPublic,
    status_code=status.HTTP_200_OK,
    summary="Usuario autenticado",
    description="Devuelve los datos del usuario de la sesión y sus roles vigentes.",
    responses=error_responses(400, 401),
)
def me(usuario: CurrentUserDep, svc: AuthServiceDep):
    return svc.obtener_perfil(usuario)


@router.get(
    "/admin/usuarios",
    response_model=List[schemas.UserAdmin],
    status_code=status.HTTP_200_OK,
    summary="Listar usuarios (admin)",
    description=(
        "Lista paginada de los usuarios activos. Con `incluir_inactivos=true` "
        "también devuelve los desactivados, con su estado."
    ),
    responses=error_responses(400, 401, 403),
)
def listar_usuarios(
    _: AdminDep,
    svc: AuthServiceDep,
    skip: int = Query(0, ge=0, description="Cantidad de registros a saltear"),
    limit: int = Query(10, le=50, description="Cantidad máxima de registros a devolver"),
    search: Optional[str] = Query(None, description="Busca usuarios por nombre, apellido o email"),
    incluir_inactivos: bool = Query(False, description="Incluye a los usuarios desactivados"),
):
    return svc.listar_usuarios(skip, limit, search, incluir_inactivos)


@router.post(
    "/admin/usuarios/{id}/activar",
    response_model=schemas.UserAdmin,
    status_code=status.HTTP_200_OK,
    summary="Activar usuario (admin)",
    description="Vuelve a nulo el deleted_at del usuario. Responde 409 si ya estaba activo.",
    responses=error_responses(400, 401, 403, 404, 409),
)
def activar_usuario(_: AdminDep, svc: AuthServiceDep, id: int = Path(..., gt=0, description="Id del usuario")):
    return svc.activar(id)


@router.post(
    "/admin/usuarios/{id}/desactivar",
    response_model=schemas.UserAdmin,
    status_code=status.HTTP_200_OK,
    summary="Desactivar usuario (admin)",
    description=(
        "Completa deleted_at con la fecha actual. El usuario ya no puede iniciar sesión "
        "ni usar rutas protegidas. Responde 409 si ya estaba desactivado o si es el propio admin."
    ),
    responses=error_responses(400, 401, 403, 404, 409),
)
def desactivar_usuario(admin: AdminDep, svc: AuthServiceDep, id: int = Path(..., gt=0, description="Id del usuario")):
    return svc.desactivar(id, admin)
