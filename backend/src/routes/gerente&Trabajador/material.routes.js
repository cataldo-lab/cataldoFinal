"use strict";
import { Router } from "express";
import {
    createMaterial,
    getMateriales,
    getMaterialById,
    updateMaterial,
    updateStockMaterial,
    deleteMaterial,
    getMaterialesBajoStock,
    getAlertasStock
} from "../../controllers/gerente&Trabajador/material.controller.js";
import { authenticateJwt } from "../../middlewares/authentication.middleware.js";
import { isEmployee, isManager } from "../../middlewares/authorization.middleware.js";



const router = Router();

// Middleware de autenticación para todas las rutas
router.use(authenticateJwt);




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

/**
 * Rutas de consulta (todos los trabajadores)
 */

// GET /api/materiales - Obtener todos los materiales
router.get(
    "/",
    isEmployee,
    getMateriales
);

// GET /api/materiales/:id - Obtener un material por ID
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