// frontend/src/hooks/materiales/useMaterialRepresentante.jsx
import { useState, useEffect } from 'react';
import { getMaterialRepresentante } from '@services/materiales.service.js';

/**
 * Hook para obtener el representante de un material
 * @param {number} id - ID del material
 * @param {boolean} autoFetch - Si true, carga automáticamente al montar
 * @returns {Object} - Estado y funciones para manejar el representante
 */
export function useMaterialRepresentante(id, autoFetch = true) {
  const [representante, setRepresentante] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRepresentante = async () => {
    if (!id) {
      setError('ID de material no proporcionado');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await getMaterialRepresentante(id);
      
      if (response.success) {
        setRepresentante(response.data);
      } else {
        setError(response.message);
        setRepresentante(null);
      }
    } catch (err) {
      console.error('Error en useMaterialRepresentante:', err);
      setError('Error inesperado al cargar representante');
      setRepresentante(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch && id) {
      fetchRepresentante();
    }
  }, [id, autoFetch]);

  return {
    representante,
    loading,
    error,
    fetchRepresentante,
    setRepresentante
  };
}