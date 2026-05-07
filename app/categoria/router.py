from fastapi import APIRouter, Depends, status
from sqlmodel import Session
from typing import List

from app.core.database import get_session
from . import schema, service

router = APIRouter(prefix="/categorias", tags=["Categorías"])


@router.get("/", response_model=List[schema.CategoriaRead])
def listar(session: Session = Depends(get_session)):
    return service.obtener_categorias(session=session)


@router.get("/{id}", response_model=schema.CategoriaRead)
def detalle(id: int, session: Session = Depends(get_session)):
    return service.obtener_categoria_por_id(session=session, id=id)


@router.post(
    "/", response_model=schema.CategoriaRead, status_code=status.HTTP_201_CREATED
)
def crear(categoria: schema.CategoriaCreate, session: Session = Depends(get_session)):
    return service.crear_categoria(session=session, data=categoria)


@router.put("/{id}", response_model=schema.CategoriaRead)
def actualizar(
    id: int,
    categoria: schema.CategoriaUpdate,
    session: Session = Depends(get_session),
):
    return service.actualizar_categoria(session=session, id=id, data=categoria)


@router.delete("/{id}")
def eliminar(id: int, session: Session = Depends(get_session)):
    return service.eliminar_categoria(session=session, id=id)
