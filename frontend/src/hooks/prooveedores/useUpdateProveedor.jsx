// frontend/src/hooks/proveedores/useUpdateProveedor.jsx
import { useState } from 'react';
import { updateProveedor } from '@services/proveedor.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import { validarRUT, validarEmail, validarTelefono } from '@validaciones';

/**
 * Hook para actualizar proveedores
 * @returns {Object} Estado y funciones
 */
export const useUpdateProveedor = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [proveedor, setProveedor] = useState(null);

  /**
   * Validar datos del proveedor (campos opcionales)
   * @param {Object} proveedorData - Datos a validar
   * @returns {Object} { isValid, errors }
   */
  const validateProveedorData = (proveedorData) => {
    const errors = {};

    // Validar rol (si se proporciona)
    if (proveedorData.rol_proveedor !== undefined && 
        proveedorData.rol_proveedor.trim() === '') {
      errors.rol_proveedor = 'El rol no puede estar vacío';
    }

    // Validar RUT proveedor (si se proporciona)
    if (proveedorData.rut_proveedor !== undefined) {
      if (proveedorData.rut_proveedor.trim() === '') {
        errors.rut_proveedor = 'El RUT no puede estar vacío';
      } else if (!validarRUT(proveedorData.rut_proveedor)) {
        errors.rut_proveedor = 'El RUT del proveedor no es válido';
      }
    }

    // Validar nombre representante (si se proporciona)
    if (proveedorData.nombre_representante !== undefined && 
        proveedorData.nombre_representante.trim() === '') {
      errors.nombre_representante = 'El nombre no puede estar vacío';
    }

    // Validar apellido representante (si se proporciona)
    if (proveedorData.apellido_representante !== undefined && 
        proveedorData.apellido_representante.trim() === '') {
      errors.apellido_representante = 'El apellido no puede estar vacío';
    }

    // Validar RUT representante (si se proporciona)
    if (proveedorData.rut_representante !== undefined) {
      if (proveedorData.rut_representante.trim() === '') {
        errors.rut_representante = 'El RUT no puede estar vacío';
      } else if (!validarRUT(proveedorData.rut_representante)) {
        errors.rut_representante = 'El RUT del representante no es válido';
      }
    }

    // Validar correo (si se proporciona)
    if (proveedorData.correo_proveedor !== undefined) {
      if (proveedorData.correo_proveedor.trim() === '') {
        errors.correo_proveedor = 'El correo no puede estar vacío';
      } else if (!validarEmail(proveedorData.correo_proveedor)) {
        errors.correo_proveedor = 'El correo no es válido';
      }
    }

    // Validar teléfono (si se proporciona)
    if (proveedorData.fono_proveedor !== undefined) {
      if (proveedorData.fono_proveedor.trim() === '') {
        errors.fono_proveedor = 'El teléfono no puede estar vacío';
      } else if (!validarTelefono(proveedorData.fono_proveedor)) {
        errors.fono_proveedor = 'El teléfono no es válido';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };

  /**
   * Actualizar un proveedor existente
   * @param {number} id - ID del proveedor
   * @param {Object} proveedorData - Datos a actualizar
   * @returns {Promise<Object|null>} Proveedor actualizado o null
   */
  const handleUpdateProveedor = async (id, proveedorData) => {
    try {
      setLoading(true);
      setError(null);
      setProveedor(null);

      // Validar ID
      if (!id || isNaN(parseInt(id))) {
        const errorMsg = 'ID de proveedor inválido';
        setError(errorMsg);
        showErrorAlert('Error', errorMsg);
        return null;
      }

      // Validar que haya datos para actualizar
      if (!proveedorData || Object.keys(proveedorData).length === 0) {
        const errorMsg = 'No hay datos para actualizar';
        setError(errorMsg);
        showErrorAlert('Error', errorMsg);
        return null;
      }

      // Validar datos
      const validation = validateProveedorData(proveedorData);
      if (!validation.isValid) {
        const errorMessage = Object.values(validation.errors).join('\n');
        setError(validation.errors);
        showErrorAlert('Datos inválidos', errorMessage);
        return null;
      }

      // Preparar datos (solo campos proporcionados)
      const dataToSend = {};

      if (proveedorData.rol_proveedor !== undefined) {
        dataToSend.rol_proveedor = proveedorData.rol_proveedor.trim();
      }
      if (proveedorData.rut_proveedor !== undefined) {
        dataToSend.rut_proveedor = proveedorData.rut_proveedor.trim();
      }
      if (proveedorData.nombre_representante !== undefined) {
        dataToSend.nombre_representante = proveedorData.nombre_representante.trim();
      }
      if (proveedorData.apellido_representante !== undefined) {
        dataToSend.apellido_representante = proveedorData.apellido_representante.trim();
      }
      if (proveedorData.rut_representante !== undefined) {
        dataToSend.rut_representante = proveedorData.rut_representante.trim();
      }
      if (proveedorData.fono_proveedor !== undefined) {
        dataToSend.fono_proveedor = proveedorData.fono_proveedor.trim();
      }
      if (proveedorData.correo_proveedor !== undefined) {
        dataToSend.correo_proveedor = proveedorData.correo_proveedor.trim().toLowerCase();
      }

      const response = await updateProveedor(parseInt(id), dataToSend);

      if (response.status === 'Success') {
        setProveedor(response.data);
        showSuccessAlert(
          '¡Proveedor actualizado!',
          'Los datos se han actualizado exitosamente'
        );
        return response.data;
      } else {
        throw new Error(response.details || 'Error al actualizar proveedor');
      }

    } catch (err) {
      const errorMessage = err.response?.data?.details || 
                          err.message || 
                          'Error al actualizar el proveedor';
      setError(errorMessage);
      showErrorAlert('Error', errorMessage);
      console.error('Error en useUpdateProveedor:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualizar solo un campo específico
   * @param {number} id - ID del proveedor
   * @param {string} field - Campo a actualizar
   * @param {any} value - Nuevo valor
   * @returns {Promise<Object|null>}
   */
  const updateField = async (id, field, value) => {
    return await handleUpdateProveedor(id, { [field]: value });
  };

  /**
   * Resetear estado
   */
  const reset = () => {
    setLoading(false);
    setError(null);
    setProveedor(null);
  };

  return {
    loading,
    error,
    proveedor,
    updateProveedor: handleUpdateProveedor,
    updateField,
    validateProveedorData,
    reset
  };
};

export default useUpdateProveedor;