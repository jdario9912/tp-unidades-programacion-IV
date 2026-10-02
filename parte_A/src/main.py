from contextlib import asynccontextmanager

from fastapi import FastAPI
from src.database import crear_tablas
from src.modules.producto.routers import router as producto_router
from src.modules.categoria.routers import router as categoria_router
from src.modules.proveedor.routers import router as proveedor_router
from src.exceptions import register_exception_handlers

@asynccontextmanager
async def lifespan(app: FastAPI):
    crear_tablas()
    yield

def create_app() -> FastAPI:
    app = FastAPI(
        title="API Integradora - Unidad 1",
        description="Conceptos: Path, Query, Body, Pydantic, Errores.",
        version="1.0.0",
        lifespan=lifespan
    )
    
    app.include_router(producto_router)
    app.include_router(categoria_router)
    app.include_router(proveedor_router)
    register_exception_handlers(app)
    return app

app = create_app()
