"use strict";
import { Router } from "express";
import {
  enviarCorreosCumpleanosController,
  getCumpleanerosHoyController,
  getProximosCumpleanosController
} from "../controllers/cumpleanos.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isEmployee, isManager } from "../middlewares/authorization.middleware.js";

const router = Router();

// Aplicar autenticación a todas las rutas
router.use(authenticateJwt);

// Ruta para enviar correos de cumpleaños manualmente (requiere ser empleado o gerente)
router.post("/enviar", isEmployee, isManager, enviarCorreosCumpleanosController);

// Ruta para obtener cumpleañeros de hoy (requiere ser empleado o gerente)
router.get("/hoy", isEmployee, isManager, getCumpleanerosHoyController);

// Ruta para obtener próximos cumpleaños (requiere ser empleado o gerente)
router.get("/proximos", isEmployee, isManager, getProximosCumpleanosController);

export default router;
