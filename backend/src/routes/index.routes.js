"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import adminRoutes from "./admin.routes.js";
import gerenteRoutes from "./gerente.routes.js";
import trabajadorTiendaRoutes from "./trabajadorTienda.routes.js";
import clienteRoutes from "./cliente.routes.js";
import operacionRoutes from "./operacion.routes.js";

const router = Router();

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
    .use("/admin", adminRoutes)
    .use("/gerente", gerenteRoutes)
    .use("/trabajador-tienda", trabajadorTiendaRoutes)
    .use("/cliente", clienteRoutes)
    .use("/operaciones", operacionRoutes);

export default router;