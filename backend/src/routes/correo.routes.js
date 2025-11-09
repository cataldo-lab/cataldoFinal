"use strict";
import { Router } from "express";
import {
  enviarCorreoController,
  getHistorialCorreosController,
  getCorreoByIdController,
  getEstadisticasCorreosController
} from "../controllers/correo.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isEmployee, isManager } from "../middlewares/authorization.middleware.js";

const router = Router();

// Aplicar autenticación a todas las rutas
router.use(authenticateJwt);

// Ruta para enviar correo (requiere ser empleado o gerente)
router.post("/enviar", isEmployee, isManager, enviarCorreoController);

// Ruta para obtener historial de correos (requiere ser empleado o gerente)
router.get("/historial", isEmployee, isManager, getHistorialCorreosController);

// Ruta para obtener un correo específico por ID (requiere ser empleado o gerente)
router.get("/:id", isEmployee, isManager, getCorreoByIdController);

// Ruta para obtener estadísticas de correos (requiere ser empleado o gerente)
router.get("/estadisticas/general", isEmployee, isManager, getEstadisticasCorreosController);

export default router;
