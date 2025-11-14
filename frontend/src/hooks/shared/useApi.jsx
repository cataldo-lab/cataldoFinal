// frontend/src/hooks/shared/useApi.jsx
import { useState, useEffect, useCallback } from 'react';

/**
 * Hook genérico para llamadas a API
 * Maneja estados de loading, error y data de forma consistente
 *
 * @param {Function} apiFunction - Función que hace la llamada a la API
 * @param {Object} options - Opciones de configuración
 * @param {boolean} options.autoFetch - Si debe ejecutar automáticamente al montar (default: true)
 * @param {*} options.initialData - Datos iniciales (default: null)
 * @param {Function} options.onSuccess - Callback cuando la llamada es exitosa
 * @param {Function} options.onError - Callback cuando hay un error
 * @returns {Object} { data, loading, error, execute, refetch, setData }
 */
export function useApi(apiFunction, options = {}) {
  const {
    autoFetch = true,
    initialData = null,
    onSuccess = null,
    onError = null
  } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiFunction(...args);

      // Soportar diferentes formatos de respuesta
      const isSuccess = response.success || response.status === 'Success';
      const responseData = response.data || response;

      if (isSuccess) {
        setData(responseData);
        if (onSuccess) onSuccess(responseData);
        return [responseData, null];
      } else {
        const errorMsg = response.message || 'Error en la petición';
        setError(errorMsg);
        if (onError) onError(errorMsg);
        return [null, errorMsg];
      }
    } catch (err) {
      const errorMsg = err.message || 'Error inesperado';
      console.error('Error en useApi:', err);
      setError(errorMsg);
      if (onError) onError(errorMsg);
      return [null, errorMsg];
    } finally {
      setLoading(false);
    }
  }, [apiFunction, onSuccess, onError]);

  useEffect(() => {
    if (autoFetch) {
      execute();
    }
  }, [autoFetch, execute]);

  return {
    data,
    loading,
    error,
    execute,
    refetch: execute,
    setData
  };
}

export default useApi;
