import { useState, useCallback } from 'react';
import { getMateriales, getMaterialesConResumen } from '@services/materiales.service.js';

/**
 * Hook para obtener lista de materiales con filtros
 * @param {boolean} conResumen - Si incluir resumen de compras y proveedor
 * @returns {Object} Estado y funciones para obtener materiales
 */
export const useGetMateriales = (conResumen = false) => {
  const [materiales, setMateriales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Obtener materiales con filtros opcionales
   * @param {Object} filtros - Filtros a aplicar
   * @param {string} [filtros.categoria_unidad] - Filtrar por categoría
   * @param {boolean} [filtros.activo] - Filtrar por estado activo
   * @param {boolean} [filtros.bajo_stock] - Solo materiales bajo stock
   * @param {number} [filtros.id_proveedor] - Filtrar por proveedor
   */
  const fetchMateriales = useCallback(async (filtros = {}) => {
    try {
      setLoading(true);
      setError(null);

      const serviceFunc = conResumen ? getMaterialesConResumen : getMateriales;
      const response = await serviceFunc(filtros);

      if (response.status === 'Success') {
        setMateriales(response.data || []);
        return response.data;
      } else {
        throw new Error(response.details || 'Error al obtener materiales');
      }

    } catch (err) {
      const errorMessage = err.response?.data?.details || 
                          err.message || 
                          'Error al obtener materiales';
      setError(errorMessage);
      console.error('Error en useGetMateriales:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [conResumen]);

  /**
   * Resetear estado
   */
  const reset = useCallback(() => {
    setMateriales([]);
    setLoading(false);
    setError(null);
  }, []);

  return {
    materiales,
    loading,
    error,
    fetchMateriales,
    reset
  };
};

export default useGetMateriales;