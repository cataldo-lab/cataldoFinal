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



  
// Controladores temporales hasta implementar los reales
function getOperations(req, res) {
  res.json({ 
    status: "Success", 
    message: "Operaciones obtenidas", 
    data: [] 
  });
}

function getOperation(req, res) {
  res.json({ 
    status: "Success", 
    message: "Operación obtenida", 
    data: {} 
  });
}

function updateOperation(req, res) {
  res.json({ 
    status: "Success", 
    message: "Operación actualizada", 
    data: {} 
  });
}

function getEmployees(req, res) {
  res.json({ 
    status: "Success", 
    message: "Empleados obtenidos", 
    data: [] 
  });
}

function getEmployee(req, res) {
  res.json({ 
    status: "Success", 
    message: "Empleado obtenido", 
    data: {} 
  });
}

function updateEmployee(req, res) {
  res.json({ 
    status: "Success", 
    message: "Empleado actualizado", 
    data: {} 
  });
}

function getSalesReport(req, res) {
  res.json({ 
    status: "Success", 
    message: "Reporte de ventas", 
    data: { report: "sales_data" } 
  });
}

function getInventoryReport(req, res) {
  res.json({ 
    status: "Success", 
    message: "Reporte de inventario", 
    data: { report: "inventory_data" } 
  });
}

function getOperationsReport(req, res) {
  res.json({ 
    status: "Success", 
    message: "Reporte de operaciones", 
    data: { report: "operations_data" } 
  });
}

export default router;