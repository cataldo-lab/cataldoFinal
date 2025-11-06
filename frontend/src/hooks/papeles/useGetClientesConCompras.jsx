// frontend/src/hooks/papeles/useGetClientesConCompras.jsx
import { useState, useEffect, useCallback } from 'react';
import { getClientesConCompras } from '@services/papeles.service.js';


export const useGetClientesConCompras = (autoFetch = true) => {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [estadisticas, setEstadisticas] = useState(null);

 
    const fetchClientes = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await getClientesConCompras();

            if (response.status === 'Success') {
                setClientes(response.data || []);
                setEstadisticas(response.estadisticas_generales || null);
                return response.data;
            } else {
                throw new Error(response.message || 'Error al obtener clientes');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 
                                err.message || 
                                'Error al obtener clientes con compras';
            setError(errorMessage);
            console.error('Error en useGetClientesConCompras:', err);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Resetear estado
     */
    const reset = useCallback(() => {
        setClientes([]);
        setEstadisticas(null);
        setLoading(false);
        setError(null);
    }, []);

    useEffect(() => {
        if (autoFetch) {
            fetchClientes();
        }
    }, [autoFetch, fetchClientes]);

    return {
        clientes,
        estadisticas,
        loading,
        error,
        fetchClientes,
        reset
    };
};

export default useGetClientesConCompras;