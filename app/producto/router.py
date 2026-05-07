from fastapi import APIRouter, Depends, status
from sqlmodel import Session
from typing import List

from app.core.database import get_session
from . import schema, service

router = APIRouter(prefix="/productos", tags=["Productos"])


@router.get("/", response_model=List[schema.ProductoRead])
def listar(skip: int = 0, limit: int = 100, session: Session = Depends(get_session)):
    return service.obtener_productos(session=session, skip=skip, limit=limit)


@router.get("/{id}", response_model=schema.ProductoRead)
def detalle(id: int, session: Session = Depends(get_session)):
    return service.obtener_producto_por_id(session=session, id=id)


@router.post(
    "/", response_model=schema.ProductoRead, status_code=status.HTTP_201_CREATED
)
def crear(producto: schema.ProductoCreate, session: Session = Depends(get_session)):
    return service.crear_producto(session=session, data=producto)


@router.put("/{id}", response_model=schema.ProductoRead)
def actualizar(
    id: int,
    producto: schema.ProductoUpdate,
    session: Session = Depends(get_session),
):
    return service.actualizar_producto(session=session, id=id, data=producto)


@router.delete("/{id}")
def eliminar(id: int, session: Session = Depends(get_session)):
    return service.eliminar_producto(session=session, id=id)
