import { useState } from 'react';
import { updateEstadoOperacion } from '@/services/operacion.service.js';

/**
 * Hook para actualizar el estado de una operación
 * @param {Object} options - Opciones
 * @param {Function} options.onSuccess - Callback al actualizar exitosamente
 * @param {Function} options.onError - Callback al ocurrir error
 * @returns {Object} { updateEstado, loading, error }
 */
export function useEstadoOperacion({ onSuccess, onError } = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateEstado = async (id, nuevoEstado) => {
    if (!id) {
      const errorMsg = 'ID de operación no proporcionado';
      setError(errorMsg);
      if (onError) onError({ message: errorMsg });
      return { success: false, error: errorMsg };
    }

    if (!nuevoEstado) {
      const errorMsg = 'Estado no proporcionado';
      setError(errorMsg);
      if (onError) onError({ message: errorMsg });
      return { success: false, error: errorMsg };
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await updateEstadoOperacion(id, nuevoEstado);
      
      if (response.status === 'Success') {
        if (onSuccess) {
          onSuccess(response.data);
        }
        return { success: true, data: response.data };
      } else {
        const errorMsg = response.message || 'Error al actualizar estado';
        setError(errorMsg);
        if (onError) onError({ message: errorMsg });
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMsg = err.message || 'Error de conexión';
      setError(errorMsg);
      if (onError) onError({ message: errorMsg });
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return {
    updateEstado,
    loading,
    error
  };
}