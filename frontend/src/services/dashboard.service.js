// frontend/src/services/dashboard.service.js

import axios from './root.service.js';

/**
 * Obtiene el resumen general del dashboard
 * @returns {Promise} Resumen con operaciones, ingresos y clientes
 */
export const getResumenGeneral = async () => {
  try {
    const response = await axios.get('/dashboard/resumen');
    return response.data;
  } catch (error) {
    console.error('Error al obtener resumen general:', error);
    throw error.response?.data || error;
  }
};

/**
 * Obtiene métricas de ventas por período
 * @param {string} desde - Fecha de inicio (YYYY-MM-DD)
 * @param {string} hasta - Fecha de fin (YYYY-MM-DD)
 * @returns {Promise} Métricas de ventas
 */
export const getMetricasVentas = async (desde, hasta) => {
  try {
    const params = {};
    if (desde) params.desde = desde;
    if (hasta) params.hasta = hasta;

    const response = await axios.get('/dashboard/ventas', { params });
    return response.data;
  } catch (error) {
    console.error('Error al obtener métricas de ventas:', error);
    throw error.response?.data || error;
  }
};

/**
 * Obtiene estado del inventario con alertas
 * @returns {Promise} Estado de inventario
 */
export const getEstadoInventario = async () => {
  try {
    const response = await axios.get('/dashboard/inventario');
    return response.data;
  } catch (error) {
    console.error('Error al obtener estado de inventario:', error);
    throw error.response?.data || error;
  }
};

/**
 * Obtiene estadísticas de clientes
 * @returns {Promise} Estadísticas de clientes
 */
export const getEstadisticasClientes = async () => {
  try {
    const response = await axios.get('/dashboard/clientes');
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas de clientes:', error);
    throw error.response?.data || error;
  }
};

/**
 * Obtiene métricas de satisfacción del cliente
 * @param {string} desde - Fecha de inicio (YYYY-MM-DD)
 * @param {string} hasta - Fecha de fin (YYYY-MM-DD)
 * @returns {Promise} Métricas de satisfacción
 */
export const getSatisfaccionCliente = async (desde, hasta) => {
  try {
    const params = {};
    if (desde) params.desde = desde;
    if (hasta) params.hasta = hasta;

    const response = await axios.get('/dashboard/satisfaccion', { params });
    return response.data;
  } catch (error) {
    console.error('Error al obtener satisfacción de clientes:', error);
    throw error.response?.data || error;
  }
};

/**
 * Obtiene indicadores operacionales
 * @param {string} desde - Fecha de inicio (YYYY-MM-DD)
 * @param {string} hasta - Fecha de fin (YYYY-MM-DD)
 * @returns {Promise} Indicadores operacionales
 */
export const getIndicadoresOperacionales = async (desde, hasta) => {
  try {
    const params = {};
    if (desde) params.desde = desde;
    if (hasta) params.hasta = hasta;

    const response = await axios.get('/dashboard/operaciones', { params });
    return response.data;
  } catch (error) {
    console.error('Error al obtener indicadores operacionales:', error);
    throw error.response?.data || error;
  }
};
