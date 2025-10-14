"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import adminRoutes from "./admin.routes.js";
import gerenteRoutes from "./gerente.routes.js";
import trabajadorTiendaRoutes from "./trabajadorTienda.routes.js";
import clienteRoutes from "./cliente.routes.js";
import operacionRoutes from "./gerente&Trabajador/operacion.routes.js";
import productoRoutes from "./gerente&Trabajador/producto.routes.js";
import materialRoutes from "./gerente&Trabajador/material.routes.js";
import clienteGTRoutes from "./gerente&Trabajador/cliente.routes.js";

const router = Router();

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
    .use("/admin", adminRoutes)
    .use("/gerente", gerenteRoutes)
    .use("/trabajador-tienda", trabajadorTiendaRoutes)
    .use("/cliente", clienteRoutes)
    .use("/operaciones", operacionRoutes)
    .use("/productos", productoRoutes)
    .use("/materiales", materialRoutes)
    .use("/clientes", clienteGTRoutes); 
export default router;