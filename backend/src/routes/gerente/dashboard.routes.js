"use strict";
import { Router } from "express";
import { authenticateJwt } from "../../middlewares/authentication.middleware.js";

import * as dashboardController from "../../controllers/gerente/dashboard.controller.js";

const router = Router();

// Aplicar middleware de autenticación a todas las rutas del dashboard
router.use(authenticateJwt);

/**
 * @route   GET /api/dashboard/resumen
 * @desc    Obtiene resumen general del dashboard (operaciones, ingresos, clientes)
 * @access  Gerente, Administrador
 */
router.get(
  "/resumen",
  dashboardController.getResumenGeneralController
);

/**
 * @route   GET /api/dashboard/ventas
 * @desc    Obtiene métricas de ventas por período
 * @query   desde (YYYY-MM-DD), hasta (YYYY-MM-DD)
 * @access  Gerente, Administrador
 */
router.get(
  "/ventas",
  dashboardController.getMetricasVentasController
);

/**
 * @route   GET /api/dashboard/inventario
 * @desc    Obtiene estado del inventario con alertas de stock
 * @access  Gerente, Administrador
 */
router.get(
  "/inventario",
  dashboardController.getEstadoInventarioController
);

/**
 * @route   GET /api/dashboard/clientes
 * @desc    Obtiene estadísticas de clientes
 * @access  Gerente, Administrador
 */
router.get(
  "/clientes",
  dashboardController.getEstadisticasClientesController
);

/**
 * @route   GET /api/dashboard/satisfaccion
 * @desc    Obtiene métricas de satisfacción del cliente
 * @query   desde (YYYY-MM-DD), hasta (YYYY-MM-DD)
 * @access  Gerente, Administrador
 */
router.get(
  "/satisfaccion",
  dashboardController.getSatisfaccionClienteController
);

/**
 * @route   GET /api/dashboard/operaciones
 * @desc    Obtiene indicadores operacionales (conversión, abonos, proyecciones)
 * @query   desde (YYYY-MM-DD), hasta (YYYY-MM-DD)
 * @access  Gerente, Administrador
 */
router.get(
  "/operaciones",
  dashboardController.getIndicadoresOperacionalesController
);

export default router;
