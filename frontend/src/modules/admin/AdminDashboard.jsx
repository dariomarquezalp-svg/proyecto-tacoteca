import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  PackageIcon,
  UsersIcon,
  ShoppingBagIcon,
  AlertTriangleIcon,
} from "lucide-react";

import Loading from "../../components/Loading";
import { statusColors } from "../../assets/assets";
import api from "../../config/api";
import formatCurrency from "../../utils/formatCurrency";

export default function AdminDashboard() {
  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "MX$";
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/stats")
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Error fetching admin stats:", err))
      .finally(() => setLoading(false));
  }, []);

  const cards = stats
    ? [
        { label: "Pedidos Totales", value: stats.totalOrders, icon: ShoppingBagIcon },
        { label: "Usuarios Registrados", value: stats.totalUsers, icon: UsersIcon },
        { label: "Platillos Activos", value: stats.totalProducts, icon: PackageIcon },
        { label: "Fuera de Stock", value: stats.outOfStock, icon: AlertTriangleIcon, isCritical: stats.outOfStock > 0 },
      ]
    : [];

  if (loading) return <Loading />;

  return (
    <div className="space-y-6 bg-[#000000] text-white min-h-screen p-1">
      {/* Mapeo de Tarjetas Analíticas en Gris Contenedor */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-[#121212] rounded-2xl p-5 border border-white/5 flex justify-between items-start gap-3"
          >
            <div>
              <p className="text-3xl font-extrabold text-white tracking-tight">{card.value}</p>
              <p className="text-xs font-medium text-[#A7A7A7] mt-1">{card.label}</p>
            </div>
            <div className={`size-9 rounded-xl flex items-center justify-center bg-[#2A2A2A] ${card.isCritical ? 'text-red-500' : 'text-[#FF8C00]'}`}>
              <card.icon className="size-4.5" />
            </div>
          </div>
        ))}
      </div>

      {/* Contenedor de Órdenes Recientes */}
      <div className="bg-[#121212] rounded-2xl border border-white/5 overflow-hidden">
        <div className="px-6 py-5 flex items-center justify-between border-b border-white/5">
          <h2 className="text-base font-bold text-white">Pedidos Recientes</h2>
          {/* Botón Naranja con Blanco para ver todo */}
          <Link
            to="/admin/orders"
            className="text-xs font-bold bg-[#FF8C00] text-white px-3 py-1.5 rounded-full hover:bg-opacity-90 transition-all"
          >
            Ver Todo
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-[#1C1C1C] text-[#A7A7A7] uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-3.5">ID Pedido</th>
                <th className="px-6 py-3.5">Cliente</th>
                <th className="px-6 py-3.5">Artículos</th>
                <th className="px-6 py-3.5">Total</th>
                <th className="px-6 py-3.5">Estado</th>
                <th className="px-6 py-3.5">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[#EAEAEA]">
              {stats?.recentOrders?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-[#A7A7A7]">
                    No hay registros disponibles.
                  </td>
                </tr>
              ) : (
                stats?.recentOrders?.map((order) => (
                  <tr key={order.id} className="hover:bg-[#1F1F1F] transition-colors">
                    <td className="px-6 py-4 font-mono text-gray-500 text-[11px]">
                      #{order.id ? order.id.slice(-6).toUpperCase() : ""}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-white">{order.user?.name || "Invitado"}</p>
                      <p className="text-[11px] text-[#A7A7A7]">{order.user?.email || ""}</p>
                    </td>
                    <td className="px-6 py-4 text-[#A7A7A7]">{order.items?.length || 0} pzs</td>
                    <td className="px-6 py-4 font-bold text-white">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${statusColors[order.status] || "bg-neutral-800 text-gray-400"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#A7A7A7]">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}