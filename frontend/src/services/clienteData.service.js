// src/services/clienteData.service.js

import axios from './root.service.js'; 

/**
 * Obtiene todos los clientes
 * @returns {Promise} Lista de clientes
 */
export const getAllClientes = async () => {
  try {
    const response = await axios.get('/ClientesUser');
    return response.data;
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    throw error.response?.data || error;
  }
};

/**
 * Busca clientes con filtros opcionales
 * @param {Object} filtros - Objeto con filtros de búsqueda
 * @param {string} filtros.nombre - Nombre del cliente (búsqueda parcial)
 * @param {string} filtros.email - Email del cliente (búsqueda parcial)
 * @param {string} filtros.categoria - Categoría del cliente (regular, vip, premium)
 * @returns {Promise} Lista de clientes que coinciden con los filtros
 */
export const searchClientes = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filtros.nombre) params.append('nombre', filtros.nombre);
    if (filtros.email) params.append('email', filtros.email);
    if (filtros.categoria) params.append('categoria', filtros.categoria);
    
    const response = await axios.get(`/clientes/search?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error al buscar clientes:', error);
    throw error.response?.data || error;
  }
};

/**
 * Obtiene un cliente por ID con todas sus relaciones
 * @param {number} id - ID del usuario/cliente
 * @returns {Promise} Datos completos del cliente
 */
export const getClienteById = async (id) => {
  try {
    const response = await axios.get(`/clientes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener cliente ${id}:`, error);
    throw error.response?.data || error;
  }
};

/**
 * Obtiene solo los datos de usuario (parte 1 del perfil)
 * @param {number} id - ID del usuario
 * @returns {Promise} Datos básicos del usuario
 */
export const getUserById = async (id) => {
  try {
    const response = await axios.get(`/clientes/${id}/usuario`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener usuario ${id}:`, error);
    throw error.response?.data || error;
  }
};

/**
 * Obtiene solo los datos específicos de cliente (parte 2 del perfil)
 * @param {number} id - ID del usuario
 * @returns {Promise} Datos específicos del cliente
 */
export const getClienteDetalleById = async (id) => {
  try {
    const response = await axios.get(`/clientes/${id}/full`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener detalles de cliente ${id}:`, error);
    throw error.response?.data || error;
  }
};

/**
 * Crea un perfil completo (usuario + cliente)
 * @param {Object} userData - Datos del usuario (rut, nombre, email, password, etc.)
 * @param {Object} clienteData - Datos del cliente (categoría, descuento, etc.)
 * @returns {Promise} Resultado de la creación
 */
export const createPerfilFull = async (userData, clienteData) => {
  try {
    const response = await axios.post('/clientes', {
      userData,
      clienteData
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear perfil completo:', error);
    throw error.response?.data || error;
  }
};

/**
 * Crea perfil de cliente para un usuario existente
 * @param {number} id - ID del usuario existente
 * @param {Object} clienteData - Datos del cliente
 * @returns {Promise} Resultado de la creación
 */
export const createMedioPerfil = async (id, clienteData) => {
  try {
    const response = await axios.post(`/clientes/${id}/full`, {
      clienteData
    });
    return response.data;
  } catch (error) {
    console.error(`Error al crear medio perfil para usuario ${id}:`, error);
    throw error.response?.data || error;
  }
};

/**
 * Actualiza solo los datos de cliente
 * @param {number} id - ID del usuario
 * @param {Object} clienteData - Datos del cliente a actualizar
 * @returns {Promise} Resultado de la actualización
 */
export const updateMedioPerfil = async (id, clienteData) => {
  try {
    const response = await axios.patch(`/clientes/${id}/full`, {
      clienteData
    });
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar medio perfil para usuario ${id}:`, error);
    throw error.response?.data || error;
  }
};

/**
 * Actualiza el perfil completo (usuario + cliente)
 * @param {number} id - ID del usuario
 * @param {Object} userData - Datos del usuario a actualizar
 * @param {Object} clienteData - Datos del cliente a actualizar
 * @returns {Promise} Resultado de la actualización
 */
export const updatePerfilFull = async (id, userData = {}, clienteData = {}) => {
  try {
    const response = await axios.patch(`/clientes/${id}`, {
      userData,
      clienteData
    });
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar perfil completo para usuario ${id}:`, error);
    throw error.response?.data || error;
  }
};

/**
 * Bloquea un usuario cliente
 * @param {number} id - ID del usuario a bloquear
 * @param {string} motivo - Motivo del bloqueo (opcional)
 * @returns {Promise} Resultado del bloqueo
 */
export const blockUserCliente = async (id, motivo = '') => {
  try {
    const response = await axios.patch(`/clientes/${id}/block`, {
      motivo
    });
    return response.data;
  } catch (error) {
    console.error(`Error al bloquear usuario ${id}:`, error);
    throw error.response?.data || error;
  }
};

/**
 * Elimina un usuario cliente
 * @param {number} id - ID del usuario a eliminar
 * @param {boolean} softDelete - Si es true hace soft delete (bloqueo), si es false elimina permanentemente
 * @returns {Promise} Resultado de la eliminación
 */
export const deleteUserCliente = async (id, softDelete = true) => {
  try {
    const response = await axios.delete(`/clientes/${id}`, {
      params: { softDelete }
    });
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar usuario ${id}:`, error);
    throw error.response?.data || error;
  }
};