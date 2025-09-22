import axios from 'axios';
import cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000/api';

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Importante para cookies
});

// Interceptor para agregar el token a las peticiones
instance.interceptors.request.use(
  (config) => {
    // Intentar obtener el token de la cookie
    const token = cookies.get('jwt-auth');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar respuestas y errores
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si recibimos un error 401, limpiar la sesión
    if (error.response?.status === 401) {
      sessionStorage.removeItem('usuario');
      cookies.remove('jwt');
      cookies.remove('jwt-auth');
      delete instance.defaults.headers.common['Authorization'];
      
      // Redireccionar al login si no estamos ya ahí
      if (window.location.pathname !== '/auth') {
        window.location.href = '/auth';
      }
    }
    
    return Promise.reject(error);
  }
);

export default instance;