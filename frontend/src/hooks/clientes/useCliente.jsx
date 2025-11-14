// src/hooks/clientes/useCliente.js

import { useCallback } from 'react';
import { getClienteById } from '../../services/clienteData.service.js';
import { useApi } from '@hooks/shared/useApi.jsx';

/**
 * Hook simplificado para obtener un cliente específico por ID
 * @param {number} id - ID del cliente
 * @param {boolean} autoFetch - Si debe cargar automáticamente (default: true)
 * @returns {Object} { cliente, loading, error, refetch }
 */
export const useCliente = (id, autoFetch = true) => {
  // Crear función memoizada para la API
  const apiFunction = useCallback(
    () => id ? getClienteById(id) : Promise.resolve({ success: false, message: 'ID no proporcionado' }),
    [id]
  );

  // Usar el hook genérico useApi
  const { data, loading, error, refetch } = useApi(apiFunction, {
    autoFetch: autoFetch && !!id,
    initialData: null
  });

  return {
    cliente: data,
    loading,
    error,
    refetch
  };
};