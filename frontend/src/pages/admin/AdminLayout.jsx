import { Navigate, NavLink, Outlet } from "react-router-dom";
import {
  PlusIcon,
  PackageSearchIcon,
  ShoppingBagIcon,
  LogOutIcon,
  BarChart3Icon,
  ShieldIcon,
  Truck,
} from "lucide-react";

import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";

export default function AdminLayout() {
  const { user, loading } = useAuth();

  const AdminLinkData = [
    { to: "/admin", label: "Dashboard", icon: BarChart3Icon, exact: true },
    { to: "/admin/products/new", label: "Agregar Platillo", icon: PlusIcon, exact: false },
    { to: "/admin/products", label: "Inventario Menú", icon: PackageSearchIcon, exact: false },
    { to: "/admin/orders", label: "Comandas", icon: ShoppingBagIcon, exact: false },
    { to: "/admin/delivery-partners", label: "Repartidores", icon: Truck, exact: false },
    { to: "/", label: "Volver a Inicio", icon: LogOutIcon, exact: true },
  ];

  // Desactivado temporalmente para desarrollo
  // if (loading) return null;
  // if (!user?.isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col">
      <div className="max-lg:hidden shrink-0">
        {/* 💡 Si se sigue rompiendo al guardar, comenta la línea de abajo temporalmente para verificar si el error viene de tu Navbar */}
        <Navbar />
      </div>
      
      {/* Contenedor flexible adaptable */}
      <div className="flex flex-col flex-1 lg:flex-row gap-6 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:h-[calc(100vh-80px)]">
        
        {/* Sidebar Estilo Spotify */}
        <aside className="w-full lg:w-60 shrink-0 h-fit bg-[#121212] rounded-2xl p-4 border border-white/5">
          <div className="pb-3 mb-3 border-b border-white/5">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 px-2 uppercase tracking-wide">
              <ShieldIcon className="size-4 text-[#FF8C00]" /> Terminal Admin
            </h2>
          </div>
          <nav className="flex flex-col gap-1">
            {AdminLinkData.map((link) => {
              // 🛠️ SOLUCIÓN: React necesita que los componentes inicien con Mayúscula
              const IconComponent = link.icon;

              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.exact}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
                      isActive
                        ? "bg-[#FF8C00] text-white shadow-lg shadow-[#FF8C00]/10" 
                        : "text-[#A7A7A7] hover:text-white hover:bg-[#2A2A2A]" 
                    }`
                  }
                >
                  <IconComponent className="size-4 shrink-0" /> {link.label}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        {/* Panel Central Scrolleable */}
        <main className="flex-1 overflow-y-auto no-scrollbar pb-10 h-full rounded-2xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
}