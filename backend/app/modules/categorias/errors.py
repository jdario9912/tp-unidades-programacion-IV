from app.modules.errors import ConflictError, NotFoundError


class CategoriaNoEncontrada(NotFoundError):
    def __init__(self, id: int):
        super().__init__(f"No se encontró una categoría con el id {id}")


class NombreDuplicado(ConflictError):
    def __init__(self, nombre: str):
        super().__init__(f"Ya existe una categoría con el nombre '{nombre}'")
