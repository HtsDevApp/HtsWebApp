import { useAuth } from "../context/AuthContext";

export default function UserHome() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Portal de Usuario</h1>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Cerrar Sesión
        </button>
      </nav>

      <div className="max-w-4xl mx-auto p-8 text-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Bienvenido, {user?.username}</h2>
          <p className="text-gray-600 mb-6">
            Tienes acceso de nivel <span className="font-mono bg-gray-200 px-2 py-1 rounded text-sm">{user?.role}</span>.
          </p>
          <div className="p-4 bg-blue-50 text-blue-800 rounded border border-blue-200">
            Aquí podrás ver el contenido asignado a tu cuenta (Próximamente).
          </div>
        </div>
      </div>
    </div>
  );
}