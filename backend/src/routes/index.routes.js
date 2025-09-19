"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
//import managerRoutes from "./gerente.routes.js";
//import employeeRoutes from "./trabajadorTienda.routes.js";
//import clientRoutes from "./cliente.routes.js";
//import profileRoutes from "./profile.routes.js";
//import publicRoutes from "./public.routes.js";
const router = Router();

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes);
    //.use("/manager", managerRoutes);
    //.use("/employee", employeeRoutes);
    //.use("/client", clientRoutes);
    //.use("/profile", profileRoutes);
    //.use("/public", publicRoutes);

export default router;