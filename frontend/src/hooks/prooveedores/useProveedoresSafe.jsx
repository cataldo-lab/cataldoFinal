// src/hooks/proveedores/useProveedoresSafe.jsx
import { useState, useEffect } from 'react';
import { getProveedores } from '@services/proveedor.service.js';
import { showErrorAlert } from '@helpers/sweetAlert.js';

export const useProveedoresSafe = () => {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProveedores = async (showErrors = true) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getProveedores();
      
      if (response.status === 'Success') {
        setProveedores(response.data || []);
        return response.data;
      } else {
        throw new Error(response.message || 'Error al obtener proveedores');
      }
    } catch (err) {
      console.error('Error al cargar proveedores:', err);
      setError(err.message || 'Error desconocido');
      setProveedores([]);
      
      if (showErrors) {
        // Mostrar alerta solo si se pasa el parámetro como true
        showErrorAlert(
          'Información parcial', 
          'No se pudieron cargar los proveedores. La funcionalidad será limitada.'
        );
      }
      
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Cargar proveedores al montar el componente
  useEffect(() => {
    fetchProveedores(false); // No mostrar errores en carga inicial
  }, []);

  return {
    proveedores,
    loading,
    error,
    fetchProveedores,
    hasProveedores: proveedores.length > 0
  };
};

export default useProveedoresSafe;