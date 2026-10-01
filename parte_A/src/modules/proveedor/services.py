from typing import List, Optional
from .schemas import ProveedorCreate, ProveedorRead
from .errors import CodigoDuplicadoError, ProveedorYaInactivoError

db_proveedores: List[ProveedorRead] = []
id_counter = 1

def crear(data: ProveedorCreate) -> ProveedorRead:
    global id_counter
    nuevo = ProveedorRead(id=id_counter, **data.model_dump())
    db_proveedores.append(nuevo)
    id_counter += 1
    return nuevo

def obtener_todos(skip: int, limit: int) -> List[ProveedorRead]:
    return db_proveedores[skip : skip + limit]

def obtener_por_id(id: int) -> Optional[ProveedorRead]:
    for p in db_proveedores:
        if p.id == id:
            return p
    return None

def _normalizar(codigo: str) -> str:
    return codigo.strip().upper()


def _validar_codigo_unico(codigo: str, id_actual: int) -> None:
    nuevo = _normalizar(codigo)
    for p in db_proveedores:
        if p.id != id_actual and _normalizar(p.codigo) == nuevo:
            raise CodigoDuplicadoError(codigo)

def actualizar_total(id: int, data: ProveedorCreate) -> Optional[ProveedorRead]:
    for index, p in enumerate(db_proveedores):
        if p.id == id:
            _validar_codigo_unico(data.codigo, id)
            proveedor_actualizado = ProveedorRead(id=id, **data.model_dump())
            db_proveedores[index] = proveedor_actualizado
            return proveedor_actualizado
    return None


def desactivar(id: int) -> Optional[ProveedorRead]:
    for index, p in enumerate(db_proveedores):
        if p.id == id:
            if not p.activo:
                raise ProveedorYaInactivoError(id)  # RN-05 -> 409
            p_dict = p.model_dump()
            p_dict["activo"] = False
            proveedor_actualizado = ProveedorRead(**p_dict)
            db_proveedores[index] = proveedor_actualizado
            return proveedor_actualizado
    return None