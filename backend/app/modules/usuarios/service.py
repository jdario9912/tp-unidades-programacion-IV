from typing import List

from .errors import AutoDesactivacion, UsuarioNoEncontrado
from .models import Usuario
from .schemas import UserPublic
from .unit_of_work import UsuarioUnitOfWork


class UsuarioService:
    def __init__(self, uow: UsuarioUnitOfWork) -> None:
        self.uow = uow

    def listar(self) -> List[UserPublic]:
        with self.uow as uow:
            return [UserPublic.model_validate(u) for u in uow.usuarios.listar()]

    def activar(self, id: int) -> UserPublic:
        """Idempotente: responde el usuario aunque ya estuviera activo."""
        with self.uow as uow:
            usuario = self._obtener(uow, id)
            usuario.disabled = False
            uow.usuarios.add(usuario)
            return UserPublic.model_validate(usuario)

    def desactivar(self, id: int, admin: Usuario) -> UserPublic:
        """Idempotente: responde el usuario aunque ya estuviera desactivado."""
        with self.uow as uow:
            usuario = self._obtener(uow, id)
            if usuario.id == admin.id:
                raise AutoDesactivacion()

            usuario.disabled = True
            uow.usuarios.add(usuario)
            return UserPublic.model_validate(usuario)

    @staticmethod
    def _obtener(uow: UsuarioUnitOfWork, id: int) -> Usuario:
        usuario = uow.usuarios.get_by_id(id)
        if not usuario:
            raise UsuarioNoEncontrado(id)
        return usuario
