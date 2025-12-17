import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { Link } from "react-router-dom";

// Local interfaces for the UI
interface Company {
  id: number;
  nombre: string;
}

interface AppUser {
  id: number;
  username: string;
  role: string;
  empresa_id: number | null;
  // We use this property for the joined data from Supabase
  empresa?: { nombre: string } | null; 
}

export default function Users() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "USER",
    empresa_id: "" as string | number, // Union type to handle empty select
  });

  // 1. FETCH DATA (Users + Companies)
  const fetchData = async () => {
    setLoading(true);

    // A. Fetch Companies for the dropdown
    const { data: companiesData } = await supabase
      .from("empresa")
      .select("*")
      .order("nombre", { ascending: true });
    
    if (companiesData) setCompanies(companiesData);

    // B. Fetch Users with their Company Name (Join)
    // Note: The syntax '*, empresa(nombre)' grabs all user columns + the related company name
    const { data: usersData, error } = await supabase
      .from("app_users")
      .select("*, empresa(nombre)") 
      .order("id", { ascending: true });

    if (error) console.error("Error fetching users:", error);
    else {
        // We cast this to any first because Supabase types for joins can be tricky
        setUsers((usersData as any) || []); 
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. HANDLE FORM SUBMIT (Create & Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username) return;

    // Prepare payload
    const payload: any = {
      username: formData.username,
      role: formData.role,
      empresa_id: formData.empresa_id ? Number(formData.empresa_id) : null,
    };

    // Only include password if it's NOT empty (so we don't erase it on edit)
    if (formData.password.trim() !== "") {
      payload.password = formData.password;
    } else if (!editingId) {
      alert("Password is required for new users");
      return;
    }

    if (editingId) {
      // UPDATE
      const { error } = await supabase
        .from("app_users")
        // @ts-ignore: Suppress type error for deployment
        .update(payload)
        .eq("id", editingId);
      
      if (!error) resetForm();
      else alert("Error updating user: " + error.message);
    } else {
      // CREATE
      const { error } = await supabase
        .from("app_users")
        // @ts-ignore: Suppress type error for deployment
        .insert([payload]);

      if (!error) resetForm();
      else alert("Error creating user: " + error.message);
    }
    
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ username: "", password: "", role: "USER", empresa_id: "" });
    fetchData();
  };

  // 3. DELETE
  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro que quieres eliminar este usuario?")) return;

    const { error } = await supabase.from("app_users").delete().eq("id", id);
    if (error) alert("Error deleting user");
    else fetchData();
  };

  // 4. LOAD EDIT DATA
  const startEdit = (user: AppUser) => {
    setEditingId(user.id);
    setFormData({
      username: user.username,
      password: "", // We leave password blank unless they want to change it
      role: user.role,
      empresa_id: user.empresa_id || "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
          <Link to="/admin" className="text-blue-600 hover:underline">
            &larr; Volver al Panel
          </Link>
        </div>

        {/* --- FORM SECTION --- */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? `Editando Usuario #${editingId}` : "Crear Nuevo Usuario"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Usuario / Email</label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="mt-1 w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contraseña {editingId && <span className="text-gray-400 font-normal">(Dejar en blanco para mantener)</span>}
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="mt-1 w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Rol</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="mt-1 w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            {/* Company Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Empresa Asignada</label>
              <select
                value={formData.empresa_id}
                onChange={(e) => setFormData({ ...formData, empresa_id: e.target.value })}
                className="mt-1 w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">-- Sin Empresa --</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="md:col-span-2 flex gap-3 mt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              >
                {editingId ? "Actualizar Usuario" : "Crear Usuario"}
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

        {/* --- TABLE SECTION --- */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Cargando usuarios...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Empresa</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {u.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        u.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {/* Check if related data exists */}
                      {u.empresa?.nombre || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => startEdit(u)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}