// src/hooks/clientes/useSearchClientes.jsx

import { useState, useCallback } from 'react';
import { searchClientes } from '../../services/clienteData.service.js';

/**
 * Hook para buscar clientes con filtros
 * @returns {Object} { clientes, loading, error, search, clearResults, filtrosActivos }
 */
export const useSearchClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filtrosActivos, setFiltrosActivos] = useState({});

  const search = useCallback(async (filtros = {}) => {
    try {
      setLoading(true);
      setError(null);
      setFiltrosActivos(filtros);
      
      const resultado = await searchClientes(filtros);
      
      if (resultado.success) {
        setClientes(resultado.data || []);
      } else {
        setError(resultado.message || 'Error al buscar clientes');
        setClientes([]);
      }
    } catch (err) {
      setError(err.message || 'Error al buscar clientes');
      setClientes([]);
      console.error('Error en useSearchClientes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setClientes([]);
    setError(null);
    setFiltrosActivos({});
  }, []);

  return {
    clientes,
    loading,
    error,
    search,
    clearResults,
    filtrosActivos,
    total: clientes.length
  };
};