import { useState, useCallback } from 'react';
import { getMaterialById, getMaterialDetalleCompleto } from '@services/materiales.service.js';

/**
 * Hook para obtener un material por ID
 * @param {boolean} detalleCompleto - Si obtener detalle completo
 * @returns {Object} Estado y funciones
 */
export const useGetMaterialById = (detalleCompleto = false) => {
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Obtener material por ID
   * @param {number} id - ID del material
   */
  const fetchMaterial = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      setMaterial(null);

      if (!id || isNaN(parseInt(id))) {
        throw new Error('ID de material inválido');
      }

      const serviceFunc = detalleCompleto ? getMaterialDetalleCompleto : getMaterialById;
      const response = await serviceFunc(parseInt(id));

      if (response.status === 'Success') {
        setMaterial(response.data);
        return response.data;
      } else {
        throw new Error(response.details || 'Material no encontrado');
      }

    } catch (err) {
      const errorMessage = err.response?.data?.details || 
                          err.message || 
                          'Error al obtener material';
      setError(errorMessage);
      console.error('Error en useGetMaterialById:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [detalleCompleto]);

  /**
   * Resetear estado
   */
  const reset = useCallback(() => {
    setMaterial(null);
    setLoading(false);
    setError(null);
  }, []);

  return {
    material,
    loading,
    error,
    fetchMaterial,
    reset
  };
};

export default useGetMaterialById;