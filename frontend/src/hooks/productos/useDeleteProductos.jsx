// frontend/src/hooks/productos/useDeleteProductos.jsx
import { useState } from 'react';
import { deleteProducto } from '@services/producto.service.js';
import { showErrorAlert, showSuccessAlert, deleteDataAlert } from '@helpers/sweetAlert.js';

/**
 * Hook personalizado para manejar la eliminación de productos
 * Soporta eliminación individual y masiva
 */
export const useDeleteProductos = (productos, onDeleteSuccess) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * Elimina un producto individual
   * @param {number} id - ID del producto a eliminar
   */
  const handleDelete = async (id) => {
    try {
      const result = await deleteDataAlert();
      if (result.isConfirmed) {
        setIsDeleting(true);
        const response = await deleteProducto(id);

        if (response.status === 'Success') {
          showSuccessAlert('Éxito', 'Producto desactivado correctamente');
          setSelectedItems([]);

          // Llamar callback para actualizar la lista
          if (onDeleteSuccess) {
            await onDeleteSuccess();
          }

          return true;
        } else {
          showErrorAlert('Error', response.message || 'No se pudo desactivar el producto');
          return false;
        }
      }
      return false;
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      showErrorAlert('Error', 'No se pudo desactivar el producto');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Elimina múltiples productos de forma masiva
   */
  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) {
      showErrorAlert('Error', 'No hay productos seleccionados');
      return false;
    }

    try {
      const result = await deleteDataAlert();
      if (result.isConfirmed) {
        setIsDeleting(true);

        // Ejecutar todas las eliminaciones en paralelo
        const promises = selectedItems.map(id => deleteProducto(id));
        const responses = await Promise.all(promises);

        // Verificar si todas fueron exitosas
        const allSuccessful = responses.every(res => res.status === 'Success');

        if (allSuccessful) {
          showSuccessAlert('Éxito', `${selectedItems.length} productos desactivados correctamente`);
          setSelectedItems([]);

          // Llamar callback para actualizar la lista
          if (onDeleteSuccess) {
            await onDeleteSuccess();
          }

          return true;
        } else {
          const failedCount = responses.filter(res => res.status !== 'Success').length;
          showErrorAlert('Error', `${failedCount} de ${selectedItems.length} productos no pudieron ser desactivados`);
          return false;
        }
      }
      return false;
    } catch (error) {
      console.error('Error en eliminación masiva:', error);
      showErrorAlert('Error', 'No se pudieron desactivar los productos seleccionados');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Alterna la selección de un item individual
   * @param {number} id - ID del producto a alternar
   */
  const toggleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  /**
   * Alterna la selección de todos los items
   */
  const toggleSelectAll = () => {
    if (selectedItems.length === productos.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(productos.map(p => p.id_producto));
    }
  };

  /**
   * Limpia todos los items seleccionados
   */
  const clearSelection = () => {
    setSelectedItems([]);
  };

  /**
   * Verifica si un item está seleccionado
   * @param {number} id - ID del producto
   * @returns {boolean}
   */
  const isItemSelected = (id) => {
    return selectedItems.includes(id);
  };

  /**
   * Verifica si todos los items están seleccionados
   * @returns {boolean}
   */
  const areAllSelected = () => {
    return productos.length > 0 && selectedItems.length === productos.length;
  };

  return {
    selectedItems,
    isDeleting,
    handleDelete,
    handleBulkDelete,
    toggleSelectItem,
    toggleSelectAll,
    clearSelection,
    isItemSelected,
    areAllSelected
  };
};
