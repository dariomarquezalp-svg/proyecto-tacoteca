import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  User as UserIcon,
  Mail as MailIcon,
  Lock as LockIcon,
  Loader2 as Loader2Icon,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
} from "lucide-react";

const Login = () => {
  const [esEstadoLogin, setEsEstadoLogin] = useState(true);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      if (esEstadoLogin) {
        await login(email, password);
      } else {
        await register(nombre, email, password);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error?.message || "Ocurrió un error");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#000000] text-white selection:bg-[#FF8C00] selection:text-white">
      
      {/* SECCIÓN IZQUIERDA: HERO VISUAL (AJUSTADA: UN POQUITO MÁS CLARA) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#000000] relative items-center justify-center overflow-hidden border-r border-white/5">
        <img
          src="https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=1200&q=80"
          alt="Tacos al Pastor Tacoteca"
          className="absolute inset-0 object-cover h-full w-full opacity-35 mix-blend-luminosity"
        />
        {/* Gradiente intermedio para dejar ver mejor la silueta del taco */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/60 to-[#000000]/85" />
        
        <div className="relative text-center px-12 z-10">
          <h2 className="text-5xl font-bold uppercase tracking-tight">
            Taco<span className="text-[#FF8C00]">teca</span>
          </h2>
          <p className="text-[#A7A7A7] text-sm font-medium uppercase tracking-wider mt-2">
            Tacos al pastor, asada y campechanos.
          </p>
        </div>
      </div>

      {/* SECCIÓN DERECHA: FORMULARIO DE ACCESO */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-[#000000]">
        <div className="w-full max-w-md bg-[#121212] p-10 rounded-2xl border border-white/5 shadow-xl">
          
          {/* ENCABEZADO */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-bold uppercase tracking-tight hover:text-[#FF8C00] transition-colors">
                Taco<span className="text-[#FF8C00]">teca</span>
              </span>
            </Link>
            
            <h1 className="text-xl font-bold uppercase tracking-tight mb-1.5">
              {esEstadoLogin ? "Ingresar" : "Registrarse"}
            </h1>
            
            <p className="text-xs text-[#A7A7A7]">
              {esEstadoLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
              <button
                type="button"
                onClick={() => setEsEstadoLogin(!esEstadoLogin)}
                className="text-[#FF8C00] font-bold hover:underline ml-1.5 cursor-pointer"
              >
                {esEstadoLogin ? "Crear una" : "Ingresar"}
              </button>
            </p>
          </div>

          {/* FORMULARIO */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* CAMPO: NOMBRE (SOLO EN REGISTRO) */}
            {!esEstadoLogin && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider">Nombre</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A7A7A7]" />
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required={!esEstadoLogin}
                    placeholder="Tu nombre"
                    className="w-full pl-11 pr-4 py-3 bg-[#2A2A2A] text-sm rounded-lg placeholder-[#727272] focus:outline-none focus:border-[#FF8C00] border border-transparent transition-colors"
                  />
                </div>
              </div>
            )}

            {/* CAMPO: CORREO ELECTRÓNICO */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider">Correo Electrónico</label>
              <div className="relative">
                <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A7A7A7]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="correo@ejemplo.com"
                  className="w-full pl-11 pr-4 py-3 bg-[#2A2A2A] text-sm rounded-lg placeholder-[#727272] focus:outline-none focus:border-[#FF8C00] border border-transparent transition-colors"
                />
              </div>
            </div>

            {/* CAMPO: CONTRASEÑA */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider">Contraseña</label>
              <div className="relative">
                <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A7A7A7]" />
                <input
                  type={mostrarPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-12 py-3 bg-[#2A2A2A] text-sm rounded-lg placeholder-[#727272] focus:outline-none focus:border-[#FF8C00] border border-transparent transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A7A7A7] hover:text-[#FF8C00] transition-colors cursor-pointer"
                >
                  {mostrarPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* BOTÓN DE ENVÍO */}
            <button
              type="submit"
              disabled={cargando}
              className="w-full py-3 bg-[#FF8C00] text-white text-sm font-bold rounded-full uppercase tracking-wider hover:bg-opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-6 flex items-center justify-center cursor-pointer shadow-md shadow-[#FF8C00]/10"
            >
              {cargando ? (
                <Loader2Icon className="w-4 h-4 animate-spin" />
              ) : esEstadoLogin ? (
                "Ingresar"
              ) : (
                "Registrarse"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;