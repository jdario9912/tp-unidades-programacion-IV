from typing import Optional

from app.modules.categorias.errors import CategoriaNoEncontrada
from .errors import ProductoNoEncontrado
from .models import Producto
from .schemas import (
    ProductoCreate,
    ProductoRead,
    ProductosPaginados,
    ProductoStockUpdate,
    ProductoUpdate,
)
from .unit_of_work import ProductoUnitOfWork


class ProductoService:
    def __init__(self, uow: ProductoUnitOfWork) -> None:
        self.uow = uow

    def listar(
        self,
        skip: int = 0,
        limit: int = 20,
        search: Optional[str] = None,
        categoria_id: Optional[int] = None,
        disponible: Optional[bool] = None,
    ) -> ProductosPaginados:
        with self.uow as uow:
            total, productos = uow.productos.search(skip, limit, search, categoria_id, disponible)
            return ProductosPaginados(
                total=total, items=[ProductoRead.model_validate(p) for p in productos]
            )

    def obtener(self, id: int) -> ProductoRead:
        with self.uow as uow:
            return ProductoRead.model_validate(self._obtener_activo(uow, id))

    def crear(self, data: ProductoCreate) -> ProductoRead:
        with self.uow as uow:
            self._validar_categoria(uow, data.categoria_id)

            producto = Producto.model_validate(data)
            uow.productos.add(producto)
            return ProductoRead.model_validate(producto)

    def actualizar(self, id: int, data: ProductoUpdate) -> ProductoRead:
        with self.uow as uow:
            producto = self._obtener_activo(uow, id)
            # Los campos obligatorios no aceptan null: un null explícito se ignora.
            cambios = data.model_dump(exclude_unset=True, exclude_none=True)

            if "categoria_id" in cambios:
                self._validar_categoria(uow, cambios["categoria_id"])

            for key, value in cambios.items():
                setattr(producto, key, value)

            uow.productos.add(producto)
            return ProductoRead.model_validate(producto)

    def actualizar_stock(self, id: int, data: ProductoStockUpdate) -> ProductoRead:
        with self.uow as uow:
            producto = self._obtener_activo(uow, id)

            for key, value in data.model_dump(exclude_unset=True, exclude_none=True).items():
                setattr(producto, key, value)

            uow.productos.add(producto)
            return ProductoRead.model_validate(producto)

    def eliminar(self, id: int) -> None:
        """Baja lógica: activo = false."""
        with self.uow as uow:
            producto = self._obtener_activo(uow, id)
            producto.activo = False
            uow.productos.add(producto)

    @staticmethod
    def _obtener_activo(uow: ProductoUnitOfWork, id: int) -> Producto:
        """Un producto dado de baja se trata como inexistente."""
        producto = uow.productos.get_by_id(id)
        if not producto or not producto.activo:
            raise ProductoNoEncontrado(id)
        return producto

    @staticmethod
    def _validar_categoria(uow: ProductoUnitOfWork, categoria_id: int) -> None:
        categoria = uow.categorias.get_by_id(categoria_id)
        if not categoria or not categoria.activo:
            raise CategoriaNoEncontrada(categoria_id)
