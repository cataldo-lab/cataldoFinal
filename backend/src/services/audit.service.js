// backend/src/services/audit.service.js
"use strict";
import { AppDataSource } from "../config/configDb.js";
import { TipoEvento, NivelSeveridad } from "../entity/audit_log.entity.js";

/**
 * Registra un evento en el log de auditoría
 * @param {Object} eventData - Datos del evento
 * @returns {Promise<[Object|null, string|null]>}
 */
export async function logAuditEvent(eventData) {
  try {
    const auditRepository = AppDataSource.getRepository("AuditLog");
    
    // Buscar el usuario si se proporciona email
    let usuario = null;
    if (eventData.email) {
      const userRepository = AppDataSource.getRepository("User");
      usuario = await userRepository.findOne({ 
        where: { email: eventData.email } 
      });
    }
    
    const log = auditRepository.create({
      tipo_evento: eventData.tipo,
      email_usuario: eventData.email || null,
      usuario: usuario,
      ip_address: eventData.ip || null,
      user_agent: eventData.userAgent || null,
      descripcion: eventData.descripcion || null,
      entidad_afectada: eventData.entidad || null,
      id_entidad_afectada: eventData.idEntidad || null,
      datos_antes: eventData.datosAntes || null,
      datos_despues: eventData.datosDespues || null,
      nivel: eventData.nivel || NivelSeveridad.INFO,
      exito: eventData.exito !== false
    });
    
    await auditRepository.save(log);
    return [log, null];
  } catch (error) {
    console.error("Error al registrar evento de auditoría:", error);
    return [null, error.message];
  }
}

/**
 * Obtiene logs del sistema con filtros
 * @param {Object} filtros - Filtros para la búsqueda
 * @returns {Promise<[Array|null, string|null]>}
 */
export async function getSystemLogs(filtros = {}) {
  try {
    const auditRepository = AppDataSource.getRepository("AuditLog");
    
    const where = {};
    if (filtros.tipo_evento) where.tipo_evento = filtros.tipo_evento;
    if (filtros.nivel) where.nivel = filtros.nivel;
    if (filtros.entidad) where.entidad_afectada = filtros.entidad;
    if (filtros.email) where.email_usuario = filtros.email;
    if (filtros.exito !== undefined) where.exito = filtros.exito;
    
    const logs = await auditRepository.find({
      where,
      relations: ["usuario"],
      order: { fecha_hora: "DESC" },
      take: filtros.limit || 100
    });
    
    // Formatear respuesta para ocultar passwords
    const logsFormateados = logs.map(log => {
      const logData = { ...log };
      if (logData.usuario && logData.usuario.password) {
        delete logData.usuario.password;
      }
      return logData;
    });
    
    return [logsFormateados, null];
  } catch (error) {
    console.error("Error al obtener logs del sistema:", error);
    return [null, error.message];
  }
}

/**
 * Obtiene la actividad de un usuario específico
 * @param {number} userId - ID del usuario
 * @returns {Promise<[Array|null, string|null]>}
 */
export async function getUserActivityLog(userId) {
  try {
    const auditRepository = AppDataSource.getRepository("AuditLog");
    const userRepository = AppDataSource.getRepository("User");
    
    // Verificar que el usuario existe
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return [null, "Usuario no encontrado"];
    }
    
    const logs = await auditRepository.find({
      where: { usuario: { id: userId } },
      relations: ["usuario"],
      order: { fecha_hora: "DESC" }
    });
    
    // Formatear respuesta
    const logsFormateados = logs.map(log => {
      const logData = { ...log };
      if (logData.usuario && logData.usuario.password) {
        delete logData.usuario.password;
      }
      return logData;
    });
    
    return [logsFormateados, null];
  } catch (error) {
    console.error("Error al obtener actividad del usuario:", error);
    return [null, error.message];
  }
}

/**
 * Obtiene intentos de login fallidos
 * @param {number} limit - Cantidad de registros a obtener
 * @returns {Promise<[Array|null, string|null]>}
 */
export async function getFailedLoginAttempts(limit = 50) {
  try {
    const auditRepository = AppDataSource.getRepository("AuditLog");
    
    const logs = await auditRepository.find({
      where: {
        tipo_evento: TipoEvento.LOGIN_FAILED
      },
      order: { fecha_hora: "DESC" },
      take: limit
    });
    
    return [logs, null];
  } catch (error) {
    console.error("Error al obtener intentos fallidos de login:", error);
    return [null, error.message];
  }
}

/**
 * Obtiene el historial de una entidad específica
 * @param {string} entidad - Nombre de la entidad
 * @param {number} idEntidad - ID de la entidad
 * @returns {Promise<[Array|null, string|null]>}
 */
export async function getEntityHistory(entidad, idEntidad) {
  try {
    const auditRepository = AppDataSource.getRepository("AuditLog");
    
    const logs = await auditRepository.find({
      where: {
        entidad_afectada: entidad,
        id_entidad_afectada: idEntidad
      },
      relations: ["usuario"],
      order: { fecha_hora: "ASC" }
    });
    
    // Formatear respuesta
    const logsFormateados = logs.map(log => {
      const logData = { ...log };
      if (logData.usuario && logData.usuario.password) {
        delete logData.usuario.password;
      }
      return logData;
    });
    
    return [logsFormateados, null];
  } catch (error) {
    console.error("Error al obtener historial de entidad:", error);
    return [null, error.message];
  }
}

// Exportar tipos para uso en otros servicios
export { TipoEvento, NivelSeveridad };