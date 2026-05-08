import { type Producto } from "../types/producto";
import ProductoCard from "./ProductoCard";

interface Props {
  productos: Producto[];
  onEdit: (producto: Producto) => void;
  onDelete: (id: number) => void;
}

const ProductoList = ({ productos, onEdit, onDelete }: Props) => {
  if (productos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <span className="text-5xl mb-4">📦</span>
        <p className="text-lg font-medium">No hay productos todavía</p>
        <p className="text-sm mt-1">Crea uno usando el botón de arriba</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {productos.map((prod) => (
        <ProductoCard
          key={prod.id}
          producto={prod}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ProductoList;