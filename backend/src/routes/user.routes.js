"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/user.controller.js";
import {
  getAuditLogs,
  getUserActivity,
  getFailedLogins,
  getEntityAuditHistory
} from "../controllers/audit.controller.js";




const router = Router();

router
  .use(authenticateJwt)
  .use(isAdmin);

router
  .get("/", getUsers)
  .get("/detail/", getUser)
  .patch("/detail/", updateUser)
  .post("/create/",createUser)
  .delete("/detail/", deleteUser);


router
  .get("/audit/logs", getAuditLogs)
  .get("/audit/user/:id", getUserActivity)
  .get("/audit/failed-logins", getFailedLogins)
  .get("/audit/entity/:entidad/:id", getEntityAuditHistory)
  //.get("/audit/dashboard", getAuditDashboard);

export default router;