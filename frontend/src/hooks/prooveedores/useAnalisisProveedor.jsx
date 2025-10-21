// frontend/src/hooks/proveedores/useAnalisisProveedor.jsx
import { useState, useCallback } from 'react';
import { getAnalisisProveedor } from '@services/proveedor.service.js';

/**
 * Hook para obtener análisis completo de un proveedor
 * Incluye materiales suministrados y estadísticas de compras
 * @returns {Object} Estado y funciones
 */
export const useAnalisisProveedor = () => {
  const [analisis, setAnalisis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Obtener análisis de proveedor
   * @param {number} id_proveedor - ID del proveedor
   */
  const fetchAnalisis = useCallback(async (id_proveedor) => {
    try {
      setLoading(true);
      setError(null);
      setAnalisis(null);

      if (!id_proveedor || isNaN(parseInt(id_proveedor))) {
        throw new Error('ID de proveedor inválido');
      }

      const response = await getAnalisisProveedor(parseInt(id_proveedor));

      if (response.status === 'Success') {
        setAnalisis(response.data);
        return response.data;
      } else {
        throw new Error(response.details || 'Error al obtener análisis');
      }

    } catch (err) {
      const errorMessage = err.response?.data?.details || 
                          err.message || 
                          'Error al obtener análisis del proveedor';
      setError(errorMessage);
      console.error('Error en useAnalisisProveedor:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtener resumen rápido de estadísticas
   * @returns {Object|null} Resumen de estadísticas
   */
  const getResumenEstadisticas = useCallback(() => {
    if (!analisis || !analisis.estadisticas) return null;

    const stats = analisis.estadisticas;

    return {
      totalMateriales: stats.total_materiales_suministrados || 0,
      totalCompras: stats.total_compras || 0,
      totalGastado: stats.total_gastado || 0,
      comprasPendientes: stats.compras_pendientes || 0,
      materialesBajoStock: stats.materiales_bajo_stock || 0,
      ultimaCompra: stats.ultima_compra || null
    };
  }, [analisis]);

  /**
   * Obtener materiales con alerta de stock
   * @returns {Array} Materiales con stock bajo o crítico
   */
  const getMaterialesConAlerta = useCallback(() => {
    if (!analisis || !analisis.materiales_suministrados) return [];

    return analisis.materiales_suministrados.filter(material => 
      material.estado_stock === 'bajo' || material.estado_stock === 'critico'
    );
  }, [analisis]);

  /**
   * Obtener top materiales por cantidad comprada
   * @param {number} limit - Número de materiales a retornar
   * @returns {Array} Top materiales
   */
  const getTopMateriales = useCallback((limit = 5) => {
    if (!analisis || !analisis.materiales_suministrados) return [];

    return [...analisis.materiales_suministrados]
      .sort((a, b) => b.total_comprado - a.total_comprado)
      .slice(0, limit);
  }, [analisis]);

  /**
   * Obtener top materiales por gasto
   * @param {number} limit - Número de materiales a retornar
   * @returns {Array} Top materiales por gasto
   */
  const getTopMaterialesPorGasto = useCallback((limit = 5) => {
    if (!analisis || !analisis.materiales_suministrados) return [];

    return [...analisis.materiales_suministrados]
      .sort((a, b) => b.total_gastado - a.total_gastado)
      .slice(0, limit);
  }, [analisis]);

  /**
   * Resetear estado
   */
  const reset = useCallback(() => {
    setAnalisis(null);
    setLoading(false);
    setError(null);
  }, []);

  return {
    analisis,
    loading,
    error,
    fetchAnalisis,
    getResumenEstadisticas,
    getMaterialesConAlerta,
    getTopMateriales,
    getTopMaterialesPorGasto,
    reset
  };
};

export default useAnalisisProveedor;