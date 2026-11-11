from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import create_all_tables
from app.modules.auth.router import router as auth_router
from app.modules.usuarios.router import router as usuario_router
from app.modules.categorias.router import router as categoria_router
from app.modules.productos.router import router as producto_router
from app.modules.pedidos.router import router as pedido_router
from .exceptions_handler import register_exception_handlers

API_PREFIX = "/api/v1"


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_all_tables()
    yield

tags_metadata = [
    {"name": "Autenticación", "description": "Registro, inicio y cierre de sesión con JWT en cookie HttpOnly."},
    {"name": "Usuarios", "description": "Listado, activación y desactivación de usuarios (admin)."},
    {"name": "Categorías", "description": "Consulta pública y ABM con baja lógica (admin)."},
    {"name": "Productos", "description": "Catálogo paginado con búsqueda, ABM, stock y disponibilidad (admin)."},
    {"name": "Pedidos", "description": "Creación desde el carrito, máquina de estados, cancelación y resumen."},
]

def create_app() -> FastAPI:
    app = FastAPI(
        title="API Food Store",
        description=(
            "Las bajas son lógicas: un registro dado de baja deja de aparecer en los listados "
            "y al consultarlo por id se responde **404**. Los pedidos no se borran: se cancelan.\n\n"
            "La sesión viaja en la cookie HttpOnly `access_token`, que se obtiene en "
            "`POST /api/v1/auth/token`. Las escrituras del catálogo, la gestión de pedidos "
            "y la de usuarios requieren el rol **admin**."
        ),
        version="1.0.0",
        openapi_tags=tags_metadata,
        lifespan=lifespan
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.FRONTEND_ORIGIN],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(auth_router, prefix=API_PREFIX)
    app.include_router(usuario_router, prefix=API_PREFIX)
    app.include_router(categoria_router, prefix=API_PREFIX)
    app.include_router(producto_router, prefix=API_PREFIX)
    app.include_router(pedido_router, prefix=API_PREFIX)
    register_exception_handlers(app)
    return app

app = create_app()
