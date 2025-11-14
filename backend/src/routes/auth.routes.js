"use strict";
import { Router } from "express";
import { login, logout, register } from "../controllers/auth.controller.js";

const router = Router();

// Rutas cambiadas para evitar bloqueo por extensiones de navegador
router
  .post("/verify", login)
  .post("/create", register)
  .post("/end", logout);

export default router;