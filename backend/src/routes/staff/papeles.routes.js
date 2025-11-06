"use strict";
import { Router } from "express";
import {
    getClientesConCompras,
    getClienteConComprasById,
    getClientesConComprasPorFechas,
    getEstadisticasAvanzadas
} from "../../controllers/staff/papeles.controller.js";
import { authenticateJwt } from "../../middlewares/authentication.middleware.js";
import { isEmployeeOrManager } from "../../middlewares/authorization.middleware.js";

const router = Router();

router.use(authenticateJwt);

// Rutas específicas (deben ir ANTES de las rutas con parámetros)
router.get("/estadisticas", isEmployeeOrManager, getEstadisticasAvanzadas);
router.get("/compras/filtro/fechas", isEmployeeOrManager, getClientesConComprasPorFechas);

// Rutas generales
router.get("/compras", isEmployeeOrManager, getClientesConCompras);
router.get("/compras/:id", isEmployeeOrManager, getClienteConComprasById);

export default router;