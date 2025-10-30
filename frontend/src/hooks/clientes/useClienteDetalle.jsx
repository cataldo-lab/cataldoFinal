// src/hooks/clientes/useClienteDetalle.js

import { useState, useEffect, useCallback } from 'react';
import { getUserById, getClienteDetalleById } from '../../services/clienteData.service.js';

/**
 * Hook para obtener detalles completos del cliente (usuario + cliente)
 * @param {number} id - ID del usuario
 * @returns {Object} { usuario, clienteDetalle, loading, error, refetch }
 */
export const useClienteDetalle = (id) => {
  const [usuario, setUsuario] = useState(null);
  const [clienteDetalle, setClienteDetalle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetalles = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Obtener ambos en paralelo para mejor rendimiento
      const [usuarioResult, detalleResult] = await Promise.all([
        getUserById(id),
        getClienteDetalleById(id)
      ]);

      if (usuarioResult.success) {
        setUsuario(usuarioResult.data);
      }

      if (detalleResult.success) {
        setClienteDetalle(detalleResult.data);
      }

      if (!usuarioResult.success && !detalleResult.success) {
        setError('Error al obtener los detalles del cliente');
      }
    } catch (err) {
      setError(err.message || 'Error al obtener detalles');
      console.error('Error en useClienteDetalle:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchDetalles();
    }
  }, [id, fetchDetalles]);

  return {
    usuario,
    clienteDetalle,
    loading,
    error,
    refetch: fetchDetalles
  };
};