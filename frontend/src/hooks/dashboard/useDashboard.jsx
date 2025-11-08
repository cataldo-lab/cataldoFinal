// frontend/src/hooks/dashboard/useDashboard.jsx

import { useState, useEffect, useCallback } from 'react';
import {
  getResumenGeneral,
  getMetricasVentas,
  getEstadoInventario,
  getEstadisticasClientes,
  getSatisfaccionCliente,
  getIndicadoresOperacionales
} from '../../services/dashboard.service.js';

/**
 * Hook personalizado para el dashboard del gerente
 * @returns {Object} Datos y funciones del dashboard
 */
export const useDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resumen, setResumen] = useState(null);
  const [ventas, setVentas] = useState(null);
  const [inventario, setInventario] = useState(null);
  const [clientes, setClientes] = useState(null);
  const [satisfaccion, setSatisfaccion] = useState(null);
  const [indicadores, setIndicadores] = useState(null);

  /**
   * Carga todos los datos del dashboard
   */
  const cargarDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar todos los endpoints en paralelo
      const [
        resumenData,
        ventasData,
        inventarioData,
        clientesData,
        satisfaccionData,
        indicadoresData
      ] = await Promise.all([
        getResumenGeneral(),
        getMetricasVentas(),
        getEstadoInventario(),
        getEstadisticasClientes(),
        getSatisfaccionCliente(),
        getIndicadoresOperacionales()
      ]);

      setResumen(resumenData.data);
      setVentas(ventasData.data);
      setInventario(inventarioData.data);
      setClientes(clientesData.data);
      setSatisfaccion(satisfaccionData.data);
      setIndicadores(indicadoresData.data);

    } catch (err) {
      console.error('Error al cargar dashboard:', err);
      setError(err.message || 'Error al cargar el dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Carga métricas de ventas con filtro de fechas
   */
  const cargarVentas = useCallback(async (desde, hasta) => {
    try {
      const data = await getMetricasVentas(desde, hasta);
      setVentas(data.data);
      return data;
    } catch (err) {
      console.error('Error al cargar ventas:', err);
      throw err;
    }
  }, []);

  /**
   * Carga satisfacción con filtro de fechas
   */
  const cargarSatisfaccion = useCallback(async (desde, hasta) => {
    try {
      const data = await getSatisfaccionCliente(desde, hasta);
      setSatisfaccion(data.data);
      return data;
    } catch (err) {
      console.error('Error al cargar satisfacción:', err);
      throw err;
    }
  }, []);

  /**
   * Carga indicadores con filtro de fechas
   */
  const cargarIndicadores = useCallback(async (desde, hasta) => {
    try {
      const data = await getIndicadoresOperacionales(desde, hasta);
      setIndicadores(data.data);
      return data;
    } catch (err) {
      console.error('Error al cargar indicadores:', err);
      throw err;
    }
  }, []);

  /**
   * Actualiza solo el resumen (para refresh parcial)
   */
  const actualizarResumen = useCallback(async () => {
    try {
      const data = await getResumenGeneral();
      setResumen(data.data);
      return data;
    } catch (err) {
      console.error('Error al actualizar resumen:', err);
      throw err;
    }
  }, []);

  /**
   * Actualiza solo el inventario
   */
  const actualizarInventario = useCallback(async () => {
    try {
      const data = await getEstadoInventario();
      setInventario(data.data);
      return data;
    } catch (err) {
      console.error('Error al actualizar inventario:', err);
      throw err;
    }
  }, []);

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDashboard();
  }, [cargarDashboard]);

  return {
    // Estados
    loading,
    error,
    resumen,
    ventas,
    inventario,
    clientes,
    satisfaccion,
    indicadores,

    // Funciones
    cargarDashboard,
    cargarVentas,
    cargarSatisfaccion,
    cargarIndicadores,
    actualizarResumen,
    actualizarInventario
  };
};
