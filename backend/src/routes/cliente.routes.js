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
  .get("/catalog", getProductCatalog)
  .get("/catalog/:id", getProductDetail)
  
  // Gestión de sus propias operaciones
  .get("/my-orders", getMyOrders)
  .get("/my-orders/:id", getMyOrder)
  .post("/my-orders", createOrder)
  
  // Perfil del cliente
  .get("/profile", getMyProfile)
  .patch("/profile", updateMyProfile)
  
  // Encuestas
  .get("/surveys", getMySurveys)
  .post("/surveys", createSurvey);

// Controladores temporales hasta implementar los reales
function getProductCatalog(req, res) {
  res.json({ 
    status: "Success", 
    message: "Catálogo de productos", 
    data: [] 
  });
}

function getProductDetail(req, res) {
  res.json({ 
    status: "Success", 
    message: "Detalle del producto", 
    data: { id: req.params.id } 
  });
}

function getMyOrders(req, res) {
  res.json({ 
    status: "Success", 
    message: "Mis órdenes", 
    data: [] 
  });
}

function getMyOrder(req, res) {
  res.json({ 
    status: "Success", 
    message: "Mi orden", 
    data: { id: req.params.id } 
  });
}

function createOrder(req, res) {
  res.json({ 
    status: "Success", 
    message: "Orden creada", 
    data: { orderId: "12345" } 
  });
}

function getMyProfile(req, res) {
  res.json({ 
    status: "Success", 
    message: "Mi perfil", 
    data: req.user 
  });
}

function updateMyProfile(req, res) {
  res.json({ 
    status: "Success", 
    message: "Perfil actualizado", 
    data: { ...req.user, ...req.body } 
  });
}

function getMySurveys(req, res) {
  res.json({ 
    status: "Success", 
    message: "Mis encuestas", 
    data: [] 
  });
}

function createSurvey(req, res) {
  res.json({ 
    status: "Success", 
    message: "Encuesta creada", 
    data: { surveyId: "67890" } 
  });
}

export default router;