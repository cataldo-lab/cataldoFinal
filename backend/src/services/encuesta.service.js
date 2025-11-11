"use strict";
import { AppDataSource } from "../config/configDb.js";
import { EncuestaSchema } from "../entity/encuesta.entity.js";
import { OperacionSchema } from "../entity/operacion.entity.js";
import { Not, IsNull } from "typeorm";

const encuestaRepository = AppDataSource.getRepository(EncuestaSchema);
const operacionRepository = AppDataSource.getRepository(OperacionSchema);

/**
 * Crea una nueva encuesta para una operación
 * @param {Object} encuestaData - Datos de la encuesta
 * @param {number} encuestaData.id_operacion - ID de la operación
 * @param {number} encuestaData.nota_pedido - Nota del pedido (1-7)
 * @param {number} encuestaData.nota_repartidor - Nota del repartidor (1-7)
 * @param {string} encuestaData.comentario - Comentario opcional
 * @returns {Promise<Object>} Resultado de la creación
 */
export async function crearEncuesta(encuestaData) {
  try {
    const { id_operacion, nota_pedido, nota_repartidor, comentario } = encuestaData;

    // Validar datos requeridos
    if (!id_operacion || nota_pedido === undefined || nota_repartidor === undefined) {
      return {
        success: false,
        message: "Los campos id_operacion, nota_pedido y nota_repartidor son obligatorios"
      };
    }

    // Validar rango de notas (1-7)
    if (nota_pedido < 1 || nota_pedido > 7 || nota_repartidor < 1 || nota_repartidor > 7) {
      return {
        success: false,
        message: "Las notas deben estar entre 1 y 7"
      };
    }

    // Verificar que la operación existe
    const operacion = await operacionRepository.findOne({
      where: { id_operacion }
    });

    if (!operacion) {
      return {
        success: false,
        message: `No se encontró la operación con ID ${id_operacion}`
      };
    }

    // Validar que la operación esté en estado válido para encuesta
    const estadosValidos = ['entregada'];
    if (!estadosValidos.includes(operacion.estado_operacion)) {
      return {
        success: false,
        message: `La operación debe estar en estado "entregada" para crear una encuesta. Estado actual: ${operacion.estado_operacion}`
      };
    }

    // Verificar si ya existe una encuesta para esta operación
    const encuestaExistente = await encuestaRepository.findOne({
      where: { operacion: { id_operacion } }
    });

    if (encuestaExistente) {
      return {
        success: false,
        message: "Ya existe una encuesta para esta operación"
      };
    }

    // Crear la encuesta
    const nuevaEncuesta = encuestaRepository.create({
      nota_pedido,
      nota_repartidor,
      comentario: comentario || null,
      operacion: { id_operacion }
    });

    const encuestaGuardada = await encuestaRepository.save(nuevaEncuesta);

    return {
      success: true,
      message: "Encuesta creada exitosamente",
      data: encuestaGuardada
    };

  } catch (error) {
    console.error("Error al crear encuesta:", error);
    return {
      success: false,
      message: `Error al crear encuesta: ${error.message}`
    };
  }
}

/**
 * Obtiene todas las encuestas con filtros opcionales
 * @param {Object} filtros - Filtros de búsqueda
 * @param {number} filtros.nota_minima - Nota mínima para filtrar
 * @param {Date} filtros.fecha_desde - Filtrar desde fecha
 * @param {Date} filtros.fecha_hasta - Filtrar hasta fecha
 * @param {number} filtros.page - Página actual
 * @param {number} filtros.limit - Límite por página
 * @returns {Promise<Object>} Lista de encuestas
 */
export async function getEncuestas(filtros = {}) {
  try {
    const {
      nota_minima,
      fecha_desde,
      fecha_hasta,
      page = 1,
      limit = 20
    } = filtros;

    const queryBuilder = encuestaRepository
      .createQueryBuilder("encuesta")
      .leftJoinAndSelect("encuesta.operacion", "operacion")
      .leftJoinAndSelect("operacion.cliente", "cliente")
      .orderBy("encuesta.fecha_encuesta", "DESC");

    // Aplicar filtros
    if (nota_minima) {
      queryBuilder.andWhere(
        "(encuesta.nota_pedido >= :nota_minima OR encuesta.nota_repartidor >= :nota_minima)",
        { nota_minima }
      );
    }

    if (fecha_desde) {
      queryBuilder.andWhere("encuesta.fecha_encuesta >= :fecha_desde", { fecha_desde });
    }

    if (fecha_hasta) {
      queryBuilder.andWhere("encuesta.fecha_encuesta <= :fecha_hasta", { fecha_hasta });
    }

    // Paginación
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [encuestas, total] = await queryBuilder.getManyAndCount();

    return {
      success: true,
      message: "Encuestas obtenidas exitosamente",
      data: {
        encuestas,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        limit
      }
    };

  } catch (error) {
    console.error("Error al obtener encuestas:", error);
    return {
      success: false,
      message: `Error al obtener encuestas: ${error.message}`,
      data: {
        encuestas: [],
        total: 0,
        page: 1,
        totalPages: 0,
        limit: 20
      }
    };
  }
}

/**
 * Obtiene una encuesta por su ID
 * @param {number} encuestaId - ID de la encuesta
 * @returns {Promise<Object>} Datos de la encuesta
 */
export async function getEncuestaById(encuestaId) {
  try {
    const encuesta = await encuestaRepository.findOne({
      where: { id_encuesta: encuestaId },
      relations: ["operacion", "operacion.cliente"]
    });

    if (!encuesta) {
      return {
        success: false,
        message: `No se encontró encuesta con ID ${encuestaId}`
      };
    }

    return {
      success: true,
      message: "Encuesta obtenida exitosamente",
      data: encuesta
    };

  } catch (error) {
    console.error(`Error al obtener encuesta ${encuestaId}:`, error);
    return {
      success: false,
      message: `Error al obtener encuesta: ${error.message}`
    };
  }
}

/**
 * Obtiene la encuesta de una operación específica
 * @param {number} operacionId - ID de la operación
 * @returns {Promise<Object>} Datos de la encuesta
 */
export async function getEncuestaByOperacion(operacionId) {
  try {
    const encuesta = await encuestaRepository.findOne({
      where: { operacion: { id_operacion: operacionId } },
      relations: ["operacion", "operacion.cliente"]
    });

    if (!encuesta) {
      return {
        success: false,
        message: `No se encontró encuesta para la operación ${operacionId}`
      };
    }

    return {
      success: true,
      message: "Encuesta obtenida exitosamente",
      data: encuesta
    };

  } catch (error) {
    console.error(`Error al obtener encuesta de operación ${operacionId}:`, error);
    return {
      success: false,
      message: `Error al obtener encuesta: ${error.message}`
    };
  }
}

/**
 * Actualiza una encuesta existente
 * @param {number} encuestaId - ID de la encuesta
 * @param {Object} encuestaData - Datos a actualizar
 * @returns {Promise<Object>} Resultado de la actualización
 */
export async function actualizarEncuesta(encuestaId, encuestaData) {
  try {
    const { nota_pedido, nota_repartidor, comentario } = encuestaData;

    // Buscar la encuesta
    const encuesta = await encuestaRepository.findOne({
      where: { id_encuesta: encuestaId }
    });

    if (!encuesta) {
      return {
        success: false,
        message: `No se encontró encuesta con ID ${encuestaId}`
      };
    }

    // Validar rango de notas si se proporcionan
    if (nota_pedido !== undefined && (nota_pedido < 1 || nota_pedido > 7)) {
      return {
        success: false,
        message: "La nota del pedido debe estar entre 1 y 7"
      };
    }

    if (nota_repartidor !== undefined && (nota_repartidor < 1 || nota_repartidor > 7)) {
      return {
        success: false,
        message: "La nota del repartidor debe estar entre 1 y 7"
      };
    }

    // Actualizar campos
    if (nota_pedido !== undefined) encuesta.nota_pedido = nota_pedido;
    if (nota_repartidor !== undefined) encuesta.nota_repartidor = nota_repartidor;
    if (comentario !== undefined) encuesta.comentario = comentario;

    const encuestaActualizada = await encuestaRepository.save(encuesta);

    return {
      success: true,
      message: "Encuesta actualizada exitosamente",
      data: encuestaActualizada
    };

  } catch (error) {
    console.error(`Error al actualizar encuesta ${encuestaId}:`, error);
    return {
      success: false,
      message: `Error al actualizar encuesta: ${error.message}`
    };
  }
}

/**
 * Elimina una encuesta
 * @param {number} encuestaId - ID de la encuesta
 * @returns {Promise<Object>} Resultado de la eliminación
 */
export async function eliminarEncuesta(encuestaId) {
  try {
    const encuesta = await encuestaRepository.findOne({
      where: { id_encuesta: encuestaId }
    });

    if (!encuesta) {
      return {
        success: false,
        message: `No se encontró encuesta con ID ${encuestaId}`
      };
    }

    await encuestaRepository.remove(encuesta);

    return {
      success: true,
      message: "Encuesta eliminada exitosamente"
    };

  } catch (error) {
    console.error(`Error al eliminar encuesta ${encuestaId}:`, error);
    return {
      success: false,
      message: `Error al eliminar encuesta: ${error.message}`
    };
  }
}

/**
 * Obtiene estadísticas de las encuestas
 * @returns {Promise<Object>} Estadísticas
 */
export async function getEstadisticasEncuestas() {
  try {
    const total = await encuestaRepository.count();

    // Promedios
    const queryBuilder = encuestaRepository
      .createQueryBuilder("encuesta")
      .select("AVG(encuesta.nota_pedido)", "promedio_pedido")
      .addSelect("AVG(encuesta.nota_repartidor)", "promedio_repartidor");

    const promedios = await queryBuilder.getRawOne();

    // Distribución de notas de pedido
    const distribucionPedido = await encuestaRepository
      .createQueryBuilder("encuesta")
      .select("encuesta.nota_pedido", "nota")
      .addSelect("COUNT(*)", "cantidad")
      .groupBy("encuesta.nota_pedido")
      .orderBy("encuesta.nota_pedido", "ASC")
      .getRawMany();

    // Distribución de notas de repartidor
    const distribucionRepartidor = await encuestaRepository
      .createQueryBuilder("encuesta")
      .select("encuesta.nota_repartidor", "nota")
      .addSelect("COUNT(*)", "cantidad")
      .groupBy("encuesta.nota_repartidor")
      .orderBy("encuesta.nota_repartidor", "ASC")
      .getRawMany();

    // Encuestas con comentarios
    const conComentarios = await encuestaRepository.count({
      where: { comentario: Not(IsNull()) }
    });

    return {
      success: true,
      message: "Estadísticas obtenidas exitosamente",
      data: {
        total,
        promedio_pedido: parseFloat(promedios.promedio_pedido || 0).toFixed(2),
        promedio_repartidor: parseFloat(promedios.promedio_repartidor || 0).toFixed(2),
        con_comentarios: conComentarios,
        sin_comentarios: total - conComentarios,
        distribucion_pedido: distribucionPedido.map(d => ({
          nota: parseInt(d.nota),
          cantidad: parseInt(d.cantidad)
        })),
        distribucion_repartidor: distribucionRepartidor.map(d => ({
          nota: parseInt(d.nota),
          cantidad: parseInt(d.cantidad)
        }))
      }
    };

  } catch (error) {
    console.error("Error al obtener estadísticas de encuestas:", error);
    return {
      success: false,
      message: `Error al obtener estadísticas: ${error.message}`
    };
  }
}

/**
 * Obtiene las operaciones que NO tienen encuesta
 * @returns {Promise<Object>} Operaciones sin encuesta
 */
export async function getOperacionesSinEncuesta() {
  try {
    // Obtener IDs de operaciones que YA tienen encuesta
    const operacionesConEncuesta = await encuestaRepository
      .createQueryBuilder("encuesta")
      .select("encuesta.id_operacion", "id_operacion")
      .getRawMany()
      .then(rows => rows.map(row => row.id_operacion));

    let queryBuilder = operacionRepository
      .createQueryBuilder("operacion")
      .leftJoinAndSelect("operacion.cliente", "cliente")
      .where("operacion.estado_operacion = :estado", {
        estado: 'entregada'
      })
      .orderBy("operacion.fecha_entrega_estimada", "DESC");

    if (operacionesConEncuesta.length > 0) {
      queryBuilder = queryBuilder.andWhere("operacion.id_operacion NOT IN (:...ids)", {
        ids: operacionesConEncuesta
      });
    }

    const operaciones = await queryBuilder.getMany();

    return {
      success: true,
      message: "Operaciones sin encuesta obtenidas exitosamente",
      data: operaciones
    };

  } catch (error) {
    console.error("Error al obtener operaciones sin encuesta:", error);
    return {
      success: false,
      message: `Error al obtener operaciones sin encuesta: ${error.message}`,
      data: []
    };
  }
}
