import React from "react";
import { KeyRoundIcon } from "lucide-react";

const OrderOTP = ({ order }) => {
  // Si el pedido ya se entregó o se canceló, no hace falta mostrar el código OTP
  if (!order || ["Delivered", "Cancelled"].includes(order.status)) return null;

  return (
    // CAMBIO: Fondo gris contenedor de Spotify (#121212) con bordes sutiles y texto blanco
    <div className="bg-[#121212] rounded-2xl p-6 border border-white/5 shadow-xl relative overflow-hidden">
      {/* Línea decorativa superior naranja */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#FF8C00]" />

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
        {/* Icono con fondo naranja traslúcido */}
        <div className="p-3 bg-[#FF8C00]/10 rounded-xl w-fit shrink-0">
          <KeyRoundIcon className="size-5 text-[#FF8C00]" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Código de Verificación de Entrega
          </h3>
          <p className="text-xs text-[#A7A7A7] font-medium mt-0.5 leading-relaxed">
            Muestra este código OTP al repartidor cuando llegue con tu pedido para confirmar la entrega segura.
          </p>
        </div>
      </div>

      {/* Contenedor del código OTP con estilo de cupón/boleto troquelado oscuro */}
      <div className="bg-[#1C1C1C] border border-dashed border-white/10 rounded-xl py-4 text-center select-all group hover:border-[#FF8C00]/30 transition-colors">
        <span className="text-3xl font-black tracking-[0.25em] text-[#FF8C00] font-mono pl-[0.25em]">
          {order.otp || "----"}
        </span>
      </div>
    </div>
  );
};

export default OrderOTP;