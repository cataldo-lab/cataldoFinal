"use strict";
import {
    createClienteService,
    getClientesService,
    getClienteByIdService,
    updateClienteService,
    getHistorialOperacionesService,
    getEstadisticasClienteService,
    getCategoriasClienteService
} from "../../services/gerente&Trabajador/cliente.service.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess
} from "../../handlers/responseHandlers.js";

/**
 * POST /api/clientes
 * Crear un nuevo cliente
 */
export async function createCliente(req, res) {
    try {
        const clienteData = req.body;

        const [cliente, error] = await createClienteService(clienteData);

        if (error) return handleErrorClient(res, 400, error);

        handleSuccess(res, 201, "Cliente creado exitosamente", cliente);

    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

/**
 * GET /api/clientes
 * Obtener todos los clientes
 */
export async function getClientes(req, res) {
    try {
        const filtros = {
            categoria_cliente: req.query.categoria,
            comuna: req.query.comuna,
            search: req.query.search
        };

        // Limpiar filtros vacíos
        Object.keys(filtros).forEach(key => {
            if (!filtros[key]) delete filtros[key];
        });

        const [clientes, error] = await getClientesService(filtros);

        if (error) return handleErrorServer(res, 500, error);

        handleSuccess(res, 200, "Clientes obtenidos exitosamente", clientes);

    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

/**
 * GET /api/clientes/:id
 * Obtener un cliente por ID
 */
export async function getClienteById(req, res) {
    try {
        const { id } = req.params;

        const [cliente, error] = await getClienteByIdService(parseInt(id));

        if (error) return handleErrorClient(res, 404, error);

        handleSuccess(res, 200, "Cliente obtenido exitosamente", cliente);

    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

/**
 * PUT /api/clientes/:id
 * Actualizar cliente
 */
export async function updateCliente(req, res) {
    try {
        const { id } = req.params;
        const datosActualizados = req.body;

        const [cliente, error] = await updateClienteService(
            parseInt(id),
            datosActualizados
        );

        if (error) return handleErrorClient(res, 404, error);

        handleSuccess(res, 200, "Cliente actualizado exitosamente", cliente);

    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

/**
 * GET /api/clientes/:id/operaciones
 * Obtener historial de operaciones del cliente
 */
export async function getHistorialOperaciones(req, res) {
    try {
        const { id } = req.params;

        const [operaciones, error] = await getHistorialOperacionesService(parseInt(id));

        if (error) return handleErrorServer(res, 500, error);

        handleSuccess(res, 200, "Historial obtenido exitosamente", operaciones);

    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

/**
 * GET /api/clientes/:id/estadisticas
 * Obtener estadísticas del cliente
 */
export async function getEstadisticasCliente(req, res) {
    try {
        const { id } = req.params;

        const [estadisticas, error] = await getEstadisticasClienteService(parseInt(id));

        if (error) return handleErrorClient(res, 404, error);

        handleSuccess(res, 200, "Estadísticas obtenidas exitosamente", estadisticas);

    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

/**
 * GET /api/clientes/categorias
 * Obtener categorías disponibles
 */
export async function getCategorias(req, res) {
    try {
        const [categorias, error] = await getCategoriasClienteService();

        if (error) return handleErrorServer(res, 500, error);

        handleSuccess(res, 200, "Categorías obtenidas exitosamente", categorias);

    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}