"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isClient } from "../middlewares/authorization.middleware.js";

const router = Router();

// Aplicar middlewares
router.use(authenticateJwt);
router.use(isClient);

// Rutas para clientes
router
  // Ver catálogo de productos
  .get("/catalog", /* TODO: getProductCatalog */)
  .get("/catalog/:id", /* TODO: getProductDetail */)
  
  // Gestión de sus propias operaciones
  .get("/my-orders", /* TODO: getMyOrders */)
  .get("/my-orders/:id", /* TODO: getMyOrder */)
  .post("/my-orders", /* TODO: createOrder */)
  
  // Perfil del cliente
  .get("/profile", /* TODO: getMyProfile */)
  .patch("/profile", /* TODO: updateMyProfile */)
  
  // Encuestas
  .get("/surveys", /* TODO: getMySurveys */)
  .post("/surveys", /* TODO: createSurvey */);

export default router;