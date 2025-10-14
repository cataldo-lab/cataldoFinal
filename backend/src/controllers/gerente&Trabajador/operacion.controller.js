"use strict";
import {
    createOperacionService,
    getOperacionesService,
    getOperacionByIdService,
    updateEstadoOperacionService,
    updateOperacionService,
    deleteOperacionService,
    getDashboardStatsService
} from "../../services/gerente&Trabajador/operacion.service.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess
} from "../../handlers/responseHandlers.js";

/**
 * POST /api/operaciones
 * Crear una nueva operación
 */
export async function createOperacion(req, res) {
    try {
        const operacionData = req.body;

        const [operacion, error] = await createOperacionService(operacionData);

        if (error) return handleErrorClient(res, 400, error);

        handleSuccess(res, 201, "Operación creada exitosamente", operacion);

    } catch (error) {
        handleErrorServer(res, error);
    }
}

/**
 * GET /api/operaciones
 * Obtener todas las operaciones con filtros opcionales
 * Query params: estado_operacion, id_cliente, fecha_desde, fecha_hasta
 */
export async function getOperaciones(req, res) {
    try {
        const filtros = {
            estado_operacion: req.query.estado_operacion,
            id_cliente: req.query.id_cliente ? parseInt(req.query.id_cliente) : null,
            fecha_desde: req.query.fecha_desde,
            fecha_hasta: req.query.fecha_hasta
        };

        // Limpiar filtros vacíos
        Object.keys(filtros).forEach(key => {
            if (!filtros[key]) delete filtros[key];
        });

        const [operaciones, error] = await getOperacionesService(filtros);

        if (error) return handleErrorServer(res, error);

        handleSuccess(res, 200, "Operaciones obtenidas exitosamente", operaciones);

    } catch (error) {
        handleErrorServer(res, error);
    }
}

/**
 * GET /api/operaciones/:id
 * Obtener una operación por ID
 */
export async function getOperacionById(req, res) {
    try {
        const { id } = req.params;

        const [operacion, error] = await getOperacionByIdService(parseInt(id));

        if (error) return handleErrorClient(res, 404, error);

        handleSuccess(res, 200, "Operación obtenida exitosamente", operacion);

    } catch (error) {
        handleErrorServer(res, error);
    }
}

/**
 * PATCH /api/operaciones/:id/estado
 * Actualizar estado de operación
 * Body: { estado: "nuevo_estado" }
 */
export async function updateEstadoOperacion(req, res) {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (!estado) {
            return handleErrorClient(res, 400, "El campo 'estado' es requerido");
        }

        const [operacion, error] = await updateEstadoOperacionService(
            parseInt(id),
            estado
        );

        if (error) return handleErrorClient(res, 400, error);

        handleSuccess(res, 200, "Estado actualizado exitosamente", operacion);

    } catch (error) {
        handleErrorServer(res, error);
    }
}

/**
 * PUT /api/operaciones/:id
 * Actualizar operación
 */
export async function updateOperacion(req, res) {
    try {
        const { id } = req.params;
        const datosActualizados = req.body;

        const [operacion, error] = await updateOperacionService(
            parseInt(id),
            datosActualizados
        );

        if (error) return handleErrorClient(res, 404, error);

        handleSuccess(res, 200, "Operación actualizada exitosamente", operacion);

    } catch (error) {
        handleErrorServer(res, error);
    }
}

/**
 * DELETE /api/operaciones/:id
 * Anular operación
 */
export async function deleteOperacion(req, res) {
    try {
        const { id } = req.params;

        const [operacion, error] = await deleteOperacionService(parseInt(id));

        if (error) return handleErrorClient(res, 404, error);

        handleSuccess(res, 200, "Operación anulada exitosamente", operacion);

    } catch (error) {
        handleErrorServer(res, error);
    }
}

/**
 * GET /api/operaciones/dashboard/stats
 * Obtener estadísticas para el dashboard
 */
export async function getDashboardStats(req, res) {
    try {
        const [stats, error] = await getDashboardStatsService();

        if (error) return handleErrorServer(res, error);

        handleSuccess(res, 200, "Estadísticas obtenidas exitosamente", stats);

    } catch (error) {
        handleErrorServer(res, error);
    }
}