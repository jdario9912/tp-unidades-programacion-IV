from typing import Callable, Self

from sqlmodel import Session

from .database import session_factory


class UnitOfWork:
    """
    Abre la sesión al entrar al `with` y la cierra al salir: commit si el bloque
    terminó bien, rollback si hubo una excepción. Ningún Service ni Router hace commit.

    Las subclases crean sus repositorios en `__enter__`, sobre la misma sesión.
    """

    def __init__(self, factory: Callable[[], Session] = session_factory) -> None:
        self._factory = factory

    def __enter__(self) -> Self:
        self.session = self._factory()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb) -> None:
        try:
            if exc_type is None:
                self.session.commit()
            else:
                self.session.rollback()
        finally:
            self.session.close()
