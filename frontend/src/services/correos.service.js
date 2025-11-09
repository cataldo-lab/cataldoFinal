// frontend/src/services/correos.service.js

import axios from './root.service.js';

/**
 * Servicio para gestión de correos de postventa
 * Endpoint base: /api/postventa
 */

/**
 * Envía un correo electrónico a un cliente
 * @param {Object} correoData - Datos del correo a enviar
 * @param {string} correoData.destinatario - Email del destinatario (requerido)
 * @param {string} correoData.asunto - Asunto del correo (opcional si usa plantilla)
 * @param {string} correoData.mensaje - Mensaje del correo (opcional si usa plantilla)
 * @param {string} correoData.tipo - Tipo de plantilla: 'cotizacion' | 'confirmacion' | 'entrega' | 'seguimiento' | 'personalizado' | 'cumpleanos'
 * @param {Object} correoData.datosPlantilla - Datos para rellenar la plantilla
 * @param {string} correoData.datosPlantilla.nombreCliente - Nombre del cliente
 * @param {string} correoData.datosPlantilla.numero - Número de pedido/operación
 * @param {string} correoData.datosPlantilla.fechaEntrega - Fecha estimada de entrega
 * @param {string} correoData.datosPlantilla.estado - Estado actual del pedido
 * @param {string} correoData.datosPlantilla.detalles - Detalles adicionales
 * @param {number} correoData.datosPlantilla.descuento - Porcentaje de descuento (para cumpleaños)
 * @param {number} correoData.operacionId - ID de operación relacionada (opcional)
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const enviarCorreo = async (correoData) => {
  try {
    const response = await axios.post('/postventa/enviar', correoData);
    return response.data;
  } catch (error) {
    console.error('Error al enviar correo:', error);
    throw error.response?.data || error;
  }
};

/**
 * Obtiene el historial de correos enviados con filtros opcionales
 * @param {Object} filtros - Filtros de búsqueda
 * @param {string} filtros.destinatario - Filtrar por email del destinatario
 * @param {string} filtros.tipo - Filtrar por tipo de correo
 * @param {string} filtros.estado - Filtrar por estado: 'enviado' | 'fallido' | 'pendiente'
 * @param {string} filtros.desde - Fecha desde (formato ISO: YYYY-MM-DD)
 * @param {string} filtros.hasta - Fecha hasta (formato ISO: YYYY-MM-DD)
 * @param {number} filtros.operacionId - ID de operación relacionada
 * @param {number} filtros.limite - Cantidad de resultados por página (default: 50)
 * @param {number} filtros.pagina - Número de página (default: 1)
 * @returns {Promise<Object>} Objeto con correos, total, pagina, limite, totalPaginas
 */
export const obtenerHistorialCorreos = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();

    if (filtros.destinatario) params.append('destinatario', filtros.destinatario);
    if (filtros.tipo) params.append('tipo', filtros.tipo);
    if (filtros.estado) params.append('estado', filtros.estado);
    if (filtros.desde) params.append('desde', filtros.desde);
    if (filtros.hasta) params.append('hasta', filtros.hasta);
    if (filtros.operacionId) params.append('operacionId', filtros.operacionId);
    if (filtros.limite) params.append('limite', filtros.limite);
    if (filtros.pagina) params.append('pagina', filtros.pagina);

    const response = await axios.get(`/postventa/historial?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener historial de correos:', error);
    throw error.response?.data || error;
  }
};

/**
 * Obtiene estadísticas de correos enviados
 * @param {Object} params - Parámetros de búsqueda
 * @param {string} params.desde - Fecha desde (formato ISO: YYYY-MM-DD)
 * @param {string} params.hasta - Fecha hasta (formato ISO: YYYY-MM-DD)
 * @returns {Promise<Object>} Estadísticas de correos por tipo y estado
 */
export const obtenerEstadisticasCorreos = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();

    if (params.desde) queryParams.append('desde', params.desde);
    if (params.hasta) queryParams.append('hasta', params.hasta);

    const response = await axios.get(`/postventa/estadisticas?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas de correos:', error);
    throw error.response?.data || error;
  }
};

/**
 * Reintenta el envío de un correo que falló
 * @param {number} correoId - ID del registro de correo en la base de datos
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const reintentarEnvioCorreo = async (correoId) => {
  try {
    const response = await axios.post(`/postventa/reintentar/${correoId}`);
    return response.data;
  } catch (error) {
    console.error('Error al reintentar envío de correo:', error);
    throw error.response?.data || error;
  }
};

/**
 * Verifica la configuración del servicio de correo
 * Útil para debugging y verificar que las variables de entorno estén configuradas
 * @returns {Promise<Object>} Estado de la configuración
 */
export const verificarConfiguracionCorreo = async () => {
  try {
    const response = await axios.get('/postventa/test-config');
    return response.data;
  } catch (error) {
    console.error('Error al verificar configuración de correo:', error);
    throw error.response?.data || error;
  }
};

/**
 * Envía correo de cotización
 * Helper function para simplificar el envío de cotizaciones
 * @param {Object} data
 * @param {string} data.destinatario - Email del cliente
 * @param {string} data.nombreCliente - Nombre del cliente
 * @param {string} data.numero - Número de cotización
 * @param {string} data.detalles - Detalles de la cotización
 * @param {number} data.operacionId - ID de operación (opcional)
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const enviarCotizacion = async (data) => {
  return enviarCorreo({
    destinatario: data.destinatario,
    tipo: 'cotizacion',
    datosPlantilla: {
      nombreCliente: data.nombreCliente,
      numero: data.numero,
      detalles: data.detalles
    },
    operacionId: data.operacionId
  });
};

/**
 * Envía correo de confirmación de pedido
 * @param {Object} data
 * @param {string} data.destinatario - Email del cliente
 * @param {string} data.nombreCliente - Nombre del cliente
 * @param {string} data.numero - Número de pedido
 * @param {string} data.fechaEntrega - Fecha estimada de entrega
 * @param {string} data.detalles - Detalles del pedido
 * @param {number} data.operacionId - ID de operación (opcional)
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const enviarConfirmacionPedido = async (data) => {
  return enviarCorreo({
    destinatario: data.destinatario,
    tipo: 'confirmacion',
    datosPlantilla: {
      nombreCliente: data.nombreCliente,
      numero: data.numero,
      fechaEntrega: data.fechaEntrega,
      detalles: data.detalles
    },
    operacionId: data.operacionId
  });
};

/**
 * Envía notificación de pedido listo para entrega
 * @param {Object} data
 * @param {string} data.destinatario - Email del cliente
 * @param {string} data.nombreCliente - Nombre del cliente
 * @param {string} data.numero - Número de pedido
 * @param {string} data.detalles - Detalles de la entrega
 * @param {number} data.operacionId - ID de operación (opcional)
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const enviarNotificacionEntrega = async (data) => {
  return enviarCorreo({
    destinatario: data.destinatario,
    tipo: 'entrega',
    datosPlantilla: {
      nombreCliente: data.nombreCliente,
      numero: data.numero,
      detalles: data.detalles
    },
    operacionId: data.operacionId
  });
};

/**
 * Envía seguimiento de pedido
 * @param {Object} data
 * @param {string} data.destinatario - Email del cliente
 * @param {string} data.nombreCliente - Nombre del cliente
 * @param {string} data.numero - Número de pedido
 * @param {string} data.estado - Estado actual del pedido
 * @param {string} data.detalles - Detalles del seguimiento
 * @param {number} data.operacionId - ID de operación (opcional)
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const enviarSeguimientoPedido = async (data) => {
  return enviarCorreo({
    destinatario: data.destinatario,
    tipo: 'seguimiento',
    datosPlantilla: {
      nombreCliente: data.nombreCliente,
      numero: data.numero,
      estado: data.estado,
      detalles: data.detalles
    },
    operacionId: data.operacionId
  });
};

/**
 * Envía correo de cumpleaños
 * @param {Object} data
 * @param {string} data.destinatario - Email del cliente
 * @param {string} data.nombreCliente - Nombre del cliente
 * @param {number} data.descuento - Porcentaje de descuento de regalo (opcional)
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const enviarCorreoCumpleanos = async (data) => {
  return enviarCorreo({
    destinatario: data.destinatario,
    tipo: 'cumpleanos',
    datosPlantilla: {
      nombreCliente: data.nombreCliente,
      descuento: data.descuento
    }
  });
};

export default {
  enviarCorreo,
  obtenerHistorialCorreos,
  obtenerEstadisticasCorreos,
  reintentarEnvioCorreo,
  verificarConfiguracionCorreo,
  // Helpers
  enviarCotizacion,
  enviarConfirmacionPedido,
  enviarNotificacionEntrega,
  enviarSeguimientoPedido,
  enviarCorreoCumpleanos
};
