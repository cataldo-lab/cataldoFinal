import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { logout } from '@services/auth.service.js';
import '@styles/navbar.css';
import { useState } from "react";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(sessionStorage.getItem('usuario')) || '';
    const userRole = user?.rol;
    const [menuOpen, setMenuOpen] = useState(false);

    const logoutSubmit = () => {
        try {
            logout();
            navigate('/auth'); 
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    const toggleMenu = () => {
        if (!menuOpen) {
            removeActiveClass();
        } else {
            addActiveClass();
        }
        setMenuOpen(!menuOpen);
    };

    const removeActiveClass = () => {
        const activeLinks = document.querySelectorAll('.nav-menu ul li a.active');
        activeLinks.forEach(link => link.classList.remove('active'));
    };

    const addActiveClass = () => {
        const links = document.querySelectorAll('.nav-menu ul li a');
        links.forEach(link => {
            if (link.getAttribute('href') === location.pathname) {
                link.classList.add('active');
            }
        });
    };

    // Función para obtener las rutas según el rol
    const getRoutesByRole = () => {
        const routes = [
            {
                path: "/home",
                label: "Inicio",
                roles: ['administrador', 'gerente', 'trabajador_tienda', 'cliente']
            }
        ];

        // Rutas específicas por rol
        if (userRole === 'administrador') {
            routes.push(
                { path: "/users", label: "Usuarios", roles: ['administrador'] },
                { path: "/admin/dashboard", label: "Panel Admin", roles: ['administrador'] }
            );
        }

        if (userRole === 'gerente') {
            routes.push(
                { path: "/gerente/dashboard", label: "Dashboard", roles: ['gerente'] },
                { path: "/gerente/reports", label: "Reportes", roles: ['gerente'] }
            );
        }

        if (userRole === 'trabajador_tienda') {
            routes.push(
                { path: "/trabajador/operations", label: "Operaciones", roles: ['trabajador_tienda'] },
                { path: "/trabajador/products", label: "Productos", roles: ['trabajador_tienda'] },
                { path: "/trabajador/materials", label: "Materiales", roles: ['trabajador_tienda'] }
            );
        }

        if (userRole === 'cliente') {
            routes.push(
                { path: "/cliente/catalog", label: "Catálogo", roles: ['cliente'] },
                { path: "/cliente/orders", label: "Mis Pedidos", roles: ['cliente'] },
                { path: "/cliente/profile", label: "Mi Perfil", roles: ['cliente'] }
            );
        }

        return routes.filter(route => route.roles.includes(userRole));
    };

    const availableRoutes = getRoutesByRole();

    return (
        <nav className="navbar">
            <div className={`nav-menu ${menuOpen ? 'activado' : ''}`}>
                <ul>
                    {availableRoutes.map((route) => (
                        <li key={route.path}>
                            <NavLink 
                                to={route.path} 
                                onClick={() => { 
                                    setMenuOpen(false); 
                                    addActiveClass();
                                }} 
                                className={({ isActive }) => isActive ? 'active' : ''}
                            >
                                {route.label}
                            </NavLink>
                        </li>
                    ))}
                    <li>
                        <NavLink 
                            to="/auth" 
                            onClick={() => { 
                                logoutSubmit(); 
                                setMenuOpen(false); 
                            }} 
                        >
                            Cerrar sesión
                        </NavLink>
                    </li>
                </ul>
            </div>
            <div className="hamburger" onClick={toggleMenu}>
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </div>
        </nav>
    );
};

export default Navbar;