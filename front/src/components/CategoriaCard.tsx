import { type Categoria } from "../types/categoria";

interface Props {
  categoria: Categoria;
  onEdit: (categoria: Categoria) => void;
  onDelete: (id: number) => void;
}

const CategoriaCard = ({ categoria, onEdit, onDelete }: Props) => {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 flex flex-col gap-3 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">
            #{categoria.id}
          </span>
          <h2 className="text-gray-800 text-lg font-bold leading-tight mt-0.5">
            {categoria.nombre}
          </h2>
        </div>
      </div>

      <p className="text-gray-500 text-sm leading-relaxed flex-1">
        {categoria.descripcion || (
          <span className="italic text-gray-300">Sin descripción</span>
        )}
      </p>

      <div className="flex gap-2 pt-1">
        <button
          onClick={() => onEdit(categoria)}
          className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-medium py-2 rounded-lg transition-colors"
        >
          ✏️ Editar
        </button>
        <button
          onClick={() => onDelete(categoria.id)}
          className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium py-2 rounded-lg transition-colors"
        >
          🗑️ Eliminar
        </button>
      </div>
    </div>
  );
};

export default CategoriaCard;
