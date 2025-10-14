"use strict";
import { Router } from "express";
import {
    createOperacion,
    getOperaciones,
    getOperacionById,
    updateEstadoOperacion,
    updateOperacion,
    deleteOperacion,
    getDashboardStats
} from "controllers/operacion.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isGerente, isTrabajadorTienda } from "../middlewares/authorization.middleware.js";

const router = Router();

// Middleware de autenticación para todas las rutas
router.use(authenticateJwt);

/**
 * Rutas públicas para trabajadores (lectura)
 */

// GET /api/operaciones/dashboard/stats - Estadísticas del dashboard
router.get(
    "/dashboard/stats",
    isTrabajadorTienda,
    getDashboardStats
);

// GET /api/operaciones - Obtener todas las operaciones
router.get(
    "/",
    isTrabajadorTienda,
    getOperaciones
);

// GET /api/operaciones/:id - Obtener una operación por ID
router.get(
    "/:id",
    isTrabajadorTienda,
    getOperacionById
);

/**
 * Rutas de escritura (crear/actualizar)
 */

// POST /api/operaciones - Crear nueva operación
router.post(
    "/",
    isTrabajadorTienda,
    createOperacion
);

// PATCH /api/operaciones/:id/estado - Actualizar estado
router.patch(
    "/:id/estado",
    isTrabajadorTienda,
    updateEstadoOperacion
);

// PUT /api/operaciones/:id - Actualizar operación
router.put(
    "/:id",
    isTrabajadorTienda,
    updateOperacion
);

/**
 * Rutas de eliminación (solo gerente/admin)
 */

// DELETE /api/operaciones/:id - Anular operación
router.delete(
    "/:id",
    isGerente,
    deleteOperacion
);

export default router;