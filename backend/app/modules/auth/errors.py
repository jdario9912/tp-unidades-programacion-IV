from app.modules.errors import BadRequestError, ForbiddenError, UnauthorizedError


class CredencialesInvalidas(UnauthorizedError):
    def __init__(self):
        super().__init__("Usuario o contraseña incorrectos")


class NoAutenticado(UnauthorizedError):
    def __init__(self):
        super().__init__("No autenticado o sesión vencida")


class CuentaDesactivada(BadRequestError):
    def __init__(self):
        super().__init__("Cuenta de usuario desactivada")


class PermisoDenegado(ForbiddenError):
    def __init__(self):
        super().__init__("No tenés permisos para realizar esta acción")
