// frontend/src/hooks/materiales/useUpdateMaterial.jsx
import { useState } from 'react';
import { updateMaterial } from '@services/materiales.service.js';

export function useUpdateMaterial() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpdateMaterial = async (id, materialData) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📤 ID del material:', id);
      console.log('📤 Datos a actualizar:', materialData);
      
      const response = await updateMaterial(id, materialData);
      console.log('📥 Respuesta recibida:', response);
      
      if (response.success) {
        return [response.data, null];
      } else {
        setError(response.message);
        return [null, response.message];
      }
    } catch (err) {
      console.error('❌ Error completo:', err);
      console.error('❌ Response data:', err.response?.data);
      const errorMessage = err.response?.data?.message || 'Error al actualizar material';
      setError(errorMessage);
      return [null, errorMessage];
    } finally {
      setLoading(false);
    }
  };

  return {
    handleUpdateMaterial,
    loading,
    error
  };
}

export default useUpdateMaterial;