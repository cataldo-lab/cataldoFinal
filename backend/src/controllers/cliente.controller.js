"use strict";
import {
  getMisOperacionesService,
  getMiOperacionByIdService,
  getMiPerfilService,
} from "../services/cliente.service.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

/**
 * Controlador para obtener todas las operaciones del cliente autenticado
 */
export async function getMisOperaciones(req, res) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return handleErrorClient(res, 401, "Usuario no autenticado");
    }

    // Obtener filtros opcionales de query params
    const { estado_operacion, fecha_desde, fecha_hasta } = req.query;

    const filtros = {};
    if (estado_operacion) filtros.estado_operacion = estado_operacion;
    if (fecha_desde) filtros.fecha_desde = fecha_desde;
    if (fecha_hasta) filtros.fecha_hasta = fecha_hasta;

    const [operaciones, error] = await getMisOperacionesService(userId, filtros);

    if (error) {
      return handleErrorClient(res, 404, error);
    }

    if (operaciones.length === 0) {
      return handleSuccess(res, 200, "No tienes pedidos registrados", []);
    }

    return handleSuccess(
      res,
      200,
      "Pedidos obtenidos correctamente",
      operaciones
    );
  } catch (error) {
    console.error("Error en getMisOperaciones controller:", error);
    return handleErrorServer(res, 500, error.message);
  }
}

/**
 * Controlador para obtener una operación específica del cliente autenticado
 */
export async function getMiOperacion(req, res) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return handleErrorClient(res, 401, "Usuario no autenticado");
    }

    if (!id || isNaN(id)) {
      return handleErrorClient(res, 400, "ID de operación inválido");
    }

    const [operacion, error] = await getMiOperacionByIdService(
      userId,
      parseInt(id)
    );

    if (error) {
      return handleErrorClient(res, 404, error);
    }

    return handleSuccess(
      res,
      200,
      "Pedido obtenido correctamente",
      operacion
    );
  } catch (error) {
    console.error("Error en getMiOperacion controller:", error);
    return handleErrorServer(res, 500, error.message);
  }
}

/**
 * Controlador para obtener el perfil del cliente autenticado
 */
export async function getMiPerfil(req, res) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return handleErrorClient(res, 401, "Usuario no autenticado");
    }

    const [perfil, error] = await getMiPerfilService(userId);

    if (error) {
      return handleErrorClient(res, 404, error);
    }

    return handleSuccess(res, 200, "Perfil obtenido correctamente", perfil);
  } catch (error) {
    console.error("Error en getMiPerfil controller:", error);
    return handleErrorServer(res, 500, error.message);
  }
}
