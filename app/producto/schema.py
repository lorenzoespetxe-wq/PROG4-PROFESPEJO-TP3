from pydantic import BaseModel, Field
from typing import Optional


class ProductoBase(BaseModel):
    nombre: str = Field(..., min_length=2)
    descripcion: str = Field(..., min_length=2)
    precio_base: float = Field(..., gt=0)
    imagen_url: Optional[str] = None
    disponible: bool = True


class ProductoCreate(ProductoBase):
    pass


class ProductoUpdate(ProductoBase):
    pass


class ProductoRead(ProductoBase):
    id: int

    class Config:
        from_attributes = True
