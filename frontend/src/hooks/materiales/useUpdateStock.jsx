import { useState } from 'react';
import { updateStockMaterial } from '@services/materiales.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

/**
 * Hook para actualizar solo el stock de materiales
 */
export const useUpdateStock = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Actualizar stock de un material
   * @param {number} id - ID del material
   * @param {number} cantidad - Cantidad a modificar
   * @param {string} operacion - 'add', 'subtract', o 'set'
   * @returns {Promise<Object|null>} Material actualizado o null
   */
  const handleUpdateStock = async (id, cantidad, operacion = 'set') => {
    try {
      setLoading(true);
      setError(null);

      // Validaciones
      if (!id || isNaN(parseInt(id))) {
        const errorMsg = 'ID de material inválido';
        setError(errorMsg);
        showErrorAlert('Error', errorMsg);
        return null;
      }

      if (cantidad === undefined || cantidad === null || isNaN(parseFloat(cantidad))) {
        const errorMsg = 'La cantidad es requerida y debe ser un número';
        setError(errorMsg);
        showErrorAlert('Error', errorMsg);
        return null;
      }

      if (parseFloat(cantidad) < 0) {
        const errorMsg = 'La cantidad no puede ser negativa';
        setError(errorMsg);
        showErrorAlert('Error', errorMsg);
        return null;
      }

      const operacionesValidas = ['add', 'subtract', 'set'];
      if (!operacionesValidas.includes(operacion)) {
        const errorMsg = `Operación inválida. Use: ${operacionesValidas.join(', ')}`;
        setError(errorMsg);
        showErrorAlert('Error', errorMsg);
        return null;
      }

      // Llamar al servicio
      const response = await updateStockMaterial(
        parseInt(id),
        parseFloat(cantidad),
        operacion
      );

      if (response.status === 'Success') {
        const operacionTexto = {
          add: 'agregado',
          subtract: 'restado',
          set: 'establecido'
        };

        showSuccessAlert(
          'Stock actualizado',
          `Se ha ${operacionTexto[operacion]} ${cantidad} unidades correctamente`
        );
        return response.data;
      } else {
        throw new Error(response.details || 'Error al actualizar stock');
      }

    } catch (err) {
      const errorMessage = err.response?.data?.details || 
                          err.message || 
                          'Error al actualizar el stock';
      setError(errorMessage);
      showErrorAlert('Error', errorMessage);
      console.error('Error en useUpdateStock:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Agregar stock
   */
  const addStock = async (id, cantidad) => {
    return await handleUpdateStock(id, cantidad, 'add');
  };

  /**
   * Restar stock
   */
  const subtractStock = async (id, cantidad) => {
    return await handleUpdateStock(id, cantidad, 'subtract');
  };

  /**
   * Establecer stock
   */
  const setStock = async (id, cantidad) => {
    return await handleUpdateStock(id, cantidad, 'set');
  };

  /**
   * Resetear estado
   */
  const reset = () => {
    setLoading(false);
    setError(null);
  };

  return {
    updateStock: handleUpdateStock,
    addStock,
    subtractStock,
    setStock,
    loading,
    error,
    reset
  };
};

export default useUpdateStock;