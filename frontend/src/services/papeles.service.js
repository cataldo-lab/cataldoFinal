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

export default {
    getClientesConCompras,
    getClienteConComprasById
};