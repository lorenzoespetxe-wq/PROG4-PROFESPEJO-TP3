from sqlmodel import Session, select
from fastapi import HTTPException, status
from typing import List

from .model import ProductoCategoria
from .schema import ProductoCategoriaCreate
from app.producto.service import obtener_producto_por_id
from app.categoria.service import obtener_categoria_por_id


def crear_producto_categoria(
    session: Session, data: ProductoCategoriaCreate
) -> ProductoCategoria:
    # Validar que existan producto y categoría
    obtener_producto_por_id(session, data.producto_id)
    obtener_categoria_por_id(session, data.categoria_id)

    # Evitar duplicados
    existing = session.exec(
        select(ProductoCategoria)
        .where(ProductoCategoria.producto_id == data.producto_id)
        .where(ProductoCategoria.categoria_id == data.categoria_id)
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="La relación producto-categoría ya existe",
        )

    db_rel = ProductoCategoria.model_validate(data)
    session.add(db_rel)
    session.commit()
    session.refresh(db_rel)
    return db_rel


def obtener_relaciones(session: Session) -> List[ProductoCategoria]:
    return session.exec(select(ProductoCategoria)).all()


def obtener_categorias_de_producto(
    session: Session, producto_id: int
) -> List[ProductoCategoria]:
    obtener_producto_por_id(session, producto_id)
    return session.exec(
        select(ProductoCategoria).where(ProductoCategoria.producto_id == producto_id)
    ).all()


def eliminar_relacion(session: Session, producto_id: int, categoria_id: int) -> dict:
    # Buscamos por la clave compuesta
    rel = session.get(ProductoCategoria, (producto_id, categoria_id))
    if not rel:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Relación no encontrada",
        )
    session.delete(rel)
    session.commit()
    return {"ok": True, "mensaje": "Relación eliminada correctamente"}
