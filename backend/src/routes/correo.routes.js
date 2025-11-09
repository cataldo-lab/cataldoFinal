"use strict";
import { Router } from "express";
import {
  enviarCorreo,
  obtenerHistorial,
  obtenerCorreoPorId,
  enviarCorreoMasivo,
  obtenerPlantillas
} from "../controllers/correo.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin, isGerente, isTrabajadorTienda } from "../middlewares/authorization.middleware.js";

const router = Router();

// Usar middleware de autenticación para todas las rutas
router.use(authenticateJwt);

// Rutas para trabajador_tienda, gerente y admin
router
  .post("/enviar", isTrabajadorTienda, enviarCorreo)
  .post("/enviar-masivo", isGerente, enviarCorreoMasivo)
  .get("/historial", isTrabajadorTienda, obtenerHistorial)
  .get("/plantillas", isTrabajadorTienda, obtenerPlantillas)
  .get("/:id", isTrabajadorTienda, obtenerCorreoPorId);

export default router;
