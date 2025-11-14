import axios from './root.service.js';
import cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { convertirMinusculas } from '@helpers/formatData.js';

export async function login(dataUser) {
    try {
        const response = await axios.post('/session/verify', {
            email: dataUser.email,
            password: dataUser.password
        });
        
        const { status, data } = response;
        
        if (status === 200) {
            const { token } = data.data;
            const decodedToken = jwtDecode(token);
            const { nombreCompleto, email, rut, rol } = decodedToken;
            const userData = { nombreCompleto, email, rut, rol };
            
            // Guardar datos del usuario en sessionStorage
            sessionStorage.setItem('usuario', JSON.stringify(userData));
            
            // Guardar token en cookie
            cookies.set('jwt-auth', token, { 
                path: '/', 
                expires: 1, // 1 día
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });
            
            // Configurar header de autorización para futuras peticiones
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            return response.data;
        }
    } catch (error) {
        // Detectar si la petición fue bloqueada por un bloqueador de anuncios
        if (error.message === 'Network Error' && !error.response) {
            return {
                status: 'error',
                message: 'La conexión fue bloqueada. Por favor, desactive su bloqueador de anuncios o extensiones de seguridad para este sitio e intente nuevamente.'
            };
        }
        return error.response?.data || { status: 'error', message: 'Error de conexión' };
    }
}

export async function register(data) {
    try {
        const dataRegister = convertirMinusculas(data);
        const { nombreCompleto, email, rut, password } = dataRegister;
        const response = await axios.post('/session/create', {
            nombreCompleto,
            email,
            rut,
            password
        });
        return response.data;
    } catch (error) {
        // Detectar si la petición fue bloqueada por un bloqueador de anuncios
        if (error.message === 'Network Error' && !error.response) {
            return {
                status: 'error',
                message: 'La conexión fue bloqueada. Por favor, desactive su bloqueador de anuncios o extensiones de seguridad para este sitio e intente nuevamente.'
            };
        }
        return error.response?.data || { status: 'error', message: 'Error de conexión' };
    }
}

export async function logout() {
    try {
        await axios.post('/session/end');
        
        // Limpiar datos del usuario
        sessionStorage.removeItem('usuario');
        
        // Limpiar cookies
        cookies.remove('jwt');
        cookies.remove('jwt-auth');
        
        // Limpiar header de autorización
        delete axios.defaults.headers.common['Authorization'];
        
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        
        // En caso de error, limpiar de todas formas los datos locales
        sessionStorage.removeItem('usuario');
        cookies.remove('jwt');
        cookies.remove('jwt-auth');
        delete axios.defaults.headers.common['Authorization'];
    }
}