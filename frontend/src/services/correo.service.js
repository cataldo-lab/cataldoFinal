// frontend/src/services/correo.service.js

import axios from './root.service.js';

/**
 * Envía un correo electrónico
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
 * @param {Object} filtros - Filtros de búsqueda
 * @param {string} filtros.destinatario - Filtrar por email destinatario
 * @param {string} filtros.estado - Filtrar por estado (enviado, fallido, pendiente)
 * @param {string} filtros.tipo - Filtrar por tipo de plantilla
 * @param {string} filtros.fecha_desde - Filtrar desde fecha (formato: YYYY-MM-DD)
 * @param {string} filtros.fecha_hasta - Filtrar hasta fecha (formato: YYYY-MM-DD)
 * @param {number} filtros.page - Página actual
 * @param {number} filtros.limit - Límite de resultados por página
 * @returns {Promise} Historial de correos
 */
export const getHistorialCorreos = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();

    if (filtros.destinatario) params.append('destinatario', filtros.destinatario);
    if (filtros.estado) params.append('estado', filtros.estado);
    if (filtros.tipo) params.append('tipo', filtros.tipo);
    if (filtros.fecha_desde) params.append('fecha_desde', filtros.fecha_desde);
    if (filtros.fecha_hasta) params.append('fecha_hasta', filtros.fecha_hasta);
    if (filtros.page) params.append('page', filtros.page);
    if (filtros.limit) params.append('limit', filtros.limit);

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
 * Obtiene estadísticas de correos enviados
 * @returns {Promise} Estadísticas de correos
 */
export const getEstadisticasCorreos = async () => {
  try {
    const response = await axios.get('/correos/estadisticas/general');
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas de correos:', error);
    throw error.response?.data || error;
  }
};
