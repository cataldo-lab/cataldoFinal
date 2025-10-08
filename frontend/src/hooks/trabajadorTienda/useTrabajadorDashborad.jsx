// frontend/src/hooks/trabajador/useTrabajadorDashboard.jsx
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
        try {
            const response = await getDashboardStats();
            if (response.status === 'Success') {
                setStats(response.data);
            } else {
                setError('Error al cargar estadísticas');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { stats, loading, error, reloadStats: loadStats };
};