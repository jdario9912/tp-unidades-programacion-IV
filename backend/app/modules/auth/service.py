from app.core.security import create_access_token, hash_password, verify_password
from app.modules.usuarios.errors import UsuarioDuplicado
from app.modules.usuarios.models import Rol, Usuario
from app.modules.usuarios.schemas import UserCreate, UserPublic
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork
from .errors import CredencialesInvalidas, CuentaDesactivada


class AuthService:
    def __init__(self, uow: UsuarioUnitOfWork) -> None:
        self.uow = uow

    def registrar(self, data: UserCreate) -> UserPublic:
        """El registro público siempre crea usuarios con rol user."""
        with self.uow as uow:
            if uow.usuarios.get_by_username(data.username):
                raise UsuarioDuplicado("username", data.username)
            if uow.usuarios.get_by_email(data.email):
                raise UsuarioDuplicado("email", data.email)

            usuario = Usuario(
                **data.model_dump(exclude={"password"}),
                hashed_password=hash_password(data.password),
                role=Rol.USER,
            )
            uow.usuarios.add(usuario)
            return UserPublic.model_validate(usuario)

    def autenticar(self, username: str, password: str) -> str:
        with self.uow as uow:
            usuario = uow.usuarios.get_by_username(username)
            # La contraseña se valida antes que el estado para no revelar si el usuario existe.
            if not usuario or not verify_password(password, usuario.hashed_password):
                raise CredencialesInvalidas()

            if usuario.disabled:
                raise CuentaDesactivada()

            return create_access_token(usuario.id)
