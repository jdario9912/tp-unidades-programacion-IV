from typing import List, Optional

from .errors import CategoriaNoEncontradaError, ProductoDuplicadoError, ProductoNoEncontradoError, ProductoYaInactivoError
from .models import Producto
from .schemas import ProductoCreate, ProductoRead, ProductoReadConCategorias
from src.modules.categoria.models import Categoria
from sqlalchemy.orm import selectinload

from sqlmodel import Session, select

def _normalizar(nombre: str) -> str:
    return nombre.strip().lower()

def _nombre_existe(session: Session, nombre: str) -> bool:
    return session.exec(
        select(Producto).where(Producto.nombre == nombre)
    ).first() is not None

def crear(session: Session, data: ProductoCreate) -> ProductoRead:
    if _nombre_existe(session, data.nombre):
        raise ProductoDuplicadoError(data.nombre)

    nuevo_producto = Producto(**data.model_dump())
    session.add(nuevo_producto)
    session.commit()
    session.refresh(nuevo_producto)

    return ProductoRead(**nuevo_producto.model_dump())


def obtener_todos(session: Session, skip: int, limit: int) -> List[ProductoReadConCategorias]:
    statement = (
        select(Producto)
        .order_by(Producto.id)
        .offset(skip)
        .limit(limit)
        .options(selectinload(Producto.categorias))
    )

    return [
        ProductoReadConCategorias.model_validate(p, from_attributes=True)
        for p in session.exec(statement).all()
    ]

def obtener_por_id(session: Session, id: int) -> ProductoReadConCategorias:
    statement = select(Producto).where(Producto.id == id).options(selectinload(Producto.categorias))
    producto = session.exec(statement).first()
    if not producto:
        raise ProductoNoEncontradoError(id)
    
    return ProductoReadConCategorias.model_validate(producto, from_attributes=True)


def actualizar_total(session: Session, id: int, data: ProductoCreate) -> ProductoRead:
    statement = select(Producto).where(Producto.id == id)
    producto = session.exec(statement).first()
    if not producto:
        raise ProductoNoEncontradoError(id)

    if data.nombre != producto.nombre and _nombre_existe(session, data.nombre):
        raise ProductoDuplicadoError(data.nombre)

    for key, value in data.model_dump().items():
        setattr(producto, key, value)

    session.add(producto)
    session.commit()
    session.refresh(producto)

    return ProductoRead(**producto.model_dump())


def deshabilitar(session: Session, id: int) -> ProductoRead:
    statement = select(Producto).where(Producto.id == id)
    producto = session.exec(statement).first()
    if not producto:
        raise ProductoNoEncontradoError(id)

    if not producto.disponible:
        raise ProductoYaInactivoError(id)

    producto.disponible = False

    session.add(producto)
    session.commit()
    session.refresh(producto)

    return ProductoRead(**producto.model_dump())
    

def borrar(session: Session, id: int) -> None:
    statement = select(Producto).where(Producto.id == id)
    producto = session.exec(statement).first()
    if not producto:
        raise ProductoNoEncontradoError(id)

    session.delete(producto)
    session.commit()

def asignar_categoria(session: Session, producto_id: int, categoria_id: int) -> ProductoReadConCategorias:
    statement = (
        select(Producto)
        .where(Producto.id == producto_id)
        .options(selectinload(Producto.categorias))
    )
    producto = session.exec(statement).first()
    if not producto:
        raise ProductoNoEncontradoError(producto_id)

    statement = select(Categoria).where(Categoria.id == categoria_id)
    categoria = session.exec(statement).first()
    if not categoria:
        raise CategoriaNoEncontradaError(categoria_id)

    if categoria not in producto.categorias:
        producto.categorias.append(categoria)
        session.add(producto)
        session.commit()
        session.refresh(producto)

    return ProductoReadConCategorias.model_validate(producto, from_attributes=True)

def quitar_categoria(session: Session, producto_id: int, categoria_id: int) -> ProductoReadConCategorias:
    statement = (
        select(Producto)
        .where(Producto.id == producto_id)
        .options(selectinload(Producto.categorias))
        )
    producto = session.exec(statement).first()
    if not producto:
        raise ProductoNoEncontradoError(producto_id)

    statement = select(Categoria).where(Categoria.id == categoria_id)
    categoria = session.exec(statement).first()
    if not categoria:
        raise CategoriaNoEncontradaError(categoria_id)

    if categoria in producto.categorias:
        producto.categorias.remove(categoria)
        session.add(producto)
        session.commit()
        session.refresh(producto)

    return ProductoReadConCategorias.model_validate(producto, from_attributes=True)