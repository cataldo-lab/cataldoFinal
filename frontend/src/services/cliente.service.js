import axios from './root.service.js';

// ========================================
// MIS PEDIDOS / OPERACIONES
// ========================================

/**
 * Obtener todas mis operaciones (del cliente autenticado)
 * @param {Object} filtros - Filtros opcionales { estado_operacion?, fecha_desde?, fecha_hasta? }
 * @returns {Promise<Object>} Response del backend
 */
export async function getMisPedidos(filtros = {}) {
  try {
    const params = new URLSearchParams();
    if (filtros.estado_operacion) params.append('estado_operacion', filtros.estado_operacion);
    if (filtros.fecha_desde) params.append('fecha_desde', filtros.fecha_desde);
    if (filtros.fecha_hasta) params.append('fecha_hasta', filtros.fecha_hasta);

    const queryString = params.toString();
    const url = queryString ? `/cliente/my-orders?${queryString}` : '/cliente/my-orders';

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error al obtener mis pedidos:', error);
    return error.response?.data || {
      status: 'Error',
      message: 'Error de conexión al obtener tus pedidos'
    };
  }
}

/**
 * Obtener un pedido específico por ID
 * @param {number} id - ID del pedido
 * @returns {Promise<Object>} Response del backend
 */
export async function getMiPedidoById(id) {
  try {
    const response = await axios.get(`/cliente/my-orders/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener el pedido:', error);
    return error.response?.data || {
      status: 'Error',
      message: 'Error de conexión al obtener el pedido'
    };
  }
}

// ========================================
// MI PERFIL
// ========================================

/**
 * Obtener mi perfil de cliente
 * @returns {Promise<Object>} Response del backend
 */
export async function getMiPerfil() {
  try {
    const response = await axios.get('/cliente/profile');
    return response.data;
  } catch (error) {
    console.error('Error al obtener mi perfil:', error);
    return error.response?.data || {
      status: 'Error',
      message: 'Error de conexión al obtener tu perfil'
    };
  }
}

// ========================================
// HELPERS Y UTILIDADES
// ========================================

/**
 * Obtener etiqueta legible para un estado de pedido
 * @param {string} estado - Estado de la operación
 * @returns {string}
 */
export function getEstadoPedidoLabel(estado) {
  const labels = {
    'cotizacion': 'Cotización',
    'orden_trabajo': 'Orden de Trabajo',
    'pendiente': 'Pendiente',
    'en_proceso': 'En Proceso',
    'terminada': 'Terminada',
    'completada': 'Completada',
    'entregada': 'Entregada',
    'pagada': 'Pagada',
    'anulada': 'Anulada'
  };
  return labels[estado] || estado;
}

/**
 * Obtener color para badge según estado del pedido
 * @param {string} estado - Estado de la operación
 * @returns {string} Clase de color
 */
export function getEstadoPedidoColor(estado) {
  const colors = {
    'cotizacion': 'bg-blue-100 text-blue-800',
    'orden_trabajo': 'bg-cyan-100 text-cyan-800',
    'pendiente': 'bg-orange-100 text-orange-800',
    'en_proceso': 'bg-yellow-100 text-yellow-800',
    'terminada': 'bg-purple-100 text-purple-800',
    'completada': 'bg-green-100 text-green-800',
    'entregada': 'bg-teal-100 text-teal-800',
    'pagada': 'bg-emerald-100 text-emerald-800',
    'anulada': 'bg-red-100 text-red-800'
  };
  return colors[estado] || 'bg-gray-100 text-gray-800';
}

/**
 * Formatear fecha para mostrar en UI
 * @param {string|Date} fecha - Fecha a formatear
 * @returns {string} Fecha formateada
 */
export function formatearFecha(fecha) {
  if (!fecha) return 'Sin fecha';

  const date = new Date(fecha);
  return date.toLocaleDateString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Formatear fecha con hora para mostrar en UI
 * @param {string|Date} fecha - Fecha a formatear
 * @returns {string} Fecha y hora formateada
 */
export function formatearFechaHora(fecha) {
  if (!fecha) return 'Sin fecha';

  const date = new Date(fecha);
  return date.toLocaleDateString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Formatear moneda chilena
 * @param {number} monto - Monto a formatear
 * @returns {string} Monto formateado
 */
export function formatearMoneda(monto) {
  if (monto === null || monto === undefined) return '$0';

  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(monto);
}

/**
 * Verificar si un pedido tiene saldo pendiente
 * @param {Object} pedido - Objeto pedido
 * @returns {boolean}
 */
export function tieneSaldoPendiente(pedido) {
  return pedido.saldo_pendiente > 0;
}

/**
 * Calcular porcentaje de avance según estado
 * @param {string} estado - Estado del pedido
 * @returns {number} Porcentaje de 0 a 100
 */
export function calcularPorcentajeAvance(estado) {
  const porcentajes = {
    'cotizacion': 10,
    'orden_trabajo': 20,
    'pendiente': 30,
    'en_proceso': 50,
    'terminada': 70,
    'completada': 85,
    'entregada': 95,
    'pagada': 100,
    'anulada': 0
  };
  return porcentajes[estado] || 0;
}
