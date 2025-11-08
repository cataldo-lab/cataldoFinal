"use strict";
import {
  getResumenGeneral,
  getMetricasVentas,
  getEstadoInventario,
  getEstadisticasClientes,
  getSatisfaccionCliente,
  getIndicadoresOperacionales
} from "../../services/gerente/dashboard.service.js";

/**
 * Controlador para obtener resumen general del dashboard
 */
export async function getResumenGeneralController(req, res) {
  try {
    const resumen = await getResumenGeneral();

    return res.status(200).json({
      success: true,
      message: "Resumen general obtenido exitosamente",
      data: resumen.success ? resumen : resumen
    });
  } catch (error) {
    console.error("Error en getResumenGeneralController:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener resumen general",
      error: error.message
    });
  }
}

/**
 * Controlador para obtener métricas de ventas
 * Query params: desde (YYYY-MM-DD), hasta (YYYY-MM-DD)
 */
export async function getMetricasVentasController(req, res) {
  try {
    const { desde, hasta } = req.query;

    // Validar fechas
    let fechaInicio, fechaFin;

    if (desde && hasta) {
      fechaInicio = new Date(desde);
      fechaFin = new Date(hasta);

      if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Fechas inválidas. Formato esperado: YYYY-MM-DD"
        });
      }
    } else {
      // Por defecto: mes actual
      const ahora = new Date();
      fechaInicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
      fechaFin = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0, 23, 59, 59);
    }

    const metricas = await getMetricasVentas(fechaInicio, fechaFin);

    return res.status(200).json({
      success: true,
      message: "Métricas de ventas obtenidas exitosamente",
      data: metricas.success ? metricas : metricas
    });
  } catch (error) {
    console.error("Error en getMetricasVentasController:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener métricas de ventas",
      error: error.message
    });
  }
}

/**
 * Controlador para obtener estado del inventario
 */
export async function getEstadoInventarioController(req, res) {
  try {
    const estado = await getEstadoInventario();

    return res.status(200).json({
      success: true,
      message: "Estado de inventario obtenido exitosamente",
      data: estado.success ? estado : estado
    });
  } catch (error) {
    console.error("Error en getEstadoInventarioController:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener estado de inventario",
      error: error.message
    });
  }
}

/**
 * Controlador para obtener estadísticas de clientes
 */
export async function getEstadisticasClientesController(req, res) {
  try {
    const estadisticas = await getEstadisticasClientes();

    return res.status(200).json({
      success: true,
      message: "Estadísticas de clientes obtenidas exitosamente",
      data: estadisticas.success ? estadisticas : estadisticas
    });
  } catch (error) {
    console.error("Error en getEstadisticasClientesController:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas de clientes",
      error: error.message
    });
  }
}

/**
 * Controlador para obtener métricas de satisfacción
 * Query params: desde (YYYY-MM-DD), hasta (YYYY-MM-DD)
 */
export async function getSatisfaccionClienteController(req, res) {
  try {
    const { desde, hasta } = req.query;

    // Validar fechas
    let fechaInicio, fechaFin;

    if (desde && hasta) {
      fechaInicio = new Date(desde);
      fechaFin = new Date(hasta);

      if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Fechas inválidas. Formato esperado: YYYY-MM-DD"
        });
      }
    } else {
      // Por defecto: mes actual
      const ahora = new Date();
      fechaInicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
      fechaFin = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0, 23, 59, 59);
    }

    const satisfaccion = await getSatisfaccionCliente(fechaInicio, fechaFin);

    return res.status(200).json({
      success: true,
      message: "Métricas de satisfacción obtenidas exitosamente",
      data: satisfaccion.success ? satisfaccion : satisfaccion
    });
  } catch (error) {
    console.error("Error en getSatisfaccionClienteController:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener métricas de satisfacción",
      error: error.message
    });
  }
}

/**
 * Controlador para obtener indicadores operacionales
 * Query params: desde (YYYY-MM-DD), hasta (YYYY-MM-DD)
 */
export async function getIndicadoresOperacionalesController(req, res) {
  try {
    const { desde, hasta } = req.query;

    // Validar fechas
    let fechaInicio, fechaFin;

    if (desde && hasta) {
      fechaInicio = new Date(desde);
      fechaFin = new Date(hasta);

      if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Fechas inválidas. Formato esperado: YYYY-MM-DD"
        });
      }
    } else {
      // Por defecto: mes actual
      const ahora = new Date();
      fechaInicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
      fechaFin = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0, 23, 59, 59);
    }

    const indicadores = await getIndicadoresOperacionales(fechaInicio, fechaFin);

    return res.status(200).json({
      success: true,
      message: "Indicadores operacionales obtenidos exitosamente",
      data: indicadores.success ? indicadores : indicadores
    });
  } catch (error) {
    console.error("Error en getIndicadoresOperacionalesController:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener indicadores operacionales",
      error: error.message
    });
  }
}
