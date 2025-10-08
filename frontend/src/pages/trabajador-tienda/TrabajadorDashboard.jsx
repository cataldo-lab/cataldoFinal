// frontend/src/pages/TrabajadorDashboard.jsx
import { useState, useEffect } from 'react';
import '../../styles/trabajadorTienda/dasboard.css'
import { } from '../../hooks/trabajadorTienda/useTrabajadorDashborad.jsx'

const TrabajadorDashboard = () => {
    const [stats, setStats] = useState({
        operacionesPendientes: 0,
        operacionesEnProceso: 0,
        productosTotal: 0,
        materialesBajoStock: 0
    });

    useEffect(() => {
        // Aquí cargarías las estadísticas reales desde el backend
        loadDashboardStats();
    }, []);

    const loadDashboardStats = async () => {
        // Implementar llamadas a los servicios
        // Por ahora datos de ejemplo
        setStats({
            operacionesPendientes: 5,
            operacionesEnProceso: 3,
            productosTotal: 45,
            materialesBajoStock: 7
        });
    };

    return (
        <div className="dashboard-container">
            <h1>Panel de Trabajador</h1>
            
            {/* Tarjetas de estadísticas */}
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Operaciones Pendientes</h3>
                    <p className="stat-number">{stats.operacionesPendientes}</p>
                </div>
                
                <div className="stat-card">
                    <h3>En Proceso</h3>
                    <p className="stat-number">{stats.operacionesEnProceso}</p>
                </div>
                
                <div className="stat-card">
                    <h3>Total Productos</h3>
                    <p className="stat-number">{stats.productosTotal}</p>
                </div>
                
                <div className="stat-card warning">
                    <h3>Materiales Bajo Stock</h3>
                    <p className="stat-number">{stats.materialesBajoStock}</p>
                </div>
            </div>

            {/* Accesos rápidos */}
            <div className="quick-access">
                <h2>Accesos Rápidos</h2>
                <div className="quick-actions">
                    <button onClick={() => window.location.href = '/trabajador-tienda/operations'}>
                        📋 Ver Operaciones
                    </button>
                    <button onClick={() => window.location.href = '/trabajador-tienda/products'}>
                        📦 Gestionar Productos
                    </button>
                    <button onClick={() => window.location.href = '/trabajador-tienda/materials'}>
                        🔧 Ver Materiales
                    </button>
                    <button onClick={() => window.location.href = '/trabajador-tienda/clients'}>
                        👥 Ver Clientes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TrabajadorDashboard;