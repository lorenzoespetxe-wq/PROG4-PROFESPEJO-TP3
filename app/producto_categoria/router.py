from fastapi import APIRouter, Depends, status
from sqlmodel import Session
from typing import List

from app.core.database import get_session
from . import schema, service

router = APIRouter(prefix="/producto-categorias", tags=["ProductoCategorías"])


@router.get("/", response_model=List[schema.ProductoCategoriaRead])
def listar(session: Session = Depends(get_session)):
    return service.obtener_relaciones(session=session)


@router.get(
    "/producto/{producto_id}", response_model=List[schema.ProductoCategoriaRead]
)
def listar_por_producto(producto_id: int, session: Session = Depends(get_session)):
    return service.obtener_categorias_de_producto(
        session=session, producto_id=producto_id
    )
