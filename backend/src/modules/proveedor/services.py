from typing import List, Optional

from sqlmodel import Session, select
from .schemas import ProveedorCreate, ProveedorRead, ProveedorUpdate
from .errors import CodigoProveedorDuplicadoError, ProveedorYaInactivoError, ProveedorNoEncontradoError
from .models import Proveedor

def _normalizar(codigo: str) -> str:
    return codigo.strip().upper()

def _codigo_existe(session: Session, codigo: str) -> bool:
    return session.exec(
        select(Proveedor).where(Proveedor.codigo == codigo)
    ).first() is not None

def crear(session: Session, data: ProveedorCreate) -> ProveedorRead:
    data.codigo = _normalizar(data.codigo)

    if _codigo_existe(session, data.codigo):
        raise CodigoProveedorDuplicadoError(data.codigo)
    
    nuevo_proveedor = Proveedor(**data.model_dump())
    session.add(nuevo_proveedor)
    session.commit()
    session.refresh(nuevo_proveedor)

    return ProveedorRead(**nuevo_proveedor.model_dump())

def obtener_todos(session: Session,skip: int, limit: int) -> List[ProveedorRead]:
    statement = (
        select(Proveedor)
        .order_by(Proveedor.id)
        .offset(skip)
        .limit(limit)
    )

    return [ProveedorRead(**p.model_dump()) for p in session.exec(statement).all()]

def obtener_por_id(session: Session, id: int) -> ProveedorRead:
    statement = select(Proveedor).where(Proveedor.id == id)
    proveedor = session.exec(statement).first()
    if not proveedor:
        raise ProveedorNoEncontradoError(id)
    
    return ProveedorRead(**proveedor.model_dump())
    


def actualizar(session: Session, id: int, data: ProveedorUpdate) -> ProveedorRead:
    statement = select(Proveedor).where(Proveedor.id == id)
    proveedor = session.exec(statement).first()
    if not proveedor:
        raise ProveedorNoEncontradoError(id)
    
    data.codigo = _normalizar(data.codigo)

    if  data.codigo != proveedor.codigo and _codigo_existe(session, data.codigo):
        raise CodigoProveedorDuplicadoError(data.codigo)

    for key, value in data.model_dump().items():
            setattr(proveedor, key, value)

    session.add(proveedor)
    session.commit()
    session.refresh(proveedor)

    return ProveedorRead(**proveedor.model_dump())


def desactivar(session: Session, id: int) -> ProveedorRead:
    statement = select(Proveedor).where(Proveedor.id == id)
    proveedor = session.exec(statement).first()
    if not proveedor:
        raise ProveedorNoEncontradoError(id)

    if not proveedor.activo:
        raise ProveedorYaInactivoError(id)
    
    proveedor.activo = False

    session.add(proveedor)
    session.commit()
    session.refresh(proveedor)
    return ProveedorRead(**proveedor.model_dump())