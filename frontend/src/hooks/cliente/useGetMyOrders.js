// src/hooks/cliente/useGetMyOrders.js

import { useState, useEffect, useCallback } from 'react';
import { getMisPedidos } from '@services/cliente.service';

/**
 * Hook para obtener y manejar la lista de pedidos del cliente autenticado
 * @param {Object} options - Opciones de configuración
 * @param {boolean} options.autoFetch - Si debe cargar automáticamente (default: true)
 * @param {Object} options.filtros - Filtros para la consulta { estado_operacion?, fecha_desde?, fecha_hasta? }
 * @returns {Object} { pedidos, loading, error, refetch }
 */
export const useGetMyOrders = ({ autoFetch = true, filtros = {} } = {}) => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  const fetchPedidos = useCallback(async (customFiltros = {}) => {
    try {
      setLoading(true);
      setError(null);

      const filtrosFinales = { ...filtros, ...customFiltros };
      const response = await getMisPedidos(filtrosFinales);

      if (response.status === 'Success') {
        setPedidos(response.data || []);
      } else {
        setError(response.message || 'Error al cargar los pedidos');
        setPedidos([]);
      }
    } catch (err) {
      const errorMsg = err.message || 'Error al cargar los pedidos';
      setError(errorMsg);
      setPedidos([]);
      console.error('Error en useGetMyOrders:', err);
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  useEffect(() => {
    if (autoFetch) {
      fetchPedidos();
    }
  }, [autoFetch, fetchPedidos]);

  return {
    pedidos,
    loading,
    error,
    refetch: fetchPedidos
  };
};

export default useGetMyOrders;
