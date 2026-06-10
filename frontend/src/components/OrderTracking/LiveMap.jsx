import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// 1. Configuración de iconos personalizados
const deliveryIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // Pin del repartidor
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const homeIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1216/1216844.png", // Pin azul/casa para el destino
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Componente auxiliar para recentrar y corregir el tamaño del mapa en tiempo real
const MapController = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    if (center && center.lat && center.lng) {
      // Forzar a Leaflet a recalcular el tamaño de su contenedor físico
      map.invalidateSize();
      map.setView([center.lat, center.lng], map.getZoom(), { animate: true });
    }
  }, [center, map]);

  return null;
};

const LiveMap = ({ order, liveLocation }) => {
  // Determinar el centro de la entrega (Dirección del usuario)
  const destination = {
    lat: order?.shippingAddress?.lat || 19.4326, // Fallback a CDMX si no hay lat
    lng: order?.shippingAddress?.lng || -99.1332, // Fallback a CDMX si no hay lng
  };

  // El foco prioritario es la ubicación en vivo del repartidor; si no hay, la casa del cliente
  const currentCenter = liveLocation?.lat && liveLocation?.lng ? liveLocation : destination;

  // Forzar un micro-delay de montado para asegurar que los estilos CSS de Leaflet estén inyectados en el DOM
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return <div className="w-full h-full bg-[#121212] animate-pulse rounded-2xl" />;
  }

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={[currentCenter.lat, currentCenter.lng]}
        zoom={15}
        zoomControl={false} // Estética limpia estilo Figma
        className="w-full h-full z-0 rounded-2xl"
      >
        {/* Capa de mapa con diseño limpio y minimalista (Voyager Dark/Light contrastado) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* MARCADOR 1: Ubicación de entrega (Casa del cliente) */}
        {destination.lat && destination.lng && (
          <Marker position={[destination.lat, destination.lng]} icon={homeIcon} />
        )}

        {/* MARCADOR 2: Repartidor en movimiento (Solo aparece si hay rastreo activo) */}
        {liveLocation?.lat && liveLocation?.lng && (
          <Marker position={[liveLocation.lat, liveLocation.lng]} icon={deliveryIcon} />
        )}

        {/* Controlador inteligente de refresco de coordenadas */}
        <MapController center={currentCenter} />
      </MapContainer>
    </div>
  );
};

export default LiveMap;