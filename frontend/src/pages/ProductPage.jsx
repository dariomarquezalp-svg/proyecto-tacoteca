import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  HomeIcon,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import Loading from "../components/Loading";
import formatCurrency from "../utils/formatCurrency";

// Importación de datos locales seguros y tarjeta de producto
import { dummyProducts } from "../assets/assets"; 
import ProductCard from "../components/Home/ProductCard";

const ProductPage = () => {
  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "MX$";
  const { id } = useParams();
  const navigate = useNavigate();
  const { items, addToCart, updateQuantity, removeFromCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [localQuantity, setLocalQuantity] = useState(1);

  useEffect(() => {
    setLoading(true);
    setLocalQuantity(1);
    window.scrollTo(0, 0);

    // Búsqueda local segura evaluando id string y numérico
    const foundProduct = dummyProducts.find((p) => String(p._id || p.id) === String(id));

    if (!foundProduct) {
      navigate("/products");
      setLoading(false);
      return;
    }

    setProduct(foundProduct);

    // Productos relacionados por misma categoría
    const related = dummyProducts.filter(
      (p) => p.category === foundProduct.category && String(p._id || p.id) !== String(id)
    );
    setRelatedProducts(related);
    
    setLoading(false);
  }, [id, navigate]);

  if (loading) return <Loading />;
  if (!product) return null;

  // Sincronización exacta con el estado del carrito global
  const cartItem = items.find((item) => String(item.product._id || item.product.id) === String(product._id || product.id));
  const inCart = !!cartItem;
  const displayQuantity = inCart ? cartItem.quantity : localQuantity;

  const handleMinus = () => {
    const productId = product._id || product.id;
    if (inCart) {
      if (cartItem.quantity > 1)
        updateQuantity(productId, cartItem.quantity - 1);
      else removeFromCart(productId);
    } else {
      setLocalQuantity(Math.max(1, localQuantity - 1));
    }
  };

  const handlePlus = () => {
    const productId = product._id || product.id;
    if (inCart) updateQuantity(productId, cartItem.quantity + 1);
    else setLocalQuantity(localQuantity + 1);
  };

  const categoryLabel = product.category ? product.category.replace(/-/g, " ") : "Categoría";

  return (
    // FONDO MAESTRO NEGRO ABSOLUTO
    <div className="min-h-screen bg-[#000000] text-white selection:bg-[#FF8C00] selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Historial de rutas (Breadcrumbs) con acentos Naranja */}
        <nav className="flex items-center gap-2 text-xs text-[#A7A7A7] mb-6">
          <Link to="/" className="hover:text-[#FF8C00] transition-colors">
            <HomeIcon className="size-4" />
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-[#FF8C00] transition-colors font-bold uppercase tracking-wider">
            Menú
          </Link>
          <span>/</span>
          <Link
            to={`/products?category=${product.category}`}
            className="hover:text-[#FF8C00] transition-colors font-bold uppercase tracking-wider capitalize"
          >
            {categoryLabel}
          </Link>
          <span>/</span>
          <span className="text-[#FF8C00] font-bold truncate max-w-[200px] uppercase tracking-wider">
            {product.name}
          </span>
        </nav>

        {/* Botón Volver Atrás */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-1.5 text-xs text-[#A7A7A7] hover:text-[#FF8C00] transition-colors font-bold uppercase tracking-wider cursor-pointer"
        >
          <ArrowLeftIcon className="size-4" /> Volver
        </button>

        {/* Ficha de Detalles del Producto (Gris Contenedor Spotify) */}
        <div className="bg-[#121212] text-white rounded-2xl border border-white/5 shadow-xl overflow-hidden mb-10 relative">
          {/* Línea superior naranja de acento de marca */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#FF8C00]" />
          
          <div className="grid md:grid-cols-2 gap-6 items-center">
            
            {/* Contenedor Izquierdo: Visualización de Platillo - EN BLANCO LIMPIDO bg-[#ffffff] */}
            <div className="relative flex justify-center items-center p-8 md:p-12 bg-[#ffffff] min-h-[320px] md:min-h-[460px]">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-[340px] w-auto object-contain drop-shadow-2xl"
              />

              {/* Etiquetas flotantes en la imagen */}
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                {product.discount > 0 && (
                  <span className="px-3 py-1.5 text-xs font-bold bg-[#FF8C00] text-white rounded-md tracking-wider uppercase shadow-md">
                    {product.discount}% DESC
                  </span>
                )}
              </div>
            </div>

            {/* Contenedor Derecho: Configuración Comercial (Mantiene la estética oscura) */}
            <div className="p-6 md:p-10 lg:p-14 flex flex-col justify-center">
              <span className="text-[10px] font-bold text-[#A7A7A7] uppercase tracking-widest mb-2 block">
                {categoryLabel}
              </span>

              <h1 className="text-3xl font-bold text-white mb-3 tracking-tight uppercase">
                {product.name}
              </h1>

              {/* Ratings removed per project requirements */}

              {/* Precios e Información de la Porción */}
              <div className="flex items-baseline gap-3 mb-5 border-b border-white/5 pb-4">
                <span className="text-3xl font-bold text-white tracking-tight">
                  {formatCurrency(product.price || 0)}
                </span>
                {(product.originalPrice > product.price || product.oldPrice > product.price) && (
                  <span className="text-lg text-[#A7A7A7] line-through font-medium">
                    {formatCurrency(product.originalPrice || product.oldPrice)}
                  </span>
                )}
                <span className="text-xs text-[#A7A7A7] font-bold uppercase tracking-wider">/ {product.unit || "Orden"}</span>
              </div>

              <p className="text-xs font-medium text-[#A7A7A7] leading-relaxed mb-6">
                {product.description || "Ingredientes selectos de la más alta calidad y frescura. Ideal para disfrutar el verdadero sabor tradicional."}
              </p>

              {/* Disponibilidad en Cocina */}
              <div className="mb-6">
                {(product.stock > 0 || product.stock === undefined) ? (
                  <span className="text-xs text-emerald-500 font-bold flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                    ✓ Disponible ({product.stock || 100} ordenes listas)
                  </span>
                ) : (
                  <span className="text-xs text-red-500 font-bold flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-red-500" />
                    ✕ Agotado por hoy
                  </span>
                )}
              </div>

              {/* Controles de Compra Interactivos */}
              <div className="flex items-center gap-4">
                <div 
                  className={`flex items-center border rounded-xl overflow-hidden bg-[#2A2A2A] shadow-sm transition-colors duration-200 ${
                    inCart ? "border-[#FF8C00]" : "border-white/5"
                  }`}
                >
                  <button
                    onClick={handleMinus}
                    className={`p-3 transition-colors active:scale-95 cursor-pointer ${
                      inCart ? "text-[#FF8C00] hover:bg-[#FF8C00]/10" : "text-[#A7A7A7] hover:bg-white/5"
                    }`}
                  >
                    <MinusIcon className="w-3 h-3" />
                  </button>
                  
                  <span className="px-2 text-xs font-bold min-w-[32px] text-center text-white">
                    {displayQuantity}
                  </span>
                  
                  <button
                    onClick={handlePlus}
                    className={`p-3 transition-colors active:scale-95 cursor-pointer ${
                      inCart ? "text-[#FF8C00] hover:bg-[#FF8C00]/10" : "text-[#A7A7A7] hover:bg-white/5"
                    }`}
                  >
                    <PlusIcon className="w-3 h-3" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    if (!inCart) addToCart(product, localQuantity);
                  }}
                  disabled={product.stock === 0}
                  className={`flex-1 py-3.5 px-6 font-bold rounded-xl text-xs transition-all flex justify-center items-center gap-2 uppercase tracking-wider active:scale-[0.98] disabled:opacity-50 cursor-pointer ${
                    inCart 
                      ? "bg-[#2A2A2A] text-white border border-[#FF8C00]" 
                      : "bg-[#FF8C00] text-white hover:bg-opacity-90"
                  }`}
                >
                  <ShoppingCartIcon className="w-4 h-4" />
                  {inCart ? "Agregado al Carrito" : "Agregar al Carrito"}
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Reviews removed per request */}

        {/* Sección de Productos Relacionados */}
        {relatedProducts.length > 0 && (
          <section className="mb-24">
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white uppercase">
                  Te Puede Interesar
                </h2>
                <p className="text-xs font-medium text-[#A7A7A7] mt-1">
                  Más opciones deliciosas en {categoryLabel}
                </p>
              </div>
              <Link
                className="text-xs font-bold text-[#FF8C00] hover:underline flex items-center gap-1 transition-all uppercase tracking-wider"
                to={`/products?category=${product.category}`}
              >
                Ver Todo <ArrowRightIcon className="size-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 xl:gap-6">
              {relatedProducts.slice(0, 5).map((rp) => (
                <ProductCard key={rp._id || rp.id} product={rp} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default ProductPage;