from sqlmodel import Session, select
from fastapi import HTTPException, status
from typing import List

from .model import Producto
from .schema import ProductoCreate, ProductoUpdate


def crear_producto(session: Session, data: ProductoCreate) -> Producto:
    db_producto = Producto.model_validate(data)
    session.add(db_producto)
    session.commit()
    session.refresh(db_producto)
    return db_producto


def obtener_productos(
    session: Session, skip: int = 0, limit: int = 100
) -> List[Producto]:
    return session.exec(select(Producto).offset(skip).limit(limit)).all()


def obtener_producto_por_id(session: Session, id: int) -> Producto:
    producto = session.get(Producto, id)
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado",
        )
    return producto


def actualizar_producto(session: Session, id: int, data: ProductoUpdate) -> Producto:
    producto_db = obtener_producto_por_id(session, id)
    producto_data = data.model_dump(exclude_unset=True)
    for key, value in producto_data.items():
        setattr(producto_db, key, value)
    session.add(producto_db)
    session.commit()
    session.refresh(producto_db)
    return producto_db


def eliminar_producto(session: Session, id: int) -> dict:
    producto_db = obtener_producto_por_id(session, id)
    session.delete(producto_db)
    session.commit()
    return {"ok": True, "mensaje": f"Producto {id} eliminado"}
