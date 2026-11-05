from sqlmodel import Session
from typing import List, Optional

from src.core.security import crear_access_token, verify_password
from src.modules.usuario.errors import UsuarioNoEncontradoError
from src.modules.usuario.models import Usuario
from src.modules.usuario.schemas import UserCreate, UserPublic
from src.modules.usuario.services import UsuarioService
from src.modules.usuario.unit_of_work import UsuarioUnitOfWork

from .errors import (
    AutoDesactivacionError,
    CredencialesInvalidasError,
    CuentaDesactivadaError,
    UsuarioYaActivoError,
    UsuarioYaInactivoError,
)
from .schemas import UserAdmin


class AuthService:
    def __init__(self, session: Session) -> None:
        self._session = session

    @staticmethod
    def _to_admin(uow: UsuarioUnitOfWork, usuario: Usuario) -> UserAdmin:
        publico = UsuarioService._to_public(uow, usuario)
        return UserAdmin(
            **publico.model_dump(), activo=usuario.deleted_at is None, deleted_at=usuario.deleted_at
        )

    def registrar(self, data: UserCreate) -> UserPublic:
        return UsuarioService(self._session).crear(data)

    def autenticar(self, email: str, password: str) -> str:
        with UsuarioUnitOfWork(self._session) as uow:
            usuario = uow.usuarios.get_by_email(email)
            # La contraseña se valida antes que el estado para no revelar si el email existe.
            if not usuario or not verify_password(password, usuario.password_hash):
                raise CredencialesInvalidasError()

            if usuario.deleted_at is not None:
                raise CuentaDesactivadaError()

            return crear_access_token(usuario.id)

    def obtener_perfil(self, usuario: Usuario) -> UserPublic:
        with UsuarioUnitOfWork(self._session) as uow:
            return UsuarioService._to_public(uow, usuario)

    def listar_usuarios(self, skip: int = 0, limit: int = 10, search: Optional[str] = None) -> List[UserAdmin]:
        with UsuarioUnitOfWork(self._session) as uow:
            usuarios = uow.usuarios.listar_todos(skip, limit, search)
            return [self._to_admin(uow, u) for u in usuarios]

    def activar(self, id: int) -> UserAdmin:
        with UsuarioUnitOfWork(self._session) as uow:
            usuario = uow.usuarios.get_by_id_incluyendo_inactivos(id)
            if not usuario:
                raise UsuarioNoEncontradoError(id)

            if usuario.deleted_at is None:
                raise UsuarioYaActivoError(id)

            usuario = uow.usuarios.activar(usuario)
            resultado = self._to_admin(uow, usuario)
        return resultado

    def desactivar(self, id: int, admin: Usuario) -> UserAdmin:
        with UsuarioUnitOfWork(self._session) as uow:
            usuario = uow.usuarios.get_by_id_incluyendo_inactivos(id)
            if not usuario:
                raise UsuarioNoEncontradoError(id)

            if usuario.id == admin.id:
                raise AutoDesactivacionError()

            if usuario.deleted_at is not None:
                raise UsuarioYaInactivoError(id)

            usuario = uow.usuarios.desactivar(usuario)
            resultado = self._to_admin(uow, usuario)
        return resultado
