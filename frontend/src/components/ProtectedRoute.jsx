import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Asegúrate de que esta ruta apunte a tu hook de autenticación

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // 1. Si está cargando el estado de autenticación, mostramos un spinner o pantalla de carga
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50/30">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 2. Si no hay usuario autenticado, redirigimos al login reemplazando el historial
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Si el usuario está autenticado, renderizamos las rutas hijas
  return <Outlet />;
};

export default ProtectedRoute;