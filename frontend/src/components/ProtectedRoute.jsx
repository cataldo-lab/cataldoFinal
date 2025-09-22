import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import cookies from 'js-cookie';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const checkAuth = () => {
            try {
                const storedUser = sessionStorage.getItem('usuario');
                const token = cookies.get('jwt-auth');
                
                if (storedUser && token) {
                    const userData = JSON.parse(storedUser);
                    setUser(userData);
                    setIsAuthenticated(true);
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Error verificando autenticación:', error);
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };
        
        checkAuth();
    }, []);
    
    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '18px'
            }}>
                Verificando autenticación...
            </div>
        );
    }
    
    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.rol)) {
        return <Navigate to="/home" replace />;
    }

    return children;
};

export default ProtectedRoute;