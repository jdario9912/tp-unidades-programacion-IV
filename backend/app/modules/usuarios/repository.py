from typing import Optional, Sequence

from sqlmodel import Session, select

from app.core.base_repository import BaseRepository
from .models import Usuario


class UsuarioRepository(BaseRepository[Usuario]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Usuario)

    def get_by_username(self, username: str) -> Optional[Usuario]:
        statement = select(Usuario).where(Usuario.username == username.strip().lower())
        return self.session.exec(statement).first()

    def get_by_email(self, email: str) -> Optional[Usuario]:
        statement = select(Usuario).where(Usuario.email == email.strip().lower())
        return self.session.exec(statement).first()

    def listar(self) -> Sequence[Usuario]:
        return self.session.exec(select(Usuario).order_by(Usuario.id)).all()
