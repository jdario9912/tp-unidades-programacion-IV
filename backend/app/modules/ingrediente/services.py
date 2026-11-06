from sqlmodel import Session
from typing import List, Optional

from .unit_of_work import IngredienteUnitOfWork

from .errors import IngredienteNoEncontradoError, IngredienteDuplicadoError, IngredienteAsociadoAProducto
from .schemas import IngredienteCreate, IngredienteRead, IngredienteUpdate
from .models import Ingrediente


class IngredienteService:
    def __init__(self, session: Session) -> None:
        self._session = session

    def crear(self, data: IngredienteCreate) -> IngredienteRead:
        with IngredienteUnitOfWork(self._session) as uow:
            if uow.ingredientes.get_by_nombre(data.nombre):
                raise IngredienteDuplicadoError(data.nombre)

            ingrediente = Ingrediente.model_validate(data)
            uow.ingredientes.add(ingrediente)
            resultado = IngredienteRead.model_validate(ingrediente)
        return resultado

    def obtener_todos(self, skip: int = 0, limit: int = 10, search: Optional[str] = None) -> List[IngredienteRead]:
        with IngredienteUnitOfWork(self._session) as uow:
            ingredientes = uow.ingredientes.listar(skip, limit, search)
            return [IngredienteRead.model_validate(i) for i in ingredientes]

    def obtener_por_id(self, id: int) -> IngredienteRead:
        with IngredienteUnitOfWork(self._session) as uow:
            ingrediente = uow.ingredientes.get_by_id(id)
            if not ingrediente:
                raise IngredienteNoEncontradoError(id)

            return IngredienteRead.model_validate(ingrediente)

    def actualizar(self, id: int, data: IngredienteUpdate) -> IngredienteRead:
        with IngredienteUnitOfWork(self._session) as uow:
            ingrediente = uow.ingredientes.get_by_id(id)
            if not ingrediente:
                raise IngredienteNoEncontradoError(id)

            existente = uow.ingredientes.get_by_nombre(data.nombre)
            if existente and existente.id != ingrediente.id:
                raise IngredienteDuplicadoError(data.nombre)

            for key, value in data.model_dump().items():
                setattr(ingrediente, key, value)

            ingrediente = uow.ingredientes.add(ingrediente)
            resultado = IngredienteRead.model_validate(ingrediente)
        return resultado

    def borrar(self, id: int) -> None:
        with IngredienteUnitOfWork(self._session) as uow:
            ingrediente = uow.ingredientes.get_by_id(id)
            if not ingrediente:
                raise IngredienteNoEncontradoError(id)

            if any(p.deleted_at is None for p in ingrediente.productos):
                raise IngredienteAsociadoAProducto(id)

            uow.ingredientes.delete(ingrediente)
