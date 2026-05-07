from typing import Optional, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from app.producto.model import Producto
    from app.categoria.model import Categoria


class ProductoCategoria(SQLModel, table=True):
    __tablename__ = "producto_categoria"

    id: Optional[int] = Field(default=None, primary_key=True)
    producto_id: int = Field(foreign_key="producto.id", index=True)
    categoria_id: int = Field(foreign_key="categoria.id", index=True)

    producto: Optional["Producto"] = Relationship(back_populates="producto_categorias")
    categoria: Optional["Categoria"] = Relationship(
        back_populates="producto_categorias"
    )
