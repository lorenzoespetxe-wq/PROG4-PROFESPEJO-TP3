from sqlmodel import Session, select, delete
from fastapi import HTTPException, status
from typing import List

from .model import Producto
from .schema import ProductoCreate, ProductoUpdate

from app.producto_categoria.model import ProductoCategoria
from app.categoria.model import Categoria


def crear_producto(session: Session, data: ProductoCreate) -> Producto:
    # 1. Separar los datos propios del producto de la lista de IDs de categorías
    producto_data = data.model_dump(exclude={"categoria_ids"})

    # Instanciar el modelo SQLModel del producto
    db_producto = Producto(**producto_data)

    # Añadir a la sesión
    session.add(db_producto)

    # IMPORTANTE: Se utiliza flush() en lugar de commit().
    # flush() envía la sentencia INSERT a la base de datos para que genere
    # el ID autoincremental (PK), pero mantiene la transacción abierta.
    # Si ocurre un error en el paso 2, no se guardará el producto incompleto.
    session.flush()

    # 2. Generar las relaciones en la tabla intermedia
    if data.categoria_ids:
        for cat_id in data.categoria_ids:
            # Validar que la categoría exista para mantener la integridad referencial
            categoria_db = session.get(Categoria, cat_id)
            if not categoria_db:
                # Al levantar una excepción aquí antes del commit(), SQLAlchemy
                # hará un rollback automático, deshaciendo el INSERT del producto.
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Categoría con id {cat_id} no encontrada",
                )

            # Instanciar el objeto de la tabla intermedia con ambas PKs
            nueva_relacion = ProductoCategoria(
                producto_id=db_producto.id, categoria_id=cat_id
            )
            session.add(nueva_relacion)

    # 3. Confirmar la transacción de forma definitiva
    # Guarda tanto el producto como todas sus relaciones de manera simultánea.
    session.commit()

    # Actualiza el objeto db_producto con los datos finales de la base de datos
    # (incluyendo las relaciones si estuvieran configuradas en el modelo).
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

    # 1. Actualizar los campos propios del producto
    producto_data = data.model_dump(exclude_unset=True, exclude={"categoria_ids"})
    for key, value in producto_data.items():
        setattr(producto_db, key, value)

    # 2. Actualizar las relaciones si se enviaron en el request
    # Verificamos si 'categoria_ids' fue explícitamente enviado en el cuerpo de la petición
    if "categoria_ids" in data.model_fields_set:
        # Eliminar las relaciones existentes en la tabla intermedia para este producto
        statement = delete(ProductoCategoria).where(ProductoCategoria.producto_id == id)
        session.exec(statement)

        # Crear las nuevas relaciones
        for cat_id in data.categoria_ids:
            categoria_db = session.get(Categoria, cat_id)
            if not categoria_db:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Categoría con id {cat_id} no encontrada",
                )

            nueva_relacion = ProductoCategoria(producto_id=id, categoria_id=cat_id)
            session.add(nueva_relacion)

    session.add(producto_db)
    session.commit()
    session.refresh(producto_db)

    return producto_db


def eliminar_producto(session: Session, id: int) -> dict:
    producto_db = obtener_producto_por_id(session, id)

    # 1. Eliminar las relaciones dependientes en la tabla intermedia primero
    statement = delete(ProductoCategoria).where(ProductoCategoria.producto_id == id)
    session.exec(statement)

    # 2. Ahora sí, eliminar el producto de forma segura
    session.delete(producto_db)
    session.commit()

    return {"ok": True, "mensaje": f"Producto {id} eliminado"}
