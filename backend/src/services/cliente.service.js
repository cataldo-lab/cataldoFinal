"use strict";
import { AppDataSource } from "../config/configDb.js";
import Operacion from "../entity/operacion.entity.js";
import ProductoOperacion from "../entity/producto_operacion.entity.js";
import Producto from "../entity/producto.entity.js";
import User from "../entity/personas/user.entity.js";

/**
 * Obtener todas las operaciones del cliente autenticado
 * @param {number} userId - ID del usuario autenticado
 * @param {Object} filtros - Filtros opcionales { estado_operacion?, fecha_desde?, fecha_hasta? }
 * @returns {Promise<[Array|null, string|null]>}
 */
export async function getMisOperacionesService(userId, filtros = {}) {
  try {
    const operacionRepository = AppDataSource.getRepository(Operacion);

    // Construir query base
    const queryBuilder = operacionRepository
      .createQueryBuilder("operacion")
      .leftJoinAndSelect("operacion.cliente", "cliente")
      .leftJoinAndSelect("operacion.productosOperacion", "productosOperacion")
      .leftJoinAndSelect("productosOperacion.producto", "producto")
      .leftJoinAndSelect("operacion.encuesta", "encuesta")
      .where("operacion.id_user = :userId", { userId })
      .orderBy("operacion.fecha_creacion", "DESC");

    // Aplicar filtros opcionales
    if (filtros.estado_operacion) {
      queryBuilder.andWhere("operacion.estado_operacion = :estado", {
        estado: filtros.estado_operacion,
      });
    }

    if (filtros.fecha_desde) {
      queryBuilder.andWhere("operacion.fecha_creacion >= :fechaDesde", {
        fechaDesde: filtros.fecha_desde,
      });
    }

    if (filtros.fecha_hasta) {
      queryBuilder.andWhere("operacion.fecha_creacion <= :fechaHasta", {
        fechaHasta: filtros.fecha_hasta,
      });
    }

    const operaciones = await queryBuilder.getMany();

    if (!operaciones || operaciones.length === 0) {
      return [[], null];
    }

    // Formatear datos para el frontend
    const operacionesFormateadas = operaciones.map((operacion) => {
      // Calcular total de productos
      const totalProductos = operacion.productosOperacion?.length || 0;

      // Calcular saldo pendiente
      const costoTotal = parseFloat(operacion.costo_operacion || 0);
      const abonado = parseFloat(operacion.cantidad_abono || 0);
      const saldoPendiente = costoTotal - abonado;

      return {
        id_operacion: operacion.id_operacion,
        estado_operacion: operacion.estado_operacion,
        descripcion_operacion: operacion.descripcion_operacion,
        costo_operacion: costoTotal,
        cantidad_abono: abonado,
        saldo_pendiente: saldoPendiente,
        fecha_creacion: operacion.fecha_creacion,
        fecha_entrega_estimada: operacion.fecha_entrega_estimada,
        fecha_primer_abono: operacion.fecha_primer_abono,
        total_productos: totalProductos,
        cliente: {
          id: operacion.cliente?.id,
          nombreCompleto: operacion.cliente?.nombreCompleto,
          email: operacion.cliente?.email,
          telefono: operacion.cliente?.telefono,
        },
        productos: operacion.productosOperacion?.map((po) => ({
          id_producto_operacion: po.id_producto_operacion,
          cantidad: po.cantidad,
          precio_unitario: parseFloat(po.precio_unitario || 0),
          precio_total: parseFloat(po.precio_total || 0),
          especificaciones: po.especificaciones,
          producto: {
            id_producto: po.producto?.id_producto,
            nombre_producto: po.producto?.nombre_producto,
            categoria_producto: po.producto?.categoria_producto,
            descripcion_producto: po.producto?.descripcion_producto,
          },
        })) || [],
        encuesta: operacion.encuesta ? {
          id_encuesta: operacion.encuesta.id_encuesta,
          respondida: operacion.encuesta.fecha_respuesta !== null,
          fecha_respuesta: operacion.encuesta.fecha_respuesta,
        } : null,
      };
    });

    return [operacionesFormateadas, null];
  } catch (error) {
    console.error("Error al obtener las operaciones del cliente:", error);
    return [null, "Error interno del servidor al obtener tus pedidos"];
  }
}

/**
 * Obtener una operación específica del cliente autenticado
 * @param {number} userId - ID del usuario autenticado
 * @param {number} operacionId - ID de la operación
 * @returns {Promise<[Object|null, string|null]>}
 */
export async function getMiOperacionByIdService(userId, operacionId) {
  try {
    const operacionRepository = AppDataSource.getRepository(Operacion);

    const operacion = await operacionRepository
      .createQueryBuilder("operacion")
      .leftJoinAndSelect("operacion.cliente", "cliente")
      .leftJoinAndSelect("operacion.productosOperacion", "productosOperacion")
      .leftJoinAndSelect("productosOperacion.producto", "producto")
      .leftJoinAndSelect("operacion.encuesta", "encuesta")
      .leftJoinAndSelect("operacion.historial", "historial")
      .where("operacion.id_operacion = :operacionId", { operacionId })
      .andWhere("operacion.id_user = :userId", { userId })
      .orderBy("historial.fecha_cambio", "DESC")
      .getOne();

    if (!operacion) {
      return [null, "Operación no encontrada o no tienes permiso para verla"];
    }

    // Calcular saldo pendiente
    const costoTotal = parseFloat(operacion.costo_operacion || 0);
    const abonado = parseFloat(operacion.cantidad_abono || 0);
    const saldoPendiente = costoTotal - abonado;

    const operacionDetallada = {
      id_operacion: operacion.id_operacion,
      estado_operacion: operacion.estado_operacion,
      descripcion_operacion: operacion.descripcion_operacion,
      costo_operacion: costoTotal,
      cantidad_abono: abonado,
      saldo_pendiente: saldoPendiente,
      fecha_creacion: operacion.fecha_creacion,
      fecha_entrega_estimada: operacion.fecha_entrega_estimada,
      fecha_primer_abono: operacion.fecha_primer_abono,
      cliente: {
        id: operacion.cliente?.id,
        nombreCompleto: operacion.cliente?.nombreCompleto,
        email: operacion.cliente?.email,
        telefono: operacion.cliente?.telefono,
      },
      productos: operacion.productosOperacion?.map((po) => ({
        id_producto_operacion: po.id_producto_operacion,
        cantidad: po.cantidad,
        precio_unitario: parseFloat(po.precio_unitario || 0),
        precio_total: parseFloat(po.precio_total || 0),
        especificaciones: po.especificaciones,
        fecha_agregado: po.fecha_agregado,
        producto: {
          id_producto: po.producto?.id_producto,
          nombre_producto: po.producto?.nombre_producto,
          categoria_producto: po.producto?.categoria_producto,
          descripcion_producto: po.producto?.descripcion_producto,
        },
      })) || [],
      encuesta: operacion.encuesta ? {
        id_encuesta: operacion.encuesta.id_encuesta,
        respondida: operacion.encuesta.fecha_respuesta !== null,
        fecha_respuesta: operacion.encuesta.fecha_respuesta,
      } : null,
      historial: operacion.historial?.map((h) => ({
        id_historial: h.id_historial,
        estado_anterior: h.estado_anterior,
        estado_nuevo: h.estado_nuevo,
        fecha_cambio: h.fecha_cambio,
        observaciones: h.observaciones,
      })) || [],
    };

    return [operacionDetallada, null];
  } catch (error) {
    console.error("Error al obtener la operación del cliente:", error);
    return [null, "Error interno del servidor al obtener el pedido"];
  }
}
