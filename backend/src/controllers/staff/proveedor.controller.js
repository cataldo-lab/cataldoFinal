// backend/src/controllers/staff/proveedor.controller.js
"use strict";
import {
    createProveedorService,
    getProveedoresService,
    getProveedorByIdService,
    updateProveedorService,
    deleteProveedorService,
    createRepresentanteService,
    getRepresentantesByProveedorService,
    updateRepresentanteService,
    deleteRepresentanteService,
    getProveedoresConRepresentantesService
} from "../../services/staff/proveedor.service.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess
} from "../../handlers/responseHandlers.js";


export async function createProveedor(req, res) {
    try {
        const proveedorData = req.body;

        const [proveedor, error] = await createProveedorService(proveedorData);

        if (error) return handleErrorClient(res, 400, error);

        handleSuccess(res, 201, "Proveedor creado exitosamente", proveedor);

    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

/**
 * GET /api/proveedores
 * Obtener todos los proveedores
 */
export async function getProveedores(req, res) {
    try {
        const filtros = {
            rol_proveedor: req.query.rol_proveedor,
            search: req.query.search
        };

        // Limpiar filtros vacíos
        Object.keys(filtros).forEach(key => {
            if (!filtros[key]) delete filtros[key];
        });

        const [proveedores, error] = await getProveedoresService(filtros);

        if (error) return handleErrorServer(res, 500, error);

        handleSuccess(res, 200, "Proveedores obtenidos exitosamente", proveedores);

    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

/**
 * GET /api/proveedores/:id
 * Obtener un proveedor por ID con toda su información
 */
export async function getProveedorById(req, res) {
    try {
        const { id } = req.params;

        const [proveedor, error] = await getProveedorByIdService(parseInt(id));

        if (error) return handleErrorClient(res, 404, error);

        handleSuccess(res, 200, "Proveedor obtenido exitosamente", proveedor);

    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}


export async function updateProveedor(req, res) {
    try {
        const { id } = req.params;
        const datosActualizados = req.body;

        const [proveedor, error] = await updateProveedorService(
            parseInt(id),
            datosActualizados
        );

        if (error) return handleErrorClient(res, 404, error);

        handleSuccess(res, 200, "Proveedor actualizado exitosamente", proveedor);

    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}


export async function deleteProveedor(req, res) {
    try {
        const { id } = req.params;

        const [resultado, error] = await deleteProveedorService(parseInt(id));

        if (error) return handleErrorClient(res, 400, error);

        handleSuccess(res, 200, "Proveedor eliminado exitosamente", resultado);

    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}



/**
 * POST /api/proveedores/:id/representantes
 * Crear representante para un proveedor
 */
export async function createRepresentante(req, res) {
    try {
        const { id } = req.params;
        const representanteData = req.body;

        const [representante, error] = await createRepresentanteService(
            parseInt(id),
            representanteData
        );

        if (error) return handleErrorClient(res, 400, error);

        handleSuccess(res, 201, "Representante creado exitosamente", representante);

    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

/**
 * GET /api/proveedores/:id/representantes
 * Obtener representantes de un proveedor
 */
export async function getRepresentantesByProveedor(req, res) {
    try {
        const { id } = req.params;

        const [representantes, error] = await getRepresentantesByProveedorService(parseInt(id));

        if (error) return handleErrorClient(res, 404, error);

        handleSuccess(res, 200, "Representantes obtenidos exitosamente", representantes);

    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function updateRepresentante(req, res) {
    try {
        const { id } = req.params;
        const datosActualizados = req.body;

        const [representante, error] = await updateRepresentanteService(
            parseInt(id),
            datosActualizados
        );

        if (error) return handleErrorClient(res, 404, error);

        handleSuccess(res, 200, "Representante actualizado exitosamente", representante);

    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function deleteRepresentante(req, res) {
    try {
        const { id } = req.params;

        const [resultado, error] = await deleteRepresentanteService(parseInt(id));

        if (error) return handleErrorClient(res, 404, error);

        handleSuccess(res, 200, "Representante eliminado exitosamente", resultado);

    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getProveedoresConRepresentantes(req, res) {
    try {
        console.log('🎯 Controller: getProveedoresConRepresentantes llamado');
        
        const [proveedores, error] = await getProveedoresConRepresentantesService();

        if (error) {
            console.error('❌ Error desde service:', error);
            return res.status(500).json({
                success: false,
                message: error
            });
        }

        console.log('✅ Controller: Proveedores obtenidos exitosamente:', proveedores.length);

        return res.status(200).json({
            success: true,
            data: proveedores,
            count: proveedores.length
        });
    } catch (error) {
        console.error("❌ ERROR EN CONTROLLER getProveedoresConRepresentantes:");
        console.error("❌ Mensaje:", error.message);
        console.error("❌ Stack:", error.stack);
        return res.status(500).json({
            success: false,
            message: "Error interno del servidor"
        });
    }
}