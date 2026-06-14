import React from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useCart } from "../../context/CartContext";
import formatCurrency from "../utils/formatCurrency";

const ProductCard = ({ product }) => {
  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "MX$";
  const { addToCart, items, updateQuantity } = useCart();

  // Extraer el ID del producto de forma segura (soporta id y _id)
  const productId = product?.id || product?._id;

  // CORRECCIÓN CRÍTICA: Lectura ultra-flexible del item del carrito. 
  // Evalúa si el producto viene mapeado directo como objeto o si es una referencia plana.
  const cartItem = items?.find((item) => {
    const itemProdId = item.product?.id || item.product?._id || item.product;
    return String(itemProdId) === String(productId);
  });
  
  const inCart = !!cartItem;
  const isOutOfStock = product?.stock === 0;

  const handleAddClick = (e) => {
    e.preventDefault(); // Evita que el click redirija a la vista de detalle
    e.stopPropagation(); // Evita la propagación del evento al contenedor Link
    
    if (isOutOfStock) return;

    if (inCart) {
      updateQuantity(productId, cartItem.quantity + 1);
    } else {
      addToCart(product, 1);
    }
  };

  return (
    <Link
      to={`/product/${productId}`}
      className={`group block bg-[#121212] hover:bg-[#1C1C1C] rounded-2xl p-4 border border-white/5 shadow-xl transition-all duration-300 relative overflow-hidden ${
        isOutOfStock ? "opacity-60 hover:bg-[#121212]" : ""
      }`}
    >
      {/* Etiqueta de Descuento (Naranja) */}
      {product?.discount > 0 && !isOutOfStock && (
        <span className="absolute top-3 left-3 z-10 px-2.5 py-1 text-[10px] font-black bg-[#FF8C00] text-white rounded-md tracking-wider uppercase shadow-md">
          {product.discount}% OFF
        </span>
      )}

      {/* Etiqueta de Agotado */}
      {isOutOfStock && (
        <span className="absolute top-3 left-3 z-10 px-2.5 py-1 text-[10px] font-black bg-[#2A2A2A] text-[#A7A7A7] rounded-md tracking-wider uppercase border border-white/5 shadow-md">
          Agotado
        </span>
      )}

      {/* Imagen del Producto con fondo sutil */}
      <div className="relative aspect-square w-full bg-[#1C1C1C] group-hover:bg-[#2A2A2A] rounded-xl flex justify-center items-center p-4 mb-4 overflow-hidden transition-colors duration-300">
        <img
          src={product?.image}
          alt={product?.name}
          className={`max-h-full max-w-full object-contain drop-shadow-xl transform transition-transform duration-300 ${
            !isOutOfStock ? "group-hover:scale-105" : "grayscale"
          }`}
        />
      </div>

      {/* Información del Producto */}
      <div className="flex flex-col min-h-[90px] justify-between">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-tight group-hover:text-[#FF8C00] transition-colors line-clamp-1">
            {product?.name}
          </h3>
          
          {/* Ratings removed per project requirements */}
        </div>

        {/* Fila de Precio y Botón de Compra */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-black text-white tracking-tight">
              {formatCurrency(product?.price || 0)}
            </span>
            {(product?.originalPrice > product?.price || product?.oldPrice > product?.price) && (
              <span className="text-xs text-[#A7A7A7] line-through font-medium">
                {formatCurrency(product.originalPrice || product.oldPrice)}
              </span>
            )}
          </div>

          {/* Botón Flotante Naranja de Añadir */}
          <button
            onClick={handleAddClick}
            disabled={isOutOfStock}
            className="p-2.5 bg-[#FF8C00] text-white rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md shadow-[#FF8C00]/10 disabled:opacity-30 disabled:pointer-events-none cursor-pointer relative"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            {inCart && (
              <span className="absolute -top-1.5 -right-1.5 size-4 bg-white text-[#000000] text-[9px] font-black rounded-full flex items-center justify-center border border-[#FF8C00]">
                {cartItem.quantity}
              </span>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;