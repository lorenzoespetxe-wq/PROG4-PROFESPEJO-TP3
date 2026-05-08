from sqlmodel import Session, select
from fastapi import HTTPException, status
from typing import List

from .model import ProductoCategoria
from .schema import ProductoCategoriaCreate
from app.producto.service import obtener_producto_por_id
from app.categoria.service import obtener_categoria_por_id


def obtener_relaciones(session: Session) -> List[ProductoCategoria]:
    return session.exec(select(ProductoCategoria)).all()


def obtener_categorias_de_producto(
    session: Session, producto_id: int
) -> List[ProductoCategoria]:
    obtener_producto_por_id(session, producto_id)
    return session.exec(
        select(ProductoCategoria).where(ProductoCategoria.producto_id == producto_id)
    ).all()
