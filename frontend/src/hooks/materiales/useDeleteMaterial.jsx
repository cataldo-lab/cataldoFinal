// frontend/src/hooks/materiales/useDeleteMaterial.jsx
import { useState } from 'react';
import { deleteMaterial, hardDeleteMaterial } from '@services/materiales.service.js';


export function useDeleteMaterial() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleDeleteMaterial = async (id, permanent = false) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      const response = permanent 
        ? await hardDeleteMaterial(id)
        : await deleteMaterial(id);
      
      if (response.success) {
        setSuccess(true);
        return [true, null];
      } else {
        setError(response.message);
        return [false, response.message];
      }
    } catch (err) {
      console.error('Error en useDeleteMaterial:', err);
      const errorMsg = 'Error inesperado al eliminar material';
      setError(errorMsg);
      return [false, errorMsg];
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    handleDeleteMaterial,
    loading,
    error,
    success,
    resetState
  };
}
export default useDeleteMaterial;