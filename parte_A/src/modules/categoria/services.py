from sqlmodel import Session, select
from typing import List, Optional

from src.modules import categoria

from .errors import CategoriaNoEncontradaError, CategoriaNoEncontradaError, CategoriaDuplicadaError
from .schemas import CategoriaCreate, CategoriaRead
from .models import Categoria

def _normalizar(nombre: str) -> str:
    return nombre.strip().lower()

def _nombre_existe(session: Session, nombre: str) -> bool:
    statement = select(Categoria).where(Categoria.nombre == nombre)
    return session.exec(statement).first() is not None

def crear(session: Session, data: CategoriaCreate) -> CategoriaRead:
    data.nombre = _normalizar(data.nombre)

    if _nombre_existe(session, data.nombre):
        raise CategoriaDuplicadaError(data.nombre)

    nueva_categoria = Categoria(**data.model_dump())
    session.add(nueva_categoria)
    session.commit()
    session.refresh(nueva_categoria)

    return CategoriaRead(**nueva_categoria.model_dump())


def obtener_todas(session: Session, skip: int = 0, limit: int = 10) -> List[CategoriaRead]:
    statement = (
        select(Categoria)
        .order_by(Categoria.id)
        .offset(skip)
        .limit(limit)
    )
    return [CategoriaRead(**c.model_dump()) for c in session.exec(statement).all()]


def obtener_por_id(session: Session, id: int) -> CategoriaRead:
    statement = select(Categoria).where(Categoria.id == id)
    categoria = session.exec(statement).first()
    if not categoria:
        raise CategoriaNoEncontradaError(id)
    
    return CategoriaRead(**categoria.model_dump())


def actualizar(session: Session, id: int, data: CategoriaCreate) -> CategoriaRead:
    statement = select(Categoria).where(Categoria.id == id)
    categoria = session.exec(statement).first()
    if not categoria:
        raise CategoriaNoEncontradaError(id)

    data.nombre = _normalizar(data.nombre)

    if data.nombre != categoria.nombre and _nombre_existe(session, data.nombre):
        raise CategoriaDuplicadaError(data.nombre)

    for key, value in data.model_dump().items():
        setattr(categoria, key, value)

    session.add(categoria)
    session.commit()
    session.refresh(categoria)

    return CategoriaRead(**categoria.model_dump())


def borrar(session: Session, id: int) -> CategoriaRead:
    statement = select(Categoria).where(Categoria.id == id)
    categoria = session.exec(statement).first()
    if not categoria:
        raise CategoriaNoEncontradaError(id)

    session.delete(categoria)
    session.commit()

    return CategoriaRead(**categoria.model_dump())
