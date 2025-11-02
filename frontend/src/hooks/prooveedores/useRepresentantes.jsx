// frontend/src/hooks/proveedores/useRepresentantes.jsx
import { useState, useCallback } from 'react';
import {
  getRepresentantesByProveedor,
  createRepresentante,
  updateRepresentante,
  deleteRepresentante
} from '@services/proveedor.service.js';
import { showErrorAlert, showSuccessAlert, deleteDataAlert } from '@helpers/sweetAlert.js';

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
 * Hook para gestionar representantes de proveedores
 * @returns {Object} Estado y funciones
 */
export const useRepresentantes = () => {
  const [representantes, setRepresentantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Validar datos de representante
   * @param {Object} data - Datos a validar
   * @param {boolean} isUpdate - Si es actualización (campos opcionales)
   * @returns {Object} { isValid, errors }
   */
  const validateRepresentanteData = (data, isUpdate = false) => {
    const errors = {};

    // Validar nombre
    if (!isUpdate || data.nombre_representante !== undefined) {
      if (!data.nombre_representante || data.nombre_representante.trim() === '') {
        errors.nombre_representante = 'El nombre es obligatorio';
      }
    }

    // Validar apellido
    if (!isUpdate || data.apellido_representante !== undefined) {
      if (!data.apellido_representante || data.apellido_representante.trim() === '') {
        errors.apellido_representante = 'El apellido es obligatorio';
      }
    }

    // Validar RUT
    if (!isUpdate || data.rut_representante !== undefined) {
      if (!data.rut_representante || data.rut_representante.trim() === '') {
        errors.rut_representante = 'El RUT es obligatorio';
      } else if (!validarRUT(data.rut_representante)) {
        errors.rut_representante = 'El RUT no es válido';
      }
    }

    // Validar cargo
    if (!isUpdate || data.cargo_representante !== undefined) {
      if (!data.cargo_representante || data.cargo_representante.trim() === '') {
        errors.cargo_representante = 'El cargo es obligatorio';
      }
    }

    // Validar email (si se proporciona)
    if (data.correo_representante !== undefined && data.correo_representante.trim() !== '') {
      if (!validarEmail(data.correo_representante)) {
        errors.correo_representante = 'El correo no es válido';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };

  /**
   * Obtener representantes de un proveedor
   * @param {number} id_proveedor - ID del proveedor
   */
  const fetchRepresentantes = useCallback(async (id_proveedor) => {
    try {
      setLoading(true);
      setError(null);

      if (!id_proveedor || isNaN(parseInt(id_proveedor))) {
        throw new Error('ID de proveedor inválido');
      }

      const response = await getRepresentantesByProveedor(parseInt(id_proveedor));

      if (response.status === 'Success') {
        setRepresentantes(response.data || []);
        return response.data;
      } else {
        throw new Error(response.details || 'Error al obtener representantes');
      }

    } catch (err) {
      const errorMessage = err.response?.data?.details || 
                          err.message || 
                          'Error al obtener representantes';
      setError(errorMessage);
      console.error('Error en fetchRepresentantes:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Crear nuevo representante
   * @param {number} id_proveedor - ID del proveedor
   * @param {Object} representanteData - Datos del representante
   * @returns {Promise<Object|null>}
   */
  const handleCreateRepresentante = async (id_proveedor, representanteData) => {
    try {
      setLoading(true);
      setError(null);

      // Validar datos
      const validation = validateRepresentanteData(representanteData, false);
      if (!validation.isValid) {
        const errorMessage = Object.values(validation.errors).join('\n');
        setError(validation.errors);
        showErrorAlert('Datos inválidos', errorMessage);
        return null;
      }

      // Preparar datos
      const dataToSend = {
        nombre_representante: representanteData.nombre_representante.trim(),
        apellido_representante: representanteData.apellido_representante.trim(),
        rut_representante: representanteData.rut_representante.trim(),
        cargo_representante: representanteData.cargo_representante.trim(),
        fono_representante: representanteData.fono_representante?.trim() || '',
        correo_representante: representanteData.correo_representante?.trim().toLowerCase() || ''
      };

      const response = await createRepresentante(parseInt(id_proveedor), dataToSend);

      if (response.status === 'Success') {
        showSuccessAlert(
          '¡Representante creado!',
          `${response.data.nombre_representante} ${response.data.apellido_representante} se ha registrado exitosamente`
        );
        
        // Recargar lista
        await fetchRepresentantes(id_proveedor);
        
        return response.data;
      } else {
        throw new Error(response.details || 'Error al crear representante');
      }

    } catch (err) {
      const errorMessage = err.response?.data?.details || 
                          err.message || 
                          'Error al crear el representante';
      setError(errorMessage);
      showErrorAlert('Error', errorMessage);
      console.error('Error en handleCreateRepresentante:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualizar representante existente
   * @param {number} id_representante - ID del representante
   * @param {Object} representanteData - Datos a actualizar
   * @returns {Promise<Object|null>}
   */
  const handleUpdateRepresentante = async (id_representante, representanteData) => {
    try {
      setLoading(true);
      setError(null);

      // Validar ID
      if (!id_representante || isNaN(parseInt(id_representante))) {
        const errorMsg = 'ID de representante inválido';
        setError(errorMsg);
        showErrorAlert('Error', errorMsg);
        return null;
      }

      // Validar datos
      const validation = validateRepresentanteData(representanteData, true);
      if (!validation.isValid) {
        const errorMessage = Object.values(validation.errors).join('\n');
        setError(validation.errors);
        showErrorAlert('Datos inválidos', errorMessage);
        return null;
      }

      // Preparar datos (solo campos proporcionados)
      const dataToSend = {};

      if (representanteData.nombre_representante !== undefined) {
        dataToSend.nombre_representante = representanteData.nombre_representante.trim();
      }
      if (representanteData.apellido_representante !== undefined) {
        dataToSend.apellido_representante = representanteData.apellido_representante.trim();
      }
      if (representanteData.rut_representante !== undefined) {
        dataToSend.rut_representante = representanteData.rut_representante.trim();
      }
      if (representanteData.cargo_representante !== undefined) {
        dataToSend.cargo_representante = representanteData.cargo_representante.trim();
      }
      if (representanteData.fono_representante !== undefined) {
        dataToSend.fono_representante = representanteData.fono_representante.trim();
      }
      if (representanteData.correo_representante !== undefined) {
        dataToSend.correo_representante = representanteData.correo_representante.trim().toLowerCase();
      }

      const response = await updateRepresentante(parseInt(id_representante), dataToSend);

      if (response.status === 'Success') {
        showSuccessAlert(
          '¡Representante actualizado!',
          'Los datos se han actualizado exitosamente'
        );
        
        // Actualizar en el estado local
        setRepresentantes(prev => 
          prev.map(rep => 
            rep.id_representante === id_representante ? response.data : rep
          )
        );
        
        return response.data;
      } else {
        throw new Error(response.details || 'Error al actualizar representante');
      }

    } catch (err) {
      const errorMessage = err.response?.data?.details || 
                          err.message || 
                          'Error al actualizar el representante';
      setError(errorMessage);
      showErrorAlert('Error', errorMessage);
      console.error('Error en handleUpdateRepresentante:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Eliminar representante
   * @param {number} id_representante - ID del representante
   * @param {boolean} confirm - Si mostrar confirmación
   * @returns {Promise<boolean>}
   */
  const handleDeleteRepresentante = async (id_representante, confirm = true) => {
    try {
      // Validar ID
      if (!id_representante || isNaN(parseInt(id_representante))) {
        const errorMsg = 'ID de representante inválido';
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

      const response = await deleteRepresentante(parseInt(id_representante));

      if (response.status === 'Success') {
        showSuccessAlert(
          '¡Representante eliminado!',
          'El representante ha sido eliminado exitosamente'
        );
        
        // Remover del estado local
        setRepresentantes(prev => 
          prev.filter(rep => rep.id_representante !== id_representante)
        );
        
        return true;
      } else {
        throw new Error(response.details || 'Error al eliminar representante');
      }

    } catch (err) {
      const errorMessage = err.response?.data?.details || 
                          err.message || 
                          'Error al eliminar el representante';
      setError(errorMessage);
      showErrorAlert('Error', errorMessage);
      console.error('Error en handleDeleteRepresentante:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resetear estado
   */
  const reset = useCallback(() => {
    setRepresentantes([]);
    setLoading(false);
    setError(null);
  }, []);

  return {
    representantes,
    loading,
    error,
    fetchRepresentantes,
    createRepresentante: handleCreateRepresentante,
    updateRepresentante: handleUpdateRepresentante,
    deleteRepresentante: handleDeleteRepresentante,
    validateRepresentanteData,
    reset
  };
};

export default useRepresentantes;