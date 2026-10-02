from sqlmodel import Session, select
from typing import List, Optional

from src.modules import categoria

from .errors import CategoriaNoEncontradaError, CategoriaNoEncontradaError, CategoriaYaInactivaError, CodigoCategoriaDuplicadoError
from .schemas import CategoriaCreate, CategoriaRead
from .models import Categoria

def _normalizar(codigo: str) -> str:
    return codigo.strip().upper()

def _codigo_existe(session: Session, codigo: str) -> bool:
    statement = select(Categoria).where(Categoria.codigo == codigo)
    return session.exec(statement).first() is not None

def crear(session: Session, data: CategoriaCreate) -> CategoriaRead:
    data.codigo = _normalizar(data.codigo)

    if _codigo_existe(session, data.codigo):
        raise CodigoCategoriaDuplicadoError(data.codigo)

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

    data.codigo = _normalizar(data.codigo)

    if data.codigo != categoria.codigo and _codigo_existe(session, data.codigo):
        raise CodigoCategoriaDuplicadoError(data.codigo)

    for key, value in data.model_dump().items():
        setattr(categoria, key, value)

    session.add(categoria)
    session.commit()
    session.refresh(categoria)

    return CategoriaRead(**categoria.model_dump())


def desactivar(session: Session, id: int) -> CategoriaRead:
    statement = select(Categoria).where(Categoria.id == id)
    categoria = session.exec(statement).first()
    if not categoria:
        raise CategoriaNoEncontradaError(id)

    if not categoria.activo:
        raise CategoriaYaInactivaError(id)

    categoria.activo = False

    session.add(categoria)
    session.commit()
    session.refresh(categoria)

    return CategoriaRead(**categoria.model_dump())
