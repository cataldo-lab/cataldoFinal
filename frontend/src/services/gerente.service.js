import axios from './root.service.js';

/**
 * Obtiene las estadísticas completas del dashboard gerencial
 * @returns {Promise} Promise con los datos del dashboard
 */
export const getDashboardStats = async () => {
  try {
    const response = await axios.get('/gerente/dashboard');
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas del dashboard:', error);
    throw error;
  }
};

/**
 * Obtiene el resumen de ventas por período
 * @param {string} periodo - 'dia', 'semana', 'mes', 'año'
 * @returns {Promise} Promise con el resumen de ventas
 */
export const getSalesReport = async (periodo = 'mes') => {
  try {
    const response = await axios.get('/gerente/reports/sales', {
      params: { periodo }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener reporte de ventas:', error);
    throw error;
  }
};

/**
 * Obtiene el top de productos más vendidos
 * @param {number} limit - Cantidad de productos a obtener
 * @returns {Promise} Promise con el top de productos
 */
export const getTopProducts = async (limit = 10) => {
  try {
    const response = await axios.get('/gerente/top-products', {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener top productos:', error);
    throw error;
  }
};

/**
 * Obtiene el reporte de inventario
 * @returns {Promise} Promise con el reporte de inventario
 */
export const getInventoryReport = async () => {
  try {
    const response = await axios.get('/gerente/reports/inventory');
    return response.data;
  } catch (error) {
    console.error('Error al obtener reporte de inventario:', error);
    throw error;
  }
};

/**
 * Obtiene el reporte de operaciones
 * @returns {Promise} Promise con el reporte de operaciones
 */
export const getOperationsReport = async () => {
  try {
    const response = await axios.get('/gerente/reports/operations');
    return response.data;
  } catch (error) {
    console.error('Error al obtener reporte de operaciones:', error);
    throw error;
  }
};
