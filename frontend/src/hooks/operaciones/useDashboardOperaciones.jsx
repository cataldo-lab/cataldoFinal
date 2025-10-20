import { useState, useEffect, useCallback } from 'react';
import { getDashboardStatsOperaciones } from '@/services/operacion.service.js';

/**
 * Hook para obtener estadísticas del dashboard de operaciones
 * @param {boolean} autoLoad - Cargar automáticamente (default: true)
 * @param {number} refreshInterval - Intervalo de actualización en ms (opcional)
 * @returns {Object} { stats, loading, error, refetch }
 */
export function useDashboardOperaciones(autoLoad = true, refreshInterval = null) {
  const [stats, setStats] = useState({
    pendientes: 0,
    enProceso: 0,
    ingresosMes: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getDashboardStatsOperaciones();
      
      if (response.status === 'Success') {
        setStats(response.data || { pendientes: 0, enProceso: 0, ingresosMes: 0 });
      } else {
        setError(response.message || 'Error al cargar estadísticas');
      }
    } catch (err) {
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoLoad) {
      fetchStats();
    }
  }, [fetchStats, autoLoad]);

  // Auto-refresh opcional
  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const intervalId = setInterval(fetchStats, refreshInterval);
      return () => clearInterval(intervalId);
    }
  }, [fetchStats, refreshInterval]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
}