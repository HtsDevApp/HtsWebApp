import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../context/AuthContext";

interface ContentPage {
  title: string;
  content: string;
  updated_at: string;
}

export default function ContentView() {
  const { slug } = useParams<{ slug: string }>(); // Get slug from URL
  const { logout } = useAuth();
  
  const [page, setPage] = useState<ContentPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchPage() {
      if (!slug) return;
      
      const { data, error } = await supabase
        .from("content_page")
        .select("*")
        .eq("slug", slug)
        .single();

      if (!error && data) {
        setPage(data as any);
      }
      setLoading(false);
    }
    fetchPage();
  }, [slug]);

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

      {/* --- MAIN ARTICLE CONTENT --- */}
      <main className="max-w-6xl w-full mx-auto px-4 pt-28 flex-grow">
        {loading ? (
          <p className="text-gray-500">Cargando contenido...</p>
        ) : !page ? (
          <div className="text-center py-20">
             <h1 className="text-2xl font-bold text-gray-700">Artículo no encontrado</h1>
             <Link to="/contents" className="text-[#c1272d] hover:underline mt-4 block">Volver a la lista</Link>
          </div>
        ) : (
          <article className="bg-white rounded-2xl shadow p-6 prose max-w-none mb-24">
            <header className="mb-4 border-b pb-4">
              <h1 className="text-3xl font-semibold text-[#c1272d] mb-2">{page.title}</h1>
              <p className="text-sm text-gray-500">
                Actualizado el: {new Date(page.updated_at).toLocaleDateString()}
              </p>
            </header>
            
            {/* Render HTML Content safely. 
              Since you are the Admin creating content, this is generally safe.
            */}
            <div 
              className="text-gray-800 leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: page.content || "" }} 
            />
          </article>
        )}
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