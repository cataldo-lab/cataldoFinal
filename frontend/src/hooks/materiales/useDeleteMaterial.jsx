import { useState } from 'react';
import { deleteMaterial } from '@services/materiales.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

/**
 * Hook para desactivar materiales
 */
export const useDeleteMaterial = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Desactivar un material
   * @param {number} id - ID del material
   * @param {boolean} showAlert - Si mostrar alerta de confirmación
   * @returns {Promise<boolean>} true si fue exitoso
   */
  const handleDeleteMaterial = async (id, showAlert = true) => {
    try {
      setLoading(true);
      setError(null);

      if (!id || isNaN(parseInt(id))) {
        const errorMsg = 'ID de material inválido';
        setError(errorMsg);
        if (showAlert) showErrorAlert('Error', errorMsg);
        return false;
      }

      const response = await deleteMaterial(parseInt(id));

      if (response.status === 'Success') {
        if (showAlert) {
          showSuccessAlert(
            'Material desactivado',
            'El material ha sido desactivado correctamente'
          );
        }
        return true;
      } else {
        throw new Error(response.details || 'Error al desactivar material');
      }

    } catch (err) {
      const errorMessage = err.response?.data?.details || 
                          err.message || 
                          'Error al desactivar el material';
      setError(errorMessage);
      if (showAlert) showErrorAlert('Error', errorMessage);
      console.error('Error en useDeleteMaterial:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resetear estado
   */
  const reset = () => {
    setLoading(false);
    setError(null);
  };

  return {
    deleteMaterial: handleDeleteMaterial,
    loading,
    error,
    reset
  };
};

export default useDeleteMaterial;