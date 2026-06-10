import React from "react";
import { MapPin, Trash2, Edit3, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

// 🛠️ REPARACIÓN: Ya no necesitamos importar aquí 'api' ni 'useAuth' 
// porque delegamos la mutación de datos de forma limpia al componente padre.
const AddressCard = ({ addr, onEditHandler, onDeleteHandler }) => {
  const addressId = addr._id || addr.id;

  // Función para gatillar la confirmación antes de borrar
  const handleDeleteClick = () => {
    // Si la tarjeta está corrupta/vacía en la pantalla, la mandamos directo al handler sin preguntar
    if (!addressId) {
      onDeleteHandler(addr);
      return;
    }

    // Reemplazo estético de window.confirm usando tu toast interactivo
    const confirmToast = toast((t) => (
      <div className="flex flex-col gap-2.5 text-xs">
        <p className="font-bold text-white">¿Seguro que quieres eliminar esta dirección?</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-2.5 py-1 bg-white/10 rounded-md text-white font-medium hover:bg-white/20 transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              // 🔥 Ejecuta la función unificada del padre que sí tiene el email y el salvavidas contra 404
              onDeleteHandler(addr); 
            }}
            className="px-2.5 py-1 bg-red-500 rounded-md text-white font-bold hover:bg-red-600 transition-all cursor-pointer"
          >
            Eliminar
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      style: { background: "#1C1C1C", border: "1px solid rgba(255,255,255,0.1)" }
    });
  };

  return (
    <div className={`p-5 bg-[#121212] rounded-2xl border transition-all relative overflow-hidden group ${
      addr.isDefault 
        ? "border-[#FF8C00]/40 shadow-lg shadow-[#FF8C00]/5" 
        : "border-white/5 hover:border-white/10"
    }`}>
      {/* Indicador de línea lateral interactiva para la dirección por defecto */}
      {addr.isDefault && (
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#FF8C00]" />
      )}

      <div className="flex items-start justify-between gap-4">
        
        {/* Información de la Dirección */}
        <div className="flex gap-3 pl-1">
          {/* Contenedor del Icono de mapa adaptado */}
          <div className={`p-2 rounded-xl shrink-0 h-10 w-10 flex items-center justify-center transition-colors ${
            addr.isDefault ? "bg-[#FF8C00] text-white" : "bg-[#1C1C1C] text-[#A7A7A7] group-hover:text-white"
          }`}>
            <MapPin className="size-5" />
          </div>
          
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-white uppercase tracking-tight">
                {addr.label || "Dirección Incompleta"}
              </h3>
              {addr.isDefault && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#FF8C00]/10 text-[#FF8C00] text-[10px] font-black rounded-md uppercase tracking-wider border border-[#FF8C00]/20">
                  <CheckCircle className="size-3" /> Principal
                </span>
              )}
            </div>
            
            <p className="text-xs text-[#A7A7A7] mt-1.5 leading-relaxed font-semibold">
              {addr.address || "Faltan detalles de ubicación"}
              <br />
              <span className="text-[#A7A7A7]/70 font-medium">
                {addr.city || "Sin ciudad"}{addr.state ? `, ${addr.state}` : ""} {addr.zip || ""}
              </span>
            </p>
          </div>
        </div>

        {/* Acciones de Control: Editar y Eliminar */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEditHandler(addr)}
            className="p-2 text-[#A7A7A7] hover:text-[#FF8C00] hover:bg-white/5 rounded-xl transition-all cursor-pointer active:scale-90"
            title="Editar dirección"
          >
            <Edit3 className="size-4" />
          </button>
          <button
            onClick={handleDeleteClick} // 👈 Conectado a la confirmación interactiva
            className="p-2 text-[#A7A7A7] hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer active:scale-90"
            title="Eliminar dirección"
          >
            <Trash2 className="size-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddressCard;