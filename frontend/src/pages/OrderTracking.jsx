import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon, MapPinIcon, PhoneIcon } from "lucide-react";

import Loading from "../components/Loading";
import OrderOTP from "../components/OrderTracking/OrderOTP";
import LiveMap from "../components/OrderTracking/LiveMap";
import OrderTimeLine from "../components/OrderTracking/OrderTimeLine";
import api from "../config/api";
import formatCurrency from "../utils/formatCurrency";
import { dummyProducts } from "../assets/assets";

const OrderTracking = () => {
  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "MX$";
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liveLocation, setLiveLocation] = useState(null);

  // 1. Carga inicial de los detalles de la orden desde la API
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    api
      .get(`/orders/${id}`)
      .then((res) => {
        if (isMounted) {
          setOrder(res.data.order || res.data);
        }
      })
      .catch((err) => {
        console.error("Error al obtener los detalles del pedido:", err);
        navigate("/orders");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  // 2. Pooling activo en segundo plano para geolocalización (cada 10 segundos)
  useEffect(() => {
    if (!order || ["Delivered", "Cancelled", "Placed"].includes(order.status)) {
      return;
    }

    const fetchLocation = async () => {
      try {
        const { data } = await api.get(`/orders/${id}/location`);
        
        if (data.liveLocation?.lat && data.liveLocation?.lng) {
          setLiveLocation({
            lat: data.liveLocation.lat,
            lng: data.liveLocation.lng,
          });
        }
        
        if (data.status && data.status !== order.status) {
          setOrder((prev) => (prev ? { ...prev, status: data.status } : prev));
        }
      } catch (err) {
        console.warn("Rastreo en vivo temporalmente no disponible:", err);
      }
    };

    fetchLocation();
    const interval = setInterval(fetchLocation, 10000);

    return () => clearInterval(interval);
  }, [id, order?.status]);

  if (loading) return <Loading />;
  if (!order) return null;

  // Formateador dinámico de estado en español
  const getStatusLabel = (status) => {
    switch (status) {
      case "Placed": return "Recibido";
      case "Preparing": return "En cocina";
      case "In Transit": return "En camino";
      case "Delivered": return "Entregado";
      case "Cancelled": return "Cancelado";
      default: return status;
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

  // Cálculo de respaldo para el subtotal si no viene directamente de la API
  const calculatedSubtotal = order.items?.reduce((acc, item) => {
    const unitPrice = item.price || item.product?.price || 0;
    return acc + unitPrice * item.quantity;
  }, 0) || 0;

  const displaySubtotal = order.subtotal || calculatedSubtotal;

  return (
    // FONDO MAESTRO NEGRO ABSOLUTO
    <div className="min-h-screen pb-20 bg-[#000000] text-white selection:bg-[#FF8C00] selection:text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Botón de Retorno con acento interactivo */}
        <button
          onClick={() => navigate("/orders")}
          className="flex items-center gap-2 text-xs text-[#A7A7A7] hover:text-[#FF8C00] mb-6 transition-colors font-bold uppercase tracking-wider cursor-pointer"
        >
          <ArrowLeftIcon className="size-4" /> Volver a mis pedidos
        </button>

        {/* Encabezado: ID, Fecha y Badge de Estado */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-white/5 pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white uppercase">
              Pedido <span className="text-[#FF8C00]">#{order.id ? order.id.slice(-8).toUpperCase() : String(order._id).slice(-8).toUpperCase()}</span>
            </h1>
            <p className="text-xs font-medium text-[#A7A7A7] mt-1">
              Realizado el{" "}
              {new Date(order.createdAt).toLocaleDateString("es-ES", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          
          <span
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full self-start sm:self-auto shadow-md ${
              order.status === "Delivered"
                ? "bg-emerald-600 text-white"
                : order.status === "Cancelled"
                ? "bg-red-600 text-white"
                : "bg-[#FF8C00] text-white"
            }`}
          >
            {getStatusLabel(order.status)}
          </span>
        </div>

        {/* Grid de Contenidos Principal */}
        <div className="grid lg:grid-cols-3 gap-6 items-start">
          
          {/* Bloque Izquierdo: Mapas, OTP y Línea de Tiempo */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Componente Modular OTP */}
            <OrderOTP order={order} />
            
            {/* Contenedor del Mapa en Vivo */}
            <div className="bg-[#121212] rounded-2xl overflow-hidden border border-white/5 shadow-xl h-80 relative">
              <LiveMap order={order} liveLocation={liveLocation} />
            </div>
            
            {/* Tracking Línea de tiempo (Gris Contenedor Spotify) */}
            <div className="bg-[#121212] text-white rounded-2xl p-6 border border-white/5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-white/5" />
              <h3 className="text-[10px] font-bold text-[#A7A7A7] uppercase tracking-widest mb-6">
                Progreso del Envío
              </h3>
              <OrderTimeLine order={order} />
            </div>

            {/* Ficha del Repartidor asignado (Gris Contenedor Spotify) */}
            {order.deliveryPartner && !["Delivered", "Cancelled"].includes(order.status) && (
              <div className="bg-[#121212] text-white rounded-2xl p-5 flex items-center justify-between border border-white/5 shadow-xl relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#FF8C00]" />
                <div className="flex items-center gap-3 pl-2">
                  <div className="size-11 rounded-xl bg-[#2A2A2A] flex items-center justify-center text-white font-bold text-sm uppercase">
                    {order.deliveryPartner.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold tracking-tight text-white">
                      {order.deliveryPartner.name}
                    </p>
                    <p className="text-[11px] font-medium text-[#A7A7A7] uppercase mt-0.5">
                      {order.deliveryPartner.vehicleType === "Bike" ? "Motocicleta" : "Repartidor"} • Repartidor Asignado
                    </p>
                  </div>
                </div>
                <a
                  href={`tel:${order.deliveryPartner.phone}`}
                  className="p-3 bg-[#FF8C00] rounded-xl text-white hover:bg-opacity-90 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <PhoneIcon className="size-4" />
                </a>
              </div>
            )}
          </div>

          {/* Bloque Derecho: Dirección y Resumen Financiero */}
          <div className="space-y-6">
            
            {/* Tarjeta de Dirección de Entrega (Gris Contenedor Spotify) */}
            <div className="bg-[#121212] text-white rounded-2xl p-6 border border-white/5 shadow-xl">
              <h3 className="text-[10px] font-bold text-[#A7A7A7] uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
                <MapPinIcon className="size-4 text-[#FF8C00]" />
                Dirección de Entrega
              </h3>
              <p className="text-xs font-medium text-[#A7A7A7] leading-relaxed">
                <span className="font-bold text-white uppercase text-[10px] tracking-wider block mb-1">
                  {order.shippingAddress?.label === "Home" ? "Casa" : order.shippingAddress?.label || "Destino"}
                </span>
                {order.shippingAddress?.address}
                <br />
                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}
              </p>
            </div>

            {/* Tarjeta Resumen de Compra (Gris Contenedor Spotify) */}
            <div className="bg-[#121212] text-white rounded-2xl p-6 border border-white/5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#FF8C00]" />
              
              <h3 className="text-[10px] font-bold text-[#A7A7A7] uppercase tracking-widest mb-4">
                Platillos ({order.items?.length || 0})
              </h3>

              {/* Lista Desplegable de Productos */}
              <div className="space-y-4 max-h-64 overflow-y-auto pr-1 chunk-scrollbar border-b border-white/5 pb-4">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <img
                      src={item.product?.image || item.image}
                      alt={item.product?.name || item.name}
                      className="size-11 rounded-xl object-contain bg-[#2A2A2A] border border-white/5 p-1 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white uppercase truncate">
                        {item.product?.name || item.name}
                      </p>
                      <p className="text-[10px] font-medium text-[#A7A7A7] mt-0.5">
                        Cantidad: x{item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-white">
                      {formatCurrency((item.price || item.product?.price || 0) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Desglose de Cuentas */}
              <div className="mt-4 space-y-2.5 text-xs font-medium">
                <div className="flex justify-between text-[#A7A7A7]">
                  <span>Subtotal</span>
                  <span className="text-white font-bold">{formatCurrency(Number(displaySubtotal))}</span>
                </div>

                <div className="flex justify-between text-[#A7A7A7]">
                  <span>Envío</span>
                  <span className="text-emerald-500 font-bold uppercase tracking-wider">
                    {order.deliveryFee === 0 || !order.deliveryFee ? "Gratis" : formatCurrency(order.deliveryFee)}
                  </span>
                </div>

                <div className="flex justify-between text-[#A7A7A7]">
                  <span>Impuestos (IVA)</span>
                  <span className="text-white font-bold">{formatCurrency(order.tax || 0)}</span>
                </div>

                <div className="flex justify-between pt-3 border-t border-white/5 font-bold text-white uppercase tracking-tight">
                  <span>Total</span>
                  <span className="text-[#FF8C00] text-sm">{formatCurrency(order.total || 0)}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderTracking;