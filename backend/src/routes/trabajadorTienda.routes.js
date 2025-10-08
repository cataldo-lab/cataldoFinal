"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isEmployee } from "../middlewares/authorization.middleware.js";
import { getDashboard } from "../controllers/trabajadorTienda.controller.js";


const router = Router();

// Aplicar middlewares
router.use(authenticateJwt);
router.use(isEmployee);


router.get("/dashboard", authenticateJwt, getDashboard);




// Rutas para gestión operativa
router
  // Gestión de operaciones asignadas
  .get("/my-operations", getMyOperations)
  .patch("/operations/:id/status", updateOperationStatus)
  
  // Gestión de productos
  .get("/products", getProducts)
  .post("/products", createProduct)
  .patch("/products/:id", updateProduct)
  
  // Gestión de materiales
  .get("/materials", getMaterials)
  .patch("/materials/:id/stock", updateMaterialStock)
  
  // Gestión de clientes
  .get("/clients", getClients)
  .get("/clients/:id", getClient)
  
  // Operaciones de venta
  .post("/operations", createOperation)
  .get("/operations", getOperations);

// Controladores temporales hasta implementar los reales
function getMyOperations(req, res) {
  res.json({ 
    status: "Success", 
    message: "Mis operaciones", 
    data: [] 
  });
}

function updateOperationStatus(req, res) {
  res.json({ 
    status: "Success", 
    message: "Estado de operación actualizado", 
    data: { id: req.params.id, status: req.body.status } 
  });
}

function getProducts(req, res) {
  res.json({ 
    status: "Success", 
    message: "Productos obtenidos", 
    data: [] 
  });
}

function createProduct(req, res) {
  res.json({ 
    status: "Success", 
    message: "Producto creado", 
    data: { productId: "prod123" } 
  });
}

function updateProduct(req, res) {
  res.json({ 
    status: "Success", 
    message: "Producto actualizado", 
    data: { id: req.params.id } 
  });
}

function getMaterials(req, res) {
  res.json({ 
    status: "Success", 
    message: "Materiales obtenidos", 
    data: [] 
  });
}

function updateMaterialStock(req, res) {
  res.json({ 
    status: "Success", 
    message: "Stock de material actualizado", 
    data: { id: req.params.id, stock: req.body.stock } 
  });
}

function getClients(req, res) {
  res.json({ 
    status: "Success", 
    message: "Clientes obtenidos", 
    data: [] 
  });
}

function getClient(req, res) {
  res.json({ 
    status: "Success", 
    message: "Cliente obtenido", 
    data: { id: req.params.id } 
  });
}

function createOperation(req, res) {
  res.json({ 
    status: "Success", 
    message: "Operación creada", 
    data: { operationId: "op456" } 
  });
}

function getOperations(req, res) {
  res.json({ 
    status: "Success", 
    message: "Operaciones obtenidas", 
    data: [] 
  });
}

export default router;