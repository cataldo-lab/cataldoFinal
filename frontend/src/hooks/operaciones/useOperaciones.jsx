import { useState, useCallback, useEffect } from 'react';
import { getOperaciones } from '@/services/operacion.service.js';
import { useApi } from '@hooks/shared/useApi.jsx';

/**
 * Hook simplificado para obtener lista de operaciones con filtros
 * @param {Object} filtrosIniciales - Filtros opcionales
 * @param {boolean} autoLoad - Cargar automáticamente al montar (default: true)
 * @returns {Object} { operaciones, loading, error, refetch, setFiltros }
 */
export function useOperaciones(filtrosIniciales = {}, autoLoad = true) {
  const [filtros, setFiltros] = useState(filtrosIniciales);

  // Crear función memoizada para la API
  const apiFunction = useCallback(
    () => getOperaciones(filtros),
    [filtros]
  );

  // Usar el hook genérico useApi
  const { data, loading, error, refetch } = useApi(apiFunction, {
    autoFetch: false,
    initialData: []
  });

  // Auto-cargar cuando cambian los filtros
  useEffect(() => {
    if (autoLoad) {
      refetch();
    }
  }, [filtros, autoLoad, refetch]);

  return {
    operaciones: data,
    loading,
    error,
    refetch,
    setFiltros
  };
}