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
} from "../../controllers/staff/operacion.controller.js";
import { authenticateJwt } from "../../middlewares/authentication.middleware.js";
import { isManager, isEmployee } from "../../middlewares/authorization.middleware.js";

const router = Router();

// ✅ Aplicar autenticación a TODAS las rutas
router.use(authenticateJwt);

// ========================================
// RUTAS ESPECÍFICAS (deben ir PRIMERO)
// ========================================
// ⚠️ IMPORTANTE: Las rutas con paths fijos deben ir ANTES de las rutas con parámetros
// para evitar que Express las confunda con :id

/**
 * GET /api/operaciones/dashboard/stats
 * Obtener estadísticas para el dashboard
 * Acceso: Empleados y superiores
 */
router.get("/dashboard/stats", isEmployee, getDashboardStats);

// ========================================
// RUTAS CON PARÁMETROS - ESPECÍFICAS
// ========================================
// ⚠️ Estas deben ir ANTES de GET /:id

/**
 * PATCH /api/operaciones/:id/estado
 * Actualizar estado de una operación
 * Body: { estado: "nuevo_estado" }
 * Acceso: Empleados y superiores
 */
router.patch("/:id/estado", isEmployee, updateEstadoOperacion);

// ========================================
// RUTAS CON PARÁMETROS - GENERALES
// ========================================

/**
 * GET /api/operaciones/:id
 * Obtener una operación por ID con todos sus detalles
 * Acceso: Empleados y superiores
 */
router.get("/:id", isEmployee, getOperacionById);

/**
 * PUT /api/operaciones/:id
 * Actualizar datos de una operación
 * Acceso: Empleados y superiores
 */
router.put("/:id", isEmployee, updateOperacion);

/**
 * DELETE /api/operaciones/:id
 * Anular una operación (cambiar estado a "anulada")
 * ⚠️ SOLO GERENTES pueden anular operaciones
 * Acceso: Solo gerentes
 */
router.delete("/:id", isManager, deleteOperacion);

// ========================================
// RUTAS DE COLECCIÓN
// ========================================

/**
 * GET /api/operaciones
 * Obtener todas las operaciones con filtros opcionales
 * Query params: estado_operacion, id_cliente, fecha_desde, fecha_hasta
 * Acceso: Empleados y superiores
 */
router.get("/", isEmployee, getOperaciones);

/**
 * POST /api/operaciones
 * Crear una nueva operación
 * Body: { id_cliente, productos: [...], descripcion_operacion, ... }
 * Acceso: Empleados y superiores
 */
router.post("/", isEmployee, createOperacion);

export default router;