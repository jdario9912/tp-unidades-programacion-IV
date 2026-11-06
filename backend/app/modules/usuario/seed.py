from sqlmodel import Session, select

from app.core.config import settings
from app.core.security import hash_password
from .links import UsuarioRol
from .models import Rol, Usuario

ROL_ADMIN = "admin"
ROL_POR_DEFECTO = "user"

ROLES = [
    (ROL_ADMIN, "Administrador del sistema"),
    (ROL_POR_DEFECTO, "Usuario de la tienda"),
]


def cargar_roles(session: Session) -> None:
    """Inserta los roles que falten. Es idempotente."""
    for nombre, descripcion in ROLES:
        if session.exec(select(Rol).where(Rol.nombre == nombre)).first() is None:
            session.add(Rol(nombre=nombre, descripcion=descripcion))
    session.commit()


def cargar_admin(session: Session) -> None:
    """Crea el primer administrador con los datos de la configuración, si no existe."""
    email = settings.admin_email.strip().lower()
    if session.exec(select(Usuario).where(Usuario.email == email)).first() is not None:
        return

    rol = session.exec(select(Rol).where(Rol.nombre == ROL_ADMIN)).one()
    admin = Usuario(
        nombre="Admin",
        apellido="Sistema",
        email=email,
        password_hash=hash_password(settings.admin_password),
    )
    session.add(admin)
    session.flush()
    session.add(UsuarioRol(usuario_id=admin.id, rol_id=rol.id))
    session.commit()
