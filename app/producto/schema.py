from pydantic import BaseModel, Field
from typing import Optional, List


class ProductoBase(BaseModel):
    nombre: str = Field(..., min_length=2)
    descripcion: str = Field(..., min_length=2)
    precio_base: float = Field(..., gt=0)
    imagen_url: List[str] = Field(default_factory=list)
    disponible: bool = True


class ProductoCreate(ProductoBase):
    categoria_ids: List[int] = Field(default_factory=list)


class ProductoUpdate(ProductoBase):
    categoria_ids: List[int] = Field(default_factory=list)


class ProductoRead(ProductoBase):
    id: int

    class Config:
        from_attributes = True
