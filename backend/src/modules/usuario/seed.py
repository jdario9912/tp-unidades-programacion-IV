from sqlmodel import Session, select

from .models import Rol

ROL_POR_DEFECTO = "CLIENTE"

ROLES = [
    ("ADMIN", "Administrador del sistema"),
    ("CLIENTE", "Cliente de la tienda"),
]


def cargar_roles(session: Session) -> None:
    """Inserta los roles que falten. Es idempotente."""
    for nombre, descripcion in ROLES:
        if session.exec(select(Rol).where(Rol.nombre == nombre)).first() is None:
            session.add(Rol(nombre=nombre, descripcion=descripcion))
    session.commit()
