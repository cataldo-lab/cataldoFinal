// frontend/src/hooks/proveedores/useDeleteProveedor.jsx
import { useState } from 'react';
import { deleteProveedor } from '@services/proveedor.service.js';
import { showErrorAlert, showSuccessAlert, deleteDataAlert } from '@helpers/sweetAlert.js';

/**
 * Hook para eliminar proveedores
 * @returns {Object} Estado y funciones
 */
export const useDeleteProveedor = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Eliminar un proveedor
   * @param {number} id - ID del proveedor
   * @param {boolean} confirm - Si mostrar confirmación
   * @returns {Promise<boolean>} true si se eliminó correctamente
   */
  const handleDeleteProveedor = async (id, confirm = true) => {
    try {
      // Validar ID
      if (!id || isNaN(parseInt(id))) {
        const errorMsg = 'ID de proveedor inválido';
        setError(errorMsg);
        showErrorAlert('Error', errorMsg);
        return false;
      }

      // Confirmación
      if (confirm) {
        const result = await deleteDataAlert();
        if (!result.isConfirmed) {
          return false;
        }
      }

      setLoading(true);
      setError(null);

      const response = await deleteProveedor(parseInt(id));

      if (response.status === 'Success') {
        showSuccessAlert(
          '¡Proveedor eliminado!',
          'El proveedor ha sido eliminado exitosamente'
        );
        return true;
      } else {
        throw new Error(response.details || 'Error al eliminar proveedor');
      }

    } catch (err) {
      const errorMessage = err.response?.data?.details || 
                          err.message || 
                          'Error al eliminar el proveedor';
      setError(errorMessage);
      showErrorAlert('Error', errorMessage);
      console.error('Error en useDeleteProveedor:', err);
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
    loading,
    error,
    deleteProveedor: handleDeleteProveedor,
    reset
  };
};

export default useDeleteProveedor;