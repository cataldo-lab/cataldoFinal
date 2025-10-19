// frontend/src/hooks/materiales/useMateriales.jsx
import { useState, useEffect } from 'react';
import {
    getMaterialesConResumen,
    createMaterial,
    updateMaterial,
    deleteMaterial,
    updateStockMaterial,
    getProveedores
} from '@services/materiales.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

export const useMateriales = () => {
    const [materiales, setMateriales] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtros, setFiltros] = useState({
        categoria_unidad: '',
        activo: true,
        bajo_stock: false,
        id_proveedor: '',
        busqueda: ''
    });

    // Cargar materiales
    const fetchMateriales = async () => {
        try {
            setLoading(true);
            const filtrosAPI = {
                categoria_unidad: filtros.categoria_unidad || undefined,
                activo: filtros.activo,
                bajo_stock: filtros.bajo_stock ? 'true' : undefined,
                id_proveedor: filtros.id_proveedor || undefined
            };

            const response = await getMaterialesConResumen(filtrosAPI);
            
            if (response.status === 'Success') {
                let materialesData = response.data || [];

                // Aplicar filtro de búsqueda local
                if (filtros.busqueda) {
                    const busquedaLower = filtros.busqueda.toLowerCase();
                    materialesData = materialesData.filter(material =>
                        material.nombre_material.toLowerCase().includes(busquedaLower) ||
                        (material.proveedor?.nombre_completo || '').toLowerCase().includes(busquedaLower)
                    );
                }

                setMateriales(materialesData);
            } else {
                showErrorAlert('Error', response.message || 'No se pudieron cargar los materiales');
                setMateriales([]);
            }
        } catch (error) {
            console.error('Error al cargar materiales:', error);
            showErrorAlert('Error', 'Error al cargar los materiales');
            setMateriales([]);
        } finally {
            setLoading(false);
        }
    };

    // Cargar proveedores
    const fetchProveedores = async () => {
        try {
            const response = await getProveedores();
            if (response.status === 'Success') {
                setProveedores(response.data || []);
            }
        } catch (error) {
            console.error('Error al cargar proveedores:', error);
        }
    };

    useEffect(() => {
        fetchMateriales();
    }, [filtros.categoria_unidad, filtros.activo, filtros.bajo_stock, filtros.id_proveedor]);

    useEffect(() => {
        fetchProveedores();
    }, []);

    // Manejar cambios en filtros
    const handleFiltroChange = (nombre, valor) => {
        setFiltros(prev => ({
            ...prev,
            [nombre]: valor
        }));
    };

    // Limpiar filtros
    const limpiarFiltros = () => {
        setFiltros({
            categoria_unidad: '',
            activo: true,
            bajo_stock: false,
            id_proveedor: '',
            busqueda: ''
        });
    };

    // Crear material
    const handleCreateMaterial = async (materialData) => {
        try {
            const response = await createMaterial(materialData);
            
            if (response.status === 'Success') {
                showSuccessAlert('¡Éxito!', 'Material creado correctamente');
                await fetchMateriales();
                return [true, null];
            } else {
                showErrorAlert('Error', response.message || 'No se pudo crear el material');
                return [false, response.message];
            }
        } catch (error) {
            console.error('Error al crear material:', error);
            showErrorAlert('Error', 'Error al crear el material');
            return [false, error.message];
        }
    };

    // Actualizar material
    const handleUpdateMaterial = async (id, materialData) => {
        try {
            const response = await updateMaterial(id, materialData);
            
            if (response.status === 'Success') {
                showSuccessAlert('¡Éxito!', 'Material actualizado correctamente');
                await fetchMateriales();
                return [true, null];
            } else {
                showErrorAlert('Error', response.message || 'No se pudo actualizar el material');
                return [false, response.message];
            }
        } catch (error) {
            console.error('Error al actualizar material:', error);
            showErrorAlert('Error', 'Error al actualizar el material');
            return [false, error.message];
        }
    };

    // Actualizar solo stock
    const handleUpdateStock = async (id, cantidad, operacion = 'set') => {
        try {
            const response = await updateStockMaterial(id, cantidad, operacion);
            
            if (response.status === 'Success') {
                showSuccessAlert('¡Éxito!', 'Stock actualizado correctamente');
                await fetchMateriales();
                return [true, null];
            } else {
                showErrorAlert('Error', response.message || 'No se pudo actualizar el stock');
                return [false, response.message];
            }
        } catch (error) {
            console.error('Error al actualizar stock:', error);
            showErrorAlert('Error', 'Error al actualizar el stock');
            return [false, error.message];
        }
    };

    // Desactivar material
    const handleDeleteMaterial = async (id) => {
        try {
            const response = await deleteMaterial(id);
            
            if (response.status === 'Success') {
                showSuccessAlert('¡Éxito!', 'Material desactivado correctamente');
                await fetchMateriales();
                return [true, null];
            } else {
                showErrorAlert('Error', response.message || 'No se pudo desactivar el material');
                return [false, response.message];
            }
        } catch (error) {
            console.error('Error al desactivar material:', error);
            showErrorAlert('Error', 'Error al desactivar el material');
            return [false, error.message];
        }
    };

    // Obtener categorías únicas
    const categorias = [...new Set(materiales.map(m => m.categoria_unidad).filter(Boolean))];

    return {
        materiales,
        proveedores,
        categorias,
        loading,
        filtros,
        handleFiltroChange,
        limpiarFiltros,
        handleCreateMaterial,
        handleUpdateMaterial,
        handleUpdateStock,
        handleDeleteMaterial,
        fetchMateriales
    };
};

// Hook para formatear precios
export const useFormatPrecio = () => {
    const formatPrecio = (precio) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(precio);
    };

    return { formatPrecio };
};