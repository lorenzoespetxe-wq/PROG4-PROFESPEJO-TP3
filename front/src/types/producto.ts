export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio_base: number;
  imagen_url: string[];
  disponible: boolean;
}

export interface ProductoFormData {
  nombre: string;
  descripcion: string;
  precio_base: number | "";
  imagen_url: string;
  disponible: boolean;
  categoria_ids: number[];
}