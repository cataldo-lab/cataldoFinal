// src/services/clienteData.service.js

import axios from './root.service.js'; 



export const getAllClientes = async () => {
  try {
    const response = await axios.get('/ClientesUser');
    return response.data;
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    throw error.response?.data || error;
  }
};


export const getClienteById = async (id) => {
  try {
    const response = await axios.get(`/clientes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener cliente ${id}:`, error);
    throw error.response?.data || error;
  }
};


export const getUserById = async (id) => {
  try {
    const response = await axios.get(`/clientes/${id}/usuario`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener usuario ${id}:`, error);
    throw error.response?.data || error;
  }
};


export const getClienteDetalleById = async (id) => {
  try {
    const response = await axios.get(`/clientes/${id}/full`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener detalles de cliente ${id}:`, error);
    throw error.response?.data || error;
  }
};


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


export const blockUserCliente = async (id, motivo = '') => {
  try {
    const response = await axios.patch(`/clientes/block/${id}`, {
      motivo
    });
    return response.data;
  } catch (error) {
    console.error(`Error al bloquear usuario ${id}:`, error);
    throw error.response?.data || error;
  }
};


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

/*
export default {
  getAllClientes,
  getClienteById,
  getUserById,
  getClienteDetalleById,
  createPerfilFull,
  createMedioPerfil,
  updateMedioPerfil,
  updatePerfilFull,
  blockUserCliente,
  deleteUserCliente
};*/