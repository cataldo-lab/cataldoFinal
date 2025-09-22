import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cookies from 'js-cookie';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = () => {
            try {
                const storedUser = sessionStorage.getItem('usuario');
                const token = cookies.get('jwt-auth');

                if (storedUser && token) {
                    const userData = JSON.parse(storedUser);
                    setUser(userData);
                    setIsAuthenticated(true);
                } else {
                    // Si no hay token o usuario, limpiar todo
                    sessionStorage.removeItem('usuario');
                    cookies.remove('jwt-auth');
                    setUser(null);
                    setIsAuthenticated(false);
                    
                    // Solo redireccionar si no estamos en las páginas permitidas sin autenticación
                    const currentPath = window.location.pathname;
                    if (currentPath !== '/auth' && currentPath !== '/register') {
                        navigate('/auth');
                    }
                }
            } catch (error) {
                console.error('Error al verificar autenticación:', error);
                setUser(null);
                setIsAuthenticated(false);
                navigate('/auth');
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, [navigate]);

    const login = (userData, token) => {
        setUser(userData);
        setIsAuthenticated(true);
        sessionStorage.setItem('usuario', JSON.stringify(userData));
        cookies.set('jwt-auth', token, { 
            path: '/', 
            expires: 1,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        sessionStorage.removeItem('usuario');
        cookies.remove('jwt-auth');
        navigate('/auth');
    };

    if (loading) {
        return <div>Cargando...</div>; // O tu componente de loading
    }

    return (
        <AuthContext.Provider value={{ 
            isAuthenticated, 
            user, 
            login, 
            logout 
        }}>
            {children}
        </AuthContext.Provider>
    );
}