// frontend/src/hooks/proveedores/useGetProveedores.jsx
import { useState, useCallback } from 'react';
import { getProveedores } from '@services/proveedor.service.js';

/**
 * Hook para obtener lista de proveedores con filtros
 * @returns {Object} Estado y funciones
 */
export const useGetProveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Obtener proveedores con filtros opcionales
   * @param {Object} filtros - Filtros a aplicar
   * @param {string} [filtros.rol_proveedor] - Filtrar por rol
   * @param {string} [filtros.search] - Búsqueda general
   */
  const fetchProveedores = useCallback(async (filtros = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getProveedores(filtros);

      if (response.status === 'Success') {
        setProveedores(response.data || []);
        return response.data;
      } else {
        throw new Error(response.details || 'Error al obtener proveedores');
      }

    } catch (err) {
      const errorMessage = err.response?.data?.details || 
                          err.message || 
                          'Error al obtener proveedores';
      setError(errorMessage);
      console.error('Error en useGetProveedores:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Resetear estado
   */
  const reset = useCallback(() => {
    setProveedores([]);
    setLoading(false);
    setError(null);
  }, []);

  return {
    proveedores,
    loading,
    error,
    fetchProveedores,
    reset
  };
};

export default useGetProveedores;