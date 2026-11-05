from src.core.unit_of_work import UnitOfWork
from sqlmodel import Session
from .repository import RolRepository, UsuarioRepository

class UsuarioUnitOfWork(UnitOfWork):
    def __init__(self, session: Session) -> None:
        super().__init__(session)
        self.usuarios = UsuarioRepository(session)
        self.roles = RolRepository(session)
