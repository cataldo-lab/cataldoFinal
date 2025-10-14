"use strict";
import {
    createMaterialService,
    getMaterialesService,
    getMaterialByIdService,
    updateMaterialService,
    updateStockMaterialService,
    deleteMaterialService,
    getMaterialesBajoStockService,
    getAlertasStockService
} from "../../services/gerente&Trabajador/material.service.js"; 
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess
} from "../../handlers/responseHandlers.js";

/**
 * POST /api/materiales
 * Crear un nuevo material
 */
export async function createMaterial(req, res) {
    try {
        const materialData = req.body;

        const [material, error] = await createMaterialService(materialData);

        if (error) return handleErrorClient(res, 400, error);

        handleSuccess(res, 201, "Material creado exitosamente", material);

    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

/**
 * GET /api/materiales
 * Obtener todos los materiales
 */
export async function getMateriales(req, res) {
    try {
        const filtros = {
            categoria_unidad: req.query.categoria_unidad,
            activo: req.query.activo !== undefined ? req.query.activo === 'true' : undefined,
            bajo_stock: req.query.bajo_stock,
            id_proveedor: req.query.id_proveedor ? parseInt(req.query.id_proveedor) : undefined
        };

        // Limpiar filtros vacíos
        Object.keys(filtros).forEach(key => {
            if (filtros[key] === undefined) delete filtros[key];
        });

        const [materiales, error] = await getMaterialesService(filtros);

        if (error) return handleErrorServer(res, 500, error);

        handleSuccess(res, 200, "Materiales obtenidos exitosamente", materiales);

    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

/**
 * GET /api/materiales/:id
 * Obtener un material por ID
 */
export async function getMaterialById(req, res) {
    try {
        const { id } = req.params;

        const [material, error] = await getMaterialByIdService(parseInt(id));

        if (error) return handleErrorClient(res, 404, error);

        handleSuccess(res, 200, "Material obtenido exitosamente", material);

    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

/**
 * PUT /api/materiales/:id
 * Actualizar material
 */
export async function updateMaterial(req, res) {
    try {
        const { id } = req.params;
        const datosActualizados = req.body;

        const [material, error] = await updateMaterialService(
            parseInt(id),
            datosActualizados
        );

        if (error) return handleErrorClient(res, 404, error);

        handleSuccess(res, 200, "Material actualizado exitosamente", material);

    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

/**
 * PATCH /api/materiales/:id/stock
 * Actualizar stock de material
 * Body: { cantidad: number, operacion: 'add' | 'subtract' | 'set' }
 */
export async function updateStockMaterial(req, res) {
    try {
        const { id } = req.params;
        const { cantidad, operacion } = req.body;

        if (cantidad === undefined || cantidad === null) {
            return handleErrorClient(res, 400, "La cantidad es requerida");
        }

        if (cantidad < 0) {
            return handleErrorClient(res, 400, "La cantidad no puede ser negativa");
        }

        const [material, error] = await updateStockMaterialService(
            parseInt(id),
            cantidad,
            operacion || 'set'
        );

        if (error) return handleErrorClient(res, 400, error);

        handleSuccess(res, 200, "Stock actualizado exitosamente", material);

    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

/**
 * DELETE /api/materiales/:id
 * Desactivar material
 */
export async function deleteMaterial(req, res) {
    try {
        const { id } = req.params;

        const [material, error] = await deleteMaterialService(parseInt(id));

        if (error) return handleErrorClient(res, 404, error);

        handleSuccess(res, 200, "Material desactivado exitosamente", material);

    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

/**
 * GET /api/materiales/alertas/bajo-stock
 * Obtener materiales con stock bajo
 */
export async function getMaterialesBajoStock(req, res) {
    try {
        const [materiales, error] = await getMaterialesBajoStockService();

        if (error) return handleErrorServer(res, 500, error);

        handleSuccess(res, 200, "Materiales bajo stock obtenidos", materiales);

    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

/**
 * GET /api/materiales/alertas/stock
 * Obtener alertas de stock categorizadas
 */
export async function getAlertasStock(req, res) {
    try {
        const [alertas, error] = await getAlertasStockService();

        if (error) return handleErrorServer(res, 500, error);

        handleSuccess(res, 200, "Alertas de stock obtenidas", alertas);

    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}