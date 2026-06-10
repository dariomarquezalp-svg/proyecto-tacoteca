import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowUpRight as ArrowUpRightIcon,
  ChevronDown as ChevronDownIcon,
  LogOut as LogOutIcon,
  MapPin as MapPinIcon,
  Menu as MenuIcon,
  Package as PackageIcon,
  Search as SearchIcon,
  Shield as ShieldIcon,
  ShoppingCart as ShoppingCartIcon,
  User as UserIcon,
  X as XIcon,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount = 0, setIsCartOpen = () => {} } = useCart() || {};
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const cleanQuery = searchQuery.trim();
    if (cleanQuery) {
      navigate(`/search?q=${encodeURIComponent(cleanQuery)}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="bg-[#121212] sticky top-0 z-50 border-b border-zinc-800/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 gap-4">
        
        {/* Logo de Tacoteca */}
        <Link to="/" className="flex items-center gap-2 text-[22px] font-serif font-medium shrink-0 text-[#ff8c00]">
          Tacoteca
        </Link>

        <div className="w-full flex items-center justify-end gap-4 lg:gap-10">
          
          {/* Enlaces de Navegación - Escritorio */}
          <div className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
            <Link to="/" className="hover:text-[#ff8c00] transition-colors">Inicio</Link>
            <Link to="/products" className="hover:text-[#ff8c00] transition-colors">Productos</Link>
            <Link to="/deals" className="text-[#ff8c00] hover:text-[#e07b00] transition-colors font-medium">Ofertas</Link>
          </div>
          
          {/* Barra de Búsqueda */}
          <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-sm text-xs sm:text-sm">
            <div className="relative w-full">
              <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Buscar comida, productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 p-2 bg-zinc-900 text-white rounded-full border border-zinc-800 outline-none focus:border-[#ff8c00]/60 transition-all"
              />
            </div>
          </form>

          {/* Acciones de la Derecha */}
          <div className="flex items-center gap-3">
            
            {/* Botón del Carrito */}
            <button className="relative p-2 rounded-xl hover:bg-zinc-900 transition-colors" onClick={() => setIsCartOpen(true)}>
              <ShoppingCartIcon className="size-5 text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 size-4 bg-[#ff8c00] text-zinc-950 text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Perfil de Usuario / Menú Móvil */}
            <div className="relative flex items-center">
              {user?.name ? (
                <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-900 transition-colors" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                  <div className="size-7 rounded-full bg-zinc-800 text-white flex items-center justify-center font-medium text-xs border border-zinc-700">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDownIcon className="size-3 text-zinc-400 hidden sm:block" />
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  {/* Botón Principal - Iniciar Sesión en Blanco */}
                  <Link to="/login" className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#ff8c00] rounded-full hover:bg-[#e07b00] transition-colors">
                    <UserIcon size={16} /> Iniciar Sesión
                  </Link>
                </div>
              )}

              {/* Botón Hamburguesa (Móvil) */}
              <div className="md:hidden ml-2 flex items-center">
                {userMenuOpen ? (
                  <XIcon className="cursor-pointer size-6 text-zinc-400" onClick={() => setUserMenuOpen(false)} />
                ) : (
                  <MenuIcon className="cursor-pointer size-6 text-zinc-400" onClick={() => setUserMenuOpen(true)} />
                )}
              </div>

              {/* Menú Desplegable Dropdown */}
              {userMenuOpen && (
                <>
                  {/* Fondo para cerrar el menú al hacer clic fuera */}
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  
                  <div className="absolute right-0 top-full mt-2 w-56 bg-[#161616] rounded-xl shadow-xl border border-zinc-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {user?.name && (
                      <div className="px-4 py-2 border-b border-zinc-800">
                        <p className="text-sm font-medium text-white truncate">{user.name}</p>
                        <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                      </div>
                    )}
                    
                    <div onClick={() => setUserMenuOpen(false)}>
                      {!user?.name && (
                        /* Botón Derecha/Interno - Ajustado también en naranja con letras blancas */
                        <Link to="/login" className="flex items-center gap-2 mx-2 my-1 px-4 py-2 text-sm font-semibold text-white bg-[#ff8c00] rounded-lg hover:bg-[#e07b00] transition-colors justify-center">
                          <UserIcon size={16} /> Iniciar Sesión
                        </Link>
                      )}
                      
                      {user?.name && (
                        <>
                          <Link to="/orders" className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-900 transition-colors">
                            <PackageIcon size={16} /> Mis Pedidos
                          </Link>
                          <Link to="/addresses" className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-900 transition-colors">
                            <MapPinIcon size={16} /> Direcciones
                          </Link>
                        </>
                      )}

                      {/* Enlaces de navegación interna (Solo visible en Móvil) */}
                      <Link to="/products" className="flex md:hidden items-center gap-2 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-900 transition-colors">
                        <ArrowUpRightIcon size={16} /> Productos
                      </Link>
                      <Link to="/deals" className="flex md:hidden items-center gap-2 px-4 py-2 text-sm text-[#ff8c00] hover:bg-zinc-900 transition-colors">
                        <ArrowUpRightIcon size={16} /> Ofertas
                      </Link>

                      {user?.isAdmin && (
                        <Link to="/admin/products" className="flex items-center gap-2 px-4 py-2 text-sm text-[#ff8c00] hover:bg-[#ff8c00]/10 transition-colors font-medium">
                          <ShieldIcon size={16} /> Panel Admin
                        </Link>
                      )}

                      {user?.name && (
                        <div className="border-t border-zinc-800 pt-1 mt-1">
                          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-950/40 w-full transition-colors text-left font-medium">
                            <LogOutIcon size={16} /> Cerrar Sesión
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;