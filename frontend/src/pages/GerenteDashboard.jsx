import { useState, useEffect } from 'react';
import * as gerenteService from '@services/gerente.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

// Hook para operaciones
export const useOperations = () => {
    const [operations, setOperations] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchOperations = async () => {
        setLoading(true);
        try {
            const response = await gerenteService.getOperations();
            if (response.status === 'Success') {
                setOperations(response.data);
            } else {
                showErrorAlert('Error', 'No se pudieron cargar las operaciones');
            }
        } catch (error) {
            showErrorAlert('Error', 'Error al cargar operaciones');
        } finally {
            setLoading(false);
        }
    };

    const updateOperation = async (id, data) => {
        try {
            const response = await gerenteService.updateOperation(id, data);
            if (response.status === 'Success') {
                showSuccessAlert('Éxito', 'Operación actualizada correctamente');
                await fetchOperations(); // Recargar la lista
                return response.data;
            } else {
                showErrorAlert('Error', response.message || 'Error al actualizar operación');
                return null;
            }
        } catch (error) {
            showErrorAlert('Error', 'Error al actualizar operación');
            return null;
        }
    };

    useEffect(() => {
        fetchOperations();
    }, []);

    return {
        operations,
        loading,
        fetchOperations,
        updateOperation
    };
};

// Hook para empleados
export const useEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const response = await gerenteService.getEmployees();
            if (response.status === 'Success') {
                setEmployees(response.data);
            } else {
                showErrorAlert('Error', 'No se pudieron cargar los empleados');
            }
        } catch (error) {
            showErrorAlert('Error', 'Error al cargar empleados');
        } finally {
            setLoading(false);
        }
    };

    const updateEmployee = async (id, data) => {
        try {
            const response = await gerenteService.updateEmployee(id, data);
            if (response.status === 'Success') {
                showSuccessAlert('Éxito', 'Empleado actualizado correctamente');
                await fetchEmployees();
                return response.data;
            } else {
                showErrorAlert('Error', response.message || 'Error al actualizar empleado');
                return null;
            }
        } catch (error) {
            showErrorAlert('Error', 'Error al actualizar empleado');
            return null;
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    return {
        employees,
        loading,
        fetchEmployees,
        updateEmployee
    };
};

// Hook para reportes
export const useReports = () => {
    const [reports, setReports] = useState({
        sales: null,
        inventory: null,
        operations: null
    });
    const [loading, setLoading] = useState({
        sales: false,
        inventory: false,
        operations: false
    });

    const fetchSalesReport = async () => {
        setLoading(prev => ({ ...prev, sales: true }));
        try {
            const response = await gerenteService.getSalesReport();
            if (response.status === 'Success') {
                setReports(prev => ({ ...prev, sales: response.data }));
            } else {
                showErrorAlert('Error', 'No se pudo cargar el reporte de ventas');
            }
        } catch (error) {
            showErrorAlert('Error', 'Error al cargar reporte de ventas');
        } finally {
            setLoading(prev => ({ ...prev, sales: false }));
        }
    };

    const fetchInventoryReport = async () => {
        setLoading(prev => ({ ...prev, inventory: true }));
        try {
            const response = await gerenteService.getInventoryReport();
            if (response.status === 'Success') {
                setReports(prev => ({ ...prev, inventory: response.data }));
            } else {
                showErrorAlert('Error', 'No se pudo cargar el reporte de inventario');
            }
        } catch (error) {
            showErrorAlert('Error', 'Error al cargar reporte de inventario');
        } finally {
            setLoading(prev => ({ ...prev, inventory: false }));
        }
    };

    const fetchOperationsReport = async () => {
        setLoading(prev => ({ ...prev, operations: true }));
        try {
            const response = await gerenteService.getOperationsReport();
            if (response.status === 'Success') {
                setReports(prev => ({ ...prev, operations: response.data }));
            } else {
                showErrorAlert('Error', 'No se pudo cargar el reporte de operaciones');
            }
        } catch (error) {
            showErrorAlert('Error', 'Error al cargar reporte de operaciones');
        } finally {
            setLoading(prev => ({ ...prev, operations: false }));
        }
    };

    return {
        reports,
        loading,
        fetchSalesReport,
        fetchInventoryReport,
        fetchOperationsReport
    };
};