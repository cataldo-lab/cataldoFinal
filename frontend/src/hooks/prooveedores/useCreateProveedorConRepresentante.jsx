import { useState } from 'react';
import { createProveedorConRepresentante } from '@services/proveedor.service.js';

export function useCreateProveedorConRepresentante() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const handleCreateProveedorConRepresentante = async (data) => {
        try {
            setLoading(true);
            setError(null);

            console.log('📤 Enviando datos:', data);

            const response = await createProveedorConRepresentante(data);

            if (response.success) {
                console.log('✅ Proveedor creado:', response.data);
                closeModal(); // Cerrar modal al éxito
                return [response.data, null];
            } else {
                console.error('❌ Error en respuesta:', response.message);
                setError(response.message);
                return [null, response.message];
            }
        } catch (err) {
            console.error('❌ Error al crear proveedor con representante:', err);
            const errorMessage = 'Error inesperado al crear proveedor';
            setError(errorMessage);
            return [null, errorMessage];
        } finally {
            setLoading(false);
        }
    };

    return {
        handleCreateProveedorConRepresentante,
        loading,
        error,
        isOpen,
        openModal,
        closeModal
    };
}

export default useCreateProveedorConRepresentante;