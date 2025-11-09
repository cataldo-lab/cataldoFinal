// frontend/src/services/correo.service.js

import axios from './root.service.js';

/**
 * Envía un correo electrónico
 * @param {Object} correoData - Datos del correo
 * @param {string} correoData.destinatario - Email del destinatario
 * @param {string} correoData.asunto - Asunto del correo
 * @param {string} correoData.mensaje - Contenido del mensaje
 * @param {string} correoData.tipo - Tipo de plantilla (opcional)
 * @param {number} correoData.idCliente - ID del cliente (opcional)
 * @param {number} correoData.idOperacion - ID de la operación (opcional)
 * @returns {Promise} Resultado del envío
 */
export const enviarCorreo = async (correoData) => {
  try {
    const response = await axios.post('/correos/enviar', correoData);
    return response.data;
  } catch (error) {
    console.error('Error al enviar correo:', error);
    throw error.response?.data || error;
  }
};

/**
 * Obtiene el historial de correos enviados
 * @param {Object} filtros - Filtros de búsqueda
 * @param {number} filtros.idCliente - ID del cliente
 * @param {string} filtros.estado - Estado del envío
 * @param {string} filtros.tipo - Tipo de correo
 * @param {Date} filtros.fechaInicio - Fecha inicio
 * @param {Date} filtros.fechaFin - Fecha fin
 * @param {number} filtros.limit - Límite de resultados
 * @param {number} filtros.offset - Offset para paginación
 * @returns {Promise} Historial de correos
 */
export const getHistorialCorreos = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();

    if (filtros.idCliente) params.append('idCliente', filtros.idCliente);
    if (filtros.estado) params.append('estado', filtros.estado);
    if (filtros.tipo) params.append('tipo', filtros.tipo);
    if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
    if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);
    if (filtros.limit) params.append('limit', filtros.limit);
    if (filtros.offset) params.append('offset', filtros.offset);

    const response = await axios.get(`/correos/historial?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener historial de correos:', error);
    throw error.response?.data || error;
  }
};

/**
 * Obtiene un correo por ID
 * @param {number} id - ID del correo
 * @returns {Promise} Datos del correo
 */
export const getCorreoById = async (id) => {
  try {
    const response = await axios.get(`/correos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener correo ${id}:`, error);
    throw error.response?.data || error;
  }
};

/**
 * Envía correos masivos a múltiples destinatarios
 * @param {Object} data - Datos para envío masivo
 * @param {Array<string>} data.destinatarios - Array de emails
 * @param {string} data.asunto - Asunto del correo
 * @param {string} data.mensaje - Contenido del mensaje
 * @param {string} data.tipo - Tipo de plantilla (opcional)
 * @returns {Promise} Resultado del envío masivo
 */
export const enviarCorreoMasivo = async (data) => {
  try {
    const response = await axios.post('/correos/enviar-masivo', data);
    return response.data;
  } catch (error) {
    console.error('Error al enviar correos masivos:', error);
    throw error.response?.data || error;
  }
};

/**
 * Obtiene las plantillas de correos disponibles
 * @returns {Promise} Plantillas disponibles
 */
export const getPlantillasCorreo = async () => {
  try {
    const response = await axios.get('/correos/plantillas');
    return response.data;
  } catch (error) {
    console.error('Error al obtener plantillas:', error);
    throw error.response?.data || error;
  }
};
