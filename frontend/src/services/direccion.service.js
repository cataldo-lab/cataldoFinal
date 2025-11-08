// src/services/direccion.service.js

import axios from './root.service.js';

/**
 * Obtiene todos los países con sus regiones, provincias y comunas
 * @returns {Promise} Lista de países con jerarquía completa
 */
export const getPaises = async () => {
  try {
    const response = await axios.get('/direccion/paises');
    return response.data;
  } catch (error) {
    console.error('Error al obtener países:', error);
    throw error.response?.data || error;
  }
};
