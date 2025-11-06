"use strict";
import {
    getClientesConComprasService,
    getClienteConComprasByIdService,
    getClientesConComprasPorFechasService,
    getEstadisticasAvanzadasService,
    createOperacionConProductosService
} from "../../services/staff/papeles.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../../handlers/responseHandlers.js";


export async function getClientesConCompras(req, res) {
    try {
        const result = await getClientesConComprasService();

        if (!result.success) {
            return handleErrorClient(res, 404, result.message);
        }

        handleSuccess(res, 200, result.message, result.data, {
            count: result.count,
            estadisticas_generales: result.estadisticas_generales
        });
    } catch (error) {
        handleErrorServer(res, error.message);
    }
}


export async function getClienteConComprasById(req, res) {
    try {
        const { id } = req.params;

        const id_usuario = parseInt(id, 10);
        if (isNaN(id_usuario)) {
            return handleErrorClient(res, 400, "El ID del cliente debe ser un número válido");
        }

        const result = await getClienteConComprasByIdService(id_usuario);

        if (!result.success) {
            return handleErrorClient(res, 404, result.message);
        }

        handleSuccess(res, 200, result.message, result.data);
    } catch (error) {
        handleErrorServer(res, error.message);
    }
}

/**
 * Obtiene clientes con compras filtrado por rango de fechas
 */
export async function getClientesConComprasPorFechas(req, res) {
    try {
        const { fecha_inicio, fecha_fin } = req.query;

        const result = await getClientesConComprasPorFechasService(fecha_inicio, fecha_fin);

        if (!result.success) {
            return handleErrorClient(res, 404, result.message);
        }

        handleSuccess(res, 200, result.message, result.data, {
            count: result.count,
            periodo: result.periodo,
            totales: result.totales
        });
    } catch (error) {
        handleErrorServer(res, error.message);
    }
}

/**
 * Obtiene estadísticas avanzadas por periodo
 */
export async function getEstadisticasAvanzadas(req, res) {
    try {
        const { fecha_inicio, fecha_fin } = req.query;

        const result = await getEstadisticasAvanzadasService(fecha_inicio, fecha_fin);

        if (!result.success) {
            return handleErrorClient(res, 404, result.message);
        }

        handleSuccess(res, 200, result.message, result.data);
    } catch (error) {
        handleErrorServer(res, error.message);
    }
}

/**
 * Crea una nueva operación enlazada con productos
 * Usa la tabla intermedia ProductoOperacion (N:N)
 */
export async function createOperacionConProductos(req, res) {
    try {
        const { operacion, productos } = req.body;

        // Validar que se recibieron los datos necesarios
        if (!operacion) {
            return handleErrorClient(res, 400, "Faltan datos de la operación");
        }

        if (!operacion.id_cliente) {
            return handleErrorClient(res, 400, "El ID del cliente es requerido");
        }

        if (!productos || !Array.isArray(productos) || productos.length === 0) {
            return handleErrorClient(res, 400, "Debe incluir al menos un producto");
        }

        // Validar estructura de productos
        for (let i = 0; i < productos.length; i++) {
            const prod = productos[i];
            if (!prod.id_producto) {
                return handleErrorClient(res, 400, `El producto en la posición ${i} no tiene id_producto`);
            }
            if (!prod.cantidad || prod.cantidad <= 0) {
                return handleErrorClient(res, 400, `El producto en la posición ${i} debe tener cantidad mayor a 0`);
            }
        }

        const result = await createOperacionConProductosService(operacion, productos);

        if (!result.success) {
            return handleErrorClient(res, 400, result.message);
        }

        handleSuccess(res, 201, result.message, result.data);
    } catch (error) {
        handleErrorServer(res, error.message);
    }
}