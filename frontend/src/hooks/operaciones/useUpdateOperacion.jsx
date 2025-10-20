import { useState } from 'react';
import { updateOperacion } from '@/services/operacion.service.js';

/**
 * Hook para actualizar datos de una operación
 * @param {Object} options - Opciones
 * @param {Function} options.onSuccess - Callback al actualizar exitosamente
 * @param {Function} options.onError - Callback al ocurrir error
 * @returns {Object} { update, loading, error }
 */
export function useUpdateOperacion({ onSuccess, onError } = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const update = async (id, datosActualizados) => {
    if (!id) {
      const errorMsg = 'ID de operación no proporcionado';
      setError(errorMsg);
      if (onError) onError({ message: errorMsg });
      return { success: false, error: errorMsg };
    }

    if (!datosActualizados || Object.keys(datosActualizados).length === 0) {
      const errorMsg = 'No hay datos para actualizar';
      setError(errorMsg);
      if (onError) onError({ message: errorMsg });
      return { success: false, error: errorMsg };
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await updateOperacion(id, datosActualizados);
      
      if (response.status === 'Success') {
        if (onSuccess) {
          onSuccess(response.data);
        }
        return { success: true, data: response.data };
      } else {
        const errorMsg = response.message || 'Error al actualizar operación';
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
    update,
    loading,
    error
  };
}