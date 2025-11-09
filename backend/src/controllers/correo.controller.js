"use strict";
import {
  enviarCorreo,
  getHistorialCorreos,
  getCorreoById,
  getEstadisticasCorreos
} from "../services/correo.service.js";

/**
 * Controlador para enviar un correo electrónico
 */
export async function enviarCorreoController(req, res) {
  try {
    const { destinatario, asunto, mensaje, tipo } = req.body;

    // Validar datos requeridos
    if (!destinatario || !asunto || !mensaje) {
      return res.status(400).json({
        success: false,
        message: "Los campos destinatario, asunto y mensaje son obligatorios"
      });
    }

    // Obtener ID del usuario autenticado (si existe)
    const id_usuario_emisor = req.user?.id || null;

    // Enviar correo
    const resultado = await enviarCorreo({
      destinatario,
      asunto,
      mensaje,
      tipo: tipo || "personalizado",
      id_usuario_emisor
    });

    return res.status(resultado.success ? 200 : 500).json(resultado);

  } catch (error) {
    console.error("Error en enviarCorreoController:", error);
    return res.status(500).json({
      success: false,
      message: "Error al enviar correo",
      error: error.message
    });
  }
}

/**
 * Controlador para obtener el historial de correos
 */
export async function getHistorialCorreosController(req, res) {
  try {
    const {
      destinatario,
      estado,
      tipo,
      fecha_desde,
      fecha_hasta,
      page,
      limit
    } = req.query;

    const filtros = {
      destinatario,
      estado,
      tipo,
      fecha_desde: fecha_desde ? new Date(fecha_desde) : undefined,
      fecha_hasta: fecha_hasta ? new Date(fecha_hasta) : undefined,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20
    };

    const resultado = await getHistorialCorreos(filtros);

    return res.status(resultado.success ? 200 : 500).json(resultado);

  } catch (error) {
    console.error("Error en getHistorialCorreosController:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener historial de correos",
      error: error.message
    });
  }
}

/**
 * Controlador para obtener un correo por ID
 */
export async function getCorreoByIdController(req, res) {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de correo inválido"
      });
    }

    const resultado = await getCorreoById(parseInt(id));

    return res.status(resultado.success ? 200 : 404).json(resultado);

  } catch (error) {
    console.error(`Error en getCorreoByIdController (ID: ${req.params.id}):`, error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener correo",
      error: error.message
    });
  }
}

/**
 * Controlador para obtener estadísticas de correos
 */
export async function getEstadisticasCorreosController(req, res) {
  try {
    const resultado = await getEstadisticasCorreos();

    return res.status(resultado.success ? 200 : 500).json(resultado);

  } catch (error) {
    console.error("Error en getEstadisticasCorreosController:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas",
      error: error.message
    });
  }
}
