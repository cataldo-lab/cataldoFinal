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
import {
  getAuditLogs,
  getUserActivity,
  getFailedLogins,
  getEntityAuditHistory
} from "../controllers/audit.controller.js";


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


router
  .get("/audit/logs", getAuditLogs)                    
  .get("/audit/user/:id", getUserActivity)             
  .get("/audit/failed-logins", getFailedLogins)        
  .get("/audit/entity/:entidad/:id", getEntityAuditHistory);



export default router;