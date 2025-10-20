import axios from './root.service.js';

// === CATÁLOGO DE PRODUCTOS ===
export async function getProductCatalog() {
    try {
        const response = await axios.get('/cliente/catalog');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function getProductDetail(id) {
    try {
        const response = await axios.get(`/cliente/catalog/${id}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

// === MIS ÓRDENES ===
export async function getMyOrders() {
    try {
        const response = await axios.get('/cliente/my-orders');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function getMyOrder(id) {
    try {
        const response = await axios.get(`/cliente/my-orders/${id}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function createOrder(orderData) {
    try {
        const response = await axios.post('/cliente/my-orders', orderData);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

// === PERFIL ===
export async function getMyProfile() {
    try {
        const response = await axios.get('/cliente/profile');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function updateMyProfile(profileData) {
    try {
        const response = await axios.patch('/cliente/profile', profileData);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

// === ENCUESTAS ===
export async function getMySurveys() {
    try {
        const response = await axios.get('/cliente/surveys');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function createSurvey(surveyData) {
    try {
        const response = await axios.post('/cliente/surveys', surveyData);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}