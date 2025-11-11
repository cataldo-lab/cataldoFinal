"use strict";
import {
  crearEncuesta,
  getEncuestas,
  getEncuestaById,
  getEncuestaByOperacion,
  actualizarEncuesta,
  eliminarEncuesta,
  getEstadisticasEncuestas,
  getOperacionesSinEncuesta
} from "../services/encuesta.service.js";

/**
 * Controlador para crear una nueva encuesta
 */
export async function crearEncuestaController(req, res) {
  try {
    const { id_operacion, nota_pedido, nota_repartidor, comentario } = req.body;

    // Validar datos requeridos
    if (!id_operacion || nota_pedido === undefined || nota_repartidor === undefined) {
      return res.status(400).json({
        success: false,
        message: "Los campos id_operacion, nota_pedido y nota_repartidor son obligatorios"
      });
    }

    // Validar que las notas sean números
    if (isNaN(nota_pedido) || isNaN(nota_repartidor)) {
      return res.status(400).json({
        success: false,
        message: "Las notas deben ser números"
      });
    }

    // Validar rango de notas
    if (nota_pedido < 1 || nota_pedido > 7 || nota_repartidor < 1 || nota_repartidor > 7) {
      return res.status(400).json({
        success: false,
        message: "Las notas deben estar entre 1 y 7"
      });
    }

    const resultado = await crearEncuesta({
      id_operacion: parseInt(id_operacion),
      nota_pedido: parseInt(nota_pedido),
      nota_repartidor: parseInt(nota_repartidor),
      comentario
    });

    return res.status(resultado.success ? 201 : 400).json(resultado);

  } catch (error) {
    console.error("Error en crearEncuestaController:", error);
    return res.status(500).json({
      success: false,
      message: "Error al crear encuesta",
      error: error.message
    });
  }
}

/**
 * Controlador para obtener todas las encuestas
 */
export async function getEncuestasController(req, res) {
  try {
    const {
      nota_minima,
      fecha_desde,
      fecha_hasta,
      page,
      limit
    } = req.query;

    const filtros = {
      nota_minima: nota_minima ? parseInt(nota_minima) : undefined,
      fecha_desde: fecha_desde ? new Date(fecha_desde) : undefined,
      fecha_hasta: fecha_hasta ? new Date(fecha_hasta) : undefined,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20
    };

    const resultado = await getEncuestas(filtros);

    return res.status(resultado.success ? 200 : 500).json(resultado);

  } catch (error) {
    console.error("Error en getEncuestasController:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener encuestas",
      error: error.message
    });
  }
}

/**
 * Controlador para obtener una encuesta por ID
 */
export async function getEncuestaByIdController(req, res) {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de encuesta inválido"
      });
    }

    const resultado = await getEncuestaById(parseInt(id));

    return res.status(resultado.success ? 200 : 404).json(resultado);

  } catch (error) {
    console.error(`Error en getEncuestaByIdController (ID: ${req.params.id}):`, error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener encuesta",
      error: error.message
    });
  }
}

/**
 * Controlador para obtener la encuesta de una operación específica
 */
export async function getEncuestaByOperacionController(req, res) {
  try {
    const { id_operacion } = req.params;

    if (!id_operacion || isNaN(id_operacion)) {
      return res.status(400).json({
        success: false,
        message: "ID de operación inválido"
      });
    }

    const resultado = await getEncuestaByOperacion(parseInt(id_operacion));

    return res.status(resultado.success ? 200 : 404).json(resultado);

  } catch (error) {
    console.error(`Error en getEncuestaByOperacionController (ID: ${req.params.id_operacion}):`, error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener encuesta de la operación",
      error: error.message
    });
  }
}

/**
 * Controlador para actualizar una encuesta
 */
export async function actualizarEncuestaController(req, res) {
  try {
    const { id } = req.params;
    const { nota_pedido, nota_repartidor, comentario } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de encuesta inválido"
      });
    }

    // Validar notas si se proporcionan
    if (nota_pedido !== undefined) {
      if (isNaN(nota_pedido) || nota_pedido < 1 || nota_pedido > 7) {
        return res.status(400).json({
          success: false,
          message: "La nota del pedido debe ser un número entre 1 y 7"
        });
      }
    }

    if (nota_repartidor !== undefined) {
      if (isNaN(nota_repartidor) || nota_repartidor < 1 || nota_repartidor > 7) {
        return res.status(400).json({
          success: false,
          message: "La nota del repartidor debe ser un número entre 1 y 7"
        });
      }
    }

    const resultado = await actualizarEncuesta(parseInt(id), {
      nota_pedido: nota_pedido !== undefined ? parseInt(nota_pedido) : undefined,
      nota_repartidor: nota_repartidor !== undefined ? parseInt(nota_repartidor) : undefined,
      comentario
    });

    return res.status(resultado.success ? 200 : 404).json(resultado);

  } catch (error) {
    console.error(`Error en actualizarEncuestaController (ID: ${req.params.id}):`, error);
    return res.status(500).json({
      success: false,
      message: "Error al actualizar encuesta",
      error: error.message
    });
  }
}

/**
 * Controlador para eliminar una encuesta
 */
export async function eliminarEncuestaController(req, res) {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de encuesta inválido"
      });
    }

    const resultado = await eliminarEncuesta(parseInt(id));

    return res.status(resultado.success ? 200 : 404).json(resultado);

  } catch (error) {
    console.error(`Error en eliminarEncuestaController (ID: ${req.params.id}):`, error);
    return res.status(500).json({
      success: false,
      message: "Error al eliminar encuesta",
      error: error.message
    });
  }
}

/**
 * Controlador para obtener estadísticas de encuestas
 */
export async function getEstadisticasEncuestasController(req, res) {
  try {
    const resultado = await getEstadisticasEncuestas();

    return res.status(resultado.success ? 200 : 500).json(resultado);

  } catch (error) {
    console.error("Error en getEstadisticasEncuestasController:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas",
      error: error.message
    });
  }
}

/**
 * Controlador para obtener operaciones sin encuesta
 */
export async function getOperacionesSinEncuestaController(req, res) {
  try {
    const resultado = await getOperacionesSinEncuesta();

    return res.status(resultado.success ? 200 : 500).json(resultado);

  } catch (error) {
    console.error("Error en getOperacionesSinEncuestaController:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener operaciones sin encuesta",
      error: error.message
    });
  }
}
