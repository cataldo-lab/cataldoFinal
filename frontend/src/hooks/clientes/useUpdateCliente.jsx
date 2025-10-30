// src/hooks/clientes/useUpdateCliente.js

import { useState, useCallback } from 'react';
import { updatePerfilFull, updateMedioPerfil } from '../../services/clienteData.service.js';

/**
 * Hook para actualizar clientes (perfil completo o medio perfil)
 * @returns {Object} { updateFull, updateMedio, loading, error, success, resetState }
 */
export const useUpdateCliente = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const updateFull = useCallback(async (userId, userData = {}, clienteData = {}) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const resultado = await updatePerfilFull(userId, userData, clienteData);

      if (resultado.success) {
        setSuccess(true);
        return resultado;
      } else {
        setError(resultado.message || 'Error al actualizar perfil');
        return resultado;
      }
    } catch (err) {
      const errorMsg = err.message || 'Error al actualizar perfil completo';
      setError(errorMsg);
      console.error('Error en updateFull:', err);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMedio = useCallback(async (userId, clienteData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const resultado = await updateMedioPerfil(userId, clienteData);

      if (resultado.success) {
        setSuccess(true);
        return resultado;
      } else {
        setError(resultado.message || 'Error al actualizar perfil');
        return resultado;
      }
    } catch (err) {
      const errorMsg = err.message || 'Error al actualizar medio perfil';
      setError(errorMsg);
      console.error('Error en updateMedio:', err);
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
    updateFull,
    updateMedio,
    loading,
    error,
    success,
    resetState
  };
};