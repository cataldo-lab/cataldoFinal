import { useCallback, useMemo } from 'react';
import { getOperacionById, formatOperacionData } from '@/services/operacion.service.js';
import { useApi } from '@hooks/shared/useApi.jsx';

/**
 * Hook simplificado para obtener una operación específica por ID
 * @param {number} id - ID de la operación
 * @param {boolean} autoLoad - Cargar automáticamente (default: true)
 * @returns {Object} { operacion, loading, error, refetch }
 */
export function useOperacion(id, autoLoad = true) {
  // Crear función memoizada para la API
  const apiFunction = useCallback(
    () => id ? getOperacionById(id) : Promise.resolve({ success: false, message: 'ID no proporcionado' }),
    [id]
  );

  // Usar el hook genérico useApi
  const { data, loading, error, refetch } = useApi(apiFunction, {
    autoFetch: autoLoad && !!id,
    initialData: null
  });

  // Formatear datos para la UI
  const operacion = useMemo(() => {
    return data ? formatOperacionData(data) : null;
  }, [data]);

  return {
    operacion,
    loading,
    error,
    refetch
  };
}