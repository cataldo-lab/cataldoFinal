// frontend/src/hooks/papeles/useGetClienteConComprasById.jsx
import { useState, useCallback } from 'react';
import { getClienteConComprasById } from '@services/papeles.service.js';


export const useGetClienteConComprasById = () => {
    const [cliente, setCliente] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

 
    const fetchCliente = useCallback(async (id_cliente) => {
        try {
            setLoading(true);
            setError(null);
            setCliente(null);

            if (!id_cliente || isNaN(parseInt(id_cliente))) {
                throw new Error('ID de cliente inválido');
            }

            const response = await getClienteConComprasById(parseInt(id_cliente));

            if (response.status === 'Success') {
                setCliente(response.data);
                return response.data;
            } else {
                throw new Error(response.message || 'Cliente no encontrado');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 
                                err.message || 
                                'Error al obtener cliente con compras';
            setError(errorMessage);
            console.error('Error en useGetClienteConComprasById:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setCliente(null);
        setLoading(false);
        setError(null);
    }, []);

    return {
        cliente,
        loading,
        error,
        fetchCliente,
        reset
    };
};

export default useGetClienteConComprasById;