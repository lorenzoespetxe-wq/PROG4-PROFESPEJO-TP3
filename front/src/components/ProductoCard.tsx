import { type Producto } from "../types/producto";

interface Props {
  producto: Producto;
  onEdit: (producto: Producto) => void;
  onDelete: (id: number) => void;
}

const ProductoCard = ({ producto, onEdit, onDelete }: Props) => {
  const precioFormateado = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
  }).format(producto.precio_base);

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 flex flex-col gap-3 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">
            #{producto.id}
          </span>
          <h2 className="text-gray-800 text-lg font-bold leading-tight mt-0.5">
            {producto.nombre}
          </h2>
        </div>
        <span className={`px-2 py-1 text-xs font-semibold rounded-md ${
          producto.disponible ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
          {producto.disponible ? "Disponible" : "No disponible"}
        </span>
      </div>

      <div className="text-xl font-black text-gray-900">
        {precioFormateado}
      </div>

      <p className="text-gray-500 text-sm leading-relaxed flex-1 line-clamp-3">
        {producto.descripcion || (
          <span className="italic text-gray-300">Sin descripción</span>
        )}
      </p>

      <div className="flex gap-2 pt-2 mt-auto">
        <button
          onClick={() => onEdit(producto)}
          className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-medium py-2 rounded-lg transition-colors"
        >
          ✏️ Editar
        </button>
        <button
          onClick={() => onDelete(producto.id)}
          className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium py-2 rounded-lg transition-colors"
        >
          🗑️ Eliminar
        </button>
      </div>
    </div>
  );
};

export default ProductoCard;