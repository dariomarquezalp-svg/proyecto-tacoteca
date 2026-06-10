import React, { useState, useEffect } from "react";
import { X, Search, Navigation } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const AddressForm = ({ form, setForm, editingId, handleSubmit, resetForm }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loadingGPS, setLoadingGPS] = useState(false);

  const defaultLng = -100.3161;
  const defaultLat = 25.6866;
  
  const currentLat = Number(form.lat) || defaultLat;
  const currentLng = Number(form.lng) || defaultLng;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 🌍 DETECTOR PRECISO: Traduce coordenadas a texto real usando geocode.maps.co
  const handleCoordsChange = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://geocode.maps.co/reverse?lat=${lat}&lon=${lng}&api_key=67b5db30da6ae702381223gmo999d3e`
      );
      const data = await res.json();
      
      if (data && data.address) {
        const addr = data.address;
        
        // Unimos el nombre de la calle y el número de casa real de forma exacta
        let calleYNumero = "";
        if (addr.road) {
          calleYNumero = addr.house_number ? `${addr.road} ${addr.house_number}` : addr.road;
        } else {
          calleYNumero = data.display_name.split(",")[0] || "";
        }

        // Limpiamos palabras de relleno o códigos de manzana que a veces se cuelan
        calleYNumero = calleYNumero.replace(/Manzana \d+|Lote \d+/gi, "").trim();

        // Extraer Municipio y Ciudad reales de Nuevo León
        const municipioLimpio = addr.county || addr.subdistrict || "Gral. Escobedo";
        const ciudadLimpia = addr.city || addr.town || addr.suburb || "Gral. Escobedo";

        setForm((prev) => ({
          ...prev,
          address: calleYNumero || "Calle Conocida", 
          city: ciudadLimpia.replace(/[0-9]/g, "").trim(),
          state: municipioLimpio.replace(/[0-9]/g, "").trim(), 
          lat: lat,
          lng: lng,
        }));
      }
    } catch (err) {
      // Respaldo inmediato por si los servidores externos fallan
      setForm((prev) => ({
        ...prev,
        lat: lat,
        lng: lng,
      }));
    }
  };

  // 🚀 UBICACIÓN EN TIEMPO REAL (GPS)
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización.");
      return;
    }

    setLoadingGPS(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        handleCoordsChange(latitude, longitude);
        setLoadingGPS(false);
      },
      () => {
        handleCoordsChange(defaultLat, defaultLng);
        setLoadingGPS(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    if (!editingId && !form.lat && !form.lng) {
      handleGetLocation();
    }
  }, [editingId]);

  // 🔍 BUSCADOR DE DIRECCIONES INTEGRADO
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    try {
      const res = await fetch(
        `https://geocode.maps.co/search?q=${encodeURIComponent(searchQuery + ", Nuevo Leon, Mexico")}&api_key=67b5db30da6ae702381223gmo999d3e`
      );
      const data = await res.json();
      if (Array.isArray(data)) {
        setSuggestions(data);
      }
    } catch (err) {
      console.error("Error al buscar dirección:", err);
    }
  };

  const selectSuggestion = (sug) => {
    const lat = parseFloat(sug.lat);
    const lng = parseFloat(sug.lon);
    
    handleCoordsChange(lat, lng);
    setSuggestions([]);
    setSearchQuery("");
  };

  const ChangeMapView = ({ center }) => {
    const map = useMap();
    useEffect(() => {
      if (center[0] && center[1]) {
        map.setView(center, 17); 
        map.invalidateSize();
      }
    }, [center, map]);
    return null;
  };

  const MapEventsHandler = () => {
    useMapEvents({
      click(e) {
        handleCoordsChange(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  return (
    <div className="bg-[#121212] rounded-2xl border border-white/5 p-6 shadow-2xl mb-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#FF8C00]" />
      
      <div className="flex justify-between items-center mb-5 pb-3 border-b border-white/5">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          {editingId ? "Editar Dirección de Entrega" : "Agregar Nueva Dirección"}
        </h2>
        <button
          type="button"
          onClick={resetForm}
          className="p-1.5 text-[#A7A7A7] hover:text-white hover:bg-white/5 rounded-lg transition-all"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* 🗺️ MAPA */}
      <div className="mb-5 relative rounded-xl overflow-hidden border border-white/5 z-10">
        <div className="absolute top-3 left-3 right-3 z-[1000] max-w-md">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar dirección exacta (Ej: Cbtis 258, Escobedo)"
              className="w-full text-xs bg-[#1C1C1C] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white shadow-2xl focus:outline-none focus:border-[#FF8C00]"
            />
            <Search className="absolute left-3 top-3 size-4 text-[#FF8C00]" />
          </form>

          {suggestions.length > 0 && (
            <ul className="mt-1 bg-[#1C1C1C] border border-white/5 rounded-xl max-h-40 overflow-y-auto shadow-2xl divide-y divide-white/5 text-left">
              {suggestions.map((sug) => (
                <li
                  key={sug.place_id}
                  onClick={() => selectSuggestion(sug)}
                  className="px-4 py-2 text-[11px] text-[#A7A7A7] hover:bg-[#2A2A2A] hover:text-white cursor-pointer transition-colors truncate"
                >
                  {sug.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* BOTÓN GPS */}
        <button
          type="button"
          onClick={handleGetLocation}
          disabled={loadingGPS}
          className="absolute bottom-4 right-4 z-[1000] p-3 bg-[#FF8C00] hover:bg-[#e07b00] text-white rounded-full shadow-2xl transition-all flex items-center justify-center border border-white/10 cursor-pointer"
        >
          <Navigation className={`size-5 ${loadingGPS ? "animate-pulse" : ""}`} />
        </button>

        <MapContainer
          center={[currentLat, currentLng]}
          zoom={15}
          style={{ width: "100%", height: "288px", background: "#1C1C1C" }}
          zoomControl={false}
        >
          {/* Capa Híbrida de Google Maps Libre */}
          <TileLayer
            attribution='© <a href="https://maps.google.com">Google Maps</a>'
            url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          />
          <Marker 
            position={[currentLat, currentLng]} 
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const position = marker.getLatLng();
                handleCoordsChange(position.lat, position.lng);
              }
            }}
          />
          <ChangeMapView center={[currentLat, currentLng]} />
          <MapEventsHandler />
        </MapContainer>
      </div>

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div>
          <label className="block text-[10px] font-bold text-[#A7A7A7] uppercase tracking-widest mb-1.5">
            Nombre de la Dirección (Ej: Casa, Oficina, Cbtis)
          </label>
          <input
            type="text"
            name="label"
            required
            value={form.label || ""}
            onChange={handleChange}
            placeholder="Mi escuela"
            className="w-full text-xs bg-[#1C1C1C] border border-white/5 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-[#FF8C00] transition-all"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-[#A7A7A7] uppercase tracking-widest mb-1.5">
            Calle y Número (Auto-rellenado por el mapa)
          </label>
          <input
            type="text"
            name="address"
            required
            value={form.address || ""}
            onChange={handleChange}
            placeholder="Calle Prof. Plinio Ordóñez 604"
            className="w-full text-xs bg-[#1C1C1C] border border-white/5 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-[#FF8C00] transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-[#A7A7A7] uppercase tracking-widest mb-1.5">
              Ciudad
            </label>
            <input
              type="text"
              name="city"
              required
              value={form.city || ""}
              onChange={handleChange}
              placeholder="Gral. Escobedo"
              className="w-full text-xs bg-[#1C1C1C] border border-white/5 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-[#FF8C00]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#A7A7A7] uppercase tracking-widest mb-1.5">
              Municipio
            </label>
            <input
              type="text"
              name="state"
              value={form.state || ""}
              onChange={handleChange}
              placeholder="Gral. Escobedo"
              className="w-full text-xs bg-[#1C1C1C] border border-white/5 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-[#FF8C00]"
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5 pt-1">
          <input
            type="checkbox"
            id="isDefault"
            name="isDefault"
            checked={form.isDefault || false}
            onChange={handleChange}
            className="w-4 h-4 rounded-md text-[#FF8C00] cursor-pointer accent-[#FF8C00]"
          />
          <label htmlFor="isDefault" className="text-xs text-[#A7A7A7] font-medium cursor-pointer select-none">
            Establecer como dirección predeterminada
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/5 text-xs">
          <button
            type="button"
            onClick={resetForm}
            className="px-5 py-2.5 rounded-full border border-white/10 text-[#A7A7A7] font-bold hover:bg-white/5 transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-full bg-[#FF8C00] text-white font-black uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-[#FF8C00]/20"
          >
            {editingId ? "Actualizar" : "Guardar Dirección"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;