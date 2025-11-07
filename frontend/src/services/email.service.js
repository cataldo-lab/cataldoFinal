// src/services/email.service.js

import axios from './root.service.js';

/**
 * Envía un correo electrónico a un cliente
 * @param {Object} emailData - Datos del correo
 * @param {number} emailData.clienteId - ID del cliente
 * @param {string} emailData.asunto - Asunto del correo
 * @param {string} emailData.mensaje - Mensaje del correo
 * @returns {Promise} Resultado del envío
 */
export const sendEmailToCliente = async (emailData) => {
  try {
    const response = await axios.post('/trabajador-tienda/send-email', emailData);
    return response.data;
  } catch (error) {
    console.error('Error al enviar correo:', error);
    throw error.response?.data || error;
  }
};

/**
 * Envía correos electrónicos a múltiples clientes
 * @param {Object} emailData - Datos del correo
 * @param {Array<number>} emailData.clienteIds - IDs de los clientes
 * @param {string} emailData.asunto - Asunto del correo
 * @param {string} emailData.mensaje - Mensaje del correo
 * @returns {Promise} Resultado del envío
 */
export const sendBulkEmailToClientes = async (emailData) => {
  try {
    const response = await axios.post('/trabajador-tienda/send-bulk-email', emailData);
    return response.data;
  } catch (error) {
    console.error('Error al enviar correos masivos:', error);
    throw error.response?.data || error;
  }
};
