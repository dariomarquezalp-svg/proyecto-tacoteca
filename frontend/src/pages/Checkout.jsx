import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckIcon,
  ChevronRightIcon,
  CreditCardIcon,
  MapPinIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios"; // 👈 Importamos Axios para conectar directo al servidor real

import { useCart } from "../context/CartContext";
import CheckoutAddress from "../components/Checkout/CheckoutAddress";
import CheckoutPayment from "../components/Checkout/CheckoutPayment";
import CheckoutReview from "../components/Checkout/CheckoutReview";
import api from "../config/api";
import { useAuth } from "../context/AuthContext";
import formatCurrency from "../utils/formatCurrency";

const Checkout = () => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "MX$";

  const { items, cartTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [step, setStep] = useState("address");
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  // 1. Estructura base limpia por defecto
  const defaultAddressState = {
    id: "",
    label: "Casa",
    address: "",
    city: "",
    state: "",
    zip: "",
    isDefault: false,
    lat: 0,
    lng: 0,
  };

  // 2. Inicialización perezosa para el primer renderizado rápido
  const [address, setAddress] = useState(() => {
    if (user?.addresses?.length) {
      const defaultAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      return {
        id: defaultAddr?.id || defaultAddr?._id || "",
        label: defaultAddr?.label || "Casa",
        address: defaultAddr?.address || "",
        city: defaultAddr?.city || "",
        state: defaultAddr?.state || "",
        zip: defaultAddr?.zip || "",
        isDefault: defaultAddr?.isDefault || false,
        lat: defaultAddr?.lat || 0,
        lng: defaultAddr?.lng || 0,
      };
    }
    return defaultAddressState;
  });

  // 3. Sincronización del estado si el usuario/direcciones cargan después del montaje
  useEffect(() => {
    if (user?.addresses?.length && !address.id && !address.address) {
      const defaultAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      setAddress({
        id: defaultAddr?.id || defaultAddr?._id || "",
        label: defaultAddr?.label || "Casa",
        address: defaultAddr?.address || "",
        city: defaultAddr?.city || "",
        state: defaultAddr?.state || "",
        zip: defaultAddr?.zip || "",
        isDefault: defaultAddr?.isDefault || false,
        lat: defaultAddr?.lat || 0,
        lng: defaultAddr?.lng || 0,
      });
    }
  }, [user, address.id, address.address]);

  // Cálculos financieros derivados (Modificado a tarifas estándar locales)
  const deliveryFee = cartTotal > 300 ? 0 : 35.00;
  const tax = cartTotal * 0.16; // IVA estándar del 16%
  const total = cartTotal + deliveryFee + tax;

  const steps = [
    { key: "address", label: "Dirección", icon: MapPinIcon },
    { key: "payment", label: "Pago", icon: CreditCardIcon },
    { key: "review", label: "Confirmar", icon: CheckIcon },
  ];

  // ⚡ FUNCIÓN CORREGIDA Y CONECTADA AL BACKEND REAL
  const handlePlaceOrder = async () => {
    if (loading) return;

    if (!address.address || !address.city || !address.zip) {
      toast.error("Por favor proporciona o selecciona una dirección de entrega válida.");
      setStep("address");
      return;
    }

    setLoading(true);
    try {
      // 📦 Sincronizamos las variables exactamente como tu server.js las espera
      const orderData = {
        email: user?.email || "usuario_tacoteca@correo.com", // Enviamos el correo de la sesión real
        items: items.map((item) => ({
          product: item.product?.id || item.product?._id || "id_simulado",
          name: item.product?.name || "Platillo Tacoteca",
          quantity: item.quantity,
          price: item.product?.price || 0
        })),
        direccion: address, // Cambiado de shippingAddress -> direccion para el backend
        total: total, // Pasamos el costo final con IVA y envío
      };

      // 🚀 Petición HTTP directa al puerto 5000 de tu Express
      const response = await axios.post("http://localhost:5000/api/orders", orderData);
      const data = response.data;

      // Si la API responde con una URL de pasarela de pago (Stripe, PayPal, etc.)
      if (data && data.url) {
        window.location.href = data.url; 
        return;
      }

      // Extraer el ID del pedido generado por MongoDB Compass de forma segura
      const orderId = data?.order?._id || data?.order?.id || data?._id || data?.id;

      clearCart();
      toast.success("¡Pedido realizado con éxito!");

      // Redirección limpia
      if (orderId) {
        navigate(`/orders/${orderId}`);
      } else {
        navigate("/orders");
      }
    } catch (error) {
      console.error("Error al procesar el pedido:", error);
      toast.error(error.response?.data?.message || error.message || "Error al procesar el pedido");
    } finally {
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Renderizado condicional si el carrito está vacío (Gris Contenedor Spotify)
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4">
        <div className="text-center p-8 bg-[#121212] text-white rounded-2xl max-w-sm border border-white/5 shadow-xl">
          <h2 className="text-xl font-bold tracking-tight text-white mb-2">
            Tu carrito está vacío
          </h2>
          <p className="text-xs text-[#A7A7A7] mb-6">
            Agrega algunos platillos de nuestro menú para iniciar el pedido.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="w-full px-5 py-3 bg-[#FF8C00] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-opacity-90 transition-all cursor-pointer"
          >
            Ver Productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-[#FF8C00] selection:text-white pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Botón de Retorno */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-[#A7A7A7] hover:text-[#FF8C00] mb-6 transition-colors font-bold uppercase tracking-wider cursor-pointer"
        >
          <ArrowLeft className="size-4" /> Regresar
        </button>

        <h1 className="text-2xl font-bold tracking-tight mb-8">
          Finalizar <span className="text-[#FF8C00]">Pedido</span>
        </h1>

        {/* Pasos del Checkout (Stepper) */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStep(s.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                  step === s.key 
                    ? "bg-[#FF8C00] text-white" 
                    : "bg-[#121212] text-white hover:bg-[#2A2A2A]"
                }`}
              >
                <s.icon className="size-3.5" /> {s.label}
              </button>
              {i < steps.length - 1 && (
                <ChevronRightIcon className="size-4 text-white/20 mx-1 shrink-0" />
              )}
            </div>
          ))}
        </div>

        {/* Layout de Contenido Principal y Sidebar */}
        <div className="grid md:grid-cols-3 gap-6 items-start">
          
          {/* Secciones Dinámicas según el Paso Activo */}
          <div className="md:col-span-2 checkout-steps-patch">
            <style>{`
              .checkout-steps-patch p,
              .checkout-steps-patch span,
              .checkout-steps-patch label,
              .checkout-steps-patch div,
              .checkout-steps-patch h3,
              .checkout-steps-patch h4 {
                color: #ffffff !important;
                opacity: 1 !important;
              }
              
              .checkout-steps-patch input,
              .checkout-steps-patch select,
              .checkout-steps-patch textarea {
                color: #ffffff !important;
                background-color: #1e1e1e !important;
                border-color: rgba(255, 255, 255, 0.1) !important;
              }

              .checkout-steps-patch button {
                background-color: #FF8C00 !important;
                color: #ffffff !important;
                font-weight: 700 !important;
                text-transform: uppercase !important;
                letter-spacing: 0.05em !important;
                transition: all 0.2s ease-in-out !important;
              }

              .checkout-steps-patch button:hover:not(:disabled) {
                background-color: #e07b00 !important;
                transform: translateY(-1px) !important;
              }

              .checkout-steps-patch button:active:not(:disabled) {
                transform: scale(0.98) !important;
              }

              .checkout-steps-patch button:disabled {
                opacity: 0.5 !important;
                cursor: not-allowed !important;
              }
            `}</style>

            {step === "address" && (
              <CheckoutAddress
                address={address}
                setAddress={setAddress}
                setStep={setStep}
                user={user}
              />
            )}

            {step === "payment" && (
              <CheckoutPayment
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                setStep={setStep}
              />
            )}

            {step === "review" && (
              <CheckoutReview
                address={address}
                items={items}
                handlePlaceOrder={handlePlaceOrder}
                loading={loading}
                total={total}
              />
            )}
          </div>

          {/* Sidebar de Resumen de Compra */}
          <div className="bg-[#121212] text-white rounded-2xl p-6 h-fit sticky top-24 border border-white/5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#FF8C00]" />
            
            <h3 className="text-[10px] font-bold text-[#A7A7A7] uppercase tracking-wider mb-4">
              Resumen del Pedido
            </h3>

            <div className="space-y-3 text-xs font-medium">
              <div className="flex justify-between text-[#A7A7A7]">
                <span>
                  Subtotal ({items.length} {items.length === 1 ? 'artículo' : 'artículos'})
                </span>
                <span className="font-bold text-white">{formatCurrency(cartTotal)}</span>
              </div>

              <div className="flex justify-between text-[#A7A7A7]">
                <span>Envío</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-400 font-bold uppercase tracking-wider">Gratis</span>
                  ) : (
                    <span className="font-bold text-white">{formatCurrency(deliveryFee)}</span>
                  )}
                </span>
              </div>

              <div className="flex justify-between text-[#A7A7A7]">
                <span>IVA (16%)</span>
                <span className="font-bold text-white">{formatCurrency(tax)}</span>
              </div>

              <div className="flex justify-between pt-4 border-t border-white/5 text-xs font-bold uppercase tracking-wider text-white">
                <span>Total</span>
                <span className="text-[#FF8C00] text-sm">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;