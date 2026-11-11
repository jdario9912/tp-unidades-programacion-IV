from datetime import datetime
from typing import Optional, Sequence

from sqlalchemy.orm import selectinload
from sqlmodel import Session, func, select

from app.core.base_repository import BaseRepository
from .models import ESTADO_ENTREGADO, Pedido


class PedidoRepository(BaseRepository[Pedido]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Pedido)

    def list_by_usuario(
        self,
        usuario_id: Optional[int] = None,
        skip: int = 0,
        limit: int = 20,
        estado: Optional[str] = None,
    ) -> tuple[int, Sequence[Pedido]]:
        """Sin usuario_id lista los de todos. Del más reciente al más antiguo."""
        filtros = []
        if usuario_id is not None:
            filtros.append(Pedido.usuario_id == usuario_id)
        if estado:
            filtros.append(Pedido.estado == estado)

        total = self.session.exec(select(func.count()).select_from(Pedido).where(*filtros)).one()
        statement = (
            select(Pedido)
            .where(*filtros)
            .options(selectinload(Pedido.items))
            .order_by(Pedido.created_at.desc(), Pedido.id.desc())
            .offset(skip)
            .limit(limit)
        )
        return total, self.session.exec(statement).all()

    def count_by_estado(self) -> dict[str, int]:
        statement = select(Pedido.estado, func.count(Pedido.id)).group_by(Pedido.estado)
        return {estado: cantidad for estado, cantidad in self.session.exec(statement).all()}

    def count_desde(self, desde: datetime) -> int:
        statement = select(func.count(Pedido.id)).where(Pedido.created_at >= desde)
        return self.session.exec(statement).one()

    def sum_total_entregados(self) -> float:
        statement = select(func.coalesce(func.sum(Pedido.total), 0)).where(Pedido.estado == ESTADO_ENTREGADO)
        return float(self.session.exec(statement).one())
