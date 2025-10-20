import { useState } from 'react';
import { deleteOperacion } from '@/services/operacion.service.js';

/**
 * Hook para anular una operación (solo gerentes)
 * @param {Object} options - Opciones
 * @param {Function} options.onSuccess - Callback al anular exitosamente
 * @param {Function} options.onError - Callback al ocurrir error
 * @param {boolean} options.requireConfirmation - Requiere confirmación (default: true)
 * @returns {Object} { deleteOp, loading, error }
 */
export function useDeleteOperacion({ onSuccess, onError, requireConfirmation = true } = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteOp = async (id) => {
    if (!id) {
      const errorMsg = 'ID de operación no proporcionado';
      setError(errorMsg);
      if (onError) onError({ message: errorMsg });
      return { success: false, error: errorMsg };
    }

    // Confirmación opcional
    if (requireConfirmation) {
      const confirmed = window.confirm('¿Está seguro de anular esta operación? Esta acción no se puede deshacer.');
      if (!confirmed) {
        return { success: false, cancelled: true };
      }
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await deleteOperacion(id);
      
      if (response.status === 'Success') {
        if (onSuccess) {
          onSuccess(response.data);
        }
        return { success: true, data: response.data };
      } else {
        const errorMsg = response.message || 'Error al anular operación';
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
    deleteOp,
    loading,
    error
  };
}