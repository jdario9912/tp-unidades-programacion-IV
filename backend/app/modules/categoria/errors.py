from app.modules.errors import ConflictError, NotFoundError

class CategoriaDuplicadaError(ConflictError):
    def __init__(self, nombre: str):
        self.nombre = nombre
        super().__init__(f"Ya existe otra categoría con el nombre '{nombre}'")

class CategoriaNoEncontradaError(NotFoundError):
    def __init__(self, id: int):
        self.id = id
        super().__init__(f"No se encontró una categoría con el id {id}")

class CategoriaAsociadaAProducto(ConflictError):
    def __init__(self, id: int):
            self.id = id
            super().__init__(f"La categoria con id {id} esta asociada a un producto. No se puede eliminar")