"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/user.controller.js";

const router = Router();

// Aplicar middlewares de autenticación y autorización
router.use(authenticateJwt);
router.use(isAdmin);

// Rutas para gestión completa de usuarios
router
  .get("/users", getUsers)                    // Ver todos los usuarios
  .get("/users/detail", getUser)              // Ver detalle de un usuario
  .patch("/users/detail", updateUser)         // Actualizar cualquier usuario
  .delete("/users/detail", deleteUser);       // Eliminar cualquier usuario

// TODO: Agregar rutas para:
// - Gestión de productos
// - Gestión de proveedores
// - Gestión de materiales
// - Reportes del sistema
// - Configuración de costos terceros

export default router;