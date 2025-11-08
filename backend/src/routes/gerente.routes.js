"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isManager } from "../middlewares/authorization.middleware.js";
import {
  getDashboardStats,
  getSalesReport,
  getTopProducts,
  getOperations,
  getOperation,
  updateOperation,
  getEmployees,
  getEmployee,
  updateEmployee,
  getInventoryReport,
  getOperationsReport
} from "../controllers/gerente.controller.js";

const router = Router();

// Aplicar middlewares
router.use(authenticateJwt);
router.use(isManager);

// Rutas para el dashboard gerencial
router
  // Dashboard principal
  .get("/dashboard", getDashboardStats)

  // Top productos
  .get("/top-products", getTopProducts)

  // Gestión de operaciones
  .get("/operations", getOperations)
  .get("/operations/:id", getOperation)
  .patch("/operations/:id", updateOperation)

  // Gestión de empleados (solo ver y actualizar, no eliminar)
  .get("/employees", getEmployees)
  .get("/employees/:id", getEmployee)
  .patch("/employees/:id", updateEmployee)

  // Reportes gerenciales
  .get("/reports/sales", getSalesReport)
  .get("/reports/inventory", getInventoryReport)
  .get("/reports/operations", getOperationsReport);

export default router;