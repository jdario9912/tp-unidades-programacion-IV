from sqlmodel import Session

from .models import EstadoPedido

ESTADOS = [
    ("PENDIENTE", "Pendiente", 1, False),
    ("CONFIRMADO", "Confirmado", 2, False),
    ("EN_PREP", "En preparación", 3, False),
    ("EN_CAMINO", "En camino", 4, False),
    ("ENTREGADO", "Entregado", 5, True),
    ("CANCELADO", "Cancelado", 6, True),
]


def cargar_estados(session: Session) -> None:
    """Inserta los estados que falten. Es idempotente."""
    for codigo, descripcion, orden, es_terminal in ESTADOS:
        if session.get(EstadoPedido, codigo) is None:
            session.add(EstadoPedido(codigo=codigo, descripcion=descripcion, orden=orden, es_terminal=es_terminal))
    session.commit()
