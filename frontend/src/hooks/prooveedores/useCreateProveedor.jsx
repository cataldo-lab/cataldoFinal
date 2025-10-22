// frontend/src/hooks/proveedores/useCreateProveedor.jsx
import { useState } from 'react';
import { createProveedor } from '@services/proveedor.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

/**
 * Validar RUT chileno
 */
const validarRUT = (rut) => {
  if (!rut || typeof rut !== 'string') return false;
  
  const rutLimpio = rut.replace(/\./g, '').replace(/-/g, '');
  if (!/^[0-9]+[0-9kK]$/.test(rutLimpio)) return false;
  
  const cuerpo = rutLimpio.slice(0, -1);
  const dv = rutLimpio.slice(-1).toUpperCase();
  
  let suma = 0;
  let multiplicador = 2;
  
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i)) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  
  const dvEsperado = 11 - (suma % 11);
  const dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();
  
  return dv === dvCalculado;
};

/**
 * Validar email
 */
const validarEmail = (email) => {
  if (!email) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Hook para crear proveedores
 * @returns {Object} Estado y funciones
 */
export const useCreateProveedor = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [proveedor, setProveedor] = useState(null);

  /**
   * Validar datos del proveedor
   * @param {Object} proveedorData - Datos a validar
   * @returns {Object} { isValid, errors }
   */
  const validateProveedorData = (proveedorData) => {
    const errors = {};

    // Validar rol
    if (!proveedorData.rol_proveedor || proveedorData.rol_proveedor.trim() === '') {
      errors.rol_proveedor = 'El rol del proveedor es obligatorio';
    }

    // Validar RUT proveedor
    if (!proveedorData.rut_proveedor || proveedorData.rut_proveedor.trim() === '') {
      errors.rut_proveedor = 'El RUT del proveedor es obligatorio';
    } else if (!validarRUT(proveedorData.rut_proveedor)) {
      errors.rut_proveedor = 'El RUT del proveedor no es válido';
    }

    // Validar teléfono
    if (!proveedorData.fono_proveedor || proveedorData.fono_proveedor.trim() === '') {
      errors.fono_proveedor = 'El teléfono es obligatorio';
    }

    // Validar correo
    if (!proveedorData.correo_proveedor || proveedorData.correo_proveedor.trim() === '') {
      errors.correo_proveedor = 'El correo es obligatorio';
    } else if (!validarEmail(proveedorData.correo_proveedor)) {
      errors.correo_proveedor = 'El correo no es válido';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };

  /**
   * Crear un nuevo proveedor
   * @param {Object} proveedorData - Datos del proveedor
   * @param {string} proveedorData.rol_proveedor - Rol/tipo de proveedor
   * @param {string} proveedorData.rut_proveedor - RUT del proveedor
   * @param {string} proveedorData.fono_proveedor - Teléfono
   * @param {string} proveedorData.correo_proveedor - Email
   * @returns {Promise<Object|null>} Proveedor creado o null
   */
  const handleCreateProveedor = async (proveedorData) => {
    try {
      setLoading(true);
      setError(null);
      setProveedor(null);

      // Validar datos
      const validation = validateProveedorData(proveedorData);
      if (!validation.isValid) {
        const errorMessage = Object.values(validation.errors).join('\n');
        setError(validation.errors);
        showErrorAlert('Datos inválidos', errorMessage);
        return null;
      }

      // Preparar datos
      const dataToSend = {
        rol_proveedor: proveedorData.rol_proveedor.trim(),
        rut_proveedor: proveedorData.rut_proveedor.trim(),
        fono_proveedor: proveedorData.fono_proveedor.trim(),
        correo_proveedor: proveedorData.correo_proveedor.trim().toLowerCase()
      };

      const response = await createProveedor(dataToSend);

      if (response.status === 'Success') {
        setProveedor(response.data);
        showSuccessAlert(
          '¡Proveedor creado!',
          `${response.data.rol_proveedor} se ha registrado exitosamente`
        );
        return response.data;
      } else {
        throw new Error(response.details || 'Error al crear proveedor');
      }

    } catch (err) {
      const errorMessage = err.response?.data?.details || 
                          err.message || 
                          'Error al crear el proveedor';
      setError(errorMessage);
      showErrorAlert('Error', errorMessage);
      console.error('Error en useCreateProveedor:', err);
      return null;
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
    setProveedor(null);
  };

  return {
    loading,
    error,
    proveedor,
    createProveedor: handleCreateProveedor,
    validateProveedorData,
    reset
  };
};

export default useCreateProveedor;