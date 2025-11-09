"use strict";
import nodemailer from "nodemailer";
import { AppDataSource } from "../config/configDb.js";
import Correo from "../entity/correo.entity.js";
import User from "../entity/personas/user.entity.js";
import { EstadoEnvio, TipoCorreo } from "../entity/correo.entity.js";

// Configurar el transportador de nodemailer
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true para 465, false para otros puertos
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

/**
 * Envía un correo electrónico y registra el historial
 * @param {Object} data - Datos del correo
 * @param {string} data.destinatario - Email del destinatario
 * @param {string} data.asunto - Asunto del correo
 * @param {string} data.mensaje - Contenido del mensaje
 * @param {string} data.tipo - Tipo de plantilla
 * @param {number} data.idRemitente - ID del usuario que envía
 * @param {number} data.idCliente - ID del cliente destinatario (opcional)
 * @param {number} data.idOperacion - ID de la operación relacionada (opcional)
 * @returns {Promise<Array>} [correo, error]
 */
export async function enviarCorreoService(data) {
  try {
    const correoRepository = AppDataSource.getRepository(Correo);
    const userRepository = AppDataSource.getRepository(User);

    const { destinatario, asunto, mensaje, tipo, idRemitente, idCliente, idOperacion } = data;

    // Validar que el remitente existe
    const remitente = await userRepository.findOne({
      where: { id: idRemitente }
    });

    if (!remitente) {
      return [null, "El remitente no existe"];
    }

    // Validar que el cliente existe (si se proporciona)
    let cliente = null;
    if (idCliente) {
      cliente = await userRepository.findOne({
        where: { id: idCliente }
      });

      if (!cliente) {
        return [null, "El cliente no existe"];
      }
    }

    // Crear registro de correo en la base de datos
    const nuevoCorreo = correoRepository.create({
      destinatario,
      asunto,
      mensaje,
      tipo: tipo || TipoCorreo.PERSONALIZADO,
      estado_envio: EstadoEnvio.PENDIENTE,
      remitente: remitente,
      cliente: cliente,
      operacion: idOperacion ? { id_operacion: idOperacion } : null
    });

    try {
      // Configurar y enviar el correo
      const transporter = createTransporter();

      const mailOptions = {
        from: `"Cataldo Lab" <${process.env.EMAIL_USER}>`,
        to: destinatario,
        subject: asunto,
        text: mensaje,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #78716c; color: white; padding: 20px; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0;">Cataldo Lab</h1>
            </div>
            <div style="background-color: #f5f5f4; padding: 30px; border-radius: 0 0 10px 10px;">
              <div style="background-color: white; padding: 20px; border-radius: 8px;">
                ${mensaje.split('\n').map(line => `<p>${line}</p>`).join('')}
              </div>
              <div style="margin-top: 20px; text-align: center; color: #78716c; font-size: 12px;">
                <p>Este es un correo automático, por favor no responder.</p>
                <p>&copy; ${new Date().getFullYear()} Cataldo Lab. Todos los derechos reservados.</p>
              </div>
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);

      // Actualizar estado a enviado
      nuevoCorreo.estado_envio = EstadoEnvio.ENVIADO;
      await correoRepository.save(nuevoCorreo);

      return [nuevoCorreo, null];
    } catch (error) {
      // Si falla el envío, actualizar estado a fallido
      nuevoCorreo.estado_envio = EstadoEnvio.FALLIDO;
      nuevoCorreo.error_mensaje = error.message;
      await correoRepository.save(nuevoCorreo);

      console.error("Error al enviar correo:", error);
      return [null, `Error al enviar correo: ${error.message}`];
    }
  } catch (error) {
    console.error("Error en enviarCorreoService:", error);
    return [null, "Error interno del servidor"];
  }
}

/**
 * Obtiene el historial de correos con filtros opcionales
 * @param {Object} filtros - Filtros de búsqueda
 * @param {number} filtros.idRemitente - ID del remitente
 * @param {number} filtros.idCliente - ID del cliente
 * @param {string} filtros.estado - Estado del envío
 * @param {string} filtros.tipo - Tipo de correo
 * @param {Date} filtros.fechaInicio - Fecha inicio
 * @param {Date} filtros.fechaFin - Fecha fin
 * @param {number} filtros.limit - Límite de resultados
 * @param {number} filtros.offset - Offset para paginación
 * @returns {Promise<Array>} [historial, error]
 */
export async function obtenerHistorialCorreosService(filtros = {}) {
  try {
    const correoRepository = AppDataSource.getRepository(Correo);

    const {
      idRemitente,
      idCliente,
      estado,
      tipo,
      fechaInicio,
      fechaFin,
      limit = 50,
      offset = 0
    } = filtros;

    const queryBuilder = correoRepository.createQueryBuilder("correo")
      .leftJoinAndSelect("correo.remitente", "remitente")
      .leftJoinAndSelect("correo.cliente", "cliente")
      .leftJoinAndSelect("correo.operacion", "operacion");

    // Aplicar filtros
    if (idRemitente) {
      queryBuilder.andWhere("correo.id_remitente = :idRemitente", { idRemitente });
    }

    if (idCliente) {
      queryBuilder.andWhere("correo.id_cliente = :idCliente", { idCliente });
    }

    if (estado) {
      queryBuilder.andWhere("correo.estado_envio = :estado", { estado });
    }

    if (tipo) {
      queryBuilder.andWhere("correo.tipo = :tipo", { tipo });
    }

    if (fechaInicio) {
      queryBuilder.andWhere("correo.fecha_envio >= :fechaInicio", { fechaInicio });
    }

    if (fechaFin) {
      queryBuilder.andWhere("correo.fecha_envio <= :fechaFin", { fechaFin });
    }

    // Ordenar por fecha descendente
    queryBuilder.orderBy("correo.fecha_envio", "DESC");

    // Paginación
    queryBuilder.skip(offset).take(limit);

    const [correos, total] = await queryBuilder.getManyAndCount();

    return [{
      correos,
      total,
      limit,
      offset
    }, null];
  } catch (error) {
    console.error("Error en obtenerHistorialCorreosService:", error);
    return [null, "Error al obtener historial de correos"];
  }
}

/**
 * Obtiene un correo por ID
 * @param {number} id - ID del correo
 * @returns {Promise<Array>} [correo, error]
 */
export async function obtenerCorreoPorIdService(id) {
  try {
    const correoRepository = AppDataSource.getRepository(Correo);

    const correo = await correoRepository.findOne({
      where: { id_correo: id },
      relations: ["remitente", "cliente", "operacion"]
    });

    if (!correo) {
      return [null, "Correo no encontrado"];
    }

    return [correo, null];
  } catch (error) {
    console.error("Error en obtenerCorreoPorIdService:", error);
    return [null, "Error al obtener correo"];
  }
}

/**
 * Envía correos masivos a múltiples destinatarios
 * @param {Object} data - Datos para envío masivo
 * @param {Array} data.destinatarios - Array de emails
 * @param {string} data.asunto - Asunto del correo
 * @param {string} data.mensaje - Contenido del mensaje
 * @param {string} data.tipo - Tipo de plantilla
 * @param {number} data.idRemitente - ID del usuario que envía
 * @returns {Promise<Array>} [resultado, error]
 */
export async function enviarCorreoMasivoService(data) {
  try {
    const { destinatarios, asunto, mensaje, tipo, idRemitente } = data;

    const resultados = {
      exitosos: [],
      fallidos: []
    };

    // Enviar correos uno por uno
    for (const destinatario of destinatarios) {
      const [correo, error] = await enviarCorreoService({
        destinatario,
        asunto,
        mensaje,
        tipo,
        idRemitente
      });

      if (error) {
        resultados.fallidos.push({ destinatario, error });
      } else {
        resultados.exitosos.push(correo);
      }
    }

    return [resultados, null];
  } catch (error) {
    console.error("Error en enviarCorreoMasivoService:", error);
    return [null, "Error al enviar correos masivos"];
  }
}

/**
 * Obtiene plantillas de correos predefinidas
 * @returns {Object} Plantillas disponibles
 */
export function obtenerPlantillasCorreo() {
  return {
    cotizacion: {
      nombre: 'Envío de Cotización',
      asunto: 'Cotización de su pedido',
      mensaje: 'Estimado/a cliente,\n\nAdjuntamos la cotización solicitada para su revisión.\n\nSaludos cordiales,\nEquipo de Ventas'
    },
    confirmacion: {
      nombre: 'Confirmación de Pedido',
      asunto: 'Confirmación de su pedido',
      mensaje: 'Estimado/a cliente,\n\nLe confirmamos que su pedido ha sido recibido y está siendo procesado.\n\nSaludos cordiales,\nEquipo de Producción'
    },
    entrega: {
      nombre: 'Notificación de Entrega',
      asunto: 'Su pedido está listo',
      mensaje: 'Estimado/a cliente,\n\nLe informamos que su pedido está listo para ser retirado.\n\nSaludos cordiales,\nEquipo de Entregas'
    },
    seguimiento: {
      nombre: 'Seguimiento de Pedido',
      asunto: 'Estado de su pedido',
      mensaje: 'Estimado/a cliente,\n\nLe informamos sobre el estado actual de su pedido.\n\nSaludos cordiales,\nEquipo de Atención al Cliente'
    }
  };
}
