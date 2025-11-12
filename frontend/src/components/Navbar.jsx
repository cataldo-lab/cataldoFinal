import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { logout } from '@services/auth.service.js';
import { useAuth } from '@context/AuthContext';
import { useState, useEffect } from "react";
import { FaPowerOff } from 'react-icons/fa';
// ⭐ ROLES CONSISTENTES CON EL BACKEND
const RolePermissions = {
  administrador: ["administrador", "gerente", "trabajador_tienda"],
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
        setMenuOpen(!menuOpen);
    };

    // OBTENER RUTAS SEGÚN EL ROL ACTIVO
    const getRoutesByRole = () => {
        if (!activeRole) return [];

        const routes = [];

        // Rutas base para todos
        routes.push({ path: "/home", label: "Inicio" });

        // Rutas para administrador
        if (activeRole === "administrador") {
            routes.push(
                { path: "/users", label: "Usuarios" },
                { path: "/admin/auditoria", label: "Panel Logs" }
            );
        }

        // Rutas para gerente
        if (activeRole === "gerente" && rolesDisponibles.includes("gerente")) {
            routes.push(
                { path: "/gerente/dashboard", label: "Dashboard" },
            );
        }

        // Rutas para trabajador
        if (activeRole === "trabajador_tienda" && rolesDisponibles.includes("trabajador_tienda")) {
            routes.push(
                { path: "/trabajador/dashboard", label: "Dashboard" },
                { path: "/trabajador/papeles", label: "Papeles" },
                { path: "/trabajador/products", label: "Productos" },
                { path: "/trabajador/materiales", label: "Materiales" }
            );
        }

        // Rutas para cliente (todos tienen acceso)
        if (activeRole === "cliente" && rolesDisponibles.includes("cliente")) {
            routes.push(
                { path: "/cliente/pedidos", label: "Mis Pedidos" },
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
        <nav className="fixed w-full top-0 left-0 flex items-center justify-between bg-stone-600 h-[9vh] z-[1000] px-4 md:px-6 lg:px-8">
            {/* ⭐ INFORMACIÓN DEL USUARIO */}
            <div className="flex items-center gap-3 px-4 py-2 bg-white/10 rounded-lg transition-colors duration-300 hover:bg-white/15">
                {/* Avatar */}
                <div className="w-[35px] h-[35px] md:w-[38px] md:h-[38px] lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-[#ffc107] to-[#ff8f00] flex items-center justify-center text-[#036] font-bold text-base md:text-lg lg:text-xl shadow-md">
                    {userName.charAt(0).toUpperCase()}
                </div>
                
                {/* Detalles del usuario */}
                <div className="flex flex-col gap-0.5">
                    <span className="text-white font-semibold text-[0.85rem] md:text-[0.9rem] lg:text-[0.95rem] leading-tight max-w-[120px] md:max-w-none overflow-hidden text-ellipsis whitespace-nowrap">
                        {userName}
                    </span>
                    
                    {/* ⭐ Selector de rol si tiene múltiples roles */}
                    {rolesDisponibles.length > 1 ? (
                        <select 
                            className="bg-white/15 text-[#ffc107] border border-[#ffc107]/30 rounded-md px-2 py-1 text-[0.7rem] md:text-xs font-medium cursor-pointer transition-all duration-300 outline-none hover:bg-white/25 hover:border-[#ffc107]/50 focus:bg-white/30 focus:border-[#ffc107] focus:ring-2 focus:ring-[#ffc107]/20"
                            value={activeRole}
                            onChange={(e) => setActiveRole(e.target.value)}
                        >
                            {rolesDisponibles.map(role => (
                                <option key={role} value={role} className="bg-[#036] text-white py-2">
                                    {roleLabels[role] || role}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <span className="text-[#ffc107] text-[0.7rem] md:text-xs capitalize font-medium">
                            {roleLabels[userRole] || userRole}
                        </span>
                    )}
                </div>
            </div>

            {/* ⭐ MENÚ DE NAVEGACIÓN */}
            <div className={`${menuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row absolute md:relative top-[9vh] md:top-0 left-0 w-full md:w-auto bg-[#eef7ff] md:bg-transparent`}>
                <ul className="flex flex-col md:flex-row justify-center md:justify-end items-center list-none m-0 p-0 md:pr-8 w-full md:w-auto">
                    {availableRoutes.map((route) => (
                        <li key={route.path} className="w-full md:w-auto h-[60px] md:h-full flex items-center md:px-[30px]">
                            <NavLink 
                                to={route.path} 
                                onClick={() => setMenuOpen(false)} 
                                className={({ isActive }) => 
                                    `relative text-sm no-underline px-2.5 pb-0.5 transition-all duration-300 ${
                                        isActive 
                                            ? 'text-[#036] font-bold md:bg-[#eef7ff] md:text-[#002651] md:h-full md:leading-[9.1vh] md:font-bold md:m-0 md:pb-0 md:border-0' 
                                            : 'text-[#036] font-bold md:text-white md:font-normal md:before:content-[""] md:before:absolute md:before:bottom-0 md:before:left-0 md:before:w-full md:before:h-[3px] md:before:bg-[#006edf] md:before:scale-x-0 md:before:origin-bottom md:before:transition-transform md:before:duration-300 md:hover:before:scale-x-100'
                                    }`
                                }
                            >
                                {route.label}
                            </NavLink>
                        </li>
                    ))}
                    <li className="w-full md:w-auto h-[60px] md:h-full flex items-center md:px-[30px]">
                        <button
                            onClick={(e) => { 
                                e.preventDefault();
                                logoutSubmit(); 
                                setMenuOpen(false); 
                            }}
                            className="text-[#036] font-bold md:text-white md:font-normal text-sm no-underline relative px-2.5 pb-0.5 transition-all duration-300 md:before:content-[''] md:before:absolute md:before:bottom-0 md:before:left-0 md:before:w-full md:before:h-[3px] md:before:bg-[#006edf] md:before:scale-x-0 md:before:origin-bottom md:before:transition-transform md:before:duration-300 md:hover:before:scale-x-100 cursor-pointer bg-transparent border-0"
                        >
                            <FaPowerOff className="inline mr-2" />
                            Cerrar sesión
                        </button>
                    </li>
                </ul>
            </div>

            {/* ⭐ HAMBURGER MENU */}
            <button 
                className="flex md:hidden flex-col cursor-pointer z-[1001]" 
                onClick={toggleMenu}
                aria-label="Toggle menu"
            >
                <span className={`w-6 h-[3px] bg-white my-1 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`w-6 h-[3px] bg-white my-1 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-6 h-[3px] bg-white my-1 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>

            <style>{`
                @keyframes heartbeat {
                    0%, 50%, 100% { transform: scaleX(1); }
                    25%, 75% { transform: scaleX(1.2); }
                }
                @media (min-width: 768px) {
                    .md\\:hover\\:before\\:scale-x-100:hover::before {
                        animation: heartbeat 5s ease-in-out infinite;
                    }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;