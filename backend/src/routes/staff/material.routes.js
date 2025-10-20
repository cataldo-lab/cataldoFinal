// backend/src/routes/gerente&Trabajador/material.routes.js
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

/**
 * Rutas especiales (deben ir PRIMERO para evitar conflictos con /:id)
 */

// GET /api/materiales/con-resumen - Materiales con resumen de compras
router.get(
    "/con-resumen",
    isEmployee,
    getMaterialesConResumen
);

// GET /api/materiales/alertas/bajo-stock - Materiales con stock bajo
router.get(
    "/alertas/bajo-stock",
    isEmployee,
    getMaterialesBajoStock
);

// GET /api/materiales/alertas/stock - Alertas categorizadas
router.get(
    "/alertas/stock",
    isEmployee,
    getAlertasStock
);

// GET /api/materiales/proveedores/:id/analisis - Análisis de proveedor
router.get(
    "/proveedores/:id/analisis",
    isEmployee,
    getAnalisisProveedor
);

/**
 * Rutas de consulta (todos los trabajadores)
 */

// GET /api/materiales - Obtener todos los materiales (básico)
router.get(
    "/",
    isEmployee,
    getMateriales
);

// GET /api/materiales/:id/detalle-completo - Detalle completo del material
router.get(
    "/:id/detalle-completo",
    isEmployee,
    getMaterialDetalleCompleto
);

// GET /api/materiales/:id - Obtener un material por ID (básico)
router.get(
    "/:id",
    isEmployee,
    getMaterialById
);

/**
 * Rutas de escritura (trabajadores pueden crear/editar)
 */

// POST /api/materiales - Crear nuevo material
router.post(
    "/",
    isEmployee,
    createMaterial
);

// PUT /api/materiales/:id - Actualizar material
router.put(
    "/:id",
    isEmployee,
    updateMaterial
);

// PATCH /api/materiales/:id/stock - Actualizar stock
router.patch(
    "/:id/stock",
    isEmployee,
    updateStockMaterial
);

/**
 * Rutas de eliminación (solo gerente)
 */

// DELETE /api/materiales/:id - Desactivar material
router.delete(
    "/:id",
    isManager,
    deleteMaterial
);

export default router;