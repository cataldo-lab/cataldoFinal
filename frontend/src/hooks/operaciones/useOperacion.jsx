import { useState, useEffect, useCallback } from 'react';
import { getOperacionById, formatOperacionData } from '@/services/operacion.service.js';

/**
 * Hook para obtener una operación específica por ID
 * @param {number} id - ID de la operación
 * @param {boolean} autoLoad - Cargar automáticamente (default: true)
 * @returns {Object} { operacion, loading, error, refetch }
 */
export function useOperacion(id, autoLoad = true) {
  const [operacion, setOperacion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOperacion = useCallback(async () => {
    if (!id) {
      setError('ID de operación no proporcionado');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await getOperacionById(id);
      
      if (response.status === 'Success') {
        // Formatear datos para la UI
        const operacionFormateada = formatOperacionData(response.data);
        setOperacion(operacionFormateada);
      } else {
        setError(response.message || 'Error al cargar operación');
        setOperacion(null);
      }
    } catch (err) {
      setError(err.message || 'Error de conexión');
      setOperacion(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (autoLoad && id) {
      fetchOperacion();
    }
  }, [fetchOperacion, autoLoad, id]);

  return {
    operacion,
    loading,
    error,
    refetch: fetchOperacion
  };
}