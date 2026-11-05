from src.modules.errors import BadRequestError, ConflictError, ForbiddenError, UnauthorizedError

class CredencialesInvalidasError(UnauthorizedError):
    def __init__(self):
        super().__init__("Email o contraseña incorrectos")

class NoAutenticadoError(UnauthorizedError):
    def __init__(self):
        super().__init__("No autenticado o sesión vencida")

class CuentaDesactivadaError(BadRequestError):
    def __init__(self):
        super().__init__("Cuenta de usuario desactivada")

class PermisoDenegadoError(ForbiddenError):
    def __init__(self):
        super().__init__("No tenés permisos para realizar esta acción")

class UsuarioYaActivoError(ConflictError):
    def __init__(self, id: int):
        self.id = id
        super().__init__(f"El usuario con id {id} ya está activo")

class UsuarioYaInactivoError(ConflictError):
    def __init__(self, id: int):
        self.id = id
        super().__init__(f"El usuario con id {id} ya está desactivado")

class AutoDesactivacionError(ConflictError):
    def __init__(self):
        super().__init__("Un administrador no puede desactivar su propia cuenta")
