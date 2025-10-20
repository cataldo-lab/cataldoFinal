"use strict";
import { Router } from "express";
import {
    createCliente,
    getClientes,
    getClienteById,
    updateCliente,
    getHistorialOperaciones,
    getEstadisticasCliente,
    getCategorias
} from "../../controllers/staff/cliente.controller.js";
import { authenticateJwt } from "../../middlewares/authentication.middleware.js";
import { isEmployee } from "../../middlewares/authorization.middleware.js";

const router = Router();

// Middleware de autenticación para todas las rutas
router
    .use(authenticateJwt)
    .use(isEmployee);

// Rutas especiales (deben ir primero para evitar conflictos con /:id)


// GET /api/clientes/categorias - Obtener categorías
router.get("/categorias", getCategorias);


//Rutas CRUD


// GET /api/clientes - Obtener todos los clientes
router.get("/", getClientes);

// GET /api/clientes/:id - Obtener un cliente
router.get("/:id", getClienteById);

// POST /api/clientes - Crear nuevo cliente
router.post("/", createCliente);

// PUT /api/clientes/:id - Actualizar cliente
router.put("/:id", updateCliente);


// Rutas de información adicional
 

// GET /api/clientes/:id/operaciones - Historial de operaciones
router.get("/:id/operaciones", getHistorialOperaciones);

// GET /api/clientes/:id/estadisticas - Estadísticas del cliente
router.get("/:id/estadisticas", getEstadisticasCliente);

export default router;