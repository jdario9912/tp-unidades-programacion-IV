from .models import Pedido
from src.core.repository import RepositoryBase
from sqlmodel import Session

class PedidoRepository(RepositoryBase[Pedido]):
    def __init__(self, session: Session) -> None:
            super().__init__(session, Pedido)