import { useEffect, useState, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CalendarIcon, ChevronRightIcon, PackageIcon } from "lucide-react";
import toast from "react-hot-toast";

import { useCart } from "../context/CartContext";
import Loading from "../components/Loading";
import api from "../config/api";

const MyOrders = () => {
  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "$";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchParams, setSearchParams] = useSearchParams();
  
  const { clearCart } = useCart();

  // Pestañas corregidas con los estados reales que maneja tu API
  const tabs = [
    { id: "all", label: "Todos" },
    { id: "Placed", label: "Recibidos" },
    { id: "In Transit", label: "En camino" },
    { id: "Delivered", label: "Entregados" }
  ];

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = activeTab !== "all" ? `?status=${activeTab}` : "";
      const { data } = await api.get(`/orders${params}`);
      
      setOrders(data.orders || data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || error?.message || "Error al obtener tus pedidos");
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  // Manejo correcto de la limpieza de carrito sin provocar peticiones infinitas
  useEffect(() => {
    if (searchParams.get("clearCart")) {
      clearCart();
      setSearchParams({}, { replace: true });
    } else {
      fetchOrders();
    }
  }, [activeTab, searchParams, fetchOrders, clearCart, setSearchParams]);

  // Traductor y formateador de estilos para los Badges de Estado adaptados al modo oscuro
  const getStatusBadge = (status) => {
    switch (status) {
      case "Placed":
        return { text: "Recibido", styles: "bg-[#2A2A2A] text-white" };
      case "Preparing":
        return { text: "En Cocina", styles: "bg-[#FF8C00] text-white" };
      case "Out for Delivery":
      case "In Transit":
        return { text: "En Camino", styles: "bg-[#FF8C00] text-white animate-pulse" };
      case "Delivered":
        return { text: "Entregado", styles: "bg-emerald-500 text-white" };
      case "Cancelled":
        return { text: "Cancelado", styles: "bg-red-500 text-white" };
      default:
        return { text: status, styles: "bg-[#2A2A2A] text-white" };
    }
  };

  return (
    // FONDO NEGRO ABSOLUTO (Estilo Spotify Base)
    <div className="min-h-screen bg-[#000000] text-white mb-20 selection:bg-[#FF8C00] selection:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <h1 className="text-2xl font-bold tracking-tight mb-6">
          Mis <span className="text-[#FF8C00]">Pedidos</span>
        </h1>

        {/* Barra de Pestañas / Filtros de Estado */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer active:scale-95 ${
                activeTab === tab.id
                  // Pestaña Activa: Naranja con Blanco
                  ? "bg-[#FF8C00] text-white"
                  // Pestaña Inactiva: Gris Oscuro Spotify
                  : "bg-[#121212] text-white opacity-80 hover:opacity-100 border border-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Renderizado Condicional de Estados de Carga / Datos */}
        {loading ? (
          <Loading />
        ) : orders.length === 0 ? (
          // Vista de Estado Vacío en Gris Contenedor
          <div className="text-center py-16 bg-[#121212] text-white rounded-2xl border border-white/5 p-8 shadow-xl">
            <PackageIcon className="size-12 text-[#A7A7A7] mx-auto mb-4" />
            <h2 className="text-lg font-bold tracking-tight text-white mb-2">
              No hay órdenes registradas
            </h2>
            <p className="text-xs text-[#A7A7A7] mb-6 max-w-sm mx-auto">
              {activeTab === "all" 
                ? "Aún no has probado nuestras especialidades clandestinas. ¡Comienza a ordenar ahora!" 
                : `No tienes ningún pedido con el estado seleccionado en este momento.`}
            </p>
            <Link
              to="/products"
              className="inline-flex px-5 py-2.5 bg-[#FF8C00] text-white text-xs font-bold rounded-full hover:bg-opacity-90 transition-all shadow-md"
            >
              Ver el Menú
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const badge = getStatusBadge(order.status);
              return (
                <Link
                  key={order.id || order._id}
                  to={`/orders/${order.id || order._id}`}
                  // Tarjeta del Pedido en Gris Contenedor Spotify
                  className="block bg-[#121212] text-white rounded-2xl p-6 border border-white/5 hover:border-[#FF8C00]/40 shadow-md transition-all group relative overflow-hidden"
                >
                  {/* Línea lateral de acento de marca interactivo */}
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-transparent group-hover:bg-[#FF8C00] transition-colors" />

                  {/* Cabecera de Tarjeta: ID, Fecha y Status Badge */}
                  <div className="flex items-start justify-between mb-4 pl-1">
                    <div>
                      <p className="text-sm font-bold tracking-tight text-white">
                        Pedido #{String(order.id || order._id).slice(-8).toUpperCase()}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1 text-[#A7A7A7] font-medium">
                        <CalendarIcon className="size-3.5" />
                        <span className="text-xs">
                          {new Date(order.createdAt).toLocaleDateString("es-ES", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${badge.styles}`}
                      >
                        {badge.text}
                      </span>
                      <ChevronRightIcon className="size-4 text-[#A7A7A7] group-hover:text-[#FF8C00] group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>

                  {/* Lista de Miniaturas de Platillos */}
                  <div className="flex items-center gap-2 mb-4 pl-1">
                    {order.items?.slice(0, 4).map((item, i) => (
                      <div 
                        key={i} 
                        className="size-14 sm:size-16 rounded-xl border border-white/5 bg-[#2A2A2A] p-1 flex items-center justify-center overflow-hidden shrink-0"
                      >
                        <img
                          src={item.product?.image || item.image}
                          alt={item.product?.name || item.name}
                          className="max-h-full max-w-full object-contain rounded-lg drop-shadow-sm"
                          loading="lazy"
                        />
                      </div>
                    ))}
                    
                    {/* Badge contador sumatorio para pedidos grandes */}
                    {order.items?.length > 4 && (
                      <div className="size-14 sm:size-16 rounded-xl bg-[#2A2A2A] border border-white/5 flex items-center justify-center text-xs font-bold text-[#A7A7A7] shrink-0">
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-white/5 my-4"></div>

                  {/* Footer de Tarjeta: Unidades totales y Monto Final */}
                  <div className="flex justify-between items-center pt-1 text-xs pl-1">
                    <span className="text-[#A7A7A7] font-medium">
                      {order.items?.length || 0} {order.items?.length === 1 ? "Artículo" : "Artículos"}
                    </span>
                    <span className="text-sm font-bold text-white tracking-tight">
                      Total: <span className="text-[#FF8C00]">{currency}{(order.total || order.cartTotal || 0).toFixed(2)}</span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;