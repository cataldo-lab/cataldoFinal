// frontend/src/hooks/materiales/useMaterialesConRepresentantes.jsx
import { useState, useEffect } from 'react';
import { getMaterialesConRepresentantes } from '@services/materiales.service.js';


export function useMaterialesConRepresentantes(autoFetch = true) {
  const [materiales, setMateriales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMaterialesConRepresentantes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getMaterialesConRepresentantes();
      
      if (response.success) {
        setMateriales(response.data || []);
      } else {
        setError(response.message);
        setMateriales([]);
      }
    } catch (err) {
      console.error('Error en useMaterialesConRepresentantes:', err);
      setError('Error inesperado al cargar materiales con representantes');
      setMateriales([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchMaterialesConRepresentantes();
    }
  }, [autoFetch]);

  return {
    materiales,
    loading,
    error,
    fetchMaterialesConRepresentantes,
    setMateriales
  };
}