import { useAuth } from "../../context/AuthContext";

export default function GenericDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Portal de Usuario</h1>
        <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded">
          Salir
        </button>
      </nav>

      <div className="p-8 max-w-4xl mx-auto text-center">
        <div className="bg-white p-10 rounded shadow">
          <h2 className="text-2xl mb-4">Bienvenido, {user?.username}</h2>
          <p className="text-gray-600">
            Tu empresa ({user?.empresa_nombre || "Sin Asignar"}) no tiene un dashboard personalizado aún.
          </p>
        </div>
      </div>
    </div>
  );
}