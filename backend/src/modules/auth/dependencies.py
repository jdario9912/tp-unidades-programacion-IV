from typing import Annotated, Optional

from fastapi import Depends
from fastapi.security import APIKeyCookie

from src.core.database import SessionDep
from src.core.security import decodificar_access_token
from src.modules.usuario.models import Usuario
from src.modules.usuario.repository import UsuarioRepository
from src.modules.usuario.seed import ROL_ADMIN

from .errors import CuentaDesactivadaError, NoAutenticadoError, PermisoDenegadoError

COOKIE_NAME = "access_token"

# auto_error=False para responder con nuestro propio 401 en lugar del 403 por defecto.
cookie_scheme = APIKeyCookie(name=COOKIE_NAME, auto_error=False)


def get_current_user(
    session: SessionDep, token: Annotated[Optional[str], Depends(cookie_scheme)]
) -> Usuario:
    usuario_id = decodificar_access_token(token) if token else None
    if usuario_id is None:
        raise NoAutenticadoError()

    usuario = UsuarioRepository(session).get_by_id_incluyendo_inactivos(usuario_id)
    if not usuario:
        raise NoAutenticadoError()

    if usuario.deleted_at is not None:
        raise CuentaDesactivadaError()

    return usuario


CurrentUserDep = Annotated[Usuario, Depends(get_current_user)]


def require_admin(usuario: CurrentUserDep, session: SessionDep) -> Usuario:
    if ROL_ADMIN not in UsuarioRepository(session).nombres_roles_vigentes(usuario.id):
        raise PermisoDenegadoError()

    return usuario


AdminDep = Annotated[Usuario, Depends(require_admin)]
