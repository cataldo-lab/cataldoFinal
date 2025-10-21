// frontend/src/services/materiales.service.js
import axios from './root.service.js';

// === OBTENER MATERIALES ===

/**
 * Obtener todos los materiales (versión básica)
 */
export async function getMateriales(filtros = {}) {
    try {
        const params = new URLSearchParams();
        if (filtros.categoria_unidad) params.append('categoria_unidad', filtros.categoria_unidad);
        if (filtros.activo !== undefined) params.append('activo', filtros.activo);
        if (filtros.bajo_stock !== undefined) params.append('bajo_stock', filtros.bajo_stock);
        if (filtros.id_proveedor) params.append('id_proveedor', filtros.id_proveedor);
        
        const response = await axios.get(`/materiales?${params.toString()}`);
        return response.data;
    } catch (error) {
        return error.response?.data || { status: 'error', message: 'Error de conexión' };
    }
}

/**
 * Obtener materiales CON resumen de compras y proveedor
 */
export async function getMaterialesConResumen(filtros = {}) {
    try {
        const params = new URLSearchParams();
        if (filtros.categoria_unidad) params.append('categoria_unidad', filtros.categoria_unidad);
        if (filtros.activo !== undefined) params.append('activo', filtros.activo);
        if (filtros.bajo_stock !== undefined) params.append('bajo_stock', filtros.bajo_stock);
        if (filtros.id_proveedor) params.append('id_proveedor', filtros.id_proveedor);
        
        const response = await axios.get(`/materiales/con-resumen?${params.toString()}`);
        return response.data;
    } catch (error) {
        return error.response?.data || { status: 'error', message: 'Error de conexión' };
    }
}

/**
 * Obtener un material por ID (básico)
 */
export async function getMaterialById(id) {
    try {
        const response = await axios.get(`/materiales/${id}`);
        return response.data;
    } catch (error) {
        return error.response?.data || { status: 'error', message: 'Error de conexión' };
    }
}

/**
 * Obtener material con detalle completo (proveedor, compras, productos)
 */
export async function getMaterialDetalleCompleto(id) {
    try {
        const response = await axios.get(`/materiales/${id}/detalle-completo`);
        return response.data;
    } catch (error) {
        return error.response?.data || { status: 'error', message: 'Error de conexión' };
    }
}

// === CREAR Y ACTUALIZAR MATERIALES ===

/**
 * Crear un nuevo material
 */
export async function createMaterial(materialData) {
    try {
        const response = await axios.post('/materiales', materialData);
        return response.data;
    } catch (error) {
        return error.response?.data || { status: 'error', message: 'Error de conexión' };
    }
}

/**
 * Actualizar material
 */
export async function updateMaterial(id, materialData) {
    try {
        const response = await axios.put(`/materiales/${id}`, materialData);
        return response.data;
    } catch (error) {
        return error.response?.data || { status: 'error', message: 'Error de conexión' };
    }
}

/**
 * Actualizar solo el stock de un material
 * @param {number} id - ID del material
 * @param {number} cantidad - Cantidad a modificar
 * @param {string} operacion - 'add', 'subtract', o 'set'
 */
export async function updateStockMaterial(id, cantidad, operacion = 'set') {
    try {
        const response = await axios.patch(`/materiales/${id}/stock`, {
            cantidad,
            operacion
        });
        return response.data;
    } catch (error) {
        return error.response?.data || { status: 'error', message: 'Error de conexión' };
    }
}

/**
 * Desactivar material
 */
export async function deleteMaterial(id) {
    try {
        const response = await axios.delete(`/materiales/${id}`);
        return response.data;
    } catch (error) {
        return error.response?.data || { status: 'error', message: 'Error de conexión' };
    }
}

// === ALERTAS DE STOCK ===

/**
 * Obtener materiales con stock bajo
 */
export async function getMaterialesBajoStock() {
    try {
        const response = await axios.get('/materiales/alertas/bajo-stock');
        return response.data;
    } catch (error) {
        return error.response?.data || { status: 'error', message: 'Error de conexión' };
    }
}

/**
 * Obtener alertas de stock categorizadas
 */
export async function getAlertasStock() {
    try {
        const response = await axios.get('/materiales/alertas/stock');
        return response.data;
    } catch (error) {
        return error.response?.data || { status: 'error', message: 'Error de conexión' };
    }
}

// === COMPRAS DE MATERIALES ===

/**
 * Crear una nueva compra de material
 */
export async function createCompraMaterial(compraData) {
    try {
        const response = await axios.post('/compras-materiales', compraData);
        return response.data;
    } catch (error) {
        return error.response?.data || { status: 'error', message: 'Error de conexión' };
    }
}

/**
 * Obtener historial de compras de materiales
 */
export async function getComprasMateriales(filtros = {}) {
    try {
        const params = new URLSearchParams();
        if (filtros.id_material) params.append('id_material', filtros.id_material);
        if (filtros.id_proveedor) params.append('id_proveedor', filtros.id_proveedor);
        if (filtros.estado) params.append('estado', filtros.estado);
        if (filtros.fecha_desde) params.append('fecha_desde', filtros.fecha_desde);
        if (filtros.fecha_hasta) params.append('fecha_hasta', filtros.fecha_hasta);
        
        const response = await axios.get(`/compras-materiales?${params.toString()}`);
        return response.data;
    } catch (error) {
        return error.response?.data || { status: 'error', message: 'Error de conexión' };
    }
}

/**
 * Marcar compra como recibida (actualiza stock automáticamente)
 */
export async function marcarCompraComoRecibida(id_compra) {
    try {
        const response = await axios.patch(`/compras-materiales/${id_compra}/recibir`);
        return response.data;
    } catch (error) {
        return error.response?.data || { status: 'error', message: 'Error de conexión' };
    }
}

// === PROVEEDORES ===

/**
 * Obtener análisis completo de un proveedor
 */
export async function getAnalisisProveedor(id_proveedor) {
    try {
        const response = await axios.get(`/proveedores/${id_proveedor}/analisis`);
        return response.data;
    } catch (error) {
        return error.response?.data || { status: 'error', message: 'Error de conexión' };
    }
}

/**
 * Obtener lista de proveedores
 */
export async function getProveedores() {
    try {
        const response = await axios.get('/proveedores');
        return response.data;
    } catch (error) {
        return error.response?.data || { status: 'error', message: 'Error de conexión' };
    }
}