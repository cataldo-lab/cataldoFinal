import axios from './root.service.js';


export async function getClientesConCompras() {
    try {
        const response = await axios.get('/papeles/compras');
        return response.data;
    } catch (error) {
        console.error('Error al obtener clientes con compras:', error);
        throw error;
    }
}


export async function getClienteConComprasById(id_cliente) {
    try {
        const response = await axios.get(`/papeles/compras/${id_cliente}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener cliente ${id_cliente} con compras:`, error);
        throw error;
    }
}

/**
 * Obtiene clientes con compras filtrado por rango de fechas
 * @param {string} fecha_inicio - Fecha de inicio (YYYY-MM-DD)
 * @param {string} fecha_fin - Fecha de fin (YYYY-MM-DD)
 */
export async function getClientesConComprasPorFechas(fecha_inicio, fecha_fin) {
    try {
        const params = {};
        if (fecha_inicio) params.fecha_inicio = fecha_inicio;
        if (fecha_fin) params.fecha_fin = fecha_fin;

        const response = await axios.get('/papeles/compras/filtro/fechas', { params });
        return response.data;
    } catch (error) {
        console.error('Error al obtener clientes con compras por fechas:', error);
        throw error;
    }
}

/**
 * Obtiene estadísticas avanzadas por periodo
 * @param {string} fecha_inicio - Fecha de inicio (YYYY-MM-DD)
 * @param {string} fecha_fin - Fecha de fin (YYYY-MM-DD)
 */
export async function getEstadisticasAvanzadas(fecha_inicio, fecha_fin) {
    try {
        const params = {};
        if (fecha_inicio) params.fecha_inicio = fecha_inicio;
        if (fecha_fin) params.fecha_fin = fecha_fin;

        const response = await axios.get('/papeles/estadisticas', { params });
        return response.data;
    } catch (error) {
        console.error('Error al obtener estadísticas avanzadas:', error);
        throw error;
    }
}

export default {
    getClientesConCompras,
    getClienteConComprasById,
    getClientesConComprasPorFechas,
    getEstadisticasAvanzadas
};