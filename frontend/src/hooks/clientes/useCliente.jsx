// src/hooks/clientes/useCliente.js

import { useState, useEffect, useCallback } from 'react';
import { getClienteById } from '../../services/clienteData.service.js';

/**
 * Hook para obtener un cliente específico por ID
 * @param {number} id - ID del cliente
 * @param {boolean} autoFetch - Si debe cargar automáticamente (default: true)
 * @returns {Object} { cliente, loading, error, refetch }
 */
export const useCliente = (id, autoFetch = true) => {
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  const fetchCliente = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const resultado = await getClienteById(id);
      
      if (resultado.success) {
        setCliente(resultado.data);
      } else {
        setError(resultado.message || 'Error al obtener cliente');
      }
    } catch (err) {
      setError(err.message || 'Error al obtener cliente');
      console.error('Error en useCliente:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (autoFetch && id) {
      fetchCliente();
    }
  }, [autoFetch, id, fetchCliente]);

  return {
    cliente,
    loading,
    error,
    refetch: fetchCliente
  };
};