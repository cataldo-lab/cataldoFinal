"use strict";
import { Router } from "express";
import {
  blockUserCliente,
  deleteUserCliente, 
  getAllClientes, 
  getClienteById, 
  getUserById, 
  getClienteDetalleById, 
  createPerfilFull, 
  createMedioPerfil, 
  updateMedioPerfil, 
  updatePerfilFull 
} from "../controllers/staff/controller.service.js";
import { authenticateJwt } from "../../middlewares/authentication.middleware.js";
import { isEmployee, isManager } from "../../middlewares/authorization.middleware.js";


const router = Router();

router.use(authenticateJwt);

router.get("/ClientesUser", [isEmployee, isManager], getAllClientes)//ClienteUser
router.get("/clientes/:id", [isEmployee, isManager], getClienteById); // Obtener cliente completo por ID
router.get("/clientes/:id/usuario", [isEmployee, isManager], getUserById); // Obtener datos básicos de usuario
router.get("/clientes/:id/full", [isEmployee, isManager], getClienteDetalleById); // Obtener detalles específicos de cliente

// Rutas para crear (requieren ser empleado o gerente)
router.post("/clientes", [isEmployee, isManager], createPerfilFull); // Crear perfil completo
router.post("/clientes/:id/full", [isEmployee, isManager], createMedioPerfil); // Crear detalles para usuario existente

// Rutas para actualizar (requieren ser empleado o gerente)
router.patch("/clientes/:id/full", [isEmployee, isManager], updateMedioPerfil); // Actualizar solo detalles de cliente
router.patch("/clientes/:id", [isEmployee, isManager], updatePerfilFull); // Actualizar perfil completo
router.patch("clientes/block/:id", [isEmployee,isManager], blockUserCliente);

router.delete("clientes/:id",[isManager], deleteUserCliente);


export default router;