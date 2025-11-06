"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import adminRoutes from "./admin.routes.js";
import gerenteRoutes from "./gerente.routes.js";
import trabajadorTiendaRoutes from "./trabajadorTienda.routes.js";
import clienteRoutes from "./cliente.routes.js";
import operacionRoutes from "./staff/operacion.routes.js";
import productoRoutes from "./staff/producto.routes.js";
import materialRoutes from "./staff/material.routes.js";
import clienteGTRoutes from "./staff/cliente.routes.js";
import proveedorRoutes from "./staff/proveedor.routes.js";
import direccionRoutes from "./staff/direccion.routes.js";
import papelesRoutes from "./staff/papeles.routes.js";

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
    .use("/clientes", clienteGTRoutes)
    .use("/direccion",direccionRoutes)
    .use("/papeles", papelesRoutes)
    .use("/proveedores", proveedorRoutes);   
export default router;