"use strict";
import { Router } from "express";
import {
    createProducto,
    getProductos,
    getProductoById,
    updateProducto,
    deleteProducto,
    getCategorias
} from "../../controllers/staff/producto.controller.js";
import { authenticateJwt } from "../../middlewares/authentication.middleware.js";
import { isEmployee, isManager } from "../../middlewares/authorization.middleware.js";

const router = Router();

// Middleware de autenticación para todas las rutas
router.use(authenticateJwt);

/**
 * Rutas de consulta (todos los trabajadores)
 */

// GET /api/productos/categorias - Obtener categorías
router.get(
    "/categorias",
    isEmployee,
    getCategorias
);

// GET /api/productos - Obtener todos los productos
router.get(
    "/",
    isEmployee,
    getProductos
);

// GET /api/productos/:id - Obtener un producto por ID
router.get(
    "/:id",
    isEmployee,
    getProductoById
);

/**
 * Rutas de escritura (trabajadores pueden crear/editar)
 */

// POST /api/productos - Crear nuevo producto
router.post(
    "/",
    isEmployee,
    createProducto
);

// PUT /api/productos/:id - Actualizar producto
router.put(
    "/:id",
    isEmployee,
    updateProducto
);

/**
 * Rutas de eliminación (solo gerente)
 */

// DELETE /api/productos/:id 
router.delete(
    "/:id",
    isManager,
    deleteProducto
);

export default router;