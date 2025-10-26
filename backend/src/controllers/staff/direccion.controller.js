
"use strict";
import{
    getPaisService,
    addPaisService,
    addRegionToPaisService,
    addProvinciaToRegionService,
    addComunaToProvinciaService,
    updatePaisService,
    updateRegionService,
    updateProvinciaService,
    updateComunaService
} from "../../services/staff/direccion.service.js";
import { 
    handleSuccess, 
    handleErrorClient, 
    handleErrorServer 
} from "../../handlers/responseHandlers.js";


//Pais
export async function getPaisController(req, res) {
  try {
    const paises = await getPaisService();
    return handleSuccess(res, 200, "Países obtenidos correctamente", paises);
  } catch (error) {
    console.error("❌ Error en getPaisController:", error);
    return handleErrorServer(res, 500, "Error al obtener los países");
  }
}

export async function addPaisController(req, res) {
    const { nombre_pais } = req.body;
    try {
        const nuevoPais = await addPaisService(nombre_pais);
        return handleSuccess(res, 201, "País creado correctamente", nuevoPais);
    } catch (error) {
        console.error("❌ Error en addPaisController:", error);
        return handleErrorServer(res, 500, "Error al crear país");
    }
}

export async function updatePaisController(req, res) {
    const { id_pais } = req.params;
    const { nombre_pais } = req.body;
    try {
        const paisActualizado = await updatePaisService(id_pais, nombre_pais);
        return handleSuccess(res, 200, "País actualizado correctamente", paisActualizado);
    } catch (error) {
        console.error(" Error en updatePais:", error);
        return handleErrorServer(res, 500, "Error al actualizar país");
    }
}

//Region

export async function addRegionToPaisController(req, res) {
    const { id_pais } = req.params;
    const { nombre_region } = req.body;

    try {
        const region = await addRegionToPaisService(id_pais, nombre_region);
        return handleSuccess(res, 201, "Región agregada correctamente", region);
    } catch (error) {
        console.error("❌ Error en addRegionToPaisController:", error);
        return handleErrorServer(res, 500, "Error al agregar región al país");
    }
}


export async function updateRegionController(req, res) {
    const { id_region } = req.params;
    const data = req.body;

    try {
        const region = await updateRegionService(
            id_region, 
            data);
        return handleSuccess(res, 200, 
            "Región actualizada correctamente", 
            region);
    } catch (error) {
        console.error(" Error en updateRegionController:", 
            error);
        return handleErrorServer(res, 500, 
            "Error al actualizar región");
    }
}

export async function addProvinciaToRegionController(req, res) {
    const { id_region } = req.params;
    const { nombre_provincia } = req.body;

    try {
        const provincia = await addProvinciaToRegionService(
            id_region, 
            nombre_provincia);
        return handleSuccess(res, 201, 
            "Provincia agregada correctamente", 
            provincia);
    } catch (error) {
        console.error(" Error en addProvinciaToRegionController:", 
            error);
        return handleErrorServer(res, 500, 
            "Error al agregar provincia a la región");
    }
}


export async function updateProvinciaController(req, res) {
    const { id_provincia } = req.params;
    const data = req.body;

    try {
        const provincia = await updateProvinciaService(
            id_provincia, 
            data);
        return handleSuccess(res, 200, 
            "Provincia actualizada correctamente", 
            provincia);
    } catch (error) {
        console.error(" Error en updateProvinciaController:", 
            error);
        return handleErrorServer(res, 500, 
            "Error al actualizar provincia");
    }
}

export async function addComunaToProvinciaController(req, res) {
    const { id_provincia } = req.params;
    const { nombre_comuna } = req.body;

    try {
        const comuna = await addComunaToProvinciaService(
            id_provincia, 
            nombre_comuna);
        return handleSuccess(res, 201, "Comuna agregada correctamente", 
            comuna);
    } catch (error) {
        console.error(" Error en addComunaToProvinciaController:", 
            error);
        return handleErrorServer(res, 500, 
            "Error al agregar comuna a la provincia");
    }
}

export async function updateComunaController(req, res) {
    const { id_comuna } = req.params;
    const data = req.body;

    try {
        const comuna = await updateComunaService(
            id_comuna, 
            data);
        return handleSuccess(res, 200, 
            "Comuna actualizada correctamente", 
            comuna);
    } catch (error) {
        console.error(" Error en updateComunaController:", 
            error);
        return handleErrorServer(res, 500, 
            "Error al actualizar comuna");
    }
}