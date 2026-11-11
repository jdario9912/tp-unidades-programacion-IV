from typing import Self

from app.core.unit_of_work import UnitOfWork
from app.modules.productos.repository import ProductoRepository
from .repository import PedidoRepository


class PedidoUnitOfWork(UnitOfWork):
    """Pedidos y productos sobre la misma sesión: el stock cambia en la misma transacción."""

    def __enter__(self) -> Self:
        super().__enter__()
        self.pedidos = PedidoRepository(self.session)
        self.productos = ProductoRepository(self.session)
        return self
