"use strict";
import { Router } from "express";
import {
  crearEncuestaController,
  getEncuestasController,
  getEncuestaByIdController,
  getEncuestaByOperacionController,
  actualizarEncuestaController,
  eliminarEncuestaController,
  getEstadisticasEncuestasController,
  getOperacionesSinEncuestaController
} from "../controllers/encuesta.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isEmployee, isManager } from "../middlewares/authorization.middleware.js";

const router = Router();

// Aplicar autenticación a todas las rutas
router.use(authenticateJwt);

// Ruta para crear una nueva encuesta (requiere ser empleado o gerente)
router.post("/", isEmployee, isManager, crearEncuestaController);

// Ruta para obtener todas las encuestas con filtros (requiere ser empleado o gerente)
router.get("/", isEmployee, isManager, getEncuestasController);

// Ruta para obtener estadísticas de encuestas (requiere ser empleado o gerente)
router.get("/estadisticas", isEmployee, isManager, getEstadisticasEncuestasController);

// Ruta para obtener operaciones sin encuesta (requiere ser empleado o gerente)
router.get("/operaciones-sin-encuesta", isEmployee, isManager, getOperacionesSinEncuestaController);

// Ruta para obtener la encuesta de una operación específica (requiere ser empleado o gerente)
router.get("/operacion/:id_operacion", isEmployee, isManager, getEncuestaByOperacionController);

// Ruta para obtener una encuesta específica por ID (requiere ser empleado o gerente)
router.get("/:id", isEmployee, isManager, getEncuestaByIdController);

// Ruta para actualizar una encuesta (requiere ser empleado o gerente)
router.put("/:id", isEmployee, isManager, actualizarEncuestaController);

// Ruta para eliminar una encuesta (requiere ser empleado o gerente)
router.delete("/:id", isEmployee, isManager, eliminarEncuestaController);

export default router;
