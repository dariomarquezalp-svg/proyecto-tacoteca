import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Star } from "lucide-react";
import { useCart } from "../../context/CartContext"; // ──> RUTA CORREGIDA: Subimos 2 niveles

const ProductCard = ({ product }) => {
  // Captura el símbolo de la moneda desde el entorno o usa '$' por defecto
  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "$";

  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Handler optimizado con detención de propagación para no activar el onClick de la Card completa
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-md transition-all duration-300 group animate-fade-in cursor-pointer flex flex-col justify-between border border-gray-100"
      onClick={() => navigate(`/products/${product.id || product._id}`)}
    >
      {/* Contenedor de la Imagen */}
      <div className="relative aspect-square overflow-hidden bg-zinc-50 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover p-4 group-hover:p-2 transition-all duration-300"
          loading="lazy" // Optimización crucial de rendimiento para e-commerce
        />

        {/* Badges Flotantes */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {product.discount > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-semibold uppercase bg-orange-500 text-white rounded-full shadow-xs">
              {product.discount}% OFF
            </span>
          )}
        </div>
      </div>

      {/* Bloque de Información */}
      <div className="p-3.5 text-zinc-700 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold leading-snug mb-1.5 line-clamp-2 min-h-[2.5rem] text-gray-800">
            {product.name}
          </h3>

          {/* Rating / Calificaciones */}
          {product.rating > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <Star className="size-3 text-amber-400 fill-amber-400" />
              <span className="text-xs font-medium text-gray-600">
                {product.rating}
              </span>
              <span className="text-xs text-gray-400">
                ({product.reviewCount || 0})
              </span>
            </div>
          )}
        </div>

        {/* Sección de Precio + Botón Añadir */}
        <div className="flex items-center justify-between gap-2 mt-2">
          <div className="flex items-center gap-1 truncate">
            <span className="text-base font-bold text-zinc-900">
              {currency}
              {typeof product.price === "number" ? product.price.toFixed(2) : product.price}
            </span>
            <span className="text-xs text-gray-400 block">
              /{product.unit || "pz"}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through ml-1.5">
                {currency}
                {typeof product.originalPrice === "number" ? product.originalPrice.toFixed(2) : product.originalPrice}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="size-8 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0 hover:bg-orange-600 transition-colors active:scale-95 cursor-pointer"
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus className="size-4 pointer-events-none" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;