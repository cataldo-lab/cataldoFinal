import axios from './root.service.js';

export async function getDashboardStats() {
    try {
        console.log('🌐 Llamando a /trabajador-tienda/dashboard');
        const response = await axios.get('/trabajador-tienda/dashboard');
        console.log('📦 Respuesta del servidor:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Error en getDashboardStats:', error);
        return error.response?.data || { 
            status: 'error', 
            message: 'Error de conexión' 
        };
    }
}



// === MIS OPERACIONES ===
export async function getMyOperations() {
    try {
        const response = await axios.get('/trabajador-tienda/my-operations');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function updateOperationStatus(id, status) {
    try {
        const response = await axios.patch(`/trabajador-tienda/operations/${id}/status`, { status });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

// === PRODUCTOS ===
export async function getProducts() {
    try {
        const response = await axios.get('/trabajador-tienda/products');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function createProduct(productData) {
    try {
        const response = await axios.post('/trabajador-tienda/products', productData);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function updateProduct(id, productData) {
    try {
        const response = await axios.patch(`/trabajador-tienda/products/${id}`, productData);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

// === MATERIALES ===
export async function getMaterials() {
    try {
        const response = await axios.get('/trabajador-tienda/materials');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function updateMaterialStock(id, stock) {
    try {
        const response = await axios.patch(`/trabajador-tienda/materials/${id}/stock`, { stock });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

// === CLIENTES ===
export async function getClients() {
    try {
        const response = await axios.get('/trabajador-tienda/clients');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function getClient(id) {
    try {
        const response = await axios.get(`/trabajador-tienda/clients/${id}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

// === OPERACIONES DE VENTA ===
export async function createOperation(operationData) {
    try {
        const response = await axios.post('/trabajador-tienda/operations', operationData);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function getOperations() {
    try {
        const response = await axios.get('/trabajador-tienda/operations');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}