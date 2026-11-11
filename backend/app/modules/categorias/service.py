from typing import List

from .errors import CategoriaNoEncontrada, NombreDuplicado
from .models import Categoria
from .schemas import CategoriaCreate, CategoriaRead, CategoriaUpdate
from .unit_of_work import CategoriaUnitOfWork


class CategoriaService:
    def __init__(self, uow: CategoriaUnitOfWork) -> None:
        self.uow = uow

    def listar(self) -> List[CategoriaRead]:
        with self.uow as uow:
            return [CategoriaRead.model_validate(c) for c in uow.categorias.listar_activas()]

    def obtener(self, id: int) -> CategoriaRead:
        with self.uow as uow:
            return CategoriaRead.model_validate(self._obtener_activa(uow, id))

    def crear(self, data: CategoriaCreate) -> CategoriaRead:
        with self.uow as uow:
            nombre = data.nombre.strip()
            if uow.categorias.get_by_nombre(nombre):
                raise NombreDuplicado(nombre)

            categoria = Categoria(nombre=nombre, descripcion=data.descripcion)
            uow.categorias.add(categoria)
            return CategoriaRead.model_validate(categoria)

    def actualizar(self, id: int, data: CategoriaUpdate) -> CategoriaRead:
        with self.uow as uow:
            categoria = self._obtener_activa(uow, id)
            cambios = data.model_dump(exclude_unset=True)

            # nombre es obligatorio en la tabla: un null explícito se ignora.
            if cambios.get("nombre") is None:
                cambios.pop("nombre", None)
            else:
                cambios["nombre"] = cambios["nombre"].strip()
                existente = uow.categorias.get_by_nombre(cambios["nombre"])
                if existente and existente.id != categoria.id:
                    raise NombreDuplicado(cambios["nombre"])

            for key, value in cambios.items():
                setattr(categoria, key, value)

            uow.categorias.add(categoria)
            return CategoriaRead.model_validate(categoria)

    def eliminar(self, id: int) -> None:
        """Baja lógica: activo = false."""
        with self.uow as uow:
            categoria = self._obtener_activa(uow, id)
            categoria.activo = False
            uow.categorias.add(categoria)

    @staticmethod
    def _obtener_activa(uow: CategoriaUnitOfWork, id: int) -> Categoria:
        """Una categoría dada de baja se trata como inexistente."""
        categoria = uow.categorias.get_by_id(id)
        if not categoria or not categoria.activo:
            raise CategoriaNoEncontrada(id)
        return categoria
