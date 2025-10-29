// frontend/src/hooks/materiales/useCreateMaterial.jsx
import { useState } from 'react';
import { createMaterial } from '@services/materiales.service.js';


export function useCreateMaterial() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleCreateMaterial = async (materialData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      const response = await createMaterial(materialData);
      
      if (response.success) {
        setSuccess(true);
        return [response.data, null];
      } else {
        setError(response.message);
        return [null, response.message];
      }
    } catch (err) {
      console.error('Error en useCreateMaterial:', err);
      const errorMsg = 'Error inesperado al crear material';
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
    handleCreateMaterial,
    loading,
    error,
    success,
    resetState
  };
}