from sqlmodel import Session
from typing import List, Optional

from src.core.security import hash_password
from .unit_of_work import UsuarioUnitOfWork

from .errors import EmailDuplicadoError, RolNoEncontradoError, UsuarioNoEncontradoError
from .schemas import RolRead, UserCreate, UserPublic
from .models import Usuario
from .seed import ROL_POR_DEFECTO


class UsuarioService:
    def __init__(self, session: Session) -> None:
        self._session = session

    @staticmethod
    def _to_public(uow: UsuarioUnitOfWork, usuario: Usuario) -> UserPublic:
        resultado = UserPublic.model_validate(usuario)
        resultado.roles = uow.usuarios.nombres_roles_vigentes(usuario.id)
        return resultado

    def crear(self, data: UserCreate) -> UserPublic:
        with UsuarioUnitOfWork(self._session) as uow:
            if uow.usuarios.get_by_email(data.email):
                raise EmailDuplicadoError(data.email)

            rol = uow.roles.get_by_nombre(ROL_POR_DEFECTO)
            if not rol:
                raise RolNoEncontradoError(ROL_POR_DEFECTO)

            usuario = Usuario(
                **data.model_dump(exclude={"password"}),
                password_hash=hash_password(data.password),
            )
            uow.usuarios.add(usuario)
            # Lo asigna el registro: sin asignado_por y sin vencimiento.
            uow.usuarios.asignar_rol(usuario.id, rol.id)
            resultado = self._to_public(uow, usuario)
        return resultado

    def obtener_todos(self, skip: int = 0, limit: int = 10, search: Optional[str] = None) -> List[UserPublic]:
        with UsuarioUnitOfWork(self._session) as uow:
            usuarios = uow.usuarios.listar(skip, limit, search)
            return [self._to_public(uow, u) for u in usuarios]

    def obtener_por_id(self, id: int) -> UserPublic:
        with UsuarioUnitOfWork(self._session) as uow:
            usuario = uow.usuarios.get_by_id(id)
            if not usuario:
                raise UsuarioNoEncontradoError(id)

            return self._to_public(uow, usuario)

    def listar_roles(self) -> List[RolRead]:
        with UsuarioUnitOfWork(self._session) as uow:
            return [RolRead.model_validate(r) for r in uow.roles.listar()]

    def borrar(self, id: int) -> None:
        with UsuarioUnitOfWork(self._session) as uow:
            usuario = uow.usuarios.get_by_id(id)
            if not usuario:
                raise UsuarioNoEncontradoError(id)

            uow.usuarios.delete(usuario)
