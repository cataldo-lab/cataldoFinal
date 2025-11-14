// frontend/src/hooks/materiales/useMaterial.jsx
import { useCallback } from 'react';
import { getMaterialById } from '@services/materiales.service.js';
import { useApi } from '@hooks/shared/useApi.jsx';

/**
 * Hook simplificado para obtener un material por ID
 * @param {number} id - ID del material
 * @param {boolean} autoFetch - Si debe cargar automáticamente
 * @returns {Object} { material: data, loading, error, fetchMaterial: refetch, setMaterial: setData }
 */
export function useMaterial(id, autoFetch = true) {
  // Crear función memoizada para la API
  const apiFunction = useCallback(
    () => id ? getMaterialById(id) : Promise.resolve({ success: false, message: 'ID no proporcionado' }),
    [id]
  );

  // Usar el hook genérico useApi
  const { data, loading, error, refetch, setData } = useApi(apiFunction, {
    autoFetch: autoFetch && !!id,
    initialData: null
  });

  return {
    material: data,
    loading,
    error,
    fetchMaterial: refetch,
    setMaterial: setData
  };
}