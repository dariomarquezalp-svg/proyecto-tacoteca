import axios from "axios";

// 1. Prioriza la URL de producción, luego la de desarrollo con el prefijo /api que requiere Express
const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Interceptor de Peticiones: Adjunta automáticamente el token a cada llamado al backend
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token"); // Sincronizado con tu AuthContext
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Interceptor de Respuestas: Si el backend dice "No autorizado (401)", limpia la sesión y manda al Login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      
      // Evita un bucle infinito si el error 401 ocurre intentando loguearse o registrarse
      if (
        !window.location.pathname.includes("/login") &&
        !window.location.pathname.includes("/register")
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;