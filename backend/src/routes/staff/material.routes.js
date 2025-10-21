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

// Rutas especiales (deben ir PRIMERO para evitar conflictos con /:id)
router
  .get("/con-resumen", isEmployee, getMaterialesConResumen)          // Materiales con resumen de compras
  .get("/alertas/bajo-stock", isEmployee, getMaterialesBajoStock)    // Materiales con stock bajo
  .get("/alertas/stock", isEmployee, getAlertasStock)                // Alertas categorizadas
  .get("/proveedores/:id/analisis", isEmployee, getAnalisisProveedor); // Análisis de proveedor

// Rutas de consulta (todos los trabajadores)
router
  .get("/", isEmployee, getMateriales)                               // Obtener todos los materiales
  .get("/:id/detalle-completo", isEmployee, getMaterialDetalleCompleto) // Detalle completo
  .get("/:id", isEmployee, getMaterialById);                         // Obtener por ID

// Rutas de escritura (todos los empleados)
router
  .post("/", isEmployee, createMaterial)                            // Crear nuevo material
  .put("/:id", isEmployee, updateMaterial)                          // Actualizar material
  .patch("/:id/stock", isEmployee, updateStockMaterial);            // Actualizar stock

// Rutas de eliminación (solo gerentes)
router
  .delete("/:id", isManager, deleteMaterial);                        // Desactivar material

export default router;