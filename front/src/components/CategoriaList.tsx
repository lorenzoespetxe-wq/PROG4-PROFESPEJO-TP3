import { type Categoria } from "../types/categoria";
import CategoriaCard from "./CategoriaCard";

interface Props {
  categorias: Categoria[];
  onEdit: (categoria: Categoria) => void;
  onDelete: (id: number) => void;
}

const CategoriaList = ({ categorias, onEdit, onDelete }: Props) => {
  if (categorias.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <span className="text-5xl mb-4">📭</span>
        <p className="text-lg font-medium">No hay categorías todavía</p>
        <p className="text-sm mt-1">Creá una usando el botón de arriba</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {categorias.map((cat) => (
        <CategoriaCard
          key={cat.id}
          categoria={cat}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default CategoriaList;
