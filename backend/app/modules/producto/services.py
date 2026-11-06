from typing import List, Optional

from sqlmodel import Session

from .errors import (
    CategoriaNoEncontradaError,
    ProductoCategoriaDuplicadaError,
    ProductoCategoriaNoEncontradaError,
    ProductoIngredienteDuplicadoError,
    ProductoIngredienteNoEncontradoError,
    ProductoNoEncontradoError,
    ProductoYaInactivoError,
)
from app.modules.categoria.schemas import CategoriaRead
from app.modules.ingrediente.errors import IngredienteNoEncontradoError
from app.modules.ingrediente.schemas import IngredienteRead
from .links import ProductoCategoria, ProductoIngrediente
from .models import Producto
from .schemas import (
    CategoriaAsignadaRead,
    ProductoCategoriaCreate,
    ProductoCategoriaRead,
    ProductoCreate,
    ProductoIngredienteCreate,
    ProductoIngredienteRead,
    ProductoRead,
    ProductoReadConCategorias,
)
from .unit_of_work import ProductoUnitOfWork


class ProductoService:
    def __init__(self, session: Session) -> None:
        self._session = session

    def crear(self, data: ProductoCreate) -> ProductoReadConCategorias:
        with ProductoUnitOfWork(self._session) as uow:
            producto = Producto.model_validate(data)
            uow.productos.add(producto)
            resultado = ProductoReadConCategorias.model_validate(producto)
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

    def actualizar_total(self, id: int, data: ProductoCreate) -> ProductoReadConCategorias:
        with ProductoUnitOfWork(self._session) as uow:
            producto = uow.productos.get_by_id(id)
            if not producto:
                raise ProductoNoEncontradoError(id)

            for key, value in data.model_dump().items():
                setattr(producto, key, value)

            producto = uow.productos.add(producto)
            resultado = ProductoReadConCategorias.model_validate(producto)
        return resultado

    def deshabilitar(self, id: int) -> ProductoReadConCategorias:
        with ProductoUnitOfWork(self._session) as uow:
            producto = uow.productos.get_by_id(id)
            if not producto:
                raise ProductoNoEncontradoError(id)

            if not producto.disponible:
                raise ProductoYaInactivoError(id)

            producto.disponible = False
            producto = uow.productos.add(producto)
            resultado = ProductoReadConCategorias.model_validate(producto)
        return resultado

    def borrar(self, id: int) -> None:
        with ProductoUnitOfWork(self._session) as uow:
            producto = uow.productos.get_by_id(id)
            if not producto:
                raise ProductoNoEncontradoError(id)

            # Se quitan las asociaciones para que una categoría o un ingrediente
            # no queden vinculados a un producto eliminado.
            producto.categorias.clear()
            producto.ingredientes.clear()
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

    def asignar_ingrediente(self, producto_id: int, data: ProductoIngredienteCreate) -> ProductoIngredienteRead:
        with ProductoUnitOfWork(self._session) as uow:
            if not uow.productos.get_by_id(producto_id):
                raise ProductoNoEncontradoError(producto_id)

            if not uow.ingredientes.get_by_id(data.ingrediente_id):
                raise IngredienteNoEncontradoError(data.ingrediente_id)

            if uow.asociaciones_ingredientes.get(producto_id, data.ingrediente_id):
                raise ProductoIngredienteDuplicadoError(producto_id, data.ingrediente_id)

            link = ProductoIngrediente(producto_id=producto_id, ingrediente_id=data.ingrediente_id)
            uow.asociaciones_ingredientes.add(link)
            resultado = ProductoIngredienteRead.model_validate(link)
        return resultado

    def quitar_ingrediente(self, producto_id: int, ingrediente_id: int) -> None:
        with ProductoUnitOfWork(self._session) as uow:
            if not uow.productos.get_by_id(producto_id):
                raise ProductoNoEncontradoError(producto_id)

            if not uow.ingredientes.get_by_id(ingrediente_id):
                raise IngredienteNoEncontradoError(ingrediente_id)

            link = uow.asociaciones_ingredientes.get(producto_id, ingrediente_id)
            if not link:
                raise ProductoIngredienteNoEncontradoError(producto_id, ingrediente_id)

            uow.asociaciones_ingredientes.delete(link)

    def listar_ingredientes(self, producto_id: int) -> List[IngredienteRead]:
        with ProductoUnitOfWork(self._session) as uow:
            if not uow.productos.get_by_id(producto_id):
                raise ProductoNoEncontradoError(producto_id)

            return [
                IngredienteRead.model_validate(ingrediente)
                for ingrediente in uow.asociaciones_ingredientes.ingredientes_de_producto(producto_id)
            ]
