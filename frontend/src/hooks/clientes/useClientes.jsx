// src/hooks/clientes/useClientes.jsx

import { useCallback, useMemo } from 'react';
import { getAllClientes } from '../../services/clienteData.service.js';
import { useApi } from '@hooks/shared/useApi.jsx';

/**
 * Hook simplificado para obtener y manejar la lista de todos los clientes
 * @param {Object} options - Opciones de configuración
 * @param {boolean} options.autoFetch - Si debe cargar automáticamente (default: true)
 * @returns {Object} { clientes, total, loading, error, refetch }
 */
export const useClientes = ({ autoFetch = true } = {}) => {
  // Crear función memoizada para la API
  const apiFunction = useCallback(() => getAllClientes(), []);

  // Usar el hook genérico useApi
  const { data, loading, error, refetch } = useApi(apiFunction, {
    autoFetch,
    initialData: []
  });

  // Calcular clientes y total desde data
  const { clientes, total } = useMemo(() => {
    if (!data) return { clientes: [], total: 0 };

    const clientesData = data.clientes || data || [];
    return {
      clientes: clientesData,
      total: data.total || clientesData.length
    };
  }, [data]);

  return {
    clientes,
    total,
    loading,
    error,
    refetch
  };
};