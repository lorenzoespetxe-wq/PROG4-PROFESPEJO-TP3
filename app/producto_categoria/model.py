from typing import Optional, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from app.producto.model import Producto
    from app.categoria.model import Categoria


class ProductoCategoria(SQLModel, table=True):
    __tablename__ = "producto_categoria"

    # Clave primaria compuesta por ambas FKs
    producto_id: int = Field(foreign_key="producto.id", primary_key=True, index=True)
    categoria_id: int = Field(foreign_key="categoria.id", primary_key=True, index=True)

    producto: Optional["Producto"] = Relationship(back_populates="producto_categorias")
    categoria: Optional["Categoria"] = Relationship(
        back_populates="producto_categorias"
    )
