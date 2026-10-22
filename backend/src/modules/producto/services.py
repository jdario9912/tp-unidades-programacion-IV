from typing import List, Optional

from sqlmodel import Session

from .errors import (
    CategoriaNoEncontradaError,
    ProductoCategoriaDuplicadaError,
    ProductoCategoriaNoEncontradaError,
    ProductoDuplicadoError,
    ProductoNoEncontradoError,
    ProductoYaInactivoError,
)
from src.modules.categoria.schemas import CategoriaRead
from .links import ProductoCategoria
from .models import Producto
from .schemas import (
    CategoriaAsignadaRead,
    ProductoCategoriaCreate,
    ProductoCategoriaRead,
    ProductoCreate,
    ProductoRead,
    ProductoReadConCategorias,
)
from .unit_of_work import ProductoUnitOfWork


class ProductoService:
    def __init__(self, session: Session) -> None:
        self._session = session

    def crear(self, data: ProductoCreate) -> ProductoRead:
        with ProductoUnitOfWork(self._session) as uow:
            if uow.productos.get_by_nombre(data.nombre):
                raise ProductoDuplicadoError(data.nombre)

            producto = Producto.model_validate(data)
            uow.productos.add(producto)
            resultado = ProductoRead.model_validate(producto)
        return resultado

    def obtener_todos(
        self, skip: int = 0, limit: int = 10, search: Optional[str] = None
    ) -> List[ProductoReadConCategorias]:
        with ProductoUnitOfWork(self._session) as uow:
            productos = uow.productos.listar_con_categorias(skip, limit, search)
            return [ProductoReadConCategorias.model_validate(p) for p in productos]

    def obtener_por_id(self, id: int) -> ProductoReadConCategorias:
        with ProductoUnitOfWork(self._session) as uow:
            producto = uow.productos.get_by_id_con_categorias(id)
            if not producto:
                raise ProductoNoEncontradoError(id)

            return ProductoReadConCategorias.model_validate(producto)

    def actualizar_total(self, id: int, data: ProductoCreate) -> ProductoRead:
        with ProductoUnitOfWork(self._session) as uow:
            producto = uow.productos.get_by_id(id)
            if not producto:
                raise ProductoNoEncontradoError(id)

            for key, value in data.model_dump().items():
                setattr(producto, key, value)

            producto = uow.productos.add(producto)
            resultado = ProductoRead.model_validate(producto)
        return resultado

    def deshabilitar(self, id: int) -> ProductoRead:
        with ProductoUnitOfWork(self._session) as uow:
            producto = uow.productos.get_by_id(id)
            if not producto:
                raise ProductoNoEncontradoError(id)

            if not producto.disponible:
                raise ProductoYaInactivoError(id)

            producto.disponible = False
            producto = uow.productos.add(producto)
            resultado = ProductoRead.model_validate(producto)
        return resultado

    def borrar(self, id: int) -> None:
        with ProductoUnitOfWork(self._session) as uow:
            producto = uow.productos.get_by_id(id)
            if not producto:
                raise ProductoNoEncontradoError(id)

            # Se quitan las asociaciones para que una categoría no quede
            # vinculada a un producto eliminado.
            producto.categorias.clear()
            uow.productos.delete(producto)

    def asignar_categoria(self, producto_id: int, data: ProductoCategoriaCreate) -> ProductoCategoriaRead:
        with ProductoUnitOfWork(self._session) as uow:
            if not uow.productos.get_by_id(producto_id):
                raise ProductoNoEncontradoError(producto_id)

            if not uow.categorias.get_by_id(data.categoria_id):
                raise CategoriaNoEncontradaError(data.categoria_id)

            if uow.asociaciones.get(producto_id, data.categoria_id):
                raise ProductoCategoriaDuplicadaError(producto_id, data.categoria_id)

            link = ProductoCategoria(
                producto_id=producto_id,
                categoria_id=data.categoria_id,
                es_principal=data.es_principal,
            )
            uow.asociaciones.add(link)
            resultado = ProductoCategoriaRead.model_validate(link)
        return resultado

    def quitar_categoria(self, producto_id: int, categoria_id: int) -> None:
        with ProductoUnitOfWork(self._session) as uow:
            if not uow.productos.get_by_id(producto_id):
                raise ProductoNoEncontradoError(producto_id)

            if not uow.categorias.get_by_id(categoria_id):
                raise CategoriaNoEncontradaError(categoria_id)

            link = uow.asociaciones.get(producto_id, categoria_id)
            if not link:
                raise ProductoCategoriaNoEncontradaError(producto_id, categoria_id)

            uow.asociaciones.delete(link)

    def listar_categorias(self, producto_id: int) -> List[CategoriaAsignadaRead]:
        with ProductoUnitOfWork(self._session) as uow:
            if not uow.productos.get_by_id(producto_id):
                raise ProductoNoEncontradoError(producto_id)

            return [
                CategoriaAsignadaRead(
                    **CategoriaRead.model_validate(categoria).model_dump(),
                    es_principal=es_principal,
                )
                for categoria, es_principal in uow.asociaciones.categorias_de_producto(producto_id)
            ]
