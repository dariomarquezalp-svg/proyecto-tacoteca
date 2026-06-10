import { useEffect, useState } from "react";
import { Check, Clock, ChefHat, Bike } from "lucide-react";

const OrderTimeLine = ({ order }) => {
  // 1. Sincronización real con los estados del backend y actualización a iconos oscuros premium
  const steps = [
    { key: "Placed", label: "Pedido Recibido", icon: Clock },
    { key: "Preparing", label: "En Cocina", icon: ChefHat },
    { key: "In Transit", label: "En Camino", icon: Bike },
    { key: "Delivered", label: "Entregado", icon: Check },
  ];

  const getStepStatus = (currentStatus, stepKey) => {
    // Si el pedido está cancelado, congelamos visualmente las etapas previas
    if (currentStatus === "Cancelled") return "upcoming";

    const statusOrder = ["Placed", "Preparing", "In Transit", "Delivered"];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepKey);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "upcoming";
  };

  // 2. Formateador de hora dinámico para simular el avance de etapas basado en la fecha de creación
  const formatStepTime = (baseDateString, offsetMinutes) => {
    if (!baseDateString) return "";
    const baseDate = new Date(baseDateString);
    // Añadimos minutos progresivos de manera artificial si el backend no provee un historial exacto
    baseDate.setMinutes(baseDate.getMinutes() + offsetMinutes);
    
    return baseDate.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  return (
    <div className="relative pl-1 flex flex-col gap-y-7">
      {steps.map((step, index) => {
        const IconComponent = step.icon;
        const status = getStepStatus(order?.status, step.key);
        
        // offsets de minutos simulados para cada etapa de cocina/envío
        const minuteOffsets = [0, 5, 20, 35]; 

        return (
          <div key={index} className="relative flex items-start gap-4 group">
            
            {/* LÍNEA CONECTORA VERTICAL - Modo Oscuro */}
            {index !== steps.length - 1 && (
              <div
                className={`absolute left-[18px] top-9 w-[2px] h-[calc(100%+12px)] transition-colors duration-300 ${
                  status === "completed" ? "bg-[#FF8C00]" : "bg-white/10"
                }`}
              />
            )}

            {/* CONTENEDORES CIRCULARES */}
            <div className="relative z-10">
              {status === "completed" && (
                <div className="size-9 rounded-full bg-[#FF8C00]/20 border border-[#FF8C00] flex items-center justify-center text-[#FF8C00] shadow-sm">
                  <IconComponent className="size-[16px] stroke-[2.5]" />
                </div>
              )}

              {status === "current" && (
                <div className="size-9 rounded-full bg-[#FF8C00] flex items-center justify-center text-white ring-4 ring-[#FF8C00]/20 shadow-md animate-pulse">
                  <IconComponent className="size-[16px] stroke-[2.5]" />
                </div>
              )}

              {status === "upcoming" && (
                <div className="size-9 rounded-full bg-[#1C1C1C] border border-white/5 flex items-center justify-center text-[#A7A7A7]">
                  <IconComponent className="size-[16px] stroke-[2]" />
                </div>
              )}
            </div>

            {/* TEXTOS Y TIEMPOS - Tipografía e intensidades UI Spotify */}
            <div className="flex flex-col pt-1.5">
              <p
                className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                  status === "upcoming" ? "text-[#A7A7A7]/50 font-medium" : "text-white"
                }`}
              >
                {step.label}
              </p>
              
              {status !== "upcoming" && order?.createdAt && (
                <p className="text-[10px] text-[#A7A7A7] mt-0.5 font-semibold">
                  {formatStepTime(order.createdAt, minuteOffsets[index])}
                </p>
              )}
            </div>

          </div>
        );
      })}
    </div>
  );
};

export default OrderTimeLine;