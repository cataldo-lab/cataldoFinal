// backend/src/controllers/audit.controller.js
"use strict";
import {
  getSystemLogs,
  getUserActivityLog,
  getFailedLoginAttempts,
  getEntityHistory
} from "../services/audit.service.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

/**
 * Obtener logs generales del sistema
 */
export async function getAuditLogs(req, res) {
  try {
    const { tipo_evento, nivel, entidad, email, limit, exito } = req.query;
    
    const filtros = {
      tipo_evento,
      nivel,
      entidad,
      email,
      limit: limit ? parseInt(limit) : 100,
      exito: exito !== undefined ? exito === 'true' : undefined
    };
    
    const [logs, error] = await getSystemLogs(filtros);
    
    if (error) {
      return handleErrorClient(res, 500, "Error al obtener logs del sistema", error);
    }
    
    if (!logs || logs.length === 0) {
      return handleSuccess(res, 200, "No se encontraron logs con los filtros especificados", []);
    }
    
    handleSuccess(res, 200, "Logs del sistema obtenidos exitosamente", logs);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

/**
 * Obtener actividad de un usuario específico
 */
export async function getUserActivity(req, res) {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return handleErrorClient(res, 400, "ID de usuario inválido");
    }
    
    const [logs, error] = await getUserActivityLog(parseInt(id));
    
    if (error) {
      return handleErrorClient(res, 404, error);
    }
    
    if (!logs || logs.length === 0) {
      return handleSuccess(res, 200, "El usuario no tiene actividad registrada", []);
    }
    
    handleSuccess(res, 200, "Actividad del usuario obtenida exitosamente", logs);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

/**
 * Obtener intentos de login fallidos
 */
export async function getFailedLogins(req, res) {
  try {
    const { limit } = req.query;
    
    const [logs, error] = await getFailedLoginAttempts(
      limit ? parseInt(limit) : 50
    );
    
    if (error) {
      return handleErrorClient(res, 500, "Error al obtener intentos fallidos", error);
    }
    
    if (!logs || logs.length === 0) {
      return handleSuccess(res, 200, "No hay intentos fallidos de login", []);
    }
    
    handleSuccess(res, 200, "Intentos fallidos obtenidos exitosamente", logs);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

/**
 * Obtener historial de una entidad específica
 */
export async function getEntityAuditHistory(req, res) {
  try {
    const { entidad, id } = req.params;
    
    if (!entidad || !id || isNaN(id)) {
      return handleErrorClient(res, 400, "Parámetros inválidos");
    }
    
    const [logs, error] = await getEntityHistory(entidad, parseInt(id));
    
    if (error) {
      return handleErrorClient(res, 500, "Error al obtener historial", error);
    }
    
    if (!logs || logs.length === 0) {
      return handleSuccess(res, 200, `No hay historial para ${entidad} #${id}`, []);
    }
    
    handleSuccess(res, 200, `Historial de ${entidad} #${id} obtenido exitosamente`, logs);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}