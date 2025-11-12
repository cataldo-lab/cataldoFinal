// src/hooks/cliente/useGetMyOrderDetail.js

import { useState, useCallback } from 'react';
import { getMiPedidoById } from '@services/cliente.service';

/**
 * Hook para obtener el detalle de un pedido específico del cliente autenticado
 * @returns {Object} { pedido, loading, error, fetchPedido, clearPedido }
 */
export const useGetMyOrderDetail = () => {
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPedido = useCallback(async (id) => {
    if (!id) {
      setError('ID de pedido no proporcionado');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await getMiPedidoById(id);

      if (response.status === 'Success') {
        setPedido(response.data);
      } else {
        setError(response.message || 'Error al cargar el pedido');
        setPedido(null);
      }
    } catch (err) {
      const errorMsg = err.message || 'Error al cargar el pedido';
      setError(errorMsg);
      setPedido(null);
      console.error('Error en useGetMyOrderDetail:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearPedido = useCallback(() => {
    setPedido(null);
    setError(null);
  }, []);

  return {
    pedido,
    loading,
    error,
    fetchPedido,
    clearPedido
  };
};

export default useGetMyOrderDetail;
