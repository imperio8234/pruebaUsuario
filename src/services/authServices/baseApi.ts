import axios from 'axios';

const BACK_URL = import.meta.env.VITE_API_URL;

// Configuración de axios
export const backApi = axios.create({
  baseURL: BACK_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token automáticamente
backApi.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('access_token');
    console.log("token", token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores de token
backApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado, limpiar sessionStorage
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('refresh_token');
      // Opcional: redirigir al login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);