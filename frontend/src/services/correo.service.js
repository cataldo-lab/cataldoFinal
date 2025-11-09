// frontend/src/services/correo.service.js

import axios from './root.service.js';

/**
 * Envía un correo a un cliente
 * @param {Object} correoData - Datos del correo
 * @param {string} correoData.destinatario - Email del destinatario
 * @param {string} correoData.asunto - Asunto del correo
 * @param {string} correoData.mensaje - Contenido del mensaje
 * @param {string} correoData.tipo - Tipo de plantilla (opcional)
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
 * @param {Object} filtros - Filtros opcionales
 * @param {string} filtros.fechaDesde - Fecha desde (formato ISO)
 * @param {string} filtros.fechaHasta - Fecha hasta (formato ISO)
 * @param {string} filtros.destinatario - Email del destinatario
 * @returns {Promise} Lista de correos enviados
 */
export const getHistorialCorreos = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();

    if (filtros.fechaDesde) params.append('fechaDesde', filtros.fechaDesde);
    if (filtros.fechaHasta) params.append('fechaHasta', filtros.fechaHasta);
    if (filtros.destinatario) params.append('destinatario', filtros.destinatario);

    const response = await axios.get(`/correos/historial?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener historial de correos:', error);
    throw error.response?.data || error;
  }
};

/**
 * Obtiene un correo específico por ID
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
 * Envía un correo masivo a múltiples destinatarios
 * @param {Object} correoData - Datos del correo
 * @param {Array<string>} correoData.destinatarios - Array de emails
 * @param {string} correoData.asunto - Asunto del correo
 * @param {string} correoData.mensaje - Contenido del mensaje
 * @returns {Promise} Resultado del envío masivo
 */
export const enviarCorreoMasivo = async (correoData) => {
  try {
    const response = await axios.post('/correos/enviar-masivo', correoData);
    return response.data;
  } catch (error) {
    console.error('Error al enviar correo masivo:', error);
    throw error.response?.data || error;
  }
};

/**
 * Obtiene las plantillas de correo disponibles
 * @returns {Promise} Lista de plantillas
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
