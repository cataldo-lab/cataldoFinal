// frontend/src/hooks/productos/useDeleteProducto.jsx
import { useState } from 'react';
import { deleteProducto } from '@services/producto.service.js';
import { showErrorAlert, showSuccessAlert, deleteDataAlert } from '@helpers/sweetAlert.js';

/**
 * Hook personalizado para manejar la eliminación de productos
 * Incluye confirmación con SweetAlert y manejo de estados
 */
export const useDeleteProducto = () => {
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * Elimina un producto después de confirmar con el usuario
   * @param {number} id - ID del producto a eliminar
   * @param {Function} onSuccess - Callback a ejecutar después de eliminar exitosamente
   * @returns {Promise<boolean>} - true si se eliminó, false si se canceló o falló
   */
  const handleDelete = async (id, onSuccess) => {
    try {
      // Mostrar alerta de confirmación
      const result = await deleteDataAlert();

      if (!result.isConfirmed) {
        return false;
      }

      setIsDeleting(true);
      const response = await deleteProducto(id);

      if (response.status === 'Success') {
        showSuccessAlert('Éxito', 'Producto eliminado correctamente');

        // Ejecutar callback de éxito si existe
        if (onSuccess && typeof onSuccess === 'function') {
          await onSuccess();
        }

        return true;
      } else {
        showErrorAlert('Error', response.message || 'No se pudo eliminar el producto');
        return false;
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      showErrorAlert('Error', 'Error al eliminar el producto');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Elimina múltiples productos en lote
   * @param {Array<number>} ids - Array de IDs de productos a eliminar
   * @param {Function} onSuccess - Callback a ejecutar después de eliminar exitosamente
   * @returns {Promise<boolean>} - true si se eliminaron, false si se canceló o falló
   */
  const handleBulkDelete = async (ids, onSuccess) => {
    if (!ids || ids.length === 0) {
      showErrorAlert('Error', 'No hay productos seleccionados');
      return false;
    }

    try {
      // Mostrar alerta de confirmación
      const result = await deleteDataAlert();

      if (!result.isConfirmed) {
        return false;
      }

      setIsDeleting(true);

      // Eliminar todos los productos en paralelo
      const promises = ids.map(id => deleteProducto(id));
      const responses = await Promise.all(promises);

      // Verificar si todas las eliminaciones fueron exitosas
      const allSuccess = responses.every(res => res.status === 'Success');
      const successCount = responses.filter(res => res.status === 'Success').length;

      if (allSuccess) {
        showSuccessAlert('Éxito', `${successCount} productos eliminados correctamente`);

        // Ejecutar callback de éxito si existe
        if (onSuccess && typeof onSuccess === 'function') {
          await onSuccess();
        }

        return true;
      } else {
        showErrorAlert(
          'Parcialmente completado',
          `Se eliminaron ${successCount} de ${ids.length} productos`
        );

        // Ejecutar callback de éxito parcial
        if (successCount > 0 && onSuccess && typeof onSuccess === 'function') {
          await onSuccess();
        }

        return false;
      }
    } catch (error) {
      console.error('Error al eliminar productos en lote:', error);
      showErrorAlert('Error', 'Error al eliminar los productos seleccionados');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    handleDelete,
    handleBulkDelete,
    isDeleting
  };
};
