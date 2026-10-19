from sqlmodel import Session, func, select
from typing import List, Optional

from .unit_of_work import CategoriaUnitOfWork

from .errors import CategoriaNoEncontradaError, CategoriaDuplicadaError, CategoriaAsociadaAProducto
from .schemas import CategoriaCreate, CategoriaRead, CategoriaUpdate
from .models import Categoria


class CategoriaService:
    def __init__(self, session: Session) -> None:
        self._session = session

    def crear(self, data: CategoriaCreate) -> CategoriaRead:
        with CategoriaUnitOfWork(self._session) as uow:
            if uow.categorias.get_by_nombre(data.nombre):
                raise CategoriaDuplicadaError(data.nombre)

            categoria = Categoria.model_validate(data)
            uow.categorias.add(categoria)
            resultado = CategoriaRead.model_validate(categoria)
        return resultado

    def obtener_todas(self, skip: int = 0, limit: int = 10, search: Optional[str] = None) -> List[CategoriaRead]:
        with CategoriaUnitOfWork(self._session) as uow:
            statement = select(Categoria).order_by(Categoria.id)

            if search:
                statement = statement.where(func.lower(Categoria.nombre).contains(search.strip().lower()))

            statement = statement.offset(skip).limit(limit)
            categorias = uow.categorias.session.exec(statement).all()
            return [CategoriaRead.model_validate(c) for c in categorias]

    def obtener_por_id(self, id: int) -> CategoriaRead:
        with CategoriaUnitOfWork(self._session) as uow:
            categoria = uow.categorias.get_by_id(id)
            if not categoria:
                raise CategoriaNoEncontradaError(id)

            return CategoriaRead.model_validate(categoria)

    def actualizar(self, id: int, data: CategoriaUpdate) -> CategoriaRead:
        with CategoriaUnitOfWork(self._session) as uow:
            categoria = uow.categorias.get_by_id(id)
            if not categoria:
                raise CategoriaNoEncontradaError(id)

            data.nombre = self._normalizar(data.nombre)

            if data.nombre != categoria.nombre and self._nombre_existe(uow.categorias.session, data.nombre):
                raise CategoriaDuplicadaError(data.nombre)

            for key, value in data.model_dump().items():
                setattr(categoria, key, value)

            categoria = uow.categorias.add(categoria)
            resultado = CategoriaRead.model_validate(categoria)
        return resultado

    def borrar(self, id: int) -> CategoriaRead:
        with CategoriaUnitOfWork(self._session) as uow:
            categoria = uow.categorias.get_by_id(id)
            if not categoria:
                raise CategoriaNoEncontradaError(id)

            if categoria.productos:
                raise CategoriaAsociadaAProducto(id)

            resultado = CategoriaRead.model_validate(categoria)
            uow.categorias.delete(categoria)
        return resultado

    @staticmethod
    def _normalizar(nombre: str) -> str:
        return nombre.strip().lower()

    @staticmethod
    def _nombre_existe(session: Session, nombre: str) -> bool:
        statement = select(Categoria).where(Categoria.nombre == nombre)
        return session.exec(statement).first() is not None
