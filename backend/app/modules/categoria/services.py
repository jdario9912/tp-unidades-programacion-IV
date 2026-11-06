from sqlmodel import Session
from typing import List, Optional

from .unit_of_work import CategoriaUnitOfWork

from .errors import CategoriaNoEncontradaError, CategoriaDuplicadaError, CategoriaAsociadaAProducto
from .schemas import CategoriaCreate, CategoriaRead, CategoriaUpdate
from .models import Categoria
from app.modules.producto.schemas import ProductoRead


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
            categorias = uow.categorias.listar(skip, limit, search)
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

            existente = uow.categorias.get_by_nombre(data.nombre)
            if existente and existente.id != categoria.id:
                raise CategoriaDuplicadaError(data.nombre)

            for key, value in data.model_dump().items():
                setattr(categoria, key, value)

            categoria = uow.categorias.add(categoria)
            resultado = CategoriaRead.model_validate(categoria)
        return resultado

    def borrar(self, id: int) -> None:
        with CategoriaUnitOfWork(self._session) as uow:
            categoria = uow.categorias.get_by_id(id)
            if not categoria:
                raise CategoriaNoEncontradaError(id)

            if any(p.deleted_at is None for p in categoria.productos):
                raise CategoriaAsociadaAProducto(id)

            uow.categorias.delete(categoria)

    def listar_productos(self, id: int) -> List[ProductoRead]:
        with CategoriaUnitOfWork(self._session) as uow:
            if not uow.categorias.get_by_id(id):
                raise CategoriaNoEncontradaError(id)

            productos = uow.asociaciones.productos_de_categoria(id)
            return [ProductoRead.model_validate(p) for p in productos]

    @staticmethod
    def _normalizar(nombre: str) -> str:
        return nombre.strip().lower()
