"use strict";
import {
  obtenerDashboardGerencial,
  obtenerResumenVentas,
  obtenerTopProductos
} from "../services/gerente/dashboardGerente.service.js";
import {
  respondSuccess,
  respondError,
  handleError
} from "../handlers/responseHandlers.js";

/**
 * Controlador para obtener las estadísticas completas del dashboard gerencial
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export async function getDashboardStats(req, res) {
  try {
    const dashboardData = await obtenerDashboardGerencial();
    respondSuccess(req, res, 200, dashboardData);
  } catch (error) {
    handleError(error, "gerente.controller -> getDashboardStats");
    respondError(req, res, 500, "Error al obtener las estadísticas del dashboard");
  }
}

/**
 * Controlador para obtener el resumen de ventas por período
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export async function getSalesReport(req, res) {
  try {
    const { periodo } = req.query;
    const resumenVentas = await obtenerResumenVentas(periodo);
    respondSuccess(req, res, 200, resumenVentas);
  } catch (error) {
    handleError(error, "gerente.controller -> getSalesReport");
    respondError(req, res, 500, "Error al obtener el reporte de ventas");
  }
}

/**
 * Controlador para obtener el top de productos más vendidos
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export async function getTopProducts(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const topProductos = await obtenerTopProductos(limit);
    respondSuccess(req, res, 200, topProductos);
  } catch (error) {
    handleError(error, "gerente.controller -> getTopProducts");
    respondError(req, res, 500, "Error al obtener los productos más vendidos");
  }
}

/**
 * Controlador para obtener operaciones (temporal)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export function getOperations(req, res) {
  respondSuccess(req, res, 200, []);
}

/**
 * Controlador para obtener una operación por ID (temporal)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export function getOperation(req, res) {
  respondSuccess(req, res, 200, {});
}

/**
 * Controlador para actualizar una operación (temporal)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export function updateOperation(req, res) {
  respondSuccess(req, res, 200, {});
}

/**
 * Controlador para obtener empleados (temporal)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export function getEmployees(req, res) {
  respondSuccess(req, res, 200, []);
}

/**
 * Controlador para obtener un empleado por ID (temporal)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export function getEmployee(req, res) {
  respondSuccess(req, res, 200, {});
}

/**
 * Controlador para actualizar un empleado (temporal)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export function updateEmployee(req, res) {
  respondSuccess(req, res, 200, {});
}

/**
 * Controlador para obtener reporte de inventario (temporal)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export function getInventoryReport(req, res) {
  respondSuccess(req, res, 200, { report: "inventory_data" });
}

/**
 * Controlador para obtener reporte de operaciones (temporal)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export function getOperationsReport(req, res) {
  respondSuccess(req, res, 200, { report: "operations_data" });
}
