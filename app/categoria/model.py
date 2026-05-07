from typing import Optional, List, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from app.producto_categoria.model import ProductoCategoria


class Categoria(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str
    descripcion: str

    # Relación hacia la tabla intermedia
    producto_categorias: List["ProductoCategoria"] = Relationship(
        back_populates="categoria"
    )
