// frontend/src/hooks/materiales/useUpdateMaterial.jsx
import { useState } from 'react';
import { updateMaterial } from '@services/materiales.service.js';


export function useUpdateMaterial() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleUpdateMaterial = async (id, materialData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      const response = await updateMaterial(id, materialData);
      
      if (response.success) {
        setSuccess(true);
        return [response.data, null];
      } else {
        setError(response.message);
        return [null, response.message];
      }
    } catch (err) {
      console.error('Error en useUpdateMaterial:', err);
      const errorMsg = 'Error inesperado al actualizar material';
      setError(errorMsg);
      return [null, errorMsg];
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    handleUpdateMaterial,
    loading,
    error,
    success,
    resetState
  };
}