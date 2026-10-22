from src.core.unit_of_work import UnitOfWork
from sqlmodel import Session
from src.modules.producto.repository import ProductoRepository
from .repository import FormaPagoRepository, HistorialEstadoPedidoRepository, PedidoRepository

class PedidoUnitOfWork(UnitOfWork):
    def __init__(self, session: Session) -> None:
        super().__init__(session)
        self.pedidos = PedidoRepository(session)
        self.productos = ProductoRepository(session)
        self.formas_pago = FormaPagoRepository(session)
        self.historial = HistorialEstadoPedidoRepository(session)
