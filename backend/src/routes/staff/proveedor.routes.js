// backend/src/routes/staff/proveedor.routes.js
"use strict";
import { Router } from "express";
import {
    createProveedor,
    getProveedores,
    getProveedorById,
    updateProveedor,
    deleteProveedor,
    createRepresentante,
    getRepresentantesByProveedor,
    updateRepresentante,
    deleteRepresentante,
    getProveedoresConRepresentantes
} from "../../controllers/staff/proveedor.controller.js";
import { authenticateJwt } from "../../middlewares/authentication.middleware.js";
import { isEmployee, isManager } from "../../middlewares/authorization.middleware.js";

const router = Router();

// Middleware de autenticación para todas las rutas
router.use(authenticateJwt);

/**
 * ========================================
 * RUTAS DE REPRESENTANTES (DEBEN IR PRIMERO)
 * ========================================
 * IMPORTANTE: Estas rutas van ANTES de /:id para evitar conflictos
 */

// PUT /api/proveedores/representantes/:id - Actualizar representante
router.put("/representantes/:id", isEmployee, updateRepresentante);

// DELETE /api/proveedores/representantes/:id - Eliminar representante (solo gerente)
router.delete("/representantes/:id", isManager, deleteRepresentante);

/**
 * ========================================
 * RUTAS DE PROVEEDORES
 * ========================================
 */

// GET /api/proveedores - Obtener todos los proveedores
router.get("/", [isEmployee,isManager], getProveedores);

// POST /api/proveedores - Crear nuevo proveedor
router.post("/", [isEmployee,isManager], createProveedor);

// GET /api/proveedores/:id/representantes - Obtener representantes de un proveedor
// ⚠️ DEBE ir ANTES de GET /:id
router.get("/:id/representantes", [isEmployee,isManager], getRepresentantesByProveedor);

// POST /api/proveedores/:id/representantes - Crear representante para un proveedor
router.post("/:id/representantes", [isEmployee,isManager], createRepresentante);

// GET /api/proveedores/:id - Obtener un proveedor por ID
router.get("/:id", [isEmployee,isManager], getProveedorById);

// PUT /api/proveedores/:id - Actualizar proveedor
router.put("/:id", [isEmployee,isManager], updateProveedor);

// DELETE /api/proveedores/:id - Eliminar proveedor (solo gerente)
router.delete("/:id", [isEmployee,isManager], deleteProveedor);

router.get("/con-representantes", [isEmployee,isManager], getProveedoresConRepresentantes);


export default router;