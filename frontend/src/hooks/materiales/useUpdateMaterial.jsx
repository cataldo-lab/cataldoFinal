import { useState } from 'react';
import { updateMaterial } from '@services/materiales.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

/**
 * Hook personalizado para actualizar materiales existentes
 * @returns {Object} Estado y funciones para actualizar materiales
 */
export const useUpdateMaterial = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [material, setMaterial] = useState(null);

  /**
   * Validar datos del material antes de actualizar
   * @param {Object} materialData - Datos del material a validar
   * @returns {Object} { isValid, errors }
   */
  const validateMaterialData = (materialData) => {
    const errors = {};

    // Validar nombre (si se proporciona)
    if (materialData.nombre_material !== undefined && 
        materialData.nombre_material.trim() === '') {
      errors.nombre_material = 'El nombre del material no puede estar vacío';
    }

    // Validar precio unitario (si se proporciona)
    if (materialData.precio_unitario !== undefined) {
      const precio = parseFloat(materialData.precio_unitario);
      if (isNaN(precio) || precio <= 0) {
        errors.precio_unitario = 'El precio unitario debe ser mayor a 0';
      }
    }

    // Validar existencia (si se proporciona)
    if (materialData.existencia_material !== undefined) {
      const existencia = parseFloat(materialData.existencia_material);
      if (isNaN(existencia) || existencia < 0) {
        errors.existencia_material = 'La existencia no puede ser negativa';
      }
    }

    // Validar stock mínimo (si se proporciona)
    if (materialData.stock_minimo !== undefined) {
      const stockMin = parseFloat(materialData.stock_minimo);
      if (isNaN(stockMin) || stockMin < 0) {
        errors.stock_minimo = 'El stock mínimo no puede ser negativo';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };

  /**
   * Actualizar un material existente
   * @param {number} id - ID del material a actualizar
   * @param {Object} materialData - Datos a actualizar (todos opcionales)
   * @param {string} [materialData.nombre_material] - Nuevo nombre
   * @param {number} [materialData.existencia_material] - Nueva existencia
   * @param {string} [materialData.unidad_medida] - Nueva unidad
   * @param {number} [materialData.precio_unitario] - Nuevo precio
   * @param {number} [materialData.stock_minimo] - Nuevo stock mínimo
   * @param {boolean} [materialData.activo] - Nuevo estado activo
   * @returns {Promise<Object|null>} Material actualizado o null si hay error
   */
  const handleUpdateMaterial = async (id, materialData) => {
    try {
      setLoading(true);
      setError(null);
      setMaterial(null);

      // Validar ID
      if (!id || isNaN(parseInt(id))) {
        const errorMsg = 'ID de material inválido';
        setError(errorMsg);
        showErrorAlert('Error', errorMsg);
        return null;
      }

      // Validar que haya al menos un campo para actualizar
      if (!materialData || Object.keys(materialData).length === 0) {
        const errorMsg = 'No hay datos para actualizar';
        setError(errorMsg);
        showErrorAlert('Error', errorMsg);
        return null;
      }

      // Validar datos antes de enviar
      const validation = validateMaterialData(materialData);
      if (!validation.isValid) {
        const errorMessage = Object.values(validation.errors).join('\n');
        setError(validation.errors);
        showErrorAlert('Datos inválidos', errorMessage);
        return null;
      }

      // Preparar datos (limpiar y formatear solo los campos proporcionados)
      const dataToSend = {};

      if (materialData.nombre_material !== undefined) {
        dataToSend.nombre_material = materialData.nombre_material.trim();
      }

      if (materialData.unidad_medida !== undefined) {
        dataToSend.unidad_medida = materialData.unidad_medida;
      }

      if (materialData.precio_unitario !== undefined) {
        dataToSend.precio_unitario = parseFloat(materialData.precio_unitario);
      }

      if (materialData.existencia_material !== undefined) {
        dataToSend.existencia_material = parseFloat(materialData.existencia_material);
      }

      if (materialData.stock_minimo !== undefined) {
        dataToSend.stock_minimo = parseFloat(materialData.stock_minimo);
      }

      if (materialData.activo !== undefined) {
        dataToSend.activo = Boolean(materialData.activo);
      }

      // Llamar al servicio
      const response = await updateMaterial(parseInt(id), dataToSend);

      if (response.status === 'Success') {
        setMaterial(response.data);
        showSuccessAlert(
          '¡Material actualizado!',
          `${response.data.nombre_material} se ha actualizado exitosamente`
        );
        return response.data;
      } else {
        throw new Error(response.details || 'Error al actualizar material');
      }

    } catch (err) {
      const errorMessage = err.response?.data?.details || 
                          err.message || 
                          'Error al actualizar el material';
      setError(errorMessage);
      showErrorAlert('Error', errorMessage);
      console.error('Error en useUpdateMaterial:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualizar solo campos específicos
   * @param {number} id - ID del material
   * @param {string} field - Campo a actualizar
   * @param {any} value - Nuevo valor
   * @returns {Promise<Object|null>}
   */
  const updateField = async (id, field, value) => {
    return await handleUpdateMaterial(id, { [field]: value });
  };

  /**
   * Activar o desactivar material
   * @param {number} id - ID del material
   * @param {boolean} activo - Nuevo estado
   * @returns {Promise<Object|null>}
   */
  const toggleActivo = async (id, activo) => {
    return await handleUpdateMaterial(id, { activo });
  };

  /**
   * Resetear el estado del hook
   */
  const reset = () => {
    setLoading(false);
    setError(null);
    setMaterial(null);
  };

  return {
    // Estado
    loading,
    error,
    material,
    
    // Funciones
    updateMaterial: handleUpdateMaterial,
    updateField,
    toggleActivo,
    validateMaterialData,
    reset
  };
};

export default useUpdateMaterial;