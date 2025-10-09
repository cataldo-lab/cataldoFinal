import axios from './root.service.js';

export const getAuditLogs = async (filtros = {}) => {
  const params = new URLSearchParams();
  if (filtros.tipo_evento) params.append('tipo_evento', filtros.tipo_evento);
  if (filtros.nivel) params.append('nivel', filtros.nivel);
  if (filtros.entidad) params.append('entidad', filtros.entidad);
  if (filtros.email) params.append('email', filtros.email);
  if (filtros.limit) params.append('limit', filtros.limit);
  if (filtros.exito !== undefined) params.append('exito', filtros.exito);
  
  const response = await axios.get(`/admin/audit/logs?${params.toString()}`);
  return response.data;
};

export const getUserActivity = async (userId) => {
  const response = await axios.get(`/admin/audit/user/${userId}`);
  return response.data;
};

export const getFailedLogins = async (limit = 50) => {
  const response = await axios.get(`/admin/audit/failed-logins?limit=${limit}`);
  return response.data;
};

export const getEntityHistory = async (entidad, id) => {
  const response = await axios.get(`/admin/audit/entity/${entidad}/${id}`);
  return response.data;
};

export const getAuditDashboard = async () => {
  const response = await axios.get('/admin/audit/dashboard');
  return response.data;
};