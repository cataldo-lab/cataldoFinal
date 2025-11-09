"use strict";
import nodemailer from "nodemailer";
import { AppDataSource } from "../config/configDb.js";
import PostventaSchema from "../entity/postventa.entity.js";
import User from "../entity/personas/user.entity.js";
import {
    EMAIL_USER,
    EMAIL_PASSWORD,
    EMAIL_SERVICE,
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_SECURE
} from "../config/configEnv.js";

/**
 * Configuración del transporter de nodemailer
 * Soporta tanto servicios conocidos (Gmail, etc) como configuración SMTP personalizada
 */
function createEmailTransporter() {
    const config = {};

    if (EMAIL_SERVICE) {
        // Usar servicio conocido (Gmail, Outlook, etc)
        config.service = EMAIL_SERVICE;
    } else {
        // Configuración SMTP personalizada
        config.host = EMAIL_HOST;
        config.port = EMAIL_PORT || 587;
        config.secure = EMAIL_SECURE === 'true'; // true para puerto 465, false para otros puertos
    }

    config.auth = {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
    };

    return nodemailer.createTransporter(config);
}

/**
 * Plantillas de correo predefinidas
 */
const plantillasCorreo = {
    cotizacion: {
        generarAsunto: (datos) => `Cotización de su pedido - ${datos.numero || ''}`,
        generarMensaje: (datos) => `
Estimado/a ${datos.nombreCliente || 'cliente'},

Adjuntamos la cotización solicitada para su revisión.

${datos.detalles || ''}

Para cualquier consulta, no dude en contactarnos.

Saludos cordiales,
Equipo de Ventas - Cataldo Muebles
        `.trim()
    },
    confirmacion: {
        generarAsunto: (datos) => `Confirmación de su pedido #${datos.numero || ''}`,
        generarMensaje: (datos) => `
Estimado/a ${datos.nombreCliente || 'cliente'},

Le confirmamos que su pedido #${datos.numero || ''} ha sido recibido y está siendo procesado.

Fecha estimada de entrega: ${datos.fechaEntrega || 'Por confirmar'}

${datos.detalles || ''}

Saludos cordiales,
Equipo de Producción - Cataldo Muebles
        `.trim()
    },
    entrega: {
        generarAsunto: (datos) => `Su pedido está listo para retiro`,
        generarMensaje: (datos) => `
Estimado/a ${datos.nombreCliente || 'cliente'},

Le informamos que su pedido #${datos.numero || ''} está listo para ser retirado.

${datos.detalles || ''}

Puede retirarlo en nuestro local en el horario habitual.

Saludos cordiales,
Equipo de Entregas - Cataldo Muebles
        `.trim()
    },
    seguimiento: {
        generarAsunto: (datos) => `Estado de su pedido #${datos.numero || ''}`,
        generarMensaje: (datos) => `
Estimado/a ${datos.nombreCliente || 'cliente'},

Le informamos sobre el estado actual de su pedido #${datos.numero || ''}:

Estado: ${datos.estado || 'En proceso'}

${datos.detalles || ''}

Saludos cordiales,
Equipo de Atención al Cliente - Cataldo Muebles
        `.trim()
    },
    cumpleanos: {
        generarAsunto: (datos) => `¡Feliz Cumpleaños ${datos.nombreCliente || ''}! 🎉`,
        generarMensaje: (datos) => `
¡Feliz Cumpleaños ${datos.nombreCliente || 'estimado/a cliente'}! 🎂🎉

Desde Cataldo Muebles queremos desearte un día especial lleno de alegría.

${datos.descuento ? `Como regalo, te ofrecemos un ${datos.descuento}% de descuento en tu próxima compra.` : ''}

¡Que disfrutes tu día!

Con cariño,
Equipo Cataldo Muebles
        `.trim()
    },
    personalizado: {
        generarAsunto: (datos) => datos.asunto || 'Comunicación de Cataldo Muebles',
        generarMensaje: (datos) => datos.mensaje || ''
    }
};

/**
 * Envía un correo electrónico y registra en la base de datos
 * @param {Object} correoData - Datos del correo
 * @param {string} correoData.destinatario - Email del destinatario
 * @param {string} correoData.asunto - Asunto del correo (opcional si usa plantilla)
 * @param {string} correoData.mensaje - Mensaje del correo (opcional si usa plantilla)
 * @param {string} correoData.tipo - Tipo de plantilla (cotizacion|confirmacion|entrega|seguimiento|personalizado|cumpleanos)
 * @param {Object} correoData.datosPlantilla - Datos para generar la plantilla
 * @param {number} correoData.operacionId - ID de operación relacionada (opcional)
 * @param {number} correoData.usuarioId - ID del usuario que envía (opcional)
 * @returns {Promise<Array>} [resultado, error]
 */
export async function enviarCorreoService(correoData) {
    const postventaRepository = AppDataSource.getRepository(PostventaSchema);
    const userRepository = AppDataSource.getRepository(User);

    let registroPostventa = null;

    try {
        const {
            destinatario,
            asunto: asuntoOriginal,
            mensaje: mensajeOriginal,
            tipo = 'personalizado',
            datosPlantilla = {},
            operacionId,
            usuarioId
        } = correoData;

        // Validaciones básicas
        if (!destinatario) {
            return [null, { message: "El email del destinatario es obligatorio" }];
        }

        if (!EMAIL_USER || !EMAIL_PASSWORD) {
            return [null, { message: "Configuración de email incompleta. Revise las variables de entorno EMAIL_USER y EMAIL_PASSWORD" }];
        }

        // Obtener información del destinatario si está registrado
        let nombreDestinatario = datosPlantilla.nombreCliente || null;
        const usuarioDestinatario = await userRepository.findOne({
            where: { email: destinatario }
        });
        if (usuarioDestinatario && !nombreDestinatario) {
            nombreDestinatario = usuarioDestinatario.nombreCompleto;
        }

        // Generar asunto y mensaje según plantilla o usar los proporcionados
        let asuntoFinal = asuntoOriginal;
        let mensajeFinal = mensajeOriginal;

        const plantilla = plantillasCorreo[tipo];
        if (plantilla) {
            const datosCompletos = {
                ...datosPlantilla,
                nombreCliente: nombreDestinatario
            };

            if (!asuntoFinal) {
                asuntoFinal = plantilla.generarAsunto(datosCompletos);
            }
            if (!mensajeFinal) {
                mensajeFinal = plantilla.generarMensaje(datosCompletos);
            }
        }

        if (!asuntoFinal || !mensajeFinal) {
            return [null, { message: "Debe proporcionar asunto y mensaje, o seleccionar una plantilla válida" }];
        }

        // Crear registro en BD ANTES de enviar (estado: pendiente)
        registroPostventa = postventaRepository.create({
            destinatario_email: destinatario,
            destinatario_nombre: nombreDestinatario,
            asunto: asuntoFinal,
            mensaje: mensajeFinal,
            tipo_correo: tipo,
            estado_envio: 'pendiente',
            operacion_relacionada: operacionId || null,
            enviado_por_usuario: usuarioId || null
        });

        await postventaRepository.save(registroPostventa);

        // Configurar transporter
        const transporter = createEmailTransporter();

        // Configurar opciones del correo
        const mailOptions = {
            from: `"Cataldo Muebles" <${EMAIL_USER}>`,
            to: destinatario,
            subject: asuntoFinal,
            text: mensajeFinal,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
                        <h1 style="color: white; margin: 0; text-align: center;">Cataldo Muebles</h1>
                    </div>
                    <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                        <div style="background: white; padding: 20px; border-radius: 8px; white-space: pre-line;">
                            ${mensajeFinal}
                        </div>
                        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                        <p style="color: #666; font-size: 12px; text-align: center; margin: 0;">
                            Este correo fue enviado por Cataldo Muebles<br>
                            Si tiene alguna consulta, por favor responda a este correo
                        </p>
                    </div>
                </div>
            `
        };

        // Enviar correo
        const info = await transporter.sendMail(mailOptions);

        // Actualizar registro como ENVIADO
        registroPostventa.estado_envio = 'enviado';
        registroPostventa.fecha_envio = new Date();
        await postventaRepository.save(registroPostventa);

        return [
            {
                success: true,
                message: "Correo enviado exitosamente",
                data: {
                    id: registroPostventa.id_postventa,
                    messageId: info.messageId,
                    destinatario,
                    asunto: asuntoFinal,
                    tipo
                }
            },
            null
        ];

    } catch (error) {
        console.error("Error al enviar correo:", error);

        // Actualizar registro como FALLIDO si existe
        if (registroPostventa && registroPostventa.id_postventa) {
            try {
                registroPostventa.estado_envio = 'fallido';
                registroPostventa.error_mensaje = error.message || 'Error desconocido';
                await postventaRepository.save(registroPostventa);
            } catch (updateError) {
                console.error("Error al actualizar registro de postventa:", updateError);
            }
        }

        return [
            null,
            {
                message: "Error al enviar el correo",
                details: error.message
            }
        ];
    }
}

/**
 * Obtiene el historial de correos enviados
 * @param {Object} filtros - Filtros de búsqueda
 * @param {string} filtros.destinatario - Filtrar por email del destinatario
 * @param {string} filtros.tipo - Filtrar por tipo de correo
 * @param {string} filtros.estado - Filtrar por estado de envío
 * @param {Date} filtros.desde - Fecha desde
 * @param {Date} filtros.hasta - Fecha hasta
 * @param {number} filtros.operacionId - ID de operación
 * @param {number} filtros.limite - Límite de resultados (default: 50)
 * @param {number} filtros.pagina - Página actual (default: 1)
 * @returns {Promise<Array>} [resultado, error]
 */
export async function obtenerHistorialCorreosService(filtros = {}) {
    try {
        const postventaRepository = AppDataSource.getRepository(PostventaSchema);

        const {
            destinatario,
            tipo,
            estado,
            desde,
            hasta,
            operacionId,
            limite = 50,
            pagina = 1
        } = filtros;

        // Construir query
        const queryBuilder = postventaRepository
            .createQueryBuilder("postventa")
            .leftJoinAndSelect("postventa.usuario", "usuario")
            .leftJoinAndSelect("postventa.operacion", "operacion");

        // Aplicar filtros
        if (destinatario) {
            queryBuilder.andWhere("postventa.destinatario_email ILIKE :email", {
                email: `%${destinatario}%`
            });
        }

        if (tipo) {
            queryBuilder.andWhere("postventa.tipo_correo = :tipo", { tipo });
        }

        if (estado) {
            queryBuilder.andWhere("postventa.estado_envio = :estado", { estado });
        }

        if (desde) {
            queryBuilder.andWhere("postventa.fecha_creacion >= :desde", { desde });
        }

        if (hasta) {
            queryBuilder.andWhere("postventa.fecha_creacion <= :hasta", { hasta });
        }

        if (operacionId) {
            queryBuilder.andWhere("postventa.operacion_relacionada = :operacionId", {
                operacionId
            });
        }

        // Ordenar por fecha de creación descendente
        queryBuilder.orderBy("postventa.fecha_creacion", "DESC");

        // Paginación
        const skip = (pagina - 1) * limite;
        queryBuilder.skip(skip).take(limite);

        // Ejecutar query
        const [correos, total] = await queryBuilder.getManyAndCount();

        return [
            {
                success: true,
                data: {
                    correos,
                    total,
                    pagina: Number(pagina),
                    limite: Number(limite),
                    totalPaginas: Math.ceil(total / limite)
                }
            },
            null
        ];

    } catch (error) {
        console.error("Error al obtener historial de correos:", error);
        return [
            null,
            {
                message: "Error al obtener el historial de correos",
                details: error.message
            }
        ];
    }
}

/**
 * Obtiene estadísticas de correos enviados
 * @param {Date} desde - Fecha desde
 * @param {Date} hasta - Fecha hasta
 * @returns {Promise<Array>} [resultado, error]
 */
export async function obtenerEstadisticasCorreosService(desde, hasta) {
    try {
        const postventaRepository = AppDataSource.getRepository(PostventaSchema);

        const queryBuilder = postventaRepository
            .createQueryBuilder("postventa")
            .select("postventa.tipo_correo", "tipo")
            .addSelect("postventa.estado_envio", "estado")
            .addSelect("COUNT(*)", "cantidad");

        if (desde) {
            queryBuilder.andWhere("postventa.fecha_creacion >= :desde", { desde });
        }

        if (hasta) {
            queryBuilder.andWhere("postventa.fecha_creacion <= :hasta", { hasta });
        }

        queryBuilder.groupBy("postventa.tipo_correo");
        queryBuilder.addGroupBy("postventa.estado_envio");

        const estadisticas = await queryBuilder.getRawMany();

        return [
            {
                success: true,
                data: {
                    estadisticas,
                    periodo: { desde, hasta }
                }
            },
            null
        ];

    } catch (error) {
        console.error("Error al obtener estadísticas:", error);
        return [
            null,
            {
                message: "Error al obtener estadísticas de correos",
                details: error.message
            }
        ];
    }
}

/**
 * Reintenta el envío de un correo fallido
 * @param {number} postventaId - ID del registro de postventa
 * @returns {Promise<Array>} [resultado, error]
 */
export async function reintentarEnvioCorreoService(postventaId) {
    try {
        const postventaRepository = AppDataSource.getRepository(PostventaSchema);

        const correoOriginal = await postventaRepository.findOne({
            where: { id_postventa: postventaId }
        });

        if (!correoOriginal) {
            return [null, { message: "Correo no encontrado" }];
        }

        if (correoOriginal.estado_envio === 'enviado') {
            return [null, { message: "El correo ya fue enviado exitosamente" }];
        }

        // Reenviar usando los datos originales
        const resultado = await enviarCorreoService({
            destinatario: correoOriginal.destinatario_email,
            asunto: correoOriginal.asunto,
            mensaje: correoOriginal.mensaje,
            tipo: correoOriginal.tipo_correo,
            operacionId: correoOriginal.operacion_relacionada,
            usuarioId: correoOriginal.enviado_por_usuario
        });

        return resultado;

    } catch (error) {
        console.error("Error al reintentar envío:", error);
        return [
            null,
            {
                message: "Error al reintentar el envío del correo",
                details: error.message
            }
        ];
    }
}
