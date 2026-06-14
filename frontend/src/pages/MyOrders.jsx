import { useEffect, useState, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CalendarIcon, ChevronRightIcon, PackageIcon, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { useCart } from "../context/CartContext";
import Loading from "../components/Loading";
import api from "../config/api";
import formatCurrency from "../utils/formatCurrency";
import { dummyProducts } from "../assets/assets";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchParams, setSearchParams] = useSearchParams();
  const [hiddenOrders, setHiddenOrders] = useState(() => {
    const saved = window.localStorage.getItem("hiddenOrders");
    return saved ? JSON.parse(saved) : [];
  });
  const [expandedOrders, setExpandedOrders] = useState([]);
  
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

  const getOrderItemImage = (item) => {
    if (!item) return "https://via.placeholder.com/150";
    if (item.product && typeof item.product === "object") {
      return item.product.image || item.image || "https://via.placeholder.com/150";
    }

    const productId = typeof item.product === "string"
      ? item.product
      : item.product?.id || item.product?._id;

    const fallback = dummyProducts.find(
      (product) => product._id === productId || product.id === productId
    );

    return item.image || fallback?.image || "https://via.placeholder.com/150";
  };

  const visibleOrders = orders.filter(
    (order) => !hiddenOrders.includes(order.id || order._id)
  );

  const toggleOrderExpand = (orderId) => {
    setExpandedOrders((current) =>
      current.includes(orderId)
        ? current.filter((id) => id !== orderId)
        : [...current, orderId]
    );
  };

  const hideOrder = (orderId) => {
    const next = [...hiddenOrders, orderId];
    setHiddenOrders(next);
    window.localStorage.setItem("hiddenOrders", JSON.stringify(next));
  };

  const restoreHiddenOrders = () => {
    setHiddenOrders([]);
    window.localStorage.removeItem("hiddenOrders");
  };

  return (
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
                  ? "bg-[#FF8C00] text-white"
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
        ) : visibleOrders.length === 0 ? (
          <div className="text-center py-16 bg-[#121212] text-white rounded-2xl border border-white/5 p-8 shadow-xl">
            <PackageIcon className="size-12 text-[#A7A7A7] mx-auto mb-4" />
            <h2 className="text-lg font-bold tracking-tight text-white mb-2">
              No hay pedidos visibles
            </h2>
            <p className="text-xs text-[#A7A7A7] mb-6 max-w-sm mx-auto">
              Has ocultado todos los pedidos o no hay ninguno con el filtro actual.
            </p>
            <div className="flex flex-col gap-3 items-center justify-center">
              <button
                onClick={restoreHiddenOrders}
                className="inline-flex px-5 py-2.5 bg-[#FF8C00] text-white text-xs font-bold rounded-full hover:bg-opacity-90 transition-all shadow-md cursor-pointer"
              >
                Mostrar todos los pedidos
              </button>
              <Link
                to="/products"
                className="inline-flex px-5 py-2.5 bg-[#1C1C1C] text-white text-xs font-bold rounded-full hover:bg-white/10 transition-all shadow-md"
              >
                Ver el Menú
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {visibleOrders.map((order) => {
              const badge = getStatusBadge(order.status);
              const orderId = order.id || order._id;
              const isExpanded = expandedOrders.includes(orderId);
              const displayedItems = order.items?.slice(0, isExpanded ? order.items.length : 4) || [];
              return (
                <div key={orderId} className="relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      hideOrder(orderId);
                    }}
                    className="absolute right-4 top-4 z-10 rounded-full bg-[#1C1C1C] p-2 border border-white/10 text-[#A7A7A7] hover:bg-[#FF8C00] hover:text-white transition-colors cursor-pointer"
                    aria-label="Ocultar pedido"
                  >
                    <Trash2 className="size-4" />
                  </button>

                  {order.items?.length > 4 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleOrderExpand(orderId);
                      }}
                      className="absolute right-16 top-4 z-10 rounded-full bg-[#1C1C1C] px-3 py-2 text-[11px] font-semibold border border-white/10 text-[#A7A7A7] hover:bg-[#FF8C00] hover:text-white transition-colors cursor-pointer"
                    >
                      {isExpanded ? "Ver menos" : "Ver todos"}
                    </button>
                  )}

                  <Link
                    to={`/orders/${orderId}`}
                    className="block bg-[#121212] text-white rounded-2xl p-6 border border-white/5 hover:border-[#FF8C00]/40 shadow-md transition-all group relative overflow-hidden"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-transparent group-hover:bg-[#FF8C00] transition-colors" />

                    <div className="flex items-start justify-between mb-4 pl-1">
                      <div>
                        <p className="text-sm font-bold tracking-tight text-white">
                          Pedido #{String(orderId).slice(-8).toUpperCase()}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1 text-[#A7A7A7] font-medium">
                          <CalendarIcon className="size-3.5" />
                          <span className="text-xs">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString("es-ES", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }) : "Fecha no disponible"}
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

                    <div className="flex items-center gap-2 mb-4 pl-1">
                      {displayedItems.map((item, i) => (
                        <div 
                          key={i} 
                          className="size-14 sm:size-16 rounded-xl border border-white/5 bg-[#2A2A2A] p-1 flex items-center justify-center overflow-hidden shrink-0"
                        >
                          <img
                            src={getOrderItemImage(item)}
                            alt={item.product?.name || item.name || "Producto"}
                            className="max-h-full max-w-full object-contain rounded-lg drop-shadow-sm"
                            loading="lazy"
                          />
                        </div>
                      ))}
                      
                      {!isExpanded && order.items?.length > 4 && (
                        <div className="size-14 sm:size-16 rounded-xl bg-[#2A2A2A] border border-white/5 flex items-center justify-center text-xs font-bold text-[#A7A7A7] shrink-0">
                          +{order.items.length - 4}
                        </div>
                      )}
                    </div>

                    <div className="border-t border-white/5 my-4"></div>

                    <div className="flex justify-between items-center pt-1 text-xs pl-1">
                      <span className="text-[#A7A7A7] font-medium">
                        {order.items?.length || 0} {order.items?.length === 1 ? "Artículo" : "Artículos"}
                      </span>
                      <span className="text-sm font-bold text-white tracking-tight">
                        Total: <span className="text-[#FF8C00]">{formatCurrency(order.total || order.cartTotal || 0)}</span>
                      </span>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;