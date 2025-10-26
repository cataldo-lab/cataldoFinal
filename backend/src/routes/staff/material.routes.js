// backend/src/routes/staff/material.routes.js
"use strict";
import { Router } from "express";
import {
    createMaterial,
    getMateriales,
    getMaterialesConResumen,
    getMaterialById,
    getMaterialDetalleCompleto,
    updateMaterial,
    updateStockMaterial,
    deleteMaterial,
    getMaterialesBajoStock,
    getAlertasStock,
    getAnalisisProveedor
} from "../../controllers/staff/material.controller.js";
import { authenticateJwt } from "../../middlewares/authentication.middleware.js";
import { isEmployee, isManager } from "../../middlewares/authorization.middleware.js";

const router = Router();

// Middleware de autenticación para todas las rutas
router.use(authenticateJwt);

// Rutas especiales (staff)
router
  .get("/con-resumen", [isEmployee, isManager], getMaterialesConResumen)          // Materiales con resumen de compras
  .get("/alertas/bajo-stock", [isEmployee, isManager], getMaterialesBajoStock)    // Materiales con stock bajo
  .get("/alertas/stock", [isEmployee, isManager], getAlertasStock)                // Alertas categorizadas
  .get("/proveedores/:id/analisis", [isEmployee, isManager], getAnalisisProveedor); // Análisis de proveedor

// Rutas de consulta (todos staff)
router
  .get("/", [isEmployee, isManager], getMateriales)                               // Obtener todos los materiales
  .get("/:id/detalle-completo", [isEmployee, isManager], getMaterialDetalleCompleto) // Detalle completo
  .get("/:id", [isEmployee, isManager], getMaterialById);                         // Obtener por ID

// Rutas de escritura (todos staff)
router
  .post("/", [isEmployee, isManager], createMaterial)                            // Crear nuevo material
  .put("/:id", [isEmployee, isManager], updateMaterial)                          // Actualizar material
  .patch("/:id/stock", [isEmployee, isManager], updateStockMaterial);            // Actualizar stock

// Rutas de eliminación (solo gerentes)
router
  .delete("/:id", [isManager], deleteMaterial);                       

export default router;