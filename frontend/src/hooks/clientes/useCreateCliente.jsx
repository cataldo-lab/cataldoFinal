// src/hooks/clientes/useCreateCliente.js

import { useState, useCallback } from 'react';
import { createPerfilFull, createMedioPerfil } from '../../services/clienteData.service.js';

/**
 * Hook para crear clientes (perfil completo o medio perfil)
 * @returns {Object} { createFull, createMedio, loading, error, success, resetState }
 */
export const useCreateCliente = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const createFull = useCallback(async (userData, clienteData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const resultado = await createPerfilFull(userData, clienteData);

      if (resultado.success) {
        setSuccess(true);
        return resultado;
      } else {
        setError(resultado.message || 'Error al crear perfil');
        return resultado;
      }
    } catch (err) {
      const errorMsg = err.message || 'Error al crear perfil completo';
      setError(errorMsg);
      console.error('Error en createFull:', err);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const createMedio = useCallback(async (userId, clienteData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const resultado = await createMedioPerfil(userId, clienteData);

      if (resultado.success) {
        setSuccess(true);
        return resultado;
      } else {
        setError(resultado.message || 'Error al crear perfil');
        return resultado;
      }
    } catch (err) {
      const errorMsg = err.message || 'Error al crear medio perfil';
      setError(errorMsg);
      console.error('Error en createMedio:', err);
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
    createFull,
    createMedio,
    loading,
    error,
    success,
    resetState
  };
};