"use strict";
import { 
    getClientesConComprasService, 
    getClienteConComprasByIdService 
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