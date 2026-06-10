import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

// Cargamos tus productos locales y ajustamos la ruta de tu tarjeta
import { dummyProducts } from "../assets/assets"; 
import ProductCard from "../components/Home/ProductCard";

const FlashDeals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // FILTRADO LOCAL DE OFERTAS:
    // Filtramos los productos que tengan un descuento mayor a 0 o que tengan la etiqueta de descuento
    const discountedProducts = dummyProducts.filter(
      (product) => product.discount > 0 || product.oldPrice > product.price || product.isDeal
    );

    setProducts(discountedProducts);
    setLoading(false);
  }, []);

  return (
    // FONDO NEGRO ABSOLUTO (Estilo Spotify Base)
    <div className="min-h-screen bg-[#000000] text-white selection:bg-[#FF8C00] selection:text-white pb-20">
      
      {/* BANNER ESTILO SPOTIFY (Gris Contenedor con detalles Naranja y Blanco) */}
      <div className="bg-[#121212] text-white py-12 border-b border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Zap className="size-6 fill-[#FF8C00] text-[#FF8C00] animate-pulse" />
            <h1 className="text-3xl font-bold tracking-tight uppercase sm:text-4xl text-white">
              Promos <span className="text-[#FF8C00]">Canallas</span>
            </h1>
            <Zap className="size-6 fill-[#FF8C00] text-[#FF8C00] animate-pulse" />
          </div>
          <p className="text-[#A7A7A7] max-w-md mx-auto text-xs sm:text-sm font-medium tracking-wide">
            Precios de locura por tiempo limitado en nuestros mejores tacos y especialidades. ¡Que no te los ganen!
          </p>
        </div>
      </div>

      {/* Contenedor de la Rejilla de Productos */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-20 text-[#A7A7A7] flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#FF8C00] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-medium">Prendiendo los fogones...</span>
          </div>
        ) : products.length === 0 ? (
          // ESTADO VACÍO EN GRIS CONTENEDOR (Textos en Blanco y Gris Claro)
          <div className="text-center py-16 bg-[#121212] text-white rounded-2xl border border-white/5 p-8 max-w-xl mx-auto relative overflow-hidden shadow-xl">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#FF8C00]" />
            <Zap className="size-12 text-[#A7A7A7] mx-auto mb-4" />
            <h2 className="text-xl font-bold tracking-tight text-white mb-2">
              Todo tranquilo por aquí
            </h2>
            <p className="text-xs text-[#A7A7A7] max-w-xs mx-auto">
              La cocina está operando a precio regular. ¡Vuelve pronto para cazar nuevas promociones relámpago!
            </p>
          </div>
        ) : (
          /* Rejilla adaptada de ancho completo */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 xl:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashDeals;