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
            
            console.log('📡 Llamando a getProveedoresConRepresentantes...');
            const response = await getProveedoresConRepresentantes();
            console.log('📥 Respuesta recibida:', response);
            
            if (response.success) {
                setProveedores(response.data || []);
                console.log('✅ Proveedores seteados:', response.data?.length || 0);
            } else {
                setError(response.message);
                setProveedores([]);
                console.error('❌ Error en respuesta:', response.message);
            }
        } catch (err) {
            console.error('❌ Error en useProveedoresConRepresentantes:', err);
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