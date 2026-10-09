from typing import List, Optional

from .errors import CodigoProductoDuplicadoError, ProductoNoEncontradoError, ProductoYaInactivoError
from .models import Producto
from .schemas import ProductoCreate, ProductoRead
from sqlmodel import Session, select

def _normalizar(categoria: str) -> str:
    return categoria.strip().upper()

def _codigo_existe(session: Session, codigo: str) -> bool:
    return session.exec(
        select(Producto).where(Producto.codigo == codigo)
    ).first() is not None

def crear(session: Session, data: ProductoCreate) -> ProductoRead:
    if _codigo_existe(session, data.codigo):
        raise CodigoProductoDuplicadoError(data.codigo)

    nuevo_producto = Producto(**data.model_dump())
    session.add(nuevo_producto)
    session.commit()
    session.refresh(nuevo_producto)

    return ProductoRead(**nuevo_producto.model_dump())


def obtener_todos(session: Session, skip: int, limit: int) -> List[ProductoRead]:
    statement = (
        select(Producto)
        .order_by(Producto.id)
        .offset(skip)
        .limit(limit)
    )

    return [ProductoRead(**p.model_dump()) for p in session.exec(statement).all()]

def obtener_por_id(session: Session, id: int) -> ProductoRead:
    statement = select(Producto).where(Producto.id == id)
    producto = session.exec(statement).first()
    if not producto:
        raise ProductoNoEncontradoError(id)
    
    return ProductoRead(**producto.model_dump())


def actualizar_total(session: Session, id: int, data: ProductoCreate) -> ProductoRead:
    statement = select(Producto).where(Producto.id == id)
    producto = session.exec(statement).first()
    if not producto:
        raise ProductoNoEncontradoError(id)

    data.categoria = _normalizar(data.categoria)

    if data.codigo != producto.codigo and _codigo_existe(session, data.codigo):
        raise CodigoProductoDuplicadoError(data.codigo)

    for key, value in data.model_dump().items():
        setattr(producto, key, value)

    session.add(producto)
    session.commit()
    session.refresh(producto)

    return ProductoRead(**producto.model_dump())


def desactivar(session: Session, id: int) -> ProductoRead:
    statement = select(Producto).where(Producto.id == id)
    producto = session.exec(statement).first()
    if not producto:
        raise ProductoNoEncontradoError(id)

    if not producto.activo:
        raise ProductoYaInactivoError(id)

    producto.activo = False

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