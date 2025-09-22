import axios from './root.service.js';

// === OPERACIONES ===
export async function getOperations() {
    try {
        const response = await axios.get('/gerente/operations');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function getOperation(id) {
    try {
        const response = await axios.get(`/gerente/operations/${id}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function updateOperation(id, data) {
    try {
        const response = await axios.patch(`/gerente/operations/${id}`, data);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

// === EMPLEADOS ===
export async function getEmployees() {
    try {
        const response = await axios.get('/gerente/employees');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function getEmployee(id) {
    try {
        const response = await axios.get(`/gerente/employees/${id}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function updateEmployee(id, data) {
    try {
        const response = await axios.patch(`/gerente/employees/${id}`, data);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

// === REPORTES ===
export async function getSalesReport() {
    try {
        const response = await axios.get('/gerente/reports/sales');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function getInventoryReport() {
    try {
        const response = await axios.get('/gerente/reports/inventory');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function getOperationsReport() {
    try {
        const response = await axios.get('/gerente/reports/operations');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}