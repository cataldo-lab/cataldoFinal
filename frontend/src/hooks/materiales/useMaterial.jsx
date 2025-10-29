// frontend/src/hooks/materiales/useMaterial.jsx
import { useState, useEffect } from 'react';
import { getMaterialById } from '@services/materiales.service.js';


export function useMaterial(id, autoFetch = true) {
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMaterial = async () => {
    if (!id) {
      setError('ID de material no proporcionado');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await getMaterialById(id);
      
      if (response.success) {
        setMaterial(response.data);
      } else {
        setError(response.message);
        setMaterial(null);
      }
    } catch (err) {
      console.error('Error en useMaterial:', err);
      setError('Error inesperado al cargar material');
      setMaterial(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch && id) {
      fetchMaterial();
    }
  }, [id, autoFetch]);

  return {
    material,
    loading,
    error,
    fetchMaterial,
    setMaterial
  };
}