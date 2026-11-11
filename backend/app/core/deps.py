from typing import Annotated, Callable, Optional

from fastapi import Depends
from fastapi.security import APIKeyCookie

from app.modules.auth.errors import CuentaDesactivada, NoAutenticado, PermisoDenegado
from app.modules.usuarios.models import Rol, Usuario
from app.modules.usuarios.repository import UsuarioRepository
from .database import SessionDep
from .security import decode_access_token

COOKIE_NAME = "access_token"

# auto_error=False para responder con nuestro propio 401 en lugar del 403 por defecto.
cookie_scheme = APIKeyCookie(name=COOKIE_NAME, auto_error=False)


def get_current_user(
    session: SessionDep, token: Annotated[Optional[str], Depends(cookie_scheme)]
) -> Usuario:
    """Usuario de la cookie, esté activo o no. 401 si no hay sesión válida."""
    usuario_id = decode_access_token(token) if token else None
    if usuario_id is None:
        raise NoAutenticado()

    usuario = UsuarioRepository(session).get_by_id(usuario_id)
    if not usuario:
        raise NoAutenticado()

    return usuario


def get_current_active_user(usuario: Annotated[Usuario, Depends(get_current_user)]) -> Usuario:
    if usuario.disabled:
        raise CuentaDesactivada()

    return usuario


CurrentUserDep = Annotated[Usuario, Depends(get_current_active_user)]


def require_role(roles: list[Rol]) -> Callable[..., Usuario]:
    def verificar_rol(usuario: CurrentUserDep) -> Usuario:
        if usuario.role not in roles:
            raise PermisoDenegado()

        return usuario

    return verificar_rol


AdminDep = Annotated[Usuario, Depends(require_role([Rol.ADMIN]))]

# Para usar en `dependencies=[...]` cuando el endpoint no necesita el usuario.
requiere_sesion = Depends(get_current_active_user)
requiere_admin = Depends(require_role([Rol.ADMIN]))
