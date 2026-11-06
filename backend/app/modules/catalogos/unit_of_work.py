from app.core.unit_of_work import UnitOfWork
from sqlmodel import Session
from app.modules.usuario.repository import RolRepository
from .repository import EstadoPedidoRepository, FormaPagoRepository

class CatalogoUnitOfWork(UnitOfWork):
    def __init__(self, session: Session) -> None:
        super().__init__(session)
        self.estados = EstadoPedidoRepository(session)
        self.formas_pago = FormaPagoRepository(session)
        self.roles = RolRepository(session)
