import { useState, useEffect } from "react";
import { type Categoria } from "./types/categoria";
import { type Producto, type ProductoFormData } from "./types/producto";

import Navbar from "./components/Navbar";
import CategoriaList from "./components/CategoriaList";
import CategoriaModal from "./components/CategoriaModal";
import ProductoList from "./components/ProductoList";
import ProductoModal from "./components/ProductoModal";

const API = "http://localhost:8000";

const EMPTY_CAT_FORM = { nombre: "", descripcion: "" };
const EMPTY_PROD_FORM: ProductoFormData = {
  nombre: "",
  descripcion: "",
  precio_base: "",
  imagen_url: "",
  disponible: true,
  categoria_ids: [],
};

type Tab = "categorias" | "productos";

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("categorias");

  // ── Estados Categorías ──
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loadingCat, setLoadingCat] = useState(true);
  const [errorCat, setErrorCat] = useState<string | null>(null);
  const [modalCatOpen, setModalCatOpen] = useState(false);
  const [catEditando, setCatEditando] = useState<Categoria | null>(null);
  const [catFormData, setCatFormData] = useState(EMPTY_CAT_FORM);

  // ── Estados Productos ──
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loadingProd, setLoadingProd] = useState(true);
  const [errorProd, setErrorProd] = useState<string | null>(null);
  const [modalProdOpen, setModalProdOpen] = useState(false);
  const [prodEditando, setProdEditando] = useState<Producto | null>(null);
  const [prodFormData, setProdFormData] = useState<ProductoFormData>(EMPTY_PROD_FORM);

  // ── Carga inicial de datos ──
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar categorías (necesarias para ambos tabs)
        const resCat = await fetch(`${API}/categorias/`);
        if (!resCat.ok) throw new Error("Error cargando categorías");
        const dataCat = await resCat.json();
        setCategorias(dataCat);
        setLoadingCat(false);

        // Cargar productos
        const resProd = await fetch(`${API}/productos/`);
        if (!resProd.ok) throw new Error("Error cargando productos");
        const dataProd = await resProd.json();
        setProductos(dataProd);
        setLoadingProd(false);
      } catch (err) {
        const msg = "Error de conexión con el servidor.";
        setErrorCat(msg);
        setErrorProd(msg);
        setLoadingCat(false);
        setLoadingProd(false);
      }
    };
    fetchData();
  }, []);

  // ──────────────────────────────────────────────────────────────────────────
  // ── LÓGICA CATEGORÍAS ──
  // ──────────────────────────────────────────────────────────────────────────
  const openCreateCat = () => {
    setCatEditando(null);
    setCatFormData(EMPTY_CAT_FORM);
    setModalCatOpen(true);
  };

  const openEditCat = (cat: Categoria) => {
    setCatEditando(cat);
    setCatFormData({ nombre: cat.nombre, descripcion: cat.descripcion });
    setModalCatOpen(true);
  };

  const handleCreateCat = async () => {
    try {
      const res = await fetch(`${API}/categorias/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(catFormData),
      });
      if (!res.ok) throw new Error();
      const nueva = await res.json();
      setCategorias([...categorias, nueva]);
      setModalCatOpen(false);
    } catch {
      alert("Error al crear categoría.");
    }
  };

  const handleUpdateCat = async () => {
    if (!catEditando) return;
    try {
      const res = await fetch(`${API}/categorias/${catEditando.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(catFormData),
      });
      if (!res.ok) throw new Error();
      const actualizada = await res.json();
      setCategorias(categorias.map((c) => (c.id === actualizada.id ? actualizada : c)));
      setModalCatOpen(false);
    } catch {
      alert("Error al actualizar categoría.");
    }
  };

  const handleDeleteCat = async (id: number) => {
    if (!confirm("¿Eliminar categoría? Si tiene productos asociados, generará error si no se maneja en el backend.")) return;
    try {
      const res = await fetch(`${API}/categorias/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setCategorias(categorias.filter((c) => c.id !== id));
    } catch {
      alert("Error al eliminar categoría.");
    }
  };

  // ──────────────────────────────────────────────────────────────────────────
  // ── LÓGICA PRODUCTOS ──
  // ──────────────────────────────────────────────────────────────────────────
  const openCreateProd = () => {
    setProdEditando(null);
    setProdFormData(EMPTY_PROD_FORM);
    setModalProdOpen(true);
  };

  const openEditProd = async (prod: Producto) => {
    // Al editar, necesitamos obtener qué categorías tiene asignadas consultando el endpoint intermedio
    try {
      const res = await fetch(`${API}/producto-categorias/producto/${prod.id}`);
      const relaciones = await res.json();
      const idsAsignados = relaciones.map((r: any) => r.categoria_id);

      setProdEditando(prod);
      setProdFormData({
        nombre: prod.nombre,
        descripcion: prod.descripcion,
        precio_base: prod.precio_base,
        imagen_url: prod.imagen_url.join(", "), // Convertir array a string separado por comas
        disponible: prod.disponible,
        categoria_ids: idsAsignados,
      });
      setModalProdOpen(true);
    } catch {
      alert("Error al cargar las categorías del producto.");
    }
  };

  const formatProductoPayload = () => {
    return {
      ...prodFormData,
      precio_base: Number(prodFormData.precio_base),
      imagen_url: prodFormData.imagen_url
        ? prodFormData.imagen_url.split(",").map((s) => s.trim()).filter((s) => s !== "")
        : [],
    };
  };

  const handleCreateProd = async () => {
    try {
      const res = await fetch(`${API}/productos/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formatProductoPayload()),
      });
      if (!res.ok) throw new Error();
      const nuevo = await res.json();
      setProductos([...productos, nuevo]);
      setModalProdOpen(false);
    } catch {
      alert("Error al crear producto.");
    }
  };

  const handleUpdateProd = async () => {
    if (!prodEditando) return;
    try {
      const res = await fetch(`${API}/productos/${prodEditando.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formatProductoPayload()),
      });
      if (!res.ok) throw new Error();
      const actualizado = await res.json();
      setProductos(productos.map((p) => (p.id === actualizado.id ? actualizado : p)));
      setModalProdOpen(false);
    } catch {
      alert("Error al actualizar producto.");
    }
  };

  const handleDeleteProd = async (id: number) => {
    if (!confirm("¿Eliminar producto?")) return;
    try {
      const res = await fetch(`${API}/productos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setProductos(productos.filter((p) => p.id !== id));
    } catch {
      alert("Error al eliminar producto.");
    }
  };

  const toggleCategoria = (catId: number) => {
    setProdFormData((prev) => {
      const tiene = prev.categoria_ids.includes(catId);
      return {
        ...prev,
        categoria_ids: tiene
          ? prev.categoria_ids.filter((id) => id !== catId)
          : [...prev.categoria_ids, catId],
      };
    });
  };

  // ──────────────────────────────────────────────────────────────────────────
  // ── RENDERIZADO ──
  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Navegación por pestañas */}
        <div className="flex gap-4 border-b border-gray-200 mb-8">
          <button
            className={`pb-3 px-2 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === "categorias"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("categorias")}
          >
            Gestión de Categorías
          </button>
          <button
            className={`pb-3 px-2 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === "productos"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("productos")}
          >
            Gestión de Productos
          </button>
        </div>

        {/* CONTENIDO CATEGORÍAS */}
        {activeTab === "categorias" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Categorías</h2>
                <p className="text-sm text-gray-400 mt-0.5">{categorias.length} registradas</p>
              </div>
              <button
                onClick={openCreateCat}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-colors"
              >
                ＋ Nueva categoría
              </button>
            </div>
            {loadingCat ? (
              <div className="text-center py-10 text-indigo-400 animate-pulse">Cargando...</div>
            ) : errorCat ? (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">{errorCat}</div>
            ) : (
              <CategoriaList categorias={categorias} onEdit={openEditCat} onDelete={handleDeleteCat} />
            )}
          </div>
        )}

        {/* CONTENIDO PRODUCTOS */}
        {activeTab === "productos" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Productos</h2>
                <p className="text-sm text-gray-400 mt-0.5">{productos.length} registrados</p>
              </div>
              <button
                onClick={openCreateProd}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-colors"
              >
                ＋ Nuevo producto
              </button>
            </div>
            {loadingProd ? (
              <div className="text-center py-10 text-indigo-400 animate-pulse">Cargando...</div>
            ) : errorProd ? (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">{errorProd}</div>
            ) : (
              <ProductoList productos={productos} onEdit={openEditProd} onDelete={handleDeleteProd} />
            )}
          </div>
        )}
      </main>

      {/* Modales */}
      <CategoriaModal
        isOpen={modalCatOpen}
        categoriaEditando={catEditando}
        formData={catFormData}
        onFormChange={(field, val) => setCatFormData({ ...catFormData, [field]: val })}
        onClose={() => setModalCatOpen(false)}
        onSubmit={catEditando ? handleUpdateCat : handleCreateCat}
      />

      <ProductoModal
        isOpen={modalProdOpen}
        productoEditando={prodEditando}
        formData={prodFormData}
        categorias={categorias}
        onFormChange={(field, val) => setProdFormData({ ...prodFormData, [field]: val })}
        onCategoriaToggle={toggleCategoria}
        onClose={() => setModalProdOpen(false)}
        onSubmit={prodEditando ? handleUpdateProd : handleCreateProd}
      />
    </div>
  );
}

export default App;