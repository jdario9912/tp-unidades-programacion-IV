from datetime import datetime
from typing import List, Optional, Sequence

from sqlmodel import Session, func, or_, select

from src.core.models import utc_now
from src.core.repository import RepositoryBase
from .links import UsuarioRol
from .models import Rol, Usuario

class UsuarioRepository(RepositoryBase[Usuario]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Usuario)

    def get_by_email(self, email: str) -> Optional[Usuario]:
        """Incluye a los desactivados: el email es único entre todos los usuarios."""
        statement = select(Usuario).where(func.lower(Usuario.email) == email.strip().lower())
        return self.session.exec(statement).first()

    def get_by_id_incluyendo_inactivos(self, usuario_id: int) -> Optional[Usuario]:
        return self.session.get(Usuario, usuario_id)

    def listar_todos(
        self, skip: int = 0, limit: int = 10, search: Optional[str] = None
    ) -> Sequence[Usuario]:
        """Incluye a los usuarios desactivados."""
        statement = select(Usuario).order_by(Usuario.id)

        if search:
            texto = search.strip().lower()
            statement = statement.where(
                or_(
                    func.lower(Usuario.nombre).contains(texto),
                    func.lower(Usuario.apellido).contains(texto),
                    func.lower(Usuario.email).contains(texto),
                )
            )

        statement = statement.offset(skip).limit(limit)
        return self.session.exec(statement).all()

    def activar(self, usuario: Usuario) -> Usuario:
        usuario.deleted_at = None
        return self.add(usuario)

    def desactivar(self, usuario: Usuario) -> Usuario:
        self.delete(usuario)
        self.session.refresh(usuario)
        return usuario

    def nombres_roles_vigentes(self, usuario_id: int) -> List[str]:
        """Roles sin vencimiento o con vencimiento futuro."""
        statement = (
            select(Rol.nombre)
            .join(UsuarioRol, UsuarioRol.rol_id == Rol.id)
            .where(
                UsuarioRol.usuario_id == usuario_id,
                or_(UsuarioRol.expires_at.is_(None), UsuarioRol.expires_at > utc_now()),
            )
            .order_by(Rol.nombre)
        )
        return list(self.session.exec(statement).all())

    def asignar_rol(
        self,
        usuario_id: int,
        rol_id: int,
        asignado_por_id: Optional[int] = None,
        expires_at: Optional[datetime] = None,
    ) -> UsuarioRol:
        usuario_rol = UsuarioRol(
            usuario_id=usuario_id,
            rol_id=rol_id,
            asignado_por_id=asignado_por_id,
            expires_at=expires_at,
        )
        self.session.add(usuario_rol)
        self.session.flush()
        return usuario_rol


class RolRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def get_by_nombre(self, nombre: str) -> Optional[Rol]:
        statement = select(Rol).where(func.upper(Rol.nombre) == nombre.strip().upper())
        return self.session.exec(statement).first()

    def listar(self) -> Sequence[Rol]:
        return self.session.exec(select(Rol).order_by(Rol.id)).all()
