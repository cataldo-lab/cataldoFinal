"use strict";
import {
  enviarCorreosCumpleanos,
  buscarCumpleaneros,
  obtenerProximosCumpleanos
} from "../services/cumpleanos.service.js";

/**
 * Controlador para enviar correos de cumpleaños manualmente
 */
export async function enviarCorreosCumpleanosController(req, res) {
  try {
    console.log("📧 Iniciando envío manual de correos de cumpleaños...");

    const resultado = await enviarCorreosCumpleanos();

    return res.status(resultado.success ? 200 : 500).json(resultado);

  } catch (error) {
    console.error("Error en enviarCorreosCumpleanosController:", error);
    return res.status(500).json({
      success: false,
      message: "Error al enviar correos de cumpleaños",
      error: error.message
    });
  }
}

/**
 * Controlador para obtener lista de cumpleañeros de hoy
 */
export async function getCumpleanerosHoyController(req, res) {
  try {
    const cumpleaneros = await buscarCumpleaneros();

    const cumpleanerosFormateados = cumpleaneros.map(cliente => ({
      id: cliente.id_cliente,
      nombre: cliente.user.nombreCompleto,
      email: cliente.user.email,
      cumpleanos: cliente.cumpleanos_cliente,
      categoria: cliente.categoria_cliente,
      whatsapp: cliente.whatsapp_cliente
    }));

    return res.status(200).json({
      success: true,
      message: `Hay ${cumpleanerosFormateados.length} cumpleañero(s) hoy`,
      data: cumpleanerosFormateados,
      total: cumpleanerosFormateados.length
    });

  } catch (error) {
    console.error("Error en getCumpleanerosHoyController:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener cumpleañeros de hoy",
      error: error.message
    });
  }
}

/**
 * Controlador para obtener próximos cumpleaños
 */
export async function getProximosCumpleanosController(req, res) {
  try {
    const dias = parseInt(req.query.dias) || 7;

    if (dias < 1 || dias > 30) {
      return res.status(400).json({
        success: false,
        message: "El parámetro 'dias' debe estar entre 1 y 30"
      });
    }

    const proximosCumpleanos = await obtenerProximosCumpleanos(dias);

    return res.status(200).json({
      success: true,
      message: `Próximos cumpleaños en los siguientes ${dias} días`,
      data: proximosCumpleanos,
      total: proximosCumpleanos.length
    });

  } catch (error) {
    console.error("Error en getProximosCumpleanosController:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener próximos cumpleaños",
      error: error.message
    });
  }
}
