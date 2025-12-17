import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Encuesta() {
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="bg-gray-50 font-sans scroll-smooth min-h-screen flex flex-col">
      {/* --- NAVBAR --- */}
      <nav className="bg-white shadow-md border-gray-200 fixed w-full top-0 left-0 z-50">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="/HTS-10.png" className="h-8" alt="HTS Logo" />
          </Link>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>

          <div className={`${isMobileMenuOpen ? "block" : "hidden"} w-full md:block md:w-auto`}>
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:items-center md:space-x-8 md:mt-0 md:border-0 md:bg-white">
              <li><Link to="/formulario-caso" className="block py-2 px-3 text-[#c1272d] md:p-0 hover:text-red-600 transition-colors">Crea tu Caso</Link></li>
              <li><Link to="/contents" className="block py-2 px-3 text-[#c1272d] md:p-0 hover:text-red-600 transition-colors">Artículos de Conocimiento</Link></li>
              <li><Link to="/encuesta" className="block py-2 px-3 text-[#c1272d] md:p-0 font-bold">Encuesta</Link></li>
              <li>
                <button onClick={logout} className="flex items-center gap-2 py-2 px-4 text-[#c1272d] font-medium border border-[#c1272d] rounded hover:bg-[#c1272d] hover:text-white transition-colors">
                   Cerrar Sesión
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* --- CONTENT (IFRAME) --- */}
      <section className="bg-gray-50 py-16 flex-grow mt-16">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6">
            <h4 className="text-[#c1272d] font-semibold mb-4 text-center">Encuesta de satisfacción</h4>
            <div className="w-full h-[820px] md:h-[900px] rounded-lg overflow-hidden shadow-inner">
               {/* Note: I updated the Title and Src to match the specific file provided */}
              <iframe
                src="https://forms.office.com/Pages/ResponsePage.aspx?id=Mjp2GCFNwEaaUZXaQqFU_JIeVk6DjZJEuiwrS7wW88lUQVg0MVdNVVhBWUpYRFRMMkpRVU0zWEYyMy4u&embed=true"
                title="Encuesta de satisfacción"
                className="w-full h-full"
                frameBorder="0"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t-4 border-[#c1272d]">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1">
               <img src="/HTS-10.png" alt="HTS Logo" className="h-9" />
               <p className="text-gray-600 mt-4">Consultoría y soporte IT. Monitoreo, seguridad y soluciones para tu empresa.</p>
            </div>
             <div className="md:col-span-3 text-sm text-gray-500 flex items-end justify-end">
                <p>© {new Date().getFullYear()} HTS. Todos los derechos reservados.</p>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}