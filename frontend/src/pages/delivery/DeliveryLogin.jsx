import { useEffect, useState } from "react";
import { BikeIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { heroSectionData } from "../../assets/assets";
import api from "../../config/api";
import toast from "react-hot-toast";

export default function DeliveryLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/delivery/login", { email, password });
      localStorage.setItem("delivery_token", data.token);
      localStorage.setItem("delivery_partner", JSON.stringify(data.partner));
      toast.success("Sesión iniciada");
      navigate("/delivery");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error al autenticar");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("delivery_token")) {
      navigate("/delivery");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex bg-[#000000] text-white">
      {/* Panel Izquierdo Oscuro */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#121212] relative items-center justify-center border-r border-white/5">
        <img
          src={heroSectionData.hero_image}
          alt=""
          className="absolute inset-0 object-cover h-full w-full opacity-10 bg-center"
        />
        <div className="relative text-center px-12">
          <h2 className="text-4xl font-extrabold text-white mb-2 uppercase tracking-tight">
            Portal de Reparto
          </h2>
          <p className="text-[#A7A7A7] text-base max-w-xs mx-auto">
            Gestiona tus rutas diarias y entregas con precisión en tiempo real.
          </p>
        </div>
      </div>

      {/* Formulario Estilo Spotify */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <BikeIcon className="size-6 text-[#FF8C00]" />
              <span className="text-xl font-bold tracking-tight text-white">Tacoteca Envíos</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Iniciar Sesión</h1>
            <p className="text-xs text-[#A7A7A7]">Turno de Distribución</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-[#121212] rounded-2xl p-8 space-y-5 border border-white/5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#2A2A2A] border border-transparent rounded-lg text-sm text-white placeholder-[#727272] focus:outline-none focus:border-[#FF8C00] transition-colors"
                placeholder="repartidor@tacoteca.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white mb-2">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#2A2A2A] border border-transparent rounded-lg text-sm text-white placeholder-[#727272] focus:outline-none focus:border-[#FF8C00] transition-colors"
                placeholder="••••••••"
              />
            </div>
            
            {/* Botón Naranja con Blanco */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#FF8C00] hover:bg-opacity-90 text-white font-bold text-sm rounded-full transition-all disabled:opacity-50 mt-2"
            >
              {loading ? "Accediendo..." : "Entrar a Ruta"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}