import axios from './root.service.js';

// === OBTENER PRODUCTOS ===
export async function getProductos(filtros = {}) {
    try {
        const params = new URLSearchParams();
        if (filtros.categoria) params.append('categoria', filtros.categoria);
        if (filtros.activo !== undefined) params.append('activo', filtros.activo);
        if (filtros.servicio !== undefined) params.append('servicio', filtros.servicio);
        if (filtros.oferta !== undefined) params.append('oferta', filtros.oferta);
        
        const response = await axios.get(`/productos?${params.toString()}`);
        return response.data;
    } catch (error) {
        return error.response?.data || { status: 'error', message: 'Error de conexión' };
    }
}

export async function getProductoById(id) {
    try {
        const response = await axios.get(`/productos/${id}`);
        return response.data;
    } catch (error) {
        return error.response?.data || { status: 'error', message: 'Error de conexión' };
    }
}

// === CREAR PRODUCTO ===
export async function createProducto(productoData) {
    try {
        const response = await axios.post('/productos', productoData);
        return response.data;
    } catch (error) {
        return error.response?.data || { status: 'error', message: 'Error de conexión' };
    }
}

// === ACTUALIZAR PRODUCTO ===
export async function updateProducto(id, productoData) {
    try {
        const response = await axios.put(`/productos/${id}`, productoData);
        return response.data;
    } catch (error) {
        return error.response?.data || { status: 'error', message: 'Error de conexión' };
    }
}

// === DESACTIVAR PRODUCTO ===
export async function deleteProducto(id) {
    try {
        const response = await axios.delete(`/productos/${id}`);
        return response.data;
    } catch (error) {
        return error.response?.data || { status: 'error', message: 'Error de conexión' };
    }
}

// === OBTENER CATEGORÍAS ===
export async function getCategorias() {
    try {
        const response = await axios.get('/productos/categorias');
        return response.data;
    } catch (error) {
        return error.response?.data || { status: 'error', message: 'Error de conexión' };
    }
}