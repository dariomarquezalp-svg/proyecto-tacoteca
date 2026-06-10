import React from "react";

const CheckoutReview = ({ address, items, handlePlaceOrder, loading, total }) => {
  // 💸 Cambiado el respaldo por defecto a "$" para que coincida con tu Tacoteca
  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "$";

  return (
    // 🎨 DISEÑO OSCURO ADAPTADO AL ESTILO DE LA TACOTECA
    <div className="bg-[#121212] p-5 rounded-2xl border border-white/5 shadow-xl space-y-6 text-white">
      
      {/* Sección: Dirección de Entrega */}
      <div>
        <h3 className="text-xs font-bold text-[#A7A7A7] uppercase tracking-wider mb-2">
          Review Delivery Target
        </h3>
        <div className="text-xs text-[#EAEAEA] leading-relaxed bg-[#1E1E1E] p-4 rounded-xl border border-white/5">
          <span className="font-bold text-[#FF8C00] text-sm">{address.label}</span>
          <br />
          <span className="text-[#A7A7A7] mt-1 block">
            {address.address}, {address.city}, {address.state} {address.zip}
          </span>
        </div>
      </div>

      {/* Sección: Desglose de Productos */}
      <div>
        <h3 className="text-xs font-bold text-[#A7A7A7] uppercase tracking-wider mb-3">
          Item Breakdown
        </h3>
        <div className="divide-y divide-white/5 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
          {items.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3 min-w-0">
                <img 
                  src={item.product?.image || "https://via.placeholder.com/40"} 
                  alt={item.product?.name} 
                  className="size-10 rounded-lg object-cover bg-[#1E1E1E] border border-white/5" 
                />
                <div className="truncate">
                  <p className="text-sm font-bold text-white truncate">
                    {item.product?.name}
                  </p>
                  <p className="text-xs text-[#A7A7A7]">
                    Qty: {item.quantity}
                  </p>
                </div>
              </div>
              {/* Moneda e importes corregidos */}
              <span className="text-sm font-bold text-[#FF8C00] ml-2 shrink-0">
                {currency}{(item.product?.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Botón de Acción Principal (Estilo Tacoteca) */}
      <button
        type="button"
        disabled={loading}
        onClick={handlePlaceOrder}
        className="w-full py-3 bg-[#FF8C00] text-white font-bold rounded-full hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-xs uppercase tracking-wider flex justify-center items-center gap-2 cursor-pointer active:scale-[0.99]"
      >
        {loading ? (
          <>
            <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Procesando Pedido...
          </>
        ) : (
          `Place Order • ${currency}${total.toFixed(2)}`
        )}
      </button>

      {/* Mini estilo extra para que el scrollbar se vea estético y oscuro */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default CheckoutReview;