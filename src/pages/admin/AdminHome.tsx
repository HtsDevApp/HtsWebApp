import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminHome() {
  const { logout } = useAuth();

  const modules = [
    {
      title: "Usuarios",
      description: "Gestionar cuentas de acceso y roles.",
      link: "/admin/users",
      color: "bg-blue-600",
      icon: "👤", 
    },
    {
      title: "Empresas",
      description: "Administrar base de datos de empresas.",
      link: "/admin/companies",
      color: "bg-emerald-600",
      icon: "🏢",
    },
    {
      title: "Contenido",
      description: "Editar páginas y textos del sitio (CMS).",
      link: "/admin/content",
      color: "bg-purple-600",
      icon: "📝",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <nav className="bg-stone-950 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <img src="HTS-10.png" alt="Logo" className="h-10 w-10 object-contain" />
          <span className="font-bold text-xl tracking-tight">Admin Panel</span>
        </div>
        <button
          onClick={logout}
          className="text-sm bg-red-700 hover:bg-red-600 px-4 py-2 rounded transition"
        >
          Cerrar Sesión
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Bienvenido al Panel de Control</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modules.map((mod) => (
            <Link
              key={mod.title}
              to={mod.link}
              className="block group relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Colored Top Bar */}
              <div className={`h-2 w-full ${mod.color}`} />
              
              <div className="p-6">
                <div className={`w-12 h-12 rounded-lg ${mod.color} flex items-center justify-center text-2xl mb-4 text-white shadow-sm`}>
                  {mod.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {mod.title}
                </h3>
                <p className="mt-2 text-gray-500 text-sm">
                  {mod.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}