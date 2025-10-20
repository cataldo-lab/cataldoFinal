// backend/src/routes/gerente&Trabajador/proveedor.routes.js
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
    deleteRepresentante
} from "../../controllers/gerente&Trabajador/proveedor.controller.js";
import { authenticateJwt } from "../../middlewares/authentication.middleware.js";
import { isEmployee, isManager } from "../../middlewares/authorization.middleware.js";

const router = Router();

// Middleware de autenticación para todas las rutas
router.use(authenticateJwt);

/**
 * ========================================
 * RUTAS DE PROVEEDORES
 * ========================================
 */

// GET /api/proveedores - Obtener todos los proveedores
router.get("/", isEmployee, getProveedores);

// GET /api/proveedores/:id - Obtener un proveedor por ID
router.get("/:id", isEmployee, getProveedorById);

// POST /api/proveedores - Crear nuevo proveedor
router.post("/", isEmployee, createProveedor);

// PUT /api/proveedores/:id - Actualizar proveedor
router.put("/:id", isEmployee, updateProveedor);

// DELETE /api/proveedores/:id - Eliminar proveedor (solo gerente)
router.delete("/:id", isManager, deleteProveedor);

/**
 * ========================================
 * RUTAS DE REPRESENTANTES (anidadas bajo proveedores)
 * ========================================
 */

// GET /api/proveedores/:id/representantes - Obtener representantes de un proveedor
router.get("/:id/representantes", isEmployee, getRepresentantesByProveedor);

// POST /api/proveedores/:id/representantes - Crear representante para un proveedor
router.post("/:id/representantes", isEmployee, createRepresentante);

// PUT /api/proveedores/representantes/:id - Actualizar representante
router.put("/representantes/:id", isEmployee, updateRepresentante);

// DELETE /api/proveedores/representantes/:id - Eliminar representante (solo gerente)
router.delete("/representantes/:id", isManager, deleteRepresentante);

export default router;