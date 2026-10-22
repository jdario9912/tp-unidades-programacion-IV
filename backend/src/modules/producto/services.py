from typing import List, Optional

from sqlmodel import Session

from .errors import (
    CategoriaNoEncontradaError,
    ProductoDuplicadoError,
    ProductoNoEncontradoError,
    ProductoYaInactivoError,
)
from .models import Producto
from .schemas import ProductoCreate, ProductoRead, ProductoReadConCategorias
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

    def asignar_categoria(self, producto_id: int, categoria_id: int) -> ProductoReadConCategorias:
        with ProductoUnitOfWork(self._session) as uow:
            producto = uow.productos.get_by_id_con_categorias(producto_id)
            if not producto:
                raise ProductoNoEncontradoError(producto_id)

            categoria = uow.categorias.get_by_id(categoria_id)
            if not categoria:
                raise CategoriaNoEncontradaError(categoria_id)

            if categoria not in producto.categorias:
                producto.categorias.append(categoria)
                producto = uow.productos.add(producto)

            resultado = ProductoReadConCategorias.model_validate(producto)
        return resultado

    def quitar_categoria(self, producto_id: int, categoria_id: int) -> ProductoReadConCategorias:
        with ProductoUnitOfWork(self._session) as uow:
            producto = uow.productos.get_by_id_con_categorias(producto_id)
            if not producto:
                raise ProductoNoEncontradoError(producto_id)

            categoria = uow.categorias.get_by_id(categoria_id)
            if not categoria:
                raise CategoriaNoEncontradaError(categoria_id)

            if categoria in producto.categorias:
                producto.categorias.remove(categoria)
                producto = uow.productos.add(producto)

            resultado = ProductoReadConCategorias.model_validate(producto)
        return resultado
