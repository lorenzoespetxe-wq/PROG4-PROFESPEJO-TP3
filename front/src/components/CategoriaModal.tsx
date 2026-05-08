import { type Categoria } from "../types/categoria";

interface FormData {
  nombre: string;
  descripcion: string;
}

interface Props {
  isOpen: boolean;
  categoriaEditando: Categoria | null;
  formData: FormData;
  onFormChange: (field: keyof FormData, value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

const CategoriaModal = ({
  isOpen,
  categoriaEditando,
  formData,
  onFormChange,
  onClose,
  onSubmit,
}: Props) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-7 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            {categoriaEditando ? "✏️ Editar Categoría" : "➕ Nueva Categoría"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none transition-colors"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-600">
              Nombre <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => onFormChange("nombre", e.target.value)}
              placeholder="Ej: Electrónica"
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-600">
              Descripción
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => onFormChange("descripcion", e.target.value)}
              placeholder="Breve descripción de la categoría..."
              rows={3}
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition resize-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onSubmit}
            disabled={!formData.nombre.trim()}
            className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
          >
            {categoriaEditando ? "Guardar cambios" : "Crear categoría"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoriaModal;
