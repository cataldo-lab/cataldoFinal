// frontend/src/hooks/proveedores/useGetProveedorById.jsx
import { useState, useCallback } from 'react';
import { getProveedorById } from '@services/proveedor.service.js';

/**
 * Hook para obtener un proveedor por ID con toda su información
 * Incluye: materiales, representantes, estadísticas y últimas compras
 * @returns {Object} Estado y funciones
 */
export const useGetProveedorById = () => {
  const [proveedor, setProveedor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Obtener proveedor por ID
   * @param {number} id - ID del proveedor
   */
  const fetchProveedor = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      setProveedor(null);

      if (!id || isNaN(parseInt(id))) {
        throw new Error('ID de proveedor inválido');
      }

      const response = await getProveedorById(parseInt(id));

      if (response.status === 'Success') {
        setProveedor(response.data);
        return response.data;
      } else {
        throw new Error(response.details || 'Proveedor no encontrado');
      }

    } catch (err) {
      const errorMessage = err.response?.data?.details || 
                          err.message || 
                          'Error al obtener proveedor';
      setError(errorMessage);
      console.error('Error en useGetProveedorById:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Resetear estado
   */
  const reset = useCallback(() => {
    setProveedor(null);
    setLoading(false);
    setError(null);
  }, []);

  return {
    proveedor,
    loading,
    error,
    fetchProveedor,
    reset
  };
};

export default useGetProveedorById;