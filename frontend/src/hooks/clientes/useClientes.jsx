// src/hooks/clientes/useClientes.jsx

import { useState, useEffect, useCallback } from 'react';
import { getAllClientes } from '../../services/clienteData.service.js';

/**
 * Hook para obtener y manejar la lista de todos los clientes
 * @param {Object} options - Opciones de configuración
 * @param {boolean} options.autoFetch - Si debe cargar automáticamente (default: true)
 * @returns {Object} { clientes, total, loading, error, refetch }
 */
export const useClientes = ({ autoFetch = true } = {}) => {
  const [clientes, setClientes] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  const fetchClientes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const resultado = await getAllClientes();
      
      if (resultado.success) {
        const clientesData = resultado.data?.clientes || resultado.data || [];
        setClientes(clientesData);
        setTotal(resultado.data?.total || clientesData.length);
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
    if (autoFetch) {
      fetchClientes();
    }
  }, [autoFetch, fetchClientes]);

  return {
    clientes,
    total,
    loading,
    error,
    refetch: fetchClientes
  };
};