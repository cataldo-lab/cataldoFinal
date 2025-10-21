import { useState } from 'react';
import { createMaterial } from '@services/materiales.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

/**
 * Hook personalizado para crear un nuevo material
 * @returns {Object} Estado y funciones para crear materiales
 */
export const useCreateMaterial = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [material, setMaterial] = useState(null);

  /**
   * Validar datos del material antes de enviar
   * @param {Object} materialData - Datos del material a validar
   * @returns {Object} { isValid, errors }
   */
  const validateMaterialData = (materialData) => {
    const errors = {};

    // Validar nombre
    if (!materialData.nombre_material || materialData.nombre_material.trim() === '') {
      errors.nombre_material = 'El nombre del material es obligatorio';
    }

    // Validar unidad de medida
    if (!materialData.unidad_medida) {
      errors.unidad_medida = 'La unidad de medida es obligatoria';
    }

    // Validar precio unitario
    if (!materialData.precio_unitario) {
      errors.precio_unitario = 'El precio unitario es obligatorio';
    } else if (parseFloat(materialData.precio_unitario) <= 0) {
      errors.precio_unitario = 'El precio unitario debe ser mayor a 0';
    }

    // Validar existencia (si se proporciona)
    if (materialData.existencia_material !== undefined && 
        parseFloat(materialData.existencia_material) < 0) {
      errors.existencia_material = 'La existencia no puede ser negativa';
    }

    // Validar stock mínimo
    if (materialData.stock_minimo !== undefined && 
        parseFloat(materialData.stock_minimo) < 0) {
      errors.stock_minimo = 'El stock mínimo no puede ser negativo';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };

  /**
   * Crear un nuevo material
   * @param {Object} materialData - Datos del material
   * @param {string} materialData.nombre_material - Nombre del material
   * @param {string} materialData.unidad_medida - Unidad de medida (kg, m, unidad, etc.)
   * @param {number} materialData.precio_unitario - Precio unitario
   * @param {number} [materialData.existencia_material=0] - Stock inicial
   * @param {number} [materialData.stock_minimo=1] - Stock mínimo
   * @param {number} [materialData.id_proveedor] - ID del proveedor (opcional)
   * @param {boolean} [materialData.activo=true] - Si está activo
   * @returns {Promise<Object|null>} Material creado o null si hay error
   */
  const handleCreateMaterial = async (materialData) => {
    try {
      setLoading(true);
      setError(null);
      setMaterial(null);

      // Validar datos antes de enviar
      const validation = validateMaterialData(materialData);
      if (!validation.isValid) {
        const errorMessage = Object.values(validation.errors).join('\n');
        setError(validation.errors);
        showErrorAlert('Datos inválidos', errorMessage);
        return null;
      }

      // Preparar datos (limpiar y formatear)
      const dataToSend = {
        nombre_material: materialData.nombre_material.trim(),
        unidad_medida: materialData.unidad_medida,
        precio_unitario: parseFloat(materialData.precio_unitario),
        existencia_material: materialData.existencia_material 
          ? parseFloat(materialData.existencia_material) 
          : 0,
        stock_minimo: materialData.stock_minimo 
          ? parseFloat(materialData.stock_minimo) 
          : 1,
        activo: materialData.activo !== undefined 
          ? materialData.activo 
          : true
      };

      // Agregar proveedor solo si existe
      if (materialData.id_proveedor) {
        dataToSend.id_proveedor = parseInt(materialData.id_proveedor);
      }

      // Llamar al servicio
      const response = await createMaterial(dataToSend);

      if (response.status === 'Success') {
        setMaterial(response.data);
        showSuccessAlert(
          '¡Material creado!',
          `${response.data.nombre_material} se ha creado exitosamente`
        );
        return response.data;
      } else {
        throw new Error(response.details || 'Error al crear material');
      }

    } catch (err) {
      const errorMessage = err.response?.data?.details || 
                          err.message || 
                          'Error al crear el material';
      setError(errorMessage);
      showErrorAlert('Error', errorMessage);
      console.error('Error en useCreateMaterial:', err);
      return null;
    } finally {
      setLoading(false);
    }
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
    createMaterial: handleCreateMaterial,
    validateMaterialData,
    reset
  };
};

export default useCreateMaterial;