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
  updatePerfilFullController 
} from "../../controllers/staff/cliente.controller.js";
import { authenticateJwt } from "../../middlewares/authentication.middleware.js";
import { isEmployee, isManager } from "../../middlewares/authorization.middleware.js";

const router = Router();

// Aplicar autenticación a todas las rutas
router.use(authenticateJwt);

// Rutas para obtener (requieren ser empleado o gerente)
router.get("/ClientesUser", [isEmployee, isManager], getAllClientesController);
router.get("/clientes/:id", [isEmployee, isManager], getClienteByIdController);
router.get("/clientes/:id/usuario", [isEmployee, isManager], getUserByIdController);
router.get("/clientes/:id/full", [isEmployee, isManager], getClienteDetalleByIdController);

// Rutas para crear (requieren ser empleado o gerente)
router.post("/clientes", [isEmployee, isManager], createPerfilFullController);
router.post("/clientes/:id/full", [isEmployee, isManager], createMedioPerfilController);

// Rutas para actualizar (requieren ser empleado o gerente)
router.patch("/clientes/:id/full", [isEmployee, isManager], updateMedioPerfilController);
router.patch("/clientes/:id", [isEmployee, isManager], updatePerfilFullController);
router.patch("/clientes/block/:id", [isEmployee, isManager], blockUserClienteController);

// Rutas para eliminar (requieren ser gerente)
router.delete("/clientes/:id", [isEmployee,isManager], deleteUserClienteController);

export default router;