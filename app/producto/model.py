from typing import Optional, List, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import Column, JSON

if TYPE_CHECKING:
    from app.producto_categoria.model import ProductoCategoria


class Producto(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str
    descripcion: str
    precio_base: float
    imagen_url: List[str] = Field(default_factory=list, sa_column=Column(JSON))
    disponible: bool = Field(default=True)

    # Relación hacia la tabla intermedia
    producto_categorias: List["ProductoCategoria"] = Relationship(
        back_populates="producto"
    )
