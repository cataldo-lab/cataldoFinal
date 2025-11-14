// frontend/src/hooks/proveedores/useGetProveedores.jsx
import { useCallback } from 'react';
import { getProveedores } from '@services/proveedor.service.js';
import { useApi } from '@hooks/shared/useApi.jsx';

/**
 * Hook simplificado para obtener lista de proveedores con filtros
 * @param {boolean} autoFetch - Si debe cargar automáticamente (default: false)
 * @returns {Object} Estado y funciones
 */
export const useGetProveedores = (autoFetch = false) => {
  // Crear función memoizada para la API
  const apiFunction = useCallback(
    (filtros = {}) => getProveedores(filtros),
    []
  );

  // Usar el hook genérico useApi
  const { data, loading, error, execute, setData } = useApi(apiFunction, {
    autoFetch,
    initialData: []
  });

  /**
   * Resetear estado (limpiar datos)
   */
  const reset = useCallback(() => {
    setData([]);
  }, [setData]);

  return {
    proveedores: data,
    loading,
    error,
    fetchProveedores: execute,
    reset
  };
};

export default useGetProveedores;