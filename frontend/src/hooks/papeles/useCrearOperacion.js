import { useState } from 'react';
import { createOperacionConProductos } from '@services/papeles.service';

/**
 * Hook para crear operaciones con productos
 * Maneja estado de carga, errores y éxito
 */
export const useCrearOperacion = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [operacionCreada, setOperacionCreada] = useState(null);

    /**
     * Crea una operación con productos
     * @param {Object} operacionData - Datos de la operación
     * @param {Array} productos - Array de productos
     */
    const crearOperacion = async (operacionData, productos) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        setOperacionCreada(null);

        try {
            const response = await createOperacionConProductos(operacionData, productos);

            if (response.status === 'Success') {
                setSuccess(true);
                setOperacionCreada(response.data);
                return { success: true, data: response.data };
            } else {
                setError(response.message || 'Error al crear la operación');
                return { success: false, error: response.message };
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message ||
                                err.message ||
                                'Error al crear la operación';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    /**
     * Reinicia el estado del hook
     */
    const reset = () => {
        setLoading(false);
        setError(null);
        setSuccess(false);
        setOperacionCreada(null);
    };

    return {
        loading,
        error,
        success,
        operacionCreada,
        crearOperacion,
        reset
    };
};

export default useCrearOperacion;
