import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { logout } from '@services/auth.service.js';
import { useAuth } from '@context/AuthContext';
import '@styles/navbar.css';
import { useState, useEffect } from "react";

// ⭐ ROLES CONSISTENTES CON EL BACKEND
const RolePermissions = {
  administrador: ["administrador", "gerente", "trabajador_tienda", "cliente"],
  gerente: ["gerente", "trabajador_tienda", "cliente"],
  trabajador_tienda: ["trabajador_tienda", "cliente"],
  cliente: ["cliente"],
  usuario: ["cliente"],
  bloqueado: []
};

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    // Usuario y rol principal
    const user = auth?.user || JSON.parse(sessionStorage.getItem('usuario') || '{}');
    const userRole = user?.rol;
    const userName = user?.nombreCompleto || 'Usuario';

    // ⭐ Estado para el rol activo (el que está usando ahora)
    const [activeRole, setActiveRole] = useState(() => {
        return sessionStorage.getItem('activeRole') || userRole;
    });

    // ⭐ Obtener roles disponibles para el usuario
    const rolesDisponibles = RolePermissions[userRole] || [userRole];

    // Guardar rol activo en sessionStorage
    useEffect(() => {
        if (activeRole) {
            sessionStorage.setItem('activeRole', activeRole);
        }
    }, [activeRole]);

    const logoutSubmit = async () => {
        try {
            await logout();
            sessionStorage.removeItem('activeRole');
            if (auth?.logout) {
                auth.logout();
            }
            navigate('/auth', { replace: true }); 
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            sessionStorage.removeItem('usuario');
            sessionStorage.removeItem('activeRole');
            navigate('/auth', { replace: true });
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

    //  OBTENER RUTAS SEGÚN EL ROL ACTIVO
    const getRoutesByRole = () => {
        if (!activeRole) return [];

        const routes = [];

        // Rutas base para todos
        routes.push({ path: "/home", label: "Inicio" });

        // Rutas para administrador
        if (activeRole === "administrador") {
            routes.push(
                { path: "/users", label: "Usuarios" },
                { path: "/admin/dashboard", label: "Panel Admin" }
            );
        }

        // Rutas para gerente
        if (activeRole === "gerente" && rolesDisponibles.includes("gerente")) {
            routes.push(
                { path: "/gerente/dashboard", label: "Dashboard" },
                { path: "/gerente/reports", label: "Reportes" },
                { path: "/gerente/employees", label: "Empleados" }
            );
        }

        // Rutas para trabajador
        if (activeRole === "trabajador_tienda" && rolesDisponibles.includes("trabajador_tienda")) {
            routes.push(
                { path: "/trabajador/dashboard", label: "Dashboard" },
                { path: "/trabajador/operations", label: "Operaciones" },
                { path: "/trabajador/products", label: "Productos" },
                { path: "/trabajador/materials", label: "Materiales" }
            );
        }

        // Rutas para cliente (todos tienen acceso)
        if (activeRole === "cliente" && rolesDisponibles.includes("cliente")) {
            routes.push(
                { path: "/cliente/orders", label: "Mis Pedidos" },
                { path: "/cliente/profile", label: "Mi Perfil" }
            );
        }

        return routes;
    };

    const availableRoutes = getRoutesByRole();

    // Si no hay usuario, no mostrar navbar
    if (!user || !userRole) {
        return null;
    }

    // ⭐ Mapeo de nombres amigables - CONSISTENTES CON BACKEND
    const roleLabels = {
        administrador: "Administrador",
        gerente: "Gerente",
        trabajador_tienda: "Trabajador",
        cliente: "Cliente",
        usuario: "Usuario",
        bloqueado: "Bloqueado"
    };

    return (
        <nav className="navbar">
            <div className="navbar-user-info">
                <div className="user-avatar">
                    {userName.charAt(0).toUpperCase()}
                </div>
                <div className="user-details">
                    <span className="user-name">{userName}</span>
                    
                    {/* ⭐ Selector de rol si tiene múltiples roles */}
                    {rolesDisponibles.length > 1 ? (
                        <select 
                            className="role-selector"
                            value={activeRole}
                            onChange={(e) => setActiveRole(e.target.value)}
                        >
                            {rolesDisponibles.map(role => (
                                <option key={role} value={role}>
                                    {roleLabels[role] || role}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <span className="user-role">{roleLabels[userRole] || userRole}</span>
                    )}
                </div>
            </div>

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
                            onClick={(e) => { 
                                e.preventDefault();
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