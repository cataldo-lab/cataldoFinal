"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isClient } from "../middlewares/authorization.middleware.js";
import {
  getMisOperaciones,
  getMiOperacion,
  getMiPerfil,
} from "../controllers/cliente.controller.js";

const router = Router();

// Aplicar middlewares
router.use(authenticateJwt);
router.use(isClient);

// Rutas para clientes
router
  // Gestión de mis pedidos/operaciones
  .get("/my-orders", getMisOperaciones)
  .get("/my-orders/:id", getMiOperacion)

  // Perfil del cliente
  .get("/profile", getMiPerfil);

export default router;