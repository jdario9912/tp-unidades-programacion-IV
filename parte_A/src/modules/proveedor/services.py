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

    existe = _codigo_existe(session, data.codigo)
    if existe:
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
    proveedor = session.exec(
            select(Proveedor).where(Proveedor.id == id)
        ).first()
    if not proveedor:
        raise ProveedorNoEncontradoError(id)
    
    return ProveedorRead(**proveedor.model_dump())
    


def actualizar(session: Session, id: int, data: ProveedorUpdate) -> ProveedorRead:
    proveedor = session.exec(
            select(Proveedor).where(Proveedor.id == id)
        ).first()
    if not proveedor:
        raise ProveedorNoEncontradoError(id)
    
    codigo_normalizado = _normalizar(data.codigo)

    if  codigo_normalizado != proveedor.codigo:
        existe = _codigo_existe(session, codigo_normalizado)
        if existe:
            raise CodigoProveedorDuplicadoError(codigo_normalizado)
        
    data.codigo = codigo_normalizado

    proveedor.codigo = data.codigo
    proveedor.razon_social = data.razon_social
    proveedor.email = data.email
    proveedor.cuit = data.cuit
    proveedor.telefono = data.telefono
    proveedor.activo = data.activo

    session.add(proveedor)
    session.commit()
    session.refresh(proveedor)

    return ProveedorRead(**proveedor.model_dump())


def desactivar(session: Session, id: int) -> ProveedorRead:
    proveedor = session.exec(
            select(Proveedor).where(Proveedor.id == id)
        ).first()
    if not proveedor:
        raise ProveedorNoEncontradoError(id)

    if not proveedor.activo:
        raise ProveedorYaInactivoError(id)
    
    proveedor.activo = False

    session.add(proveedor)
    session.commit()
    session.refresh(proveedor)
    return ProveedorRead(**proveedor.model_dump())