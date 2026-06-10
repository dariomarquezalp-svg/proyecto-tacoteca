import React, { useEffect, useState, useCallback } from "react";
import { MapPin } from "lucide-react";
import toast from "react-hot-toast";

// Importamos lo necesario del contexto de autenticación
import { useAuth } from "../context/AuthContext";
import api from "../config/api";

// IMPORTACIONES CONSERVADAS
import AddressCard from "../components/AddressCard.jsx";
import AddressForm from "../components/AddressForm.jsx";

const Addresses = () => {
  const { updateUser, setUser, user } = useAuth();

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const initialFormState = { 
    label: "", 
    address: "", 
    city: "", 
    state: "", 
    zip: "", 
    isDefault: false,
    lat: null,
    lng: null
  };
  const [form, setForm] = useState(initialFormState);

  const resetForm = () => {
    setForm(initialFormState);
    setEditingId(null);
    setShowForm(false);
  };

  const getLocation = (retries = 3) => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("La geolocalización no está soportada por tu navegador"));
        return;
      }

      const attempt = () => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            if (retries > 0) {
              retries--;
              setTimeout(attempt, 1000);
            } else {
              reject(new Error(error.message || "No se pudieron obtener las coordenadas"));
            }
          },
          { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 }
        );
      };
      attempt();
    });
  };

  const safeUpdateUser = (updatedAddresses) => {
    if (typeof updateUser === "function") {
      updateUser({ addresses: updatedAddresses });
    } else if (typeof setUser === "function") {
      setUser((prev) => ({ ...prev, addresses: updatedAddresses }));
    } else {
      console.log("Aviso: No se localizó una función modificadora en AuthContext, cambios guardados localmente.");
    }
  };

  // 🔥 SUBMIT CONTROLADO (Sincronizado plano con tu backend)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadToast = toast.loading("Guardando ubicación en la Tacoteca...");
    try {
      let coords = { lat: form.lat, lng: form.lng };
      
      if (!coords.lat || !coords.lng) {
        try {
          coords = await getLocation();
        } catch (geoError) {
          console.warn("Geolocalización omitida o denegada, usando coordenadas por defecto.", geoError.message);
          coords = { lat: 25.6866, lng: -100.3161 }; 
        }
      }

      // Estructura limpia para req.body del Backend
      const payload = { 
        ...form, 
        lat: Number(coords.lat),
        lng: Number(coords.lng),
        email: user?.email || "usuario_anonimo@tacoteca.com" 
      };

      if (editingId) {
        const { data } = await api.put(`/addresses/${editingId}`, payload);
        const updatedList = data.addresses || [];
        setAddresses(updatedList);
        safeUpdateUser(updatedList);
        toast.success("¡Dirección actualizada correctamente!", { id: loadToast });
      } else {
        const { data } = await api.post(`/addresses`, payload);
        const updatedList = Array.isArray(data) ? data : data.addresses || [];
        setAddresses(updatedList);
        safeUpdateUser(updatedList);
        toast.success("¡Dirección guardada a la velocidad de la luz!", { id: loadToast });
      }
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Ocurrió un error al guardar", { id: loadToast });
    }
  };

  // 🗑️ NUEVA FUNCIÓN CRÍTICA: Eliminar la dirección vinculada al ID de Mongo
  const handleDeleteHandler = async (addr) => {
    const idToDelete = addr._id || addr.id;
    const userEmail = user?.email || "usuario_anonimo@tacoteca.com";

    // Salvavidas: si la dirección no tiene ID (es basura vieja), la borramos solo de la vista
    if (!idToDelete) {
      setAddresses((prev) => prev.filter((item) => item !== addr));
      toast.success("Tarjeta corrupta removida de la pantalla local");
      return;
    }

    const loadToast = toast.loading("Removiendo dirección de tus favoritos...");
    try {
      // Mandamos el ID en la URL y el email por Query String (?email=...) tal como lo espera tu Express
      const { data } = await api.delete(`/addresses/${idToDelete}?email=${userEmail}`);
      
      const updatedList = data.addresses || [];
      setAddresses(updatedList);
      safeUpdateUser(updatedList);
      toast.success("¡Dirección eliminada con éxito!", { id: loadToast });
    } catch (error) {
      console.error("Error al borrar del servidor:", error);
      toast.error(error.response?.data?.message || "No se pudo eliminar la ubicación", { id: loadToast });
    }
  };

  const onEditHandler = (addr) => {
    setForm({
      label: addr.label || "",
      address: addr.address || "",
      city: addr.city || "",
      state: addr.state || "",
      zip: addr.zip || "",
      isDefault: addr.isDefault || false,
      lat: addr.lat || null,
      lng: addr.lng || null
    });
    setEditingId(addr._id || addr.id);
    setShowForm(true);
  };

  const fetchAddresses = useCallback(() => {
    const userEmail = user?.email || "";
    api
      .get(`/addresses?email=${userEmail}`)
      .then(({ data }) => {
        setAddresses(Array.isArray(data) ? data : data.addresses || []);
      })
      .catch((error) => {
        console.error("Error al traer las direcciones del backend:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-[#FF8C00] selection:text-white py-10 px-4 mb-20">
      <div className="max-w-4xl mx-auto">
        
        {/* Encabezado Principal */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight">
            Mis <span className="text-[#FF8C00]">Direcciones</span>
          </h1>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-[#FF8C00] hover:bg-opacity-90 text-white text-xs font-bold px-5 py-2.5 rounded-full flex items-center gap-2 transition-all cursor-pointer"
            >
              <span className="text-sm font-light">+</span> Agregar Dirección
            </button>
          )}
        </div>

        {/* Componente Formulario */}
        {showForm && (
          <div className="mb-8">
            <AddressForm
              form={form}
              setForm={setForm}
              editingId={editingId}
              handleSubmit={handleSubmit}
              resetForm={resetForm}
            />
          </div>
        )}

        {/* Lista Dinámica de Direcciones */}
        {loading ? (
          <div className="text-center py-20 text-[#A7A7A7] flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#FF8C00] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-medium">Localizando tus puntos de entrega...</span>
          </div>
        ) : addresses.length === 0 ? (
          <div className="text-center py-16 bg-[#121212] text-white rounded-2xl border border-white/5 p-8 max-w-xl mx-auto relative overflow-hidden">
            <MapPin className="size-12 text-[#A7A7A7] mx-auto mb-4" />
            <h2 className="text-lg font-bold tracking-tight text-white mb-2">
              Sin direcciones guardadas
            </h2>
            <p className="text-xs text-[#A7A7A7] max-w-xs mx-auto mb-6">
              Registra dónde quieres recibir tus órdenes para hacer tus próximos pedidos a la velocidad de la luz.
            </p>
            
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex px-6 py-2.5 bg-[#FF8C00] text-white text-xs font-bold rounded-full hover:bg-opacity-90 transition-all cursor-pointer"
            >
              Dar de alta dirección
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((addr) => (
              <AddressCard
                key={addr._id || addr.id}
                addr={addr}
                onEditHandler={onEditHandler}
                // 🛠️ Pasamos la nueva función a la tarjeta para que el botón de borrar funcione al 100%
                onDeleteHandler={handleDeleteHandler} 
                setAddresses={setAddresses}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Addresses;