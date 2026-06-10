import { useEffect, useRef, useState } from "react";
import { PackageIcon, NavigationIcon } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

import OtpModal from "../../components/Delivery/OtpModal";
import CancelModal from "../../components/Delivery/CancelModal";
import DeliveryOrderCard from "../../components/Delivery/DeliveryOrderCard";
import Loading from "../../components/Loading";

const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("delivery_token")}`,
  },
});

export default function DeliveryDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("active");
  const [tracking, setTracking] = useState(false);

  const [otpModal, setOtpModal] = useState(null);
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [cancelModal, setCancelModal] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const watchIdRef = useRef(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${API_URL}/delivery/my-deliveries?status=${tab}`,
        getAuthHeaders(),
      );
      setOrders(data.orders);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error al cargar entregas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [tab]);

  useEffect(() => {
    const activeOrders = orders.filter((o) =>
      ["Assigned", "Packed", "Out for Delivery"].includes(o.status),
    );

    if (activeOrders.length === 0 || !tracking) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      return;
    }

    const sendLocation = (pos) => {
      const { latitude: lat, longitude: lng } = pos.coords;
      activeOrders.forEach((order) => {
        axios
          .put(
            `${API_URL}/delivery/my-deliveries/${order.id}/location`,
            { lat, lng },
            getAuthHeaders(),
          )
          .catch(() => {});
      });
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      sendLocation,
      () => {},
      { enableHighAccuracy: true, maximumAge: 10000 },
    );

    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(sendLocation, () => {}, {
        enableHighAccuracy: true,
      });
    }, 10000);

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      clearInterval(interval);
    };
  }, [orders, tracking]);

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await axios.put(
        `${API_URL}/delivery/my-deliveries/${orderId}/status`,
        { status },
        getAuthHeaders(),
      );
      toast.success("Estado actualizado");
      fetchOrders();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error");
    }
  };

  const handleComplete = async () => {
    if (!otpModal || !otp) return;
    setSubmitting(true);
    try {
      await axios.put(
        `${API_URL}/delivery/my-deliveries/${otpModal}/complete`,
        { otp },
        getAuthHeaders(),
      );
      toast.success("Entrega completada");
      setOtpModal(null);
      setOtp("");
      fetchOrders();
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (!cancelModal) return;
    setSubmitting(true);
    try {
      await axios.put(
        `${API_URL}/delivery/my-deliveries/${cancelModal}/cancel`,
        { reason: cancelReason },
        getAuthHeaders(),
      );
      toast.success("Entrega cancelada");
      setCancelModal(null);
      setCancelReason("");
      fetchOrders();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 bg-[#000000] text-white min-h-screen p-4">
      {/* Filtros superiores estilo "Píldoras" de Spotify */}
      <div className="flex items-center gap-2 flex-wrap">
        {[{ id: "active", label: "Activos" }, { id: "completed", label: "Historial" }].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-xs font-bold rounded-full transition-all tracking-wide ${
              tab === t.id
                ? "bg-[#FF8C00] text-white" // Botón Naranja con Blanco
                : "bg-[#2A2A2A] text-white hover:bg-[#3E3E3E]" // Gris contenedor
            }`}
          >
            {t.label}
          </button>
        ))}
        
        {/* Botón de Compartir Ruta */}
        <div className="ml-auto">
          <button
            type="button"
            onClick={() => setTracking((prev) => !prev)}
            className={`px-4 py-2 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 ${
              tracking
                ? "bg-emerald-600 text-white"
                : "bg-[#FF8C00] text-white hover:bg-opacity-90" // Naranja con Blanco
            }`}
          >
            <NavigationIcon className={`w-3.5 h-3.5 ${tracking ? "animate-pulse" : ""}`} />
            {tracking ? "Compartiendo Ruta" : "Compartir Ruta"}
          </button>
        </div>
      </div>

      {/* Lista de Pedidos o Contenedor Vacío */}
      {loading ? (
        <Loading />
      ) : orders.length === 0 ? (
        // Contenedor Gris Oscuro tipo tarjeta Spotify
        <div className="text-center py-16 bg-[#121212] rounded-2xl border border-white/5">
          <PackageIcon className="size-12 text-[#A7A7A7] mx-auto mb-3" />
          <p className="text-lg font-bold text-white mb-1">
            No hay repartos {tab === "active" ? "activos" : "completados"}
          </p>
          <p className="text-sm text-[#A7A7A7]">
            {tab === "active" ? "Las nuevas asignaciones aparecerán aquí." : "Tu historial de entregas está limpio."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <DeliveryOrderCard
              key={order.id}
              order={order}
              tab={tab}
              handleUpdateStatus={handleUpdateStatus}
              setOtpModal={setOtpModal}
              setCancelModal={setCancelModal}
            />
          ))}
        </div>
      )}

      {otpModal && (
        <OtpModal
          setOtpModal={setOtpModal}
          otp={otp}
          setOtp={setOtp}
          handleComplete={handleComplete}
          submitting={submitting}
        />
      )}
      {cancelModal && (
        <CancelModal
          setCancelModal={setCancelModal}
          cancelReason={cancelReason}
          setCancelReason={setCancelReason}
          handleCancel={handleCancel}
          submitting={submitting}
        />
      )}
    </div>
  );
}