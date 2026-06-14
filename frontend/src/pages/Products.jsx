import React, { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronDown, Home, SlidersHorizontal, X } from "lucide-react";

import { categoriesData, dummyProducts } from "../assets/assets";
import ProductCard from "../components/Home/ProductCard"; 
import FilterPanel from "../components/FilterPanel";

const ITEMS_PER_PAGE = 12;

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // 1. Lectura centralizada de parámetros desde la URL
  const query = searchParams.get("q") || ""; 
  const category = searchParams.get("category") || "";
  // organic filter removed for Tacoteca menu
  const sort = searchParams.get("sort") || "";
  const page = Number(searchParams.get("page")) || 1;
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  // 2. Procesamiento de datos optimizado con useMemo
  const { paginatedProducts, totalPages, totalCount } = useMemo(() => {
    let result = [...dummyProducts];

    // Búsqueda por texto limpia
    const cleanQuery = query.trim().toLowerCase();
    if (cleanQuery) {
      result = result.filter((p) =>
        p.name?.toLowerCase().includes(cleanQuery)
      );
    }

    // Filtro por Categoría
    if (category) {
      result = result.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // Orgánico filter removed intentionally

    // Filtro por Precio Mínimo
    if (minPrice) {
      result = result.filter((p) => p.price >= Number(minPrice));
    }

    // Filtro por Precio Máximo
    if (maxPrice) {
      result = result.filter((p) => p.price <= Number(maxPrice));
    }

    // Filtro estricto: Solo productos con inventario activo
    result = result.filter((p) => p.stock > 0);

    // Ordenamiento (Sorting)
    if (sort) {
      switch (sort) {
        case "price_asc":
          result.sort((a, b) => a.price - b.price);
          break;
        case "price_desc":
          result.sort((a, b) => b.price - a.price);
          break;
        // rating sort removed for Tacoteca (ratings UI disabled)
        case "name":
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          break;
      }
    }

    const totalCount = result.length;
    const computedTotalPages = Math.ceil(totalCount / ITEMS_PER_PAGE) || 1;

    // Segmentación por Paginación
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const paginatedProducts = result.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return {
      paginatedProducts,
      totalPages: computedTotalPages,
      totalCount,
    };
  }, [query, category, sort, page, minPrice, maxPrice]);

  // 3. Handlers de URL dinámicos
  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    if (key !== "page") {
      newParams.delete("page");
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => setSearchParams({});

  const activeCategory = categoriesData.find((c) => c.slug === category);
  const hasFilters = Boolean(category || minPrice || maxPrice || query);

  return (
    // BASE NEGRO ABSOLUTO PREMIUM
    <div className="min-h-screen bg-[#000000] text-white selection:bg-[#FF8C00] selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb con acentos en Naranja */}
        <nav className="flex items-center gap-2 text-xs text-[#A7A7A7] mb-6">
          <Link to="/" className="hover:text-[#FF8C00] transition-colors">
            <Home className="size-4" />
          </Link>
          <span>/</span>
          <span className="text-[#FF8C00] font-bold uppercase tracking-wider">
            {query ? "Resultados de Búsqueda" : activeCategory ? activeCategory.name : "Todos los Productos"}
          </span>
        </nav>

        <div className="flex gap-8 xl:gap-10">
          {/* Sidebar - Desktop (Gris Contenedor Spotify) */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-[#121212] text-white rounded-2xl p-6 sticky top-24 border border-white/5 shadow-xl relative overflow-hidden">
              {/* Línea superior naranja de acento */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#FF8C00]" />
              <FilterPanel
                categories={categoriesData}
                category={category}
                minPrice={minPrice}
                maxPrice={maxPrice}
                updateFilter={updateFilter}
                clearFilters={clearFilters}
                hasFilters={hasFilters}
              />
            </div>
          </aside>

          {/* Área de Contenido Principal */}
          <main className="flex-1">
            {/* Encabezado e Interacciones */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-white/5 pb-5">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white uppercase">
                  {query ? `Resultados para "${query.trim()}"` : activeCategory ? activeCategory.name : "Todos los Productos"}
                </h1>
                <p className="text-xs font-medium text-[#A7A7A7] mt-1">
                  Se encontraron {totalCount} {totalCount === 1 ? "producto" : "productos"}
                </p>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                {/* Botón Filtros Mobile (Modo Oscuro Integrado) */}
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2.5 text-xs bg-[#121212] text-white font-bold rounded-xl border border-white/5 hover:bg-[#1c1c1c] transition-all shadow-md cursor-pointer"
                >
                  <SlidersHorizontal className="size-4 text-[#FF8C00]" /> Filtros
                </button>

                {/* Selector de Ordenamiento */}
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => updateFilter("sort", e.target.value)}
                    className="appearance-none pl-4 pr-10 py-2.5 text-xs bg-[#121212] text-white font-bold rounded-xl border border-white/5 focus:ring-2 focus:ring-[#FF8C00] outline-none cursor-pointer shadow-md"
                  >
                    <option value="">Más recientes</option>
                    <option value="price_asc">Precio: Menor → Mayor</option>
                    <option value="price_desc">Precio: Mayor → Menor</option>
                    {/* Rating option removed — ratings are disabled */}
                    <option value="name">Nombre: A → Z</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A7A7A7] pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Rejilla de Productos / Estado Vacío */}
            {paginatedProducts.length === 0 ? (
              /* Contenedor Estado Vacío (Gris Contenedor Spotify) */
              <div className="text-center py-16 bg-[#121212] rounded-2xl border border-white/5 p-8 shadow-xl max-w-xl mx-auto relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#FF8C00]" />
                <p className="text-sm font-bold text-white mb-2 uppercase tracking-tight">
                  No se encontraron productos
                </p>
                <p className="text-xs font-medium text-[#A7A7A7] mb-6">
                  Intenta ajustando los filtros o los términos de búsqueda.
                </p>
                {/* Botón de Acción Naranja */}
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-[#FF8C00] text-white text-xs font-bold rounded-xl hover:bg-opacity-90 active:scale-[0.98] transition-all uppercase tracking-wider cursor-pointer"
                >
                  Limpiar Filtros
                </button>
              </div>
            ) : (
              /* Cuadrícula de tarjetas de productos sobre fondo oscuro */
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 xl:gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id || product._id} product={product} />
                ))}
              </div>
            )}

            {/* Paginador Dinámico */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-16">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      updateFilter("page", String(i + 1));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`size-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      page === i + 1
                        ? "bg-[#FF8C00] text-white scale-105"
                        : "bg-[#121212] text-white border border-white/5 hover:bg-[#2A2A2A]"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modal de Filtros para Dispositivos Móviles (Gris Contenedor Spotify) */}
      {mobileFiltersOpen && (
        <>
          {/* Fondo traslúcido oscuro */}
          <div
            className="fixed inset-0 bg-black/80 z-50 backdrop-blur-xs"
            onClick={() => setMobileFiltersOpen(false)}
          />

          <div className="fixed bottom-0 left-0 right-0 bg-[#121212] text-white z-50 rounded-t-2xl max-h-[85vh] overflow-y-auto shadow-2xl relative border-t border-white/5">
            {/* Línea superior decorativa */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#FF8C00]" />
            
            <div className="flex items-center justify-between p-5 border-b border-white/5 mt-1">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Filtros</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
              >
                <X className="size-5 text-[#A7A7A7] hover:text-white" />
              </button>
            </div>

            <div className="p-5 text-white">
              <FilterPanel
                categories={categoriesData}
                category={category}
                minPrice={minPrice}
                maxPrice={maxPrice}
                updateFilter={updateFilter}
                clearFilters={clearFilters}
                hasFilters={hasFilters}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Products;