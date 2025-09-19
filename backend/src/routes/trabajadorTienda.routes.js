"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isEmployee } from "../middlewares/authorization.middleware.js";

const router = Router();

// Aplicar middlewares
router.use(authenticateJwt);
router.use(isEmployee);

// Rutas para gestión operativa
router
  // Gestión de operaciones asignadas
  .get("/my-operations", /* TODO: getMyOperations */)
  .patch("/operations/:id/status", /* TODO: updateOperationStatus */)
  
  // Gestión de productos
  .get("/products", /* TODO: getProducts */)
  .post("/products", /* TODO: createProduct */)
  .patch("/products/:id", /* TODO: updateProduct */)
  
  // Gestión de materiales
  .get("/materials", /* TODO: getMaterials */)
  .patch("/materials/:id/stock", /* TODO: updateMaterialStock */)
  
  // Gestión de clientes
  .get("/clients", /* TODO: getClients */)
  .get("/clients/:id", /* TODO: getClient */)
  
  // Operaciones de venta
  .post("/operations", /* TODO: createOperation */)
  .get("/operations", /* TODO: getOperations */);

export default router;