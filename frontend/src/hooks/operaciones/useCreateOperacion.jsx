import { useState } from 'react';
import { createOperacion, validateOperacion } from '@/services/operacion.service.js';

/**
 * Hook para crear una nueva operación
 * @param {Object} options - Opciones
 * @param {Function} options.onSuccess - Callback al crear exitosamente
 * @param {Function} options.onError - Callback al ocurrir error
 * @returns {Object} { create, loading, error, validationErrors }
 */
export function useCreateOperacion({ onSuccess, onError } = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);

  const create = async (operacionData) => {
    // Validar datos antes de enviar
    const validation = validateOperacion(operacionData);
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      if (onError) {
        onError({ message: 'Errores de validación', errors: validation.errors });
      }
      return { success: false, errors: validation.errors };
    }

    setLoading(true);
    setError(null);
    setValidationErrors([]);
    
    try {
      const response = await createOperacion(operacionData);
      
      if (response.status === 'Success') {
        if (onSuccess) {
          onSuccess(response.data);
        }
        return { success: true, data: response.data };
      } else {
        const errorMsg = response.message || 'Error al crear operación';
        setError(errorMsg);
        if (onError) {
          onError({ message: errorMsg });
        }
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMsg = err.message || 'Error de conexión';
      setError(errorMsg);
      if (onError) {
        onError({ message: errorMsg });
      }
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return {
    create,
    loading,
    error,
    validationErrors
  };
}