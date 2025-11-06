"use strict";
import { Router } from "express";
import {
  blockUserClienteController,
  deleteUserClienteController, 
  getAllClientesController, 
  getClienteByIdController, 
  getUserByIdController, 
  getClienteDetalleByIdController, 
  createPerfilFullController, 
  createMedioPerfilController, 
  updateMedioPerfilController, 
  updatePerfilFullController,
  searchClientesController 
} from "../../controllers/staff/cliente.controller.js";
import { authenticateJwt } from "../../middlewares/authentication.middleware.js";
import { isEmployee, isManager } from "../../middlewares/authorization.middleware.js";

const router = Router();

// Aplicar autenticación a todas las rutas
router.use(authenticateJwt);

// Rutas para obtener (requieren ser empleado o gerente)
router.get("/search", isEmployee, isManager, searchClientesController);
router.get("/ClientesUser", isEmployee, isManager, getAllClientesController);
router.get("/:id", isEmployee, isManager, getClienteByIdController);
router.get("/:id/usuario", isEmployee, isManager, getUserByIdController);
router.get("/:id/full", isEmployee, isManager, getClienteDetalleByIdController);

// Rutas para crear (requieren ser empleado o gerente)
router.post("/", isEmployee, isManager, createPerfilFullController);
router.post("/:id/full", isEmployee, isManager, createMedioPerfilController);

// Rutas para actualizar (requieren ser empleado o gerente)
router.patch("/:id/full", isEmployee, isManager, updateMedioPerfilController);
router.patch("/:id", isEmployee, isManager, updatePerfilFullController);
router.patch("/block/:id", isEmployee, isManager, blockUserClienteController);

// Rutas para eliminar (requieren ser gerente)
router.delete("/:id", isEmployee, isManager, deleteUserClienteController);

export default router;