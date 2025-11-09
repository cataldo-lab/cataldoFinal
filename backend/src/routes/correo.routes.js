"use strict";
import { Router } from "express";
import multer from "multer";
import {
  enviarCorreoController,
  getHistorialCorreosController,
  getCorreoByIdController,
  getEstadisticasCorreosController
} from "../controllers/correo.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isEmployee, isManager } from "../middlewares/authorization.middleware.js";

const router = Router();

// Configurar multer para archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    // Solo aceptar PDFs
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos PDF'), false);
    }
  }
});

// Aplicar autenticación a todas las rutas
router.use(authenticateJwt);

// Ruta para enviar correo con archivo adjunto opcional (requiere ser empleado o gerente)
router.post("/enviar", isEmployee, isManager, upload.single('archivo'), enviarCorreoController);

// Ruta para obtener historial de correos (requiere ser empleado o gerente)
router.get("/historial", isEmployee, isManager, getHistorialCorreosController);

// Ruta para obtener un correo específico por ID (requiere ser empleado o gerente)
router.get("/:id", isEmployee, isManager, getCorreoByIdController);

// Ruta para obtener estadísticas de correos (requiere ser empleado o gerente)
router.get("/estadisticas/general", isEmployee, isManager, getEstadisticasCorreosController);

export default router;
