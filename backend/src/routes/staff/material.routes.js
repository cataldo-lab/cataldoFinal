// backend/src/routes/staff/material.routes.js
"use strict";
import { Router } from "express";
import {
  createMaterial,
  getMaterialById,
  getAllMateriales,
  updateMaterial,
  deleteMaterial,
  hardDeleteMaterial,
  getMaterialRepresentante,
  getMaterialesConRepresentantes
} from "../../controllers/staff/material.controller.js";


import { authenticateJwt } from "../../middlewares/authentication.middleware.js";
import { isManager, isEmployee } from "../../middlewares/authorization.middleware.js";

const router = Router();


router.use(authenticateJwt);
router.get("/con-representantes", [isEmployee,isManager], getMaterialesConRepresentantes);
router.get("/", [isEmployee,isManager], getAllMateriales);
router.post("/", [isEmployee,isManager], createMaterial);
router.get("/:id", [isEmployee,isManager], getMaterialById);
router.get("/:id/representante", [isEmployee,isManager], getMaterialRepresentante);
router.patch("/:id", [isEmployee,isManager], updateMaterial);
router.delete("/:id", [isEmployee,isManager], deleteMaterial);
router.delete("/:id/permanent", [isEmployee,isManager], hardDeleteMaterial);

export default router;