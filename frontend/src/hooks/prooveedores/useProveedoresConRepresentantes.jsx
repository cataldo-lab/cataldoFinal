// frontend/src/hooks/proveedores/useProveedoresConRepresentantes.jsx
import { useState, useEffect } from 'react';
import { getProveedoresConRepresentantes } from '@services/proveedor.service.js';

export function useProveedoresConRepresentantes(autoFetch = true) {
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProveedores = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await getProveedoresConRepresentantes();
            
            if (response.success) {
                setProveedores(response.data || []);
            } else {
                setError(response.message);
                setProveedores([]);
            }
        } catch (err) {
            console.error('Error en useProveedoresConRepresentantes:', err);
            setError('Error inesperado al cargar proveedores');
            setProveedores([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (autoFetch) {
            fetchProveedores();
        }
    }, [autoFetch]);

    return {
        proveedores,
        loading,
        error,
        fetchProveedores,
        setProveedores
    };
}

export default useProveedoresConRepresentantes;