from src.modules.errors import ConflictError, NotFoundError

class CodigoCategoriaDuplicadoError(ConflictError):
    def __init__(self, codigo: str):
        self.codigo = codigo
        super().__init__(f"Ya existe otra categoría con el código '{codigo}'")


class CategoriaYaInactivaError(ConflictError):
    def __init__(self, id: int):
        self.id = id
        super().__init__(f"La categoría {id} ya está desactivada")


class CategoriaNoEncontradaError(NotFoundError):
    def __init__(self, id: int):
        self.id = id
        super().__init__(f"No se encontró una categoría con el id {id}")