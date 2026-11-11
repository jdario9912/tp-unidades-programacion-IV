from typing import Optional, Sequence

from sqlmodel import Session, func, select

from app.core.base_repository import BaseRepository
from .models import Categoria


class CategoriaRepository(BaseRepository[Categoria]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Categoria)

    def get_by_nombre(self, nombre: str) -> Optional[Categoria]:
        """Incluye las dadas de baja: la baja lógica no libera el nombre."""
        statement = select(Categoria).where(func.lower(Categoria.nombre) == nombre.strip().lower())
        return self.session.exec(statement).first()

    def listar_activas(self) -> Sequence[Categoria]:
        statement = select(Categoria).where(Categoria.activo).order_by(Categoria.nombre)
        return self.session.exec(statement).all()
