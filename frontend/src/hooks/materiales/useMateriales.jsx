// frontend/src/hooks/materiales/useMateriales.jsx
import { useState, useEffect } from 'react';
import { getMateriales } from '@services/materiales.service.js';


export function useMateriales(incluirInactivos = false, autoFetch = true) {
  const [materiales, setMateriales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMateriales = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getMateriales(incluirInactivos);
      
      if (response.success) {
        setMateriales(response.data || []);
      } else {
        setError(response.message);
        setMateriales([]);
      }
    } catch (err) {
      console.error('Error en useMateriales:', err);
      setError('Error inesperado al cargar materiales');
      setMateriales([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchMateriales();
    }
  }, [incluirInactivos, autoFetch]);

  return {
    materiales,
    loading,
    error,
    fetchMateriales,
    setMateriales
  };
}

export default useMateriales;