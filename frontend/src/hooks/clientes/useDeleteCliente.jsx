// src/hooks/clientes/useDeleteCliente.js

import { useState, useCallback } from 'react';
import { blockUserCliente, deleteUserCliente } from '../../services/clienteData.service.js';

/**
 * Hook para eliminar o bloquear clientes
 * @returns {Object} { blockCliente, deleteCliente, loading, error, success, resetState }
 */
export const useDeleteCliente = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const blockCliente = useCallback(async (userId, motivo = '') => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const resultado = await blockUserCliente(userId, motivo);

      if (resultado.success) {
        setSuccess(true);
        return resultado;
      } else {
        setError(resultado.message || 'Error al bloquear usuario');
        return resultado;
      }
    } catch (err) {
      const errorMsg = err.message || 'Error al bloquear usuario';
      setError(errorMsg);
      console.error('Error en blockCliente:', err);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCliente = useCallback(async (userId, softDelete = true) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const resultado = await deleteUserCliente(userId, softDelete);

      if (resultado.success) {
        setSuccess(true);
        return resultado;
      } else {
        setError(resultado.message || 'Error al eliminar usuario');
        return resultado;
      }
    } catch (err) {
      const errorMsg = err.message || 'Error al eliminar usuario';
      setError(errorMsg);
      console.error('Error en deleteCliente:', err);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const resetState = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  return {
    blockCliente,
    deleteCliente,
    loading,
    error,
    success,
    resetState
  };
};