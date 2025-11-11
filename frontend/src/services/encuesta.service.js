// frontend/src/services/encuesta.service.js

import axios from './root.service.js';

/**
 * Crea una nueva encuesta para una operación
 * @param {Object} encuestaData - Datos de la encuesta
 * @param {number} encuestaData.id_operacion - ID de la operación
 * @param {number} encuestaData.nota_pedido - Nota del pedido (1-7)
 * @param {number} encuestaData.nota_repartidor - Nota del repartidor (1-7)
 * @param {string} encuestaData.comentario - Comentario opcional
 * @returns {Promise} Resultado de la creación
 */
export const crearEncuesta = async (encuestaData) => {
  try {
    const response = await axios.post('/encuestas', encuestaData);
    return response.data;
  } catch (error) {
    console.error('Error al crear encuesta:', error);
    throw error.response?.data || error;
  }
};

/**
 * Obtiene todas las encuestas con filtros opcionales
 * @param {Object} filtros - Filtros de búsqueda
 * @param {number} filtros.nota_minima - Nota mínima para filtrar
 * @param {string} filtros.fecha_desde - Filtrar desde fecha (formato: YYYY-MM-DD)
 * @param {string} filtros.fecha_hasta - Filtrar hasta fecha (formato: YYYY-MM-DD)
 * @param {number} filtros.page - Página actual
 * @param {number} filtros.limit - Límite de resultados por página
 * @returns {Promise} Lista de encuestas
 */
export const getEncuestas = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();

    if (filtros.nota_minima) params.append('nota_minima', filtros.nota_minima);
    if (filtros.fecha_desde) params.append('fecha_desde', filtros.fecha_desde);
    if (filtros.fecha_hasta) params.append('fecha_hasta', filtros.fecha_hasta);
    if (filtros.page) params.append('page', filtros.page);
    if (filtros.limit) params.append('limit', filtros.limit);

    const response = await axios.get(`/encuestas?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener encuestas:', error);
    throw error.response?.data || error;
  }
};

/**
 * Obtiene una encuesta específica por ID
 * @param {number} id - ID de la encuesta
 * @returns {Promise} Datos de la encuesta
 */
export const getEncuestaById = async (id) => {
  try {
    const response = await axios.get(`/encuestas/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener encuesta ${id}:`, error);
    throw error.response?.data || error;
  }
};

/**
 * Obtiene la encuesta de una operación específica
 * @param {number} idOperacion - ID de la operación
 * @returns {Promise} Datos de la encuesta
 */
export const getEncuestaByOperacion = async (idOperacion) => {
  try {
    const response = await axios.get(`/encuestas/operacion/${idOperacion}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener encuesta de operación ${idOperacion}:`, error);
    throw error.response?.data || error;
  }
};

/**
 * Actualiza una encuesta existente
 * @param {number} id - ID de la encuesta
 * @param {Object} encuestaData - Datos a actualizar
 * @returns {Promise} Resultado de la actualización
 */
export const actualizarEncuesta = async (id, encuestaData) => {
  try {
    const response = await axios.put(`/encuestas/${id}`, encuestaData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar encuesta ${id}:`, error);
    throw error.response?.data || error;
  }
};

/**
 * Elimina una encuesta
 * @param {number} id - ID de la encuesta
 * @returns {Promise} Resultado de la eliminación
 */
export const eliminarEncuesta = async (id) => {
  try {
    const response = await axios.delete(`/encuestas/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar encuesta ${id}:`, error);
    throw error.response?.data || error;
  }
};

/**
 * Obtiene estadísticas de las encuestas
 * @returns {Promise} Estadísticas de encuestas
 */
export const getEstadisticasEncuestas = async () => {
  try {
    const response = await axios.get('/encuestas/estadisticas');
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas de encuestas:', error);
    throw error.response?.data || error;
  }
};

/**
 * Obtiene las operaciones que no tienen encuesta
 * @returns {Promise} Lista de operaciones sin encuesta
 */
export const getOperacionesSinEncuesta = async () => {
  try {
    const response = await axios.get('/encuestas/operaciones-sin-encuesta');
    return response.data;
  } catch (error) {
    console.error('Error al obtener operaciones sin encuesta:', error);
    throw error.response?.data || error;
  }
};
