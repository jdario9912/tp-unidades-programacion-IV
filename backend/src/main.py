from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session

from src.core.config import settings
from src.core.database import crear_tablas, engine
from src.modules.producto.routers import router as producto_router
from src.modules.categoria.routers import router as categoria_router
from src.modules.ingrediente.routers import router as ingrediente_router
from src.modules.pedido.routers import router as pedido_router
from src.modules.catalogos.routers import router as catalogo_router
from src.modules.catalogos.seed import cargar_catalogos
from src.modules.auth.routers import router as auth_router
from src.modules.usuario.seed import cargar_admin, cargar_roles
from .exceptions_handler import register_exception_handlers

@asynccontextmanager
async def lifespan(app: FastAPI):
    crear_tablas()
    with Session(engine) as session:
        cargar_catalogos(session)
        cargar_roles(session)
        cargar_admin(session)
    yield

tags_metadata = [
    {"name": "Productos", "description": "Alta, baja, modificación y consulta de productos y sus categorías."},
    {"name": "Categorías", "description": "Alta, baja, modificación y consulta de categorías."},
    {"name": "Ingredientes", "description": "Alta, baja, modificación y consulta de ingredientes."},
    {"name": "Catálogos", "description": "Estados de pedido y formas de pago."},
    {"name": "Autenticación", "description": "Registro, inicio y cierre de sesión con JWT en cookie, y administración de usuarios."},
    {"name": "Pedidos", "description": "Creación, consulta, modificación, cambios de estado e historial de pedidos."},
]

def create_app() -> FastAPI:
    app = FastAPI(
        title="API Food Store",
        description=(
            "Todos los recursos registran `created_at` y `updated_at`. "
            "Las eliminaciones son lógicas (soft delete): el registro queda con "
            "`deleted_at` completo, deja de aparecer en los listados y al "
            "consultarlo por id se responde **404**."
        ),
        version="1.0.0",
        openapi_tags=tags_metadata,
        lifespan=lifespan
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    app.include_router(producto_router)
    app.include_router(categoria_router)
    app.include_router(ingrediente_router)
    app.include_router(pedido_router)
    app.include_router(catalogo_router)
    app.include_router(auth_router)
    register_exception_handlers(app)
    return app

app = create_app()
