"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isManager } from "../middlewares/authorization.middleware.js";

const router = Router();

// Aplicar middlewares
router.use(authenticateJwt);
router.use(isManager);

// Rutas para gestión de operaciones y empleados
router
  // Gestión de operaciones
  .get("/operations", /* TODO: getOperations */)
  .get("/operations/:id", /* TODO: getOperation */)
  .patch("/operations/:id", /* TODO: updateOperation */)
  
  // Gestión de empleados (solo ver y actualizar, no eliminar)
  .get("/employees", /* TODO: getEmployees */)
  .get("/employees/:id", /* TODO: getEmployee */)
  .patch("/employees/:id", /* TODO: updateEmployee */)
  
  // Reportes gerenciales
  .get("/reports/sales", /* TODO: getSalesReport */)
  .get("/reports/inventory", /* TODO: getInventoryReport */)
  .get("/reports/operations", /* TODO: getOperationsReport */);

export default router;