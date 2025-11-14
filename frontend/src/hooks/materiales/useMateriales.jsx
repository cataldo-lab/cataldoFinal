// frontend/src/hooks/materiales/useMateriales.jsx
import { useCallback } from 'react';
import { getMateriales } from '@services/materiales.service.js';
import { useApi } from '@hooks/shared/useApi.jsx';

/**
 * Hook simplificado para obtener materiales
 * @param {boolean} incluirInactivos - Si incluir materiales inactivos
 * @param {boolean} autoFetch - Si debe cargar automáticamente
 * @returns {Object} { materiales: data, loading, error, fetchMateriales: refetch, setMateriales: setData }
 */
export function useMateriales(incluirInactivos = false, autoFetch = true) {
  // Crear función memoizada para la API
  const apiFunction = useCallback(
    () => getMateriales(incluirInactivos),
    [incluirInactivos]
  );

  // Usar el hook genérico useApi
  const { data, loading, error, refetch, setData } = useApi(apiFunction, {
    autoFetch,
    initialData: []
  });

  return {
    materiales: data,
    loading,
    error,
    fetchMateriales: refetch,
    setMateriales: setData
  };
}

export default useMateriales;