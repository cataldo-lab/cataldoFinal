// frontend/src/hooks/trabajadorTienda/useTrabajadorDashborad.jsx
import { useState, useEffect } from 'react';
import { getDashboardStats } from '@services/trabajador.service.js';

export const useTrabajadorDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        setLoading(true);
        setError(null);
        
        try {
            console.log('🔍 Llamando a getDashboardStats...');
            const response = await getDashboardStats();
            
            console.log('📥 Respuesta recibida:', response);
            
            if (response.status === 'Success') {
                console.log('✅ Datos cargados:', response.data);
                setStats(response.data);
            } else {
                console.error('⚠️ Error en respuesta:', response);
                setError(response.message || 'Error al cargar estadísticas');
            }
        } catch (err) {
            console.error('❌ Error en loadStats:', err);
            setError(err.message || 'Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return { 
        stats, 
        loading, 
        error, 
        reloadStats: loadStats 
    };
};