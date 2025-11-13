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
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f5f5f5'
            }}>
                <div style={{
                    textAlign: 'center',
                    fontSize: '18px',
                    color: '#333'
                }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        border: '4px solid #f3f3f3',
                        borderTop: '4px solid #3498db',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 16px'
                    }}></div>
                    Inicializando...
                </div>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
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