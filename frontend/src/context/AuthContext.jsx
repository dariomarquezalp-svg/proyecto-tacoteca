import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // 👈 Importamos Axios

const AuthContext = createContext(undefined);

// Configuración base de axios para no repetir la URL todo el tiempo
const API_URL = "http://localhost:5000/api/auth"; 

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Mantiene al usuario conectado si recarga la página usando el token/user guardado
  useEffect(() => {
    const savedUser = localStorage.getItem('tacoteca_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // 1. INICIAR SESIÓN REAL (CONEXIÓN A BACKEND)
  const login = async (email, password) => {
    try {
      console.log("Intentando conectar al Backend para Login...");
      const response = await axios.post(`${API_URL}/login`, { email, password });
      
      // Si el backend responde con éxito, guardamos los datos reales del usuario
      const realUser = response.data.user || response.data; // Ajusta según la estructura de tu respuesta
      
      localStorage.setItem('tacoteca_user', JSON.stringify(realUser));
      setUser(realUser);
      navigate("/");
    } catch (error) {
      // Lanzamos el error para que el 'toast' de tu componente Login.jsx lo cachee y lo muestre
      throw error; 
    }
  };

  // 2. REGISTRO REAL (CONEXIÓN A MONGO)
  const register = async (nombre, email, password) => {
    try {
      console.log("Enviando datos de registro a MongoDB...");
      const response = await axios.post(`${API_URL}/register`, { 
        name: nombre, // Si en tu backend el esquema pide 'nombre' cámbialo a 'nombre: nombre'
        email, 
        password 
      });
      
      const realUser = response.data.user || response.data;
      
      localStorage.setItem('tacoteca_user', JSON.stringify(realUser));
      setUser(realUser);
      navigate("/");
    } catch (error) {
      throw error;
    }
  };

  // 3. CERRAR SESIÓN
  const logout = () => {
    console.log("Cerrando sesión...");
    localStorage.removeItem('tacoteca_user');
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};