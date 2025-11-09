"use strict";
import {
    enviarCorreoService,
    obtenerHistorialCorreosService,
    obtenerEstadisticasCorreosService,
    reintentarEnvioCorreoService
} from "../services/postventa.service.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess
} from "../handlers/responseHandlers.js";

/**
 * POST /api/postventa/enviar
 * Enviar un correo electrónico a un cliente
 *
 * Body esperado:
 * {
 *   destinatario: string (email),
 *   asunto?: string,
 *   mensaje?: string,
 *   tipo?: 'cotizacion' | 'confirmacion' | 'entrega' | 'seguimiento' | 'personalizado' | 'cumpleanos',
 *   datosPlantilla?: {
 *     nombreCliente?: string,
 *     numero?: string,
 *     fechaEntrega?: string,
 *     estado?: string,
 *     detalles?: string,
 *     descuento?: number
 *   },
 *   operacionId?: number
 * }
 */
export async function enviarCorreo(req, res) {
    try {
        const correoData = req.body;

        // Validación básica
        if (!correoData.destinatario) {
            return handleErrorClient(res, 400, "El email del destinatario es obligatorio");
        }

        // Obtener ID del usuario autenticado
        const usuarioId = req.user?.id;

        // Agregar usuario al correoData
        correoData.usuarioId = usuarioId;

        const [resultado, error] = await enviarCorreoService(correoData);

        if (error) {
            return handleErrorClient(res, 400, error.message, error.details);
        }

        handleSuccess(res, 200, resultado.message, resultado.data);

    } catch (error) {
        console.error("Error en enviarCorreo:", error);
        handleErrorServer(res, 500, error.message);
    }
}

/**
 * GET /api/postventa/historial
 * Obtener historial de correos enviados con filtros opcionales
 *
 * Query params:
 * - destinatario: string (filtrar por email)
 * - tipo: string (filtrar por tipo de correo)
 * - estado: 'enviado' | 'fallido' | 'pendiente'
 * - desde: date (formato ISO)
 * - hasta: date (formato ISO)
 * - operacionId: number
 * - limite: number (default 50)
 * - pagina: number (default 1)
 */
export async function obtenerHistorial(req, res) {
    try {
        const filtros = {
            destinatario: req.query.destinatario,
            tipo: req.query.tipo,
            estado: req.query.estado,
            desde: req.query.desde ? new Date(req.query.desde) : undefined,
            hasta: req.query.hasta ? new Date(req.query.hasta) : undefined,
            operacionId: req.query.operacionId ? parseInt(req.query.operacionId) : undefined,
            limite: req.query.limite ? parseInt(req.query.limite) : 50,
            pagina: req.query.pagina ? parseInt(req.query.pagina) : 1
        };

        const [resultado, error] = await obtenerHistorialCorreosService(filtros);

        if (error) {
            return handleErrorClient(res, 400, error.message, error.details);
        }

        handleSuccess(res, 200, "Historial obtenido exitosamente", resultado.data);

    } catch (error) {
        console.error("Error en obtenerHistorial:", error);
        handleErrorServer(res, 500, error.message);
    }
}

/**
 * GET /api/postventa/estadisticas
 * Obtener estadísticas de correos enviados
 *
 * Query params:
 * - desde: date (formato ISO)
 * - hasta: date (formato ISO)
 */
export async function obtenerEstadisticas(req, res) {
    try {
        const desde = req.query.desde ? new Date(req.query.desde) : undefined;
        const hasta = req.query.hasta ? new Date(req.query.hasta) : undefined;

        const [resultado, error] = await obtenerEstadisticasCorreosService(desde, hasta);

        if (error) {
            return handleErrorClient(res, 400, error.message, error.details);
        }

        handleSuccess(res, 200, "Estadísticas obtenidas exitosamente", resultado.data);

    } catch (error) {
        console.error("Error en obtenerEstadisticas:", error);
        handleErrorServer(res, 500, error.message);
    }
}

/**
 * POST /api/postventa/reintentar/:id
 * Reintentar el envío de un correo fallido
 *
 * Params:
 * - id: number (ID del registro de postventa)
 */
export async function reintentarEnvio(req, res) {
    try {
        const postventaId = parseInt(req.params.id);

        if (!postventaId || isNaN(postventaId)) {
            return handleErrorClient(res, 400, "ID de correo inválido");
        }

        const [resultado, error] = await reintentarEnvioCorreoService(postventaId);

        if (error) {
            return handleErrorClient(res, 400, error.message, error.details);
        }

        handleSuccess(res, 200, resultado.message, resultado.data);

    } catch (error) {
        console.error("Error en reintentarEnvio:", error);
        handleErrorServer(res, 500, error.message);
    }
}

/**
 * GET /api/postventa/test-config
 * Probar configuración de correo (solo desarrollo)
 */
export async function testConfiguracion(req, res) {
    try {
        const {
            EMAIL_USER,
            EMAIL_SERVICE,
            EMAIL_HOST
        } = process.env;

        const configurado = !!(EMAIL_USER && (EMAIL_SERVICE || EMAIL_HOST));

        handleSuccess(res, 200, "Configuración de correo verificada", {
            configurado,
            usuario: EMAIL_USER || 'No configurado',
            servicio: EMAIL_SERVICE || 'No configurado',
            host: EMAIL_HOST || 'No configurado'
        });

    } catch (error) {
        console.error("Error en testConfiguracion:", error);
        handleErrorServer(res, 500, error.message);
    }
}
