import { useState, useCallback } from 'react';
import { getMaterialesBajoStock, getAlertasStock } from '@services/materiales.service.js';

/**
 * Hook para obtener alertas de stock
 * @returns {Object} Estado y funciones
 */
export const useAlertasStock = () => {
  const [alertas, setAlertas] = useState(null);
  const [materialesBajoStock, setMaterialesBajoStock] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Obtener alertas categorizadas de stock
   */
  const fetchAlertasStock = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAlertasStock();

      if (response.status === 'Success') {
        setAlertas(response.data);
        return response.data;
      } else {
        throw new Error(response.details || 'Error al obtener alertas');
      }

    } catch (err) {
      const errorMessage = err.response?.data?.details || 
                          err.message || 
                          'Error al obtener alertas de stock';
      setError(errorMessage);
      console.error('Error en useAlertasStock:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtener solo materiales bajo stock
   */
  const fetchMaterialesBajoStock = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getMaterialesBajoStock();

      if (response.status === 'Success') {
        setMaterialesBajoStock(response.data || []);
        return response.data;
      } else {
        throw new Error(response.details || 'Error al obtener materiales');
      }

    } catch (err) {
      const errorMessage = err.response?.data?.details || 
                          err.message || 
                          'Error al obtener materiales bajo stock';
      setError(errorMessage);
      console.error('Error en useAlertasStock:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtener contadores de alertas
   */
  const getContadores = useCallback(() => {
    if (!alertas) return null;

    return {
      critico: alertas.critico?.length || 0,
      bajo: alertas.bajo?.length || 0,
      medio: alertas.medio?.length || 0,
      normal: alertas.normal?.length || 0,
      total: (alertas.critico?.length || 0) + 
             (alertas.bajo?.length || 0) + 
             (alertas.medio?.length || 0) + 
             (alertas.normal?.length || 0)
    };
  }, [alertas]);

  /**
   * Resetear estado
   */
  const reset = useCallback(() => {
    setAlertas(null);
    setMaterialesBajoStock([]);
    setLoading(false);
    setError(null);
  }, []);

  return {
    alertas,
    materialesBajoStock,
    loading,
    error,
    fetchAlertasStock,
    fetchMaterialesBajoStock,
    getContadores,
    reset
  };
};

export default useAlertasStock;