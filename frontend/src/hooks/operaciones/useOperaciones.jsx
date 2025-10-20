import { useState, useEffect, useCallback } from 'react';
import { getOperaciones } from '@/services/operacion.service.js';

/**
 * Hook para obtener lista de operaciones con filtros
 * @param {Object} filtrosIniciales - Filtros opcionales
 * @param {boolean} autoLoad - Cargar automáticamente al montar (default: true)
 * @returns {Object} { operaciones, loading, error, refetch, setFiltros }
 */
export function useOperaciones(filtrosIniciales = {}, autoLoad = true) {
  const [operaciones, setOperaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState(filtrosIniciales);

  const fetchOperaciones = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getOperaciones(filtros);
      
      if (response.status === 'Success') {
        setOperaciones(response.data || []);
      } else {
        setError(response.message || 'Error al cargar operaciones');
        setOperaciones([]);
      }
    } catch (err) {
      setError(err.message || 'Error de conexión');
      setOperaciones([]);
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  useEffect(() => {
    if (autoLoad) {
      fetchOperaciones();
    }
  }, [fetchOperaciones, autoLoad]);

  return {
    operaciones,
    loading,
    error,
    refetch: fetchOperaciones,
    setFiltros
  };
}