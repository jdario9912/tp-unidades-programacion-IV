from typing import Annotated, Callable, Optional

from fastapi import Depends
from fastapi.security import APIKeyCookie

from app.core.database import SessionDep
from app.core.security import decodificar_access_token
from app.modules.usuario.models import Usuario
from app.modules.usuario.repository import UsuarioRepository
from app.modules.usuario.seed import ROL_ADMIN, ROL_POR_DEFECTO

from .errors import CuentaDesactivadaError, NoAutenticadoError, PermisoDenegadoError

COOKIE_NAME = "access_token"

# auto_error=False para responder con nuestro propio 401 en lugar del 403 por defecto.
cookie_scheme = APIKeyCookie(name=COOKIE_NAME, auto_error=False)


def get_current_user(
    session: SessionDep, token: Annotated[Optional[str], Depends(cookie_scheme)]
) -> Usuario:
    """Usuario del token, esté activo o no. 401 si no hay sesión válida."""
    usuario_id = decodificar_access_token(token) if token else None
    if usuario_id is None:
        raise NoAutenticadoError()

    usuario = UsuarioRepository(session).get_by_id_incluyendo_inactivos(usuario_id)
    if not usuario:
        raise NoAutenticadoError()

    return usuario


def get_current_active_user(usuario: Annotated[Usuario, Depends(get_current_user)]) -> Usuario:
    if usuario.deleted_at is not None:
        raise CuentaDesactivadaError()

    return usuario


CurrentUserDep = Annotated[Usuario, Depends(get_current_active_user)]


def require_role(roles: list[str]) -> Callable[..., Usuario]:
    """Exige al menos uno de los roles, entre los vigentes del usuario en UsuarioRol."""

    def verificar_rol(usuario: CurrentUserDep, session: SessionDep) -> Usuario:
        vigentes = UsuarioRepository(session).nombres_roles_vigentes(usuario.id)
        if not set(roles) & set(vigentes):
            raise PermisoDenegadoError()

        return usuario

    return verificar_rol


AdminDep = Annotated[Usuario, Depends(require_role([ROL_ADMIN]))]
UserOrAdminDep = Annotated[Usuario, Depends(require_role([ROL_POR_DEFECTO, ROL_ADMIN]))]

# Para usar en `dependencies=[...]` cuando el endpoint no necesita el usuario.
requiere_sesion = Depends(get_current_active_user)
requiere_admin = Depends(require_role([ROL_ADMIN]))
