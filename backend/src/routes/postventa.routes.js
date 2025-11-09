"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isEmployee } from "../middlewares/authorization.middleware.js";
import {
    enviarCorreo,
    obtenerHistorial,
    obtenerEstadisticas,
    reintentarEnvio,
    testConfiguracion
} from "../controllers/postventa.controller.js";

const router = Router();

// Aplicar autenticación a todas las rutas
router.use(authenticateJwt);

// Aplicar autorización: solo empleados pueden acceder (trabajador_tienda, gerente, administrador)
router.use(isEmployee);

/**
 * POST /api/postventa/enviar
 * Enviar correo a cliente
 * Requiere: trabajador_tienda, gerente o administrador
 */
router.post("/enviar", enviarCorreo);

/**
 * GET /api/postventa/historial
 * Obtener historial de correos enviados
 * Requiere: trabajador_tienda, gerente o administrador
 * Query params: destinatario, tipo, estado, desde, hasta, operacionId, limite, pagina
 */
router.get("/historial", obtenerHistorial);

/**
 * GET /api/postventa/estadisticas
 * Obtener estadísticas de correos
 * Requiere: trabajador_tienda, gerente o administrador
 * Query params: desde, hasta
 */
router.get("/estadisticas", obtenerEstadisticas);

/**
 * POST /api/postventa/reintentar/:id
 * Reintentar envío de correo fallido
 * Requiere: trabajador_tienda, gerente o administrador
 */
router.post("/reintentar/:id", reintentarEnvio);

/**
 * GET /api/postventa/test-config
 * Verificar configuración de correo
 * Requiere: trabajador_tienda, gerente o administrador
 */
router.get("/test-config", testConfiguracion);

export default router;
