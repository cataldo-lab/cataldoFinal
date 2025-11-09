"use strict";
import nodemailer from "nodemailer";
import { AppDataSource } from "../config/configDb.js";
import { CorreoSchema } from "../entity/correo.entity.js";
import {
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USER,
  EMAIL_PASS,
  EMAIL_FROM
} from "../config/configEnv.js";

const correoRepository = AppDataSource.getRepository(CorreoSchema);

/**
 * Crea el transportador de nodemailer
 */
function crearTransportador() {
  return nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_PORT == 465, // true para puerto 465, false para otros
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });
}

/**
 * Envía un correo electrónico y guarda el registro en la base de datos
 * @param {Object} correoData - Datos del correo
 * @param {string} correoData.destinatario - Email del destinatario
 * @param {string} correoData.asunto - Asunto del correo
 * @param {string} correoData.mensaje - Contenido del mensaje
 * @param {string} correoData.tipo - Tipo de plantilla (opcional)
 * @param {number} correoData.id_usuario_emisor - ID del usuario que envía (opcional)
 * @returns {Promise<Object>} Resultado del envío
 */
export async function enviarCorreo(correoData) {
  try {
    const { destinatario, asunto, mensaje, tipo = "personalizado", id_usuario_emisor = null } = correoData;

    // Validar datos requeridos
    if (!destinatario || !asunto || !mensaje) {
      return {
        success: false,
        message: "Faltan datos requeridos: destinatario, asunto y mensaje son obligatorios"
      };
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(destinatario)) {
      return {
        success: false,
        message: "El formato del email del destinatario no es válido"
      };
    }

    // Crear transportador
    const transporter = crearTransportador();

    // Configurar opciones del correo
    const mailOptions = {
      from: EMAIL_FROM || EMAIL_USER,
      to: destinatario,
      subject: asunto,
      text: mensaje,
      html: `<p>${mensaje.replace(/\n/g, '<br>')}</p>`, // Convertir saltos de línea a HTML
    };

    // Intentar enviar el correo
    let estado = "enviado";
    let errorMensaje = null;

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error("Error al enviar correo:", emailError);
      estado = "fallido";
      errorMensaje = emailError.message;
    }

    // Guardar registro en la base de datos
    const correoRegistro = correoRepository.create({
      destinatario,
      asunto,
      mensaje,
      tipo,
      estado,
      error_mensaje: errorMensaje,
      usuario_emisor: id_usuario_emisor ? { id: id_usuario_emisor } : null,
    });

    const correoGuardado = await correoRepository.save(correoRegistro);

    if (estado === "enviado") {
      return {
        success: true,
        message: "Correo enviado exitosamente",
        data: correoGuardado
      };
    } else {
      return {
        success: false,
        message: `Error al enviar correo: ${errorMensaje}`,
        data: correoGuardado
      };
    }

  } catch (error) {
    console.error("Error en enviarCorreo:", error);
    return {
      success: false,
      message: `Error al procesar envío de correo: ${error.message}`
    };
  }
}

/**
 * Obtiene el historial de correos enviados
 * @param {Object} filtros - Filtros de búsqueda
 * @param {string} filtros.destinatario - Filtrar por email destinatario
 * @param {string} filtros.estado - Filtrar por estado
 * @param {string} filtros.tipo - Filtrar por tipo de plantilla
 * @param {Date} filtros.fecha_desde - Filtrar desde fecha
 * @param {Date} filtros.fecha_hasta - Filtrar hasta fecha
 * @param {number} filtros.page - Página actual
 * @param {number} filtros.limit - Límite por página
 * @returns {Promise<Object>} Historial de correos
 */
export async function getHistorialCorreos(filtros = {}) {
  try {
    const {
      destinatario,
      estado,
      tipo,
      fecha_desde,
      fecha_hasta,
      page = 1,
      limit = 20
    } = filtros;

    const queryBuilder = correoRepository
      .createQueryBuilder("correo")
      .leftJoinAndSelect("correo.usuario_emisor", "usuario")
      .orderBy("correo.fecha_envio", "DESC");

    // Aplicar filtros
    if (destinatario) {
      queryBuilder.andWhere("correo.destinatario ILIKE :destinatario", {
        destinatario: `%${destinatario}%`
      });
    }

    if (estado) {
      queryBuilder.andWhere("correo.estado = :estado", { estado });
    }

    if (tipo) {
      queryBuilder.andWhere("correo.tipo = :tipo", { tipo });
    }

    if (fecha_desde) {
      queryBuilder.andWhere("correo.fecha_envio >= :fecha_desde", { fecha_desde });
    }

    if (fecha_hasta) {
      queryBuilder.andWhere("correo.fecha_envio <= :fecha_hasta", { fecha_hasta });
    }

    // Paginación
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [correos, total] = await queryBuilder.getManyAndCount();

    return {
      success: true,
      message: "Historial de correos obtenido exitosamente",
      data: {
        correos,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        limit
      }
    };

  } catch (error) {
    console.error("Error al obtener historial de correos:", error);
    return {
      success: false,
      message: `Error al obtener historial: ${error.message}`,
      data: {
        correos: [],
        total: 0,
        page: 1,
        totalPages: 0,
        limit: 20
      }
    };
  }
}

/**
 * Obtiene un correo por su ID
 * @param {number} correoId - ID del correo
 * @returns {Promise<Object>} Datos del correo
 */
export async function getCorreoById(correoId) {
  try {
    const correo = await correoRepository.findOne({
      where: { id: correoId },
      relations: ["usuario_emisor"]
    });

    if (!correo) {
      return {
        success: false,
        message: `No se encontró correo con ID ${correoId}`
      };
    }

    return {
      success: true,
      message: "Correo obtenido exitosamente",
      data: correo
    };

  } catch (error) {
    console.error(`Error al obtener correo ${correoId}:`, error);
    return {
      success: false,
      message: `Error al obtener correo: ${error.message}`
    };
  }
}

/**
 * Obtiene estadísticas de correos enviados
 * @returns {Promise<Object>} Estadísticas
 */
export async function getEstadisticasCorreos() {
  try {
    const total = await correoRepository.count();
    const enviados = await correoRepository.count({ where: { estado: "enviado" } });
    const fallidos = await correoRepository.count({ where: { estado: "fallido" } });
    const pendientes = await correoRepository.count({ where: { estado: "pendiente" } });

    return {
      success: true,
      message: "Estadísticas obtenidas exitosamente",
      data: {
        total,
        enviados,
        fallidos,
        pendientes,
        tasa_exito: total > 0 ? ((enviados / total) * 100).toFixed(2) : 0
      }
    };

  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    return {
      success: false,
      message: `Error al obtener estadísticas: ${error.message}`
    };
  }
}
