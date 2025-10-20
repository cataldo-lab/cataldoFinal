import axios from './root.service.js';

// ========================================
// OBTENER OPERACIONES
// ========================================

/**
 * Obtener todas las operaciones con filtros opcionales
 * @param {Object} filtros - { estado_operacion?, id_cliente?, fecha_desde?, fecha_hasta? }
 */
export async function getOperaciones(filtros = {}) {
    try {
        const params = new URLSearchParams();
        if (filtros.estado_operacion) params.append('estado_operacion', filtros.estado_operacion);
        if (filtros.id_cliente) params.append('id_cliente', filtros.id_cliente);
        if (filtros.fecha_desde) params.append('fecha_desde', filtros.fecha_desde);
        if (filtros.fecha_hasta) params.append('fecha_hasta', filtros.fecha_hasta);
        
        const response = await axios.get(`/operaciones?${params.toString()}`);
        return response.data;
    } catch (error) {
        return error.response?.data || { status: 'error', message: 'Error de conexión' };
    }
}

/**
 * Obtener una operación por ID
 * @param {number} id - ID de la operación
 */
export async function getOperacionById(id) {
    try {
        const response = await axios.get(`/operaciones/${id}`);
        return response.data;
    } catch (error) {
        return error.response?.data || { status: 'error', message: 'Error de conexión' };
    }
}

// ========================================
// CREAR OPERACIÓN
// ========================================

/**
 * Crear nueva operación
 * @param {Object} operacionData - Datos de la operación
 * @param {number} operacionData.id_cliente - ID del cliente
 * @param {Array} operacionData.productos - Array de productos
 * @param {number} operacionData.productos[].id_producto - ID del producto
 * @param {number} operacionData.productos[].cantidad - Cantidad
 * @param {number} operacionData.productos[].precio_unitario - Precio (opcional)
 * @param {string} operacionData.productos[].especificaciones - Especificaciones (opcional)
 * @param {string} operacionData.estado_operacion - Estado (opcional, default: "pendiente")
 * @param {number} operacionData.cantidad_abono - Abono inicial (opcional, default: 0)
 * @param {string} operacionData.descripcion_operacion - Descripción (opcional)
 * @param {string} operacionData.fecha_entrega_estimada - Fecha estimada (YYYY-MM-DD)
 * 
 * @example

 * });
 */
export async function createOperacion(operacionData) {
    try {
        const response = await axios.post('/operaciones', operacionData);
        return response.data;
    } catch (error) {
        return error.response?.data || { status: 'error', message: 'Error de conexión' };
    }
}

// ========================================
// ACTUALIZAR OPERACIÓN
// ========================================

/**
 * Actualizar estado de una operación
 * @param {number} id - ID de la operación
 * @param {string} estado - Nuevo estado
 * Estados válidos: "cotizacion", "orden_trabajo", "pendiente", "en_proceso", 
 *                  "terminada", "completada", "entregada", "pagada", "anulada"
 */
export async function updateEstadoOperacion(id, estado) {
    try {
        const response = await axios.patch(`/operaciones/${id}/estado`, { estado });
        return response.data;
    } catch (error) {
        return error.response?.data || { status: 'error', message: 'Error de conexión' };
    }
}

/**
 * Actualizar datos de una operación
 * @param {number} id - ID de la operación
 * @param {Object} datosActualizados - Datos a actualizar
 * @param {string} datosActualizados.descripcion_operacion - Nueva descripción
 * @param {number} datosActualizados.cantidad_abono - Nuevo abono
 * @param {string} datosActualizados.fecha_entrega_estimada - Nueva fecha (YYYY-MM-DD)
 */
export async function updateOperacion(id, datosActualizados) {
    try {
        const response = await axios.put(`/operaciones/${id}`, datosActualizados);
        return response.data;
    } catch (error) {
        return error.response?.data || { status: 'error', message: 'Error de conexión' };
    }
}

// ========================================
// ELIMINAR OPERACIÓN
// ========================================

/**
 * Anular una operación (solo gerentes)
 * @param {number} id - ID de la operación
 */
export async function deleteOperacion(id) {
    try {
        const response = await axios.delete(`/operaciones/${id}`);
        return response.data;
    } catch (error) {
        return error.response?.data || { status: 'error', message: 'Error de conexión' };
    }
}

// ========================================
// ESTADÍSTICAS
// ========================================

/**
 * Obtener estadísticas del dashboard
 * @returns {Promise<Object>} { pendientes, enProceso, ingresosMes }
 */
export async function getDashboardStatsOperaciones() {
    try {
        const response = await axios.get('/operaciones/dashboard/stats');
        return response.data;
    } catch (error) {
        return error.response?.data || { status: 'error', message: 'Error de conexión' };
    }
}

// ========================================
// CONSTANTES Y HELPERS
// ========================================

/**
 * Estados disponibles para operaciones
 */
export const EstadosOperacion = {
    COTIZACION: 'cotizacion',
    ORDEN_TRABAJO: 'orden_trabajo',
    PENDIENTE: 'pendiente',
    EN_PROCESO: 'en_proceso',
    TERMINADA: 'terminada',
    COMPLETADA: 'completada',
    ENTREGADA: 'entregada',
    PAGADA: 'pagada',
    ANULADA: 'anulada'
};

/**
 * Obtener etiqueta legible para un estado
 * @param {string} estado - Estado de la operación
 * @returns {string}
 */
export function getEstadoLabel(estado) {
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
 * Obtener color para badge según estado
 * @param {string} estado - Estado de la operación
 * @returns {string} Color para UI
 */
export function getEstadoColor(estado) {
    const colors = {
        'cotizacion': 'blue',
        'orden_trabajo': 'cyan',
        'pendiente': 'orange',
        'en_proceso': 'yellow',
        'terminada': 'purple',
        'completada': 'green',
        'entregada': 'teal',
        'pagada': 'emerald',
        'anulada': 'red'
    };
    return colors[estado] || 'gray';
}

/**
 * Validar datos de operación antes de enviar
 * @param {Object} operacionData - Datos de la operación
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
export function validateOperacion(operacionData) {
    const errors = [];

    if (!operacionData.id_cliente) {
        errors.push('Debe seleccionar un cliente');
    }

    if (!operacionData.productos || operacionData.productos.length === 0) {
        errors.push('Debe agregar al menos un producto');
    } else {
        operacionData.productos.forEach((prod, index) => {
            if (!prod.id_producto) {
                errors.push(`Producto #${index + 1}: Debe seleccionar un producto`);
            }
            if (!prod.cantidad || prod.cantidad <= 0) {
                errors.push(`Producto #${index + 1}: La cantidad debe ser mayor a 0`);
            }
        });
    }

    if (operacionData.cantidad_abono && operacionData.cantidad_abono < 0) {
        errors.push('El abono no puede ser negativo');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Calcular el saldo pendiente de una operación
 * @param {Object} operacion - Objeto operación
 * @returns {number}
 */
export function calcularSaldoPendiente(operacion) {
    const costo = parseFloat(operacion.costo_operacion || 0);
    const abono = parseFloat(operacion.cantidad_abono || 0);
    return costo - abono;
}

/**
 * Verificar si una operación está pagada completamente
 * @param {Object} operacion - Objeto operación
 * @returns {boolean}
 */
export function estaPagadaCompleta(operacion) {
    return calcularSaldoPendiente(operacion) <= 0;
}

/**
 * Formatear fecha para envío al backend
 * @param {Date|string} fecha - Fecha a formatear
 * @returns {string} Formato YYYY-MM-DD
 */
export function formatFechaOperacion(fecha) {
    if (!fecha) return null;
    
    const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
    return date.toISOString().split('T')[0];
}

/**
 * Formatear operación para mostrar en UI
 * @param {Object} operacion - Objeto operación del backend
 * @returns {Object} Operación formateada
 */
export function formatOperacionData(operacion) {
    return {
        ...operacion,
        costo_operacion: parseFloat(operacion.costo_operacion || 0),
        cantidad_abono: parseFloat(operacion.cantidad_abono || 0),
        saldo_pendiente: calcularSaldoPendiente(operacion),
        esta_pagada: estaPagadaCompleta(operacion),
        estado_label: getEstadoLabel(operacion.estado_operacion),
        estado_color: getEstadoColor(operacion.estado_operacion)
    };
}