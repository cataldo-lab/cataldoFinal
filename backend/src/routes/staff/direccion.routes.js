"use strict";
import { Router } from "express";
import {
    addPaisController,
    addRegionToPaisController,
    addComunaToProvinciaController,
    addProvinciaToRegionController,
    getPaisController,
    updatePaisController,
    updateProvinciaController,
    updateComunaController,
    updateRegionController
}from "../../controllers/staff/direccion.controller.js";
import { authenticateJwt } from "../../middlewares/authentication.middleware.js";
import { isEmployee, isManager } from "../../middlewares/authorization.middleware.js";

const router= Router();

router.use(authenticateJwt);

//Pais
router.get("/paises", [isEmployee, isManager],getPaisController);
router.post("/paises", [isEmployee,isManager],addPaisController);
router.patch("/paises/:id_pais", [isEmployee,isManager], updatePaisController);

//Region
router.post("/region/:id_pais",[isEmployee,isManager], addRegionToPaisController);
router.patch("/region/:id_region",[isEmployee,isManager], updateRegionController);

//Provincia
router.post("/provincia/:id_region",[isEmployee,isManager],addProvinciaToRegionController);
router.patch("/provincia/:id_provincia",[isEmployee,isManager],updateProvinciaController);

//Comuna
router.post("/comuna/:id_provincia",[isEmployee,isManager],addComunaToProvinciaController);
router.patch("/comuna/:id_comuna",[isEmployee,isManager],updateComunaController);

export default router;