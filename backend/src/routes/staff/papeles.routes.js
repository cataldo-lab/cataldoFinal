"use strict";
import { Router } from "express";
import { 
    getClientesConCompras, 
    getClienteConComprasById 
} from "../../controllers/staff/papeles.controller.js";
import { authenticateJwt } from "../../middlewares/authentication.middleware.js";
import { isEmployeeOrManager } from "../../middlewares/authorization.middleware.js";

const router = Router();

router.use(authenticateJwt);

router.get("/compras", isEmployeeOrManager, getClientesConCompras);
router.get("/compras/:id", isEmployeeOrManager, getClienteConComprasById);

export default router;