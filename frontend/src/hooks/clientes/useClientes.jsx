// src/hooks/clientes/useClientes.js

import { useState, useEffect, useCallback } from 'react';
import { getAllClientes } from '../../services/clienteData.service.js';

/**
 * Hook para obtener y manejar la lista de todos los clientes
 * @returns {Object} { clientes, loading, error, refetch }
 */
export const useClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClientes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const resultado = await getAllClientes();
      
      if (resultado.success) {
        setClientes(resultado.data || []);
      } else {
        setError(resultado.message || 'Error al obtener clientes');
      }
    } catch (err) {
      setError(err.message || 'Error al obtener clientes');
      console.error('Error en useClientes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  return {
    clientes,
    loading,
    error,
    refetch: fetchClientes
  };
};