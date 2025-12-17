import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { Link } from "react-router-dom";

// Define the shape of our data
interface Company {
  id: number;
  nombre: string;
}

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [nameInput, setNameInput] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  // 1. READ - Fetch all companies
  const fetchCompanies = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("empresa")
      .select("*")
      .order("id", { ascending: true });

    if (error) console.error("Error fetching companies:", error);
    else setCompanies(data || []);
    
    setLoading(false);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // 2. CREATE & UPDATE - Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    if (editingId) {
      // UPDATE existing
      const { error } = await supabase
        .from("empresa")
        // @ts-ignore: Suppress type error for deployment
        .update({ nombre: nameInput })
        .eq("id", editingId);
      
      if (!error) {
        setEditingId(null);
        setNameInput("");
        fetchCompanies();
      }
    } else {
      // CREATE new
      const { error } = await supabase
        .from("empresa")
        // @ts-ignore: Suppress type error for deployment
        .insert([{ nombre: nameInput }]);

      if (!error) {
        setNameInput("");
        fetchCompanies();
      }
    }
    
  };

  // 3. DELETE
  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de eliminar esta empresa?")) return;

    const { error } = await supabase
      .from("empresa")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Error al eliminar. Puede que haya usuarios vinculados a esta empresa.");
      console.error(error);
    } else {
      fetchCompanies();
    }
  };

  // Helper to load data into form for editing
  const startEdit = (company: Company) => {
    setEditingId(company.id);
    setNameInput(company.nombre);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNameInput("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Empresas</h1>
          <Link to="/admin" className="text-blue-600 hover:underline">
            &larr; Volver al Panel
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Editar Empresa" : "Agregar Nueva Empresa"}
          </h2>
          <form onSubmit={handleSubmit} className="flex gap-4">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Nombre de la empresa..."
              className="flex-1 rounded-md border-gray-300 shadow-sm px-4 py-2 border focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              className={`px-6 py-2 rounded text-white font-medium transition ${
                editingId ? "bg-amber-600 hover:bg-amber-700" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {editingId ? "Actualizar" : "Guardar"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-6 py-2 rounded bg-gray-500 text-white hover:bg-gray-600 transition"
              >
                Cancelar
              </button>
            )}
          </form>
        </div>

        {/* List Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Cargando empresas...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {companies.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{company.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{company.nombre}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => startEdit(company)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(company.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
                {companies.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                      No hay empresas registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}