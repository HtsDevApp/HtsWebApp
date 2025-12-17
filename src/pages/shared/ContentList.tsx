import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../context/AuthContext";

interface ContentPage {
  id: number;
  title: string;
  slug: string;
  content: string;
  updated_at: string;
}

export default function ContentList() {
  const { logout } = useAuth();
  const [pages, setPages] = useState<ContentPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchPages() {
      const { data, error } = await supabase
        .from("content_page")
        .select("*")
        .order("updated_at", { ascending: false });

      if (!error && data) {
        // We cast to any here to handle potential nulls safely
        setPages(data as any[]);
      }
      setLoading(false);
    }
    fetchPages();
  }, []);

  // Helper to strip HTML tags for the excerpt
  const getExcerpt = (htmlContent: string) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    return text.length > 400 ? text.substring(0, 400) + "..." : text;
  };

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen flex flex-col font-sans">
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
              <li><Link to="/contents" className="block py-2 px-3 text-[#c1272d] md:p-0 font-bold">Artículos de Conocimiento</Link></li>
              <li><Link to="/encuesta" className="block py-2 px-3 text-[#c1272d] md:p-0 hover:text-red-600 transition-colors">Encuesta</Link></li>
              <li>
                <button onClick={logout} className="flex items-center gap-2 py-2 px-4 text-[#c1272d] font-medium border border-[#c1272d] rounded hover:bg-[#c1272d] hover:text-white transition-colors">
                   Cerrar Sesión
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-6xl w-full mx-auto px-4 pt-28 flex-grow">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-[#c1272d]">Ayuda & solución de problemas</h1>
          <p className="text-sm text-gray-600 mt-1">Guías y soluciones para problemas comunes.</p>
        </header>

        <div className="space-y-6 pb-24">
          {loading ? (
            <p className="text-gray-500">Cargando artículos...</p>
          ) : pages.length === 0 ? (
            <p className="text-gray-500">No hay artículos publicados aún.</p>
          ) : (
            pages.map((page) => (
              <div key={page.id} className="bg-white rounded-none shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold">
                  <Link to={`/contents/${page.slug}`} className="hover:underline text-[#c1272d]">
                    {page.title}
                  </Link>
                </h2>
                <p className="mt-3 text-sm text-gray-700">
                  {getExcerpt(page.content || "")}
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <Link
                    to={`/contents/${page.slug}`}
                    className="px-3 py-2 rounded-xl bg-[#c1272d] text-white hover:bg-red-700 text-sm font-medium transition-colors"
                  >
                    Leer más
                  </Link>
                  <span className="text-sm text-gray-500">
                    {new Date(page.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

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