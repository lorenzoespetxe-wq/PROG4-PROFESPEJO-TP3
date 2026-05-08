import { type Producto, type ProductoFormData } from "../types/producto";
import { type Categoria } from "../types/categoria";

interface Props {
  isOpen: boolean;
  productoEditando: Producto | null;
  formData: ProductoFormData;
  categorias: Categoria[];
  onFormChange: (field: keyof ProductoFormData, value: any) => void;
  onCategoriaToggle: (categoriaId: number) => void;
  onClose: () => void;
  onSubmit: () => void;
}

const ProductoModal = ({
  isOpen,
  productoEditando,
  formData,
  categorias,
  onFormChange,
  onCategoriaToggle,
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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-7 flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-xl font-bold text-gray-800">
            {productoEditando ? "✏️ Editar Producto" : "➕ Nuevo Producto"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-600">Nombre *</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => onFormChange("nombre", e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm"
              placeholder="Ej: Memoria RAM"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-600">Precio Base *</label>
            <input
              type="number"
              value={formData.precio_base}
              onChange={(e) => onFormChange("precio_base", e.target.value === "" ? "" : Number(e.target.value))}
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm"
              placeholder="Ej: 15000"
              min="0"
              step="0.01"
            />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-sm font-semibold text-gray-600">Descripción</label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => onFormChange("descripcion", e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm resize-none"
              rows={2}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-600">URL Imagen</label>
            <input
              type="text"
              value={formData.imagen_url}
              onChange={(e) => onFormChange("imagen_url", e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm"
              placeholder="https://ejemplo.com/img.jpg"
            />
          </div>

          <div className="flex flex-col gap-1.5 justify-center mt-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.disponible}
                onChange={(e) => onFormChange("disponible", e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm font-semibold text-gray-600">Producto Disponible</span>
            </label>
          </div>

          <div className="flex flex-col gap-2 md:col-span-2 border-t pt-3 mt-2">
            <label className="text-sm font-semibold text-gray-600">Categorías Asignadas</label>
            {categorias.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No hay categorías creadas. Crea una primero.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {categorias.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2 cursor-pointer bg-gray-50 p-2 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.categoria_ids.includes(cat.id)}
                      onChange={() => onCategoriaToggle(cat.id)}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">{cat.nombre}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t mt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onSubmit}
            disabled={!formData.nombre.trim() || formData.precio_base === "" || formData.precio_base <= 0}
            className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
          >
            {productoEditando ? "Guardar cambios" : "Crear producto"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductoModal;