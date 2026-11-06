"""
Carga los datos iniciales: catálogos (estados de pedido y formas de pago),
roles (admin y user) y el primer administrador. Es idempotente.

Se ejecuta al iniciar la API y también se puede correr solo:

    python -m app.seed
"""

from sqlmodel import Session

from app.core.database import crear_tablas, engine
from app.modules.catalogos.seed import cargar_catalogos
from app.modules.usuario.seed import cargar_admin, cargar_roles


def cargar_datos_iniciales(session: Session) -> None:
    cargar_catalogos(session)
    cargar_roles(session)
    cargar_admin(session)


if __name__ == "__main__":
    crear_tablas()
    with Session(engine) as session:
        cargar_datos_iniciales(session)
