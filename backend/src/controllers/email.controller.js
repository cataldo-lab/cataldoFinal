"use strict";

import { sendEmailToCliente } from "../services/email.service.js";
import { AppDataSource } from "../config/configDb.js";
import { User } from "../entity/user.entity.js";

/**
 * Envía un correo a un cliente
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export async function sendEmailController(req, res) {
  try {
    const { clienteId, asunto, mensaje } = req.body;

    // Validaciones
    if (!clienteId) {
      return res.status(400).json({
        status: "Error",
        message: "El ID del cliente es requerido",
      });
    }

    if (!asunto || !mensaje) {
      return res.status(400).json({
        status: "Error",
        message: "El asunto y el mensaje son requeridos",
      });
    }

    // Buscar el cliente en la base de datos
    const userRepository = AppDataSource.getRepository(User);
    const cliente = await userRepository.findOne({
      where: { id: clienteId },
      relations: ["cliente"],
    });

    if (!cliente) {
      return res.status(404).json({
        status: "Error",
        message: "Cliente no encontrado",
      });
    }

    if (!cliente.email) {
      return res.status(400).json({
        status: "Error",
        message: "El cliente no tiene un correo electrónico registrado",
      });
    }

    // Enviar el correo
    const result = await sendEmailToCliente({
      clienteEmail: cliente.email,
      clienteNombre: cliente.nombreCompleto,
      asunto,
      mensaje,
    });

    return res.status(200).json({
      status: "Success",
      message: "Correo enviado exitosamente",
      data: result,
    });
  } catch (error) {
    console.error("Error en sendEmailController:", error);
    return res.status(500).json({
      status: "Error",
      message: "Error al enviar el correo electrónico",
      error: error.message,
    });
  }
}

/**
 * Envía correos a múltiples clientes
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export async function sendBulkEmailController(req, res) {
  try {
    const { clienteIds, asunto, mensaje } = req.body;

    // Validaciones
    if (!clienteIds || !Array.isArray(clienteIds) || clienteIds.length === 0) {
      return res.status(400).json({
        status: "Error",
        message: "Se requiere un array de IDs de clientes",
      });
    }

    if (!asunto || !mensaje) {
      return res.status(400).json({
        status: "Error",
        message: "El asunto y el mensaje son requeridos",
      });
    }

    // Buscar los clientes en la base de datos
    const userRepository = AppDataSource.getRepository(User);
    const clientes = await userRepository.find({
      where: clienteIds.map((id) => ({ id })),
      relations: ["cliente"],
    });

    if (clientes.length === 0) {
      return res.status(404).json({
        status: "Error",
        message: "No se encontraron clientes",
      });
    }

    // Enviar correos a todos los clientes
    const resultados = [];
    const errores = [];

    for (const cliente of clientes) {
      try {
        if (!cliente.email) {
          errores.push({
            clienteId: cliente.id,
            nombre: cliente.nombreCompleto,
            error: "No tiene correo electrónico registrado",
          });
          continue;
        }

        const result = await sendEmailToCliente({
          clienteEmail: cliente.email,
          clienteNombre: cliente.nombreCompleto,
          asunto,
          mensaje,
        });

        resultados.push({
          clienteId: cliente.id,
          nombre: cliente.nombreCompleto,
          email: cliente.email,
          resultado: "Enviado",
        });
      } catch (error) {
        errores.push({
          clienteId: cliente.id,
          nombre: cliente.nombreCompleto,
          error: error.message,
        });
      }
    }

    return res.status(200).json({
      status: "Success",
      message: `Correos procesados: ${resultados.length} enviados, ${errores.length} fallidos`,
      data: {
        enviados: resultados,
        fallidos: errores,
      },
    });
  } catch (error) {
    console.error("Error en sendBulkEmailController:", error);
    return res.status(500).json({
      status: "Error",
      message: "Error al enviar los correos electrónicos",
      error: error.message,
    });
  }
}
