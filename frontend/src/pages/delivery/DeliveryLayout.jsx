import { Outlet, useNavigate } from "react-router-dom";
import { LogOutIcon, TruckIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function DeliveryLayout() {
  const navigate = useNavigate();
  const [partner, setPartner] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("delivery_partner");
    const token = localStorage.getItem("delivery_token");
    if (!saved || !token) {
      navigate("/delivery/login");
      return;
    }
    setPartner(JSON.parse(saved));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("delivery_partner");
    localStorage.removeItem("delivery_token");
    setPartner(null);
    navigate("/delivery/login");
  };

  if (!partner) return null;

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans antialiased">
      {/* Top Bar integrada como el header de Spotify */}
      <header className="bg-[#121212] border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TruckIcon className="size-5 text-[#FF8C00]" />
            <span className="text-sm font-bold uppercase tracking-wider text-white">
              Tacoteca <span className="text-[#FF8C00]">Reparto</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-[#A7A7A7]">
              {partner.name}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 text-[#A7A7A7] hover:text-white bg-[#2A2A2A] hover:bg-[#3E3E3E] rounded-full transition-all"
            >
              <LogOutIcon className="size-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}