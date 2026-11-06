from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session

from app.core.config import settings
from app.core.database import crear_tablas, engine
from app.modules.producto.routers import router as producto_router
from app.modules.categoria.routers import router as categoria_router
from app.modules.ingrediente.routers import router as ingrediente_router
from app.modules.pedido.routers import router as pedido_router
from app.modules.catalogos.routers import router as catalogo_router
from app.modules.auth.routers import router as auth_router
from app.seed import cargar_datos_iniciales
from .exceptions_handler import register_exception_handlers

@asynccontextmanager
async def lifespan(app: FastAPI):
    crear_tablas()
    with Session(engine) as session:
        cargar_datos_iniciales(session)
    yield

tags_metadata = [
    {"name": "Productos", "description": "Alta, baja, modificación y consulta de productos y sus categorías."},
    {"name": "Categorías", "description": "Alta, baja, modificación y consulta de categorías."},
    {"name": "Ingredientes", "description": "Alta, baja, modificación y consulta de ingredientes."},
    {"name": "Catálogos", "description": "Estados de pedido, formas de pago y roles. Solo lectura: se cargan con el seed."},
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
            "consultarlo por id se responde **404**.\n\n"
            "Todas las rutas, salvo el registro y el inicio de sesión, requieren una sesión activa "
            "(cookie `access_token`, que se obtiene en `POST /api/v1/auth/token`). "
            "Las escrituras sobre categorías, productos e ingredientes requieren el rol **admin**."
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
