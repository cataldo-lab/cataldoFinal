"use strict";
import {
  enviarCorreoService,
  obtenerHistorialCorreosService,
  obtenerCorreoPorIdService,
  enviarCorreoMasivoService,
  obtenerPlantillasCorreo,
  enviarCorreosCumpleanosService
} from "../services/correo.service.js";
import { ejecutarEnvioCumpleanosManual } from "../services/cumpleanos.cron.js";
import {
  enviarCorreoValidation,
  enviarCorreoMasivoValidation,
  filtrosHistorialValidation
} from "../validations/correo.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";
import { logAuditEvent, TipoEvento, NivelSeveridad } from "../services/audit.service.js";

/**
 * Envía un correo electrónico
 */
export async function enviarCorreo(req, res) {
  try {
    const { body } = req;
    const idRemitente = req.user?.id;
    const email = req.user?.email;
    const ip = req.ip || req.connection.remoteAddress;

    // Validar entrada
    const { error } = enviarCorreoValidation.validate(body);
    if (error) {
      return handleErrorClient(res, 400, "Error de validación", error.message);
    }

    // Enviar correo
    const [correo, errorCorreo] = await enviarCorreoService({
      ...body,
      idRemitente
    });

    if (errorCorreo) {
      await logAuditEvent({
        tipo: TipoEvento.EMAIL_SENT,
        email: email,
        ip: ip,
        descripcion: `Error al enviar correo a ${body.destinatario}: ${errorCorreo}`,
        entidad: "Correo",
        nivel: NivelSeveridad.ERROR,
        exito: false
      });

      return handleErrorClient(res, 400, "Error al enviar correo", errorCorreo);
    }

    // Registrar auditoría
    await logAuditEvent({
      tipo: TipoEvento.EMAIL_SENT,
      email: email,
      ip: ip,
      descripcion: `Correo enviado a ${body.destinatario} - Asunto: ${body.asunto}`,
      entidad: "Correo",
      idEntidad: correo.id_correo,
      datosDespues: {
        destinatario: correo.destinatario,
        asunto: correo.asunto,
        tipo: correo.tipo
      },
      nivel: NivelSeveridad.INFO,
      exito: true
    });

    handleSuccess(res, 200, "Correo enviado exitosamente", correo);
  } catch (error) {
    console.error("Error en enviarCorreo:", error);
    handleErrorServer(res, 500, error.message);
  }
}

/**
 * Obtiene el historial de correos enviados
 */
export async function obtenerHistorial(req, res) {
  try {
    const { query } = req;
    const idRemitente = req.user?.id;

    // Validar filtros
    const { error } = filtrosHistorialValidation.validate(query);
    if (error) {
      return handleErrorClient(res, 400, "Error de validación", error.message);
    }

    // Obtener historial
    const [historial, errorHistorial] = await obtenerHistorialCorreosService({
      ...query,
      idRemitente
    });

    if (errorHistorial) {
      return handleErrorClient(res, 400, "Error al obtener historial", errorHistorial);
    }

    handleSuccess(res, 200, "Historial obtenido exitosamente", historial);
  } catch (error) {
    console.error("Error en obtenerHistorial:", error);
    handleErrorServer(res, 500, error.message);
  }
}

/**
 * Obtiene un correo por ID
 */
export async function obtenerCorreoPorId(req, res) {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return handleErrorClient(res, 400, "Error de validación", "ID inválido");
    }

    const [correo, errorCorreo] = await obtenerCorreoPorIdService(parseInt(id));

    if (errorCorreo) {
      return handleErrorClient(res, 404, "Correo no encontrado", errorCorreo);
    }

    handleSuccess(res, 200, "Correo obtenido exitosamente", correo);
  } catch (error) {
    console.error("Error en obtenerCorreoPorId:", error);
    handleErrorServer(res, 500, error.message);
  }
}

/**
 * Envía correos masivos
 */
export async function enviarCorreoMasivo(req, res) {
  try {
    const { body } = req;
    const idRemitente = req.user?.id;
    const email = req.user?.email;
    const ip = req.ip || req.connection.remoteAddress;

    // Validar entrada
    const { error } = enviarCorreoMasivoValidation.validate(body);
    if (error) {
      return handleErrorClient(res, 400, "Error de validación", error.message);
    }

    // Enviar correos
    const [resultado, errorResultado] = await enviarCorreoMasivoService({
      ...body,
      idRemitente
    });

    if (errorResultado) {
      return handleErrorClient(res, 400, "Error al enviar correos", errorResultado);
    }

    // Registrar auditoría
    await logAuditEvent({
      tipo: TipoEvento.EMAIL_SENT,
      email: email,
      ip: ip,
      descripcion: `Envío masivo: ${resultado.exitosos.length} exitosos, ${resultado.fallidos.length} fallidos - Asunto: ${body.asunto}`,
      entidad: "Correo",
      datosDespues: {
        total_destinatarios: body.destinatarios.length,
        exitosos: resultado.exitosos.length,
        fallidos: resultado.fallidos.length,
        asunto: body.asunto,
        tipo: body.tipo
      },
      nivel: resultado.fallidos.length > 0 ? NivelSeveridad.WARNING : NivelSeveridad.INFO,
      exito: true
    });

    handleSuccess(res, 200, "Envío masivo completado", resultado);
  } catch (error) {
    console.error("Error en enviarCorreoMasivo:", error);
    handleErrorServer(res, 500, error.message);
  }
}

/**
 * Obtiene las plantillas de correos disponibles
 */
export async function obtenerPlantillas(req, res) {
  try {
    const plantillas = obtenerPlantillasCorreo();
    handleSuccess(res, 200, "Plantillas obtenidas exitosamente", plantillas);
  } catch (error) {
    console.error("Error en obtenerPlantillas:", error);
    handleErrorServer(res, 500, error.message);
  }
}

/**
 * Envía correos de cumpleaños manualmente
 * Busca clientes que cumplen años hoy y les envía correo automático
 */
export async function enviarCorreosCumpleanos(req, res) {
  try {
    const idRemitente = req.user?.id;
    const email = req.user?.email;
    const ip = req.ip || req.connection.remoteAddress;

    console.log('🎂 Ejecutando envío manual de correos de cumpleaños...');

    // Enviar correos de cumpleaños
    const [resultado, errorResultado] = await enviarCorreosCumpleanosService(idRemitente);

    if (errorResultado) {
      await logAuditEvent({
        tipo: TipoEvento.EMAIL_SENT,
        email: email,
        ip: ip,
        descripcion: `Error al enviar correos de cumpleaños: ${errorResultado}`,
        entidad: "Correo",
        nivel: NivelSeveridad.ERROR,
        exito: false
      });

      return handleErrorClient(res, 400, "Error al enviar correos de cumpleaños", errorResultado);
    }

    // Registrar auditoría
    await logAuditEvent({
      tipo: TipoEvento.EMAIL_SENT,
      email: email,
      ip: ip,
      descripcion: `Envío de correos de cumpleaños: ${resultado.exitosos.length}/${resultado.total} exitosos`,
      entidad: "Correo",
      datosDespues: {
        total: resultado.total,
        exitosos: resultado.exitosos.length,
        fallidos: resultado.fallidos.length
      },
      nivel: resultado.fallidos.length > 0 ? NivelSeveridad.WARNING : NivelSeveridad.INFO,
      exito: true
    });

    handleSuccess(res, 200, "Correos de cumpleaños procesados", resultado);
  } catch (error) {
    console.error("Error en enviarCorreosCumpleanos:", error);
    handleErrorServer(res, 500, error.message);
  }
}
