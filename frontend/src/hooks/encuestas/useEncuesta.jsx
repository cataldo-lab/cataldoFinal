// frontend/src/hooks/encuestas/useEncuesta.jsx

import { useState, useEffect, useCallback } from 'react';
import {
  crearEncuesta as crearEncuestaAPI,
  getEncuestas as getEncuestasAPI,
  getOperacionesSinEncuesta as getOperacionesSinEncuestaAPI,
  getEstadisticasEncuestas as getEstadisticasEncuestasAPI,
  actualizarEncuesta as actualizarEncuestaAPI,
  eliminarEncuesta as eliminarEncuestaAPI
} from '@services/encuesta.service';

/**
 * Hook para manejar el sistema de encuestas
 * Incluye CRUD de encuestas, operaciones sin encuesta y estadísticas
 * @param {Object} options - Opciones de configuración
 * @param {boolean} options.autoFetch - Si debe cargar automáticamente datos (default: false)
 * @returns {Object} Estado y funciones para manejar encuestas
 */
export const useEncuesta = ({ autoFetch = false } = {}) => {
  // Estados para encuestas
  const [encuestas, setEncuestas] = useState([]);
  const [encuestasLoading, setEncuestasLoading] = useState(false);
  const [encuestasError, setEncuestasError] = useState(null);

  // Estados para operaciones sin encuesta
  const [operacionesSinEncuesta, setOperacionesSinEncuesta] = useState([]);
  const [operacionesLoading, setOperacionesLoading] = useState(false);
  const [operacionesError, setOperacionesError] = useState(null);

  // Estados para estadísticas
  const [estadisticas, setEstadisticas] = useState(null);
  const [estadisticasLoading, setEstadisticasLoading] = useState(false);
  const [estadisticasError, setEstadisticasError] = useState(null);

  // Estados para operaciones CRUD
  const [creando, setCreando] = useState(false);
  const [actualizando, setActualizando] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [operationError, setOperationError] = useState(null);

  /**
   * Obtiene la lista de encuestas desde el backend
   * @param {Object} filtros - Filtros para la búsqueda
   */
  const fetchEncuestas = useCallback(async (filtros = {}) => {
    try {
      setEncuestasLoading(true);
      setEncuestasError(null);

      const response = await getEncuestasAPI(filtros);

      if (response.success) {
        const encuestasData = response.data?.encuestas || [];
        setEncuestas(encuestasData);
      } else {
        setEncuestasError(response.message || 'Error al cargar encuestas');
        setEncuestas([]);
      }
    } catch (err) {
      setEncuestasError(err.message || 'Error al cargar encuestas');
      console.error('Error en fetchEncuestas:', err);
      setEncuestas([]);
    } finally {
      setEncuestasLoading(false);
    }
  }, []);

  /**
   * Obtiene las operaciones que no tienen encuesta
   */
  const fetchOperacionesSinEncuesta = useCallback(async () => {
    try {
      setOperacionesLoading(true);
      setOperacionesError(null);

      const response = await getOperacionesSinEncuestaAPI();

      if (response.success) {
        const operaciones = response.data || [];
        setOperacionesSinEncuesta(operaciones);
      } else {
        setOperacionesError(response.message || 'Error al cargar operaciones');
        setOperacionesSinEncuesta([]);
      }
    } catch (err) {
      setOperacionesError(err.message || 'Error al cargar operaciones');
      console.error('Error en fetchOperacionesSinEncuesta:', err);
      setOperacionesSinEncuesta([]);
    } finally {
      setOperacionesLoading(false);
    }
  }, []);

  /**
   * Obtiene las estadísticas de encuestas
   */
  const fetchEstadisticas = useCallback(async () => {
    try {
      setEstadisticasLoading(true);
      setEstadisticasError(null);

      const response = await getEstadisticasEncuestasAPI();

      if (response.success) {
        setEstadisticas(response.data);
      } else {
        setEstadisticasError(response.message || 'Error al cargar estadísticas');
        setEstadisticas(null);
      }
    } catch (err) {
      setEstadisticasError(err.message || 'Error al cargar estadísticas');
      console.error('Error en fetchEstadisticas:', err);
      setEstadisticas(null);
    } finally {
      setEstadisticasLoading(false);
    }
  }, []);

  /**
   * Crea una nueva encuesta
   * @param {Object} encuestaData - Datos de la encuesta
   * @param {number} encuestaData.id_operacion - ID de la operación
   * @param {number} encuestaData.nota_pedido - Nota del pedido (1-7)
   * @param {number} encuestaData.nota_repartidor - Nota del repartidor (1-7)
   * @param {string} encuestaData.comentario - Comentario opcional
   * @returns {Promise<Object>} Resultado de la creación
   */
  const crear = useCallback(async (encuestaData) => {
    try {
      setCreando(true);
      setOperationError(null);

      const response = await crearEncuestaAPI(encuestaData);

      if (response.success) {
        // Recargar datos después de crear exitosamente
        await Promise.all([
          fetchOperacionesSinEncuesta(),
          fetchEncuestas()
        ]);

        return {
          success: true,
          message: 'Encuesta creada exitosamente',
          data: response.data
        };
      } else {
        setOperationError(response.message);
        return {
          success: false,
          message: response.message || 'No se pudo crear la encuesta'
        };
      }
    } catch (error) {
      const errorMessage = error.message || 'No se pudo crear la encuesta';
      setOperationError(errorMessage);
      console.error('Error en crear:', error);
      return { success: false, message: errorMessage };
    } finally {
      setCreando(false);
    }
  }, [fetchOperacionesSinEncuesta, fetchEncuestas]);

  /**
   * Actualiza una encuesta existente
   * @param {number} id - ID de la encuesta
   * @param {Object} encuestaData - Datos a actualizar
   * @returns {Promise<Object>} Resultado de la actualización
   */
  const actualizar = useCallback(async (id, encuestaData) => {
    try {
      setActualizando(true);
      setOperationError(null);

      const response = await actualizarEncuestaAPI(id, encuestaData);

      if (response.success) {
        // Recargar encuestas después de actualizar
        await fetchEncuestas();

        return {
          success: true,
          message: 'Encuesta actualizada exitosamente',
          data: response.data
        };
      } else {
        setOperationError(response.message);
        return {
          success: false,
          message: response.message || 'No se pudo actualizar la encuesta'
        };
      }
    } catch (error) {
      const errorMessage = error.message || 'No se pudo actualizar la encuesta';
      setOperationError(errorMessage);
      console.error('Error en actualizar:', error);
      return { success: false, message: errorMessage };
    } finally {
      setActualizando(false);
    }
  }, [fetchEncuestas]);

  /**
   * Elimina una encuesta
   * @param {number} id - ID de la encuesta
   * @returns {Promise<Object>} Resultado de la eliminación
   */
  const eliminar = useCallback(async (id) => {
    try {
      setEliminando(true);
      setOperationError(null);

      const response = await eliminarEncuestaAPI(id);

      if (response.success) {
        // Recargar datos después de eliminar
        await Promise.all([
          fetchOperacionesSinEncuesta(),
          fetchEncuestas()
        ]);

        return {
          success: true,
          message: 'Encuesta eliminada exitosamente'
        };
      } else {
        setOperationError(response.message);
        return {
          success: false,
          message: response.message || 'No se pudo eliminar la encuesta'
        };
      }
    } catch (error) {
      const errorMessage = error.message || 'No se pudo eliminar la encuesta';
      setOperationError(errorMessage);
      console.error('Error en eliminar:', error);
      return { success: false, message: errorMessage };
    } finally {
      setEliminando(false);
    }
  }, [fetchOperacionesSinEncuesta, fetchEncuestas]);

  /**
   * Recarga todos los datos
   */
  const refetchAll = useCallback(async () => {
    await Promise.all([
      fetchEncuestas(),
      fetchOperacionesSinEncuesta(),
      fetchEstadisticas()
    ]);
  }, [fetchEncuestas, fetchOperacionesSinEncuesta, fetchEstadisticas]);

  // Cargar datos iniciales si autoFetch está habilitado
  useEffect(() => {
    if (autoFetch) {
      refetchAll();
    }
  }, [autoFetch, refetchAll]);

  return {
    // Datos de encuestas
    encuestas,
    encuestasLoading,
    encuestasError,

    // Datos de operaciones sin encuesta
    operacionesSinEncuesta,
    operacionesLoading,
    operacionesError,

    // Datos de estadísticas
    estadisticas,
    estadisticasLoading,
    estadisticasError,

    // Estados de operaciones CRUD
    creando,
    actualizando,
    eliminando,
    operationError,

    // Funciones
    fetchEncuestas,
    fetchOperacionesSinEncuesta,
    fetchEstadisticas,
    crear,
    actualizar,
    eliminar,
    refetchAll
  };
};
