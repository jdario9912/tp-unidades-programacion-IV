from typing import Annotated

from fastapi import APIRouter, Depends, Response, status
from fastapi.security import OAuth2PasswordRequestForm

from app.core.config import settings
from app.core.deps import COOKIE_NAME, CurrentUserDep
from app.core.schemas import error_responses
from app.modules.usuarios.schemas import UserCreate, UserPublic
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork
from .schemas import MensajeRead
from .service import AuthService

router = APIRouter(prefix="/auth", tags=["Autenticación"])


def get_auth_service() -> AuthService:
    return AuthService(UsuarioUnitOfWork())


AuthServiceDep = Annotated[AuthService, Depends(get_auth_service)]


@router.post(
    "/register",
    response_model=UserPublic,
    status_code=status.HTTP_201_CREATED,
    summary="Registrar usuario",
    description=(
        "Crea un usuario con el rol user. El username y el email no pueden repetirse. "
        "La contraseña se guarda con hash bcrypt y nunca se devuelve."
    ),
    responses=error_responses(409),
)
def registrar(usuario: UserCreate, svc: AuthServiceDep):
    return svc.registrar(usuario)


@router.post(
    "/token",
    response_model=MensajeRead,
    status_code=status.HTTP_200_OK,
    summary="Iniciar sesión",
    description=(
        "Recibe las credenciales como formulario OAuth2 (`username` y `password`). "
        f"Entrega el JWT en la cookie HttpOnly `{COOKIE_NAME}`; el cuerpo no incluye el token."
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
        secure=settings.COOKIE_SECURE,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )
    return {"message": "Login exitoso"}


@router.post(
    "/logout",
    response_model=MensajeRead,
    status_code=status.HTTP_200_OK,
    summary="Cerrar sesión",
    description="Borra la cookie de sesión en el navegador.",
)
def logout(response: Response):
    response.delete_cookie(
        key=COOKIE_NAME, path="/", httponly=True, samesite="lax", secure=settings.COOKIE_SECURE
    )
    return {"message": "Sesión cerrada"}


@router.get(
    "/me",
    response_model=UserPublic,
    status_code=status.HTTP_200_OK,
    summary="Usuario autenticado",
    description="Devuelve los datos del usuario de la sesión.",
)
def me(usuario: CurrentUserDep):
    return UserPublic.model_validate(usuario)
