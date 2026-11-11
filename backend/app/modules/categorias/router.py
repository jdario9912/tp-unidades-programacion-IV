from typing import Annotated, List

from fastapi import APIRouter, Depends, Path, status

from app.core.deps import requiere_admin
from app.core.schemas import error_responses
from .schemas import CategoriaCreate, CategoriaRead, CategoriaUpdate
from .service import CategoriaService
from .unit_of_work import CategoriaUnitOfWork

# Lecturas públicas; escrituras solo para admin.
router = APIRouter(prefix="/categorias", tags=["Categorías"])


def get_categoria_service() -> CategoriaService:
    return CategoriaService(CategoriaUnitOfWork())


CategoriaServiceDep = Annotated[CategoriaService, Depends(get_categoria_service)]


@router.get(
    "",
    response_model=List[CategoriaRead],
    status_code=status.HTTP_200_OK,
    summary="Listar categorías",
    description="Lista las categorías activas.",
)
def listar_categorias(svc: CategoriaServiceDep):
    return svc.listar()


@router.get(
    "/{id}",
    response_model=CategoriaRead,
    status_code=status.HTTP_200_OK,
    summary="Obtener categoría",
    description="Devuelve una categoría activa. Si no existe o fue dada de baja responde 404.",
    responses=error_responses(404),
)
def detalle_categoria(svc: CategoriaServiceDep, id: int = Path(..., gt=0, description="Id de la categoría")):
    return svc.obtener(id)


@router.post(
    "",
    dependencies=[requiere_admin],
    response_model=CategoriaRead,
    status_code=status.HTTP_201_CREATED,
    summary="Crear categoría",
    description="Crea una categoría. El nombre es único, también frente a las dadas de baja.",
    responses=error_responses(409),
)
def crear_categoria(categoria: CategoriaCreate, svc: CategoriaServiceDep):
    return svc.crear(categoria)


@router.put(
    "/{id}",
    dependencies=[requiere_admin],
    response_model=CategoriaRead,
    status_code=status.HTTP_200_OK,
    summary="Actualizar categoría",
    description="Actualiza los campos enviados y conserva los demás.",
    responses=error_responses(404, 409),
)
def actualizar_categoria(
    categoria: CategoriaUpdate,
    svc: CategoriaServiceDep,
    id: int = Path(..., gt=0, description="Id de la categoría"),
):
    return svc.actualizar(id, categoria)


@router.delete(
    "/{id}",
    dependencies=[requiere_admin],
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Eliminar categoría",
    description=(
        "Baja lógica (`activo = false`). No libera el nombre ni oculta sus productos: "
        "para retirarla del catálogo hay que dar de baja también sus productos."
    ),
    responses=error_responses(404),
)
def eliminar_categoria(svc: CategoriaServiceDep, id: int = Path(..., gt=0, description="Id de la categoría")):
    svc.eliminar(id)
