"use strict";
import { Router } from "express";
import { 
    getClientesConCompras, 
    getClienteConComprasById 
} from "../controllers/papeles.controller.js";
import { authenticateJwt } from "../../middlewares/authentication.middleware.js";
import { isEmployee, isManager } from "../../middlewares/authorization.middleware.js";

const router = Router();

router.use(authenticateJwt);

router.get(
"/compras",
    isEmployee,isManager,
    getClientesConCompras
);

router.get(
    "/compras/:id",
    isManager, isEmployee,
    getClienteConComprasById
);

export default router;