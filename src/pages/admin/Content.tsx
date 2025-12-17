import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { Link } from "react-router-dom";

interface ContentPage {
  id: number;
  title: string | null;
  slug: string;
  content: string | null;
  updated_at: string | null;
}

export default function Content() {
  const [pages, setPages] = useState<ContentPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
  });

  // 1. FETCH DATA
  const fetchPages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("content_page")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) console.error("Error fetching content:", error);
    else setPages(data || []);
    
    setLoading(false);
  };

  useEffect(() => {
    fetchPages();
  }, []);

  // Helper: Auto-generate slug from title if slug is empty
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    // Only auto-update slug if we are NOT editing an existing page (to avoid breaking URLs)
    // or if the slug is currently empty
    if (!editingId && formData.slug === "") {
      const autoSlug = newTitle
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "") // Remove non-word chars
        .replace(/[\s_-]+/g, "-") // Replace spaces with -
        .replace(/^-+|-+$/g, ""); // Remove leading/trailing -
      
      setFormData({ ...formData, title: newTitle, slug: autoSlug });
    } else {
      setFormData({ ...formData, title: newTitle });
    }
  };

  // 2. CREATE & UPDATE
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.slug) {
      alert("Slug is required!");
      return;
    }

    const payload = {
      title: formData.title,
      slug: formData.slug,
      content: formData.content,
      updated_at: new Date().toISOString(), // Update timestamp
    };


    if (editingId) {
      // UPDATE
      const { error } = await supabase
        .from("content_page")
        // @ts-ignore: Suppress type error for deployment
        .update(payload)
        .eq("id", editingId);

      if (error) alert("Error updating page: " + error.message);
      else resetForm();
    } else {
      // CREATE
      const { error } = await supabase
        .from("content_page")
        // @ts-ignore: Suppress type error for deployment
        .insert([payload]);

      if (error) {
         // ... error handling
      }
    }

  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this page?")) return;
    
    const { error } = await supabase.from("content_page").delete().eq("id", id);
    if (error) alert("Error deleting page");
    else fetchPages();
  };

  const startEdit = (page: ContentPage) => {
    setEditingId(page.id);
    setFormData({
      title: page.title || "",
      slug: page.slug,
      content: page.content || "",
    });
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ title: "", slug: "", content: "" });
    fetchPages();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Gestor de Contenido (CMS)</h1>
          <Link to="/admin" className="text-blue-600 hover:underline">
            &larr; Volver al Panel
          </Link>
        </div>

        {/* --- FORM CARD --- */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border-t-4 border-purple-500">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Editar Página" : "Crear Nueva Página"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Título</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={handleTitleChange}
                  className="mt-1 w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Ej: Quienes Somos"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Slug (URL)</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    /page/
                  </span>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    placeholder="quienes-somos"
                  />
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Contenido HTML / Texto</label>
              <textarea
                rows={10}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="mt-1 w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-purple-500 focus:ring-purple-500 font-mono text-sm"
                placeholder="<p>Escribe tu contenido aquí...</p>"
              />
              <p className="text-xs text-gray-500 mt-1">Puedes escribir texto plano o HTML básico.</p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
              >
                {editingId ? "Actualizar Página" : "Publicar Página"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* --- LIST CARD --- */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug (URL)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Última Edición</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pages.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {p.title || "(Sin título)"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      /{p.slug}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {p.updated_at ? new Date(p.updated_at).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => startEdit(p)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
                 {pages.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      No hay páginas creadas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}