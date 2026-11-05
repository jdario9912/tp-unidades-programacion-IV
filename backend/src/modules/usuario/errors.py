from src.modules.errors import ConflictError, NotFoundError

class EmailDuplicadoError(ConflictError):
    def __init__(self, email: str):
        self.email = email
        super().__init__(f"Ya existe un usuario con el email '{email}'")

class UsuarioNoEncontradoError(NotFoundError):
    def __init__(self, id: int):
        self.id = id
        super().__init__(f"No se encontró un usuario con el id {id}")

class RolNoEncontradoError(NotFoundError):
    def __init__(self, nombre: str):
        self.nombre = nombre
        super().__init__(f"No existe el rol '{nombre}'")
