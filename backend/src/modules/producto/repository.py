from typing import Optional, Sequence

from sqlalchemy.orm import selectinload
from sqlmodel import Session, func, select

from src.core.repository import RepositoryBase
from src.modules.categoria.models import Categoria
from src.modules.ingrediente.models import Ingrediente
from .links import ProductoCategoria, ProductoIngrediente
from .models import Producto


class ProductoRepository(RepositoryBase[Producto]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Producto)

    def get_by_nombre(self, nombre: str) -> Optional[Producto]:
        statement = self.activos().where(func.lower(Producto.nombre) == nombre.strip().lower())
        return self.session.exec(statement).first()

    def get_by_id_con_categorias(self, id: int) -> Optional[Producto]:
        statement = (
            self.activos()
            .where(Producto.id == id)
            .options(selectinload(Producto.categorias), selectinload(Producto.ingredientes))
        )
        return self.session.exec(statement).first()

    def listar_con_categorias(
        self, skip: int = 0, limit: int = 10, search: Optional[str] = None
    ) -> Sequence[Producto]:
        statement = (
            self.activos()
            .order_by(Producto.id)
            .options(selectinload(Producto.categorias), selectinload(Producto.ingredientes))
        )

        if search:
            statement = statement.where(func.lower(Producto.nombre).contains(search.strip().lower()))

        statement = statement.offset(skip).limit(limit)
        return self.session.exec(statement).all()


class ProductoCategoriaRepository:
    """Acceso a la tabla de asociación. PK compuesta y borrado físico."""

    def __init__(self, session: Session) -> None:
        self.session = session

    def get(self, producto_id: int, categoria_id: int) -> Optional[ProductoCategoria]:
        return self.session.get(ProductoCategoria, (producto_id, categoria_id))

    def add(self, link: ProductoCategoria) -> ProductoCategoria:
        self.session.add(link)
        self.session.flush()
        self.session.refresh(link)
        return link

    def delete(self, link: ProductoCategoria) -> None:
        self.session.delete(link)
        self.session.flush()

    def categorias_de_producto(self, producto_id: int) -> Sequence[tuple[Categoria, bool]]:
        statement = (
            select(Categoria, ProductoCategoria.es_principal)
            .join(ProductoCategoria, ProductoCategoria.categoria_id == Categoria.id)
            .where(ProductoCategoria.producto_id == producto_id, Categoria.deleted_at.is_(None))
            .order_by(Categoria.id)
        )
        return self.session.exec(statement).all()

    def productos_de_categoria(self, categoria_id: int) -> Sequence[Producto]:
        statement = (
            select(Producto)
            .join(ProductoCategoria, ProductoCategoria.producto_id == Producto.id)
            .where(ProductoCategoria.categoria_id == categoria_id, Producto.deleted_at.is_(None))
            .order_by(Producto.id)
        )
        return self.session.exec(statement).all()


class ProductoIngredienteRepository:
    """Acceso a la tabla de asociación producto-ingrediente. PK compuesta y borrado físico."""

    def __init__(self, session: Session) -> None:
        self.session = session

    def get(self, producto_id: int, ingrediente_id: int) -> Optional[ProductoIngrediente]:
        return self.session.get(ProductoIngrediente, (producto_id, ingrediente_id))

    def add(self, link: ProductoIngrediente) -> ProductoIngrediente:
        self.session.add(link)
        self.session.flush()
        self.session.refresh(link)
        return link

    def delete(self, link: ProductoIngrediente) -> None:
        self.session.delete(link)
        self.session.flush()

    def ingredientes_de_producto(self, producto_id: int) -> Sequence[Ingrediente]:
        statement = (
            select(Ingrediente)
            .join(ProductoIngrediente, ProductoIngrediente.ingrediente_id == Ingrediente.id)
            .where(ProductoIngrediente.producto_id == producto_id, Ingrediente.deleted_at.is_(None))
            .order_by(Ingrediente.id)
        )
        return self.session.exec(statement).all()
