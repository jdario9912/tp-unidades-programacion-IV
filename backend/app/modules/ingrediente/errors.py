from app.modules.errors import ConflictError, NotFoundError

class IngredienteDuplicadoError(ConflictError):
    def __init__(self, nombre: str):
        self.nombre = nombre
        super().__init__(f"Ya existe otro ingrediente con el nombre '{nombre}'")

class IngredienteNoEncontradoError(NotFoundError):
    def __init__(self, id: int):
        self.id = id
        super().__init__(f"No se encontró un ingrediente con el id {id}")


class IngredienteAsociadoAProducto(ConflictError):
    def __init__(self, id: int):
        self.id = id
        super().__init__(f"El ingrediente con id {id} está asociado a un producto. No se puede eliminar")
