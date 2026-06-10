import React, { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Home, Search } from "lucide-react";

import { dummyProducts } from "../assets/assets";
import ProductCard from "../components/Home/ProductCard"; 

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  // Búsqueda instantánea y eficiente usando memorización
  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    
    if (!normalizedQuery) return [];

    return dummyProducts.filter((product) => {
      // Evitamos errores de propiedades indefinidas usando encadenamiento opcional (?.)
      const matchName = product.name?.toLowerCase().includes(normalizedQuery);
      const matchCategory = product.category?.toLowerCase().includes(normalizedQuery);
      
      // Muestra el producto si coincide el nombre o la categoría
      return matchName || matchCategory;
    });
  }, [query]);

  return (
    // FONDO MAESTRO NEGRO ABSOLUTO PREMIUM
    <div className="min-h-screen bg-[#000000] text-white selection:bg-[#FF8C00] selection:text-white">
      {/* Contenedor centralizado sin barra lateral ocupando el 100% */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb superior con acentos Naranja */}
        <nav className="flex items-center gap-2 text-xs text-[#A7A7A7] mb-6">
          <Link to="/" className="hover:text-[#FF8C00] transition-colors">
            <Home className="size-4" />
          </Link>
          <span>/</span>
          <span className="text-[#FF8C00] font-bold uppercase tracking-wider">Resultados de búsqueda</span>
        </nav>

        {/* Encabezado limpio de resultados */}
        <div className="mb-8 border-b border-white/5 pb-5">
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1.5 uppercase">
            Resultados para "<span className="text-[#FF8C00]">{query.trim()}</span>"
          </h1>
          <p className="text-xs font-medium text-[#A7A7A7]">
            Se {filteredProducts.length === 1 ? "encontró" : "encontraron"} {filteredProducts.length} {filteredProducts.length === 1 ? "producto" : "productos"}
          </p>
        </div>

        {/* Renderizado Condicional de Resultados */}
        {filteredProducts.length === 0 ? (
          /* Contenedor de Estado Vacío Integrado (Gris Contenedor Spotify) */
          <div className="text-center py-16 bg-[#121212] rounded-2xl border border-white/5 p-8 shadow-xl max-w-xl mx-auto relative overflow-hidden">
            {/* Línea superior naranja de acento */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#FF8C00]" />
            
            <Search className="size-14 text-[#A7A7A7]/20 mx-auto mb-4" />
            <h2 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">
              No encontramos resultados
            </h2>
            <p className="text-xs font-medium text-[#A7A7A7] mb-6 max-w-sm mx-auto leading-relaxed">
              No pudimos hallar platillos que coincidan con &ldquo;{query.trim()}&rdquo;. 
              Intenta con otro término o explora nuestra variedad completa.
            </p>
            
            {/* Botón de llamada a la acción Naranja */}
            <Link
              to="/products"
              className="inline-flex px-6 py-3 bg-[#FF8C00] text-white text-xs font-bold rounded-xl hover:bg-opacity-90 active:scale-[0.98] transition-all uppercase tracking-wider cursor-pointer"
            >
              Ver todo el menú
            </Link>
          </div>
        ) : (
          /* Rejilla de productos integrada sobre el fondo oscuro */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 xl:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;