"use strict";
import { AppDataSource } from "../../config/configDb.js";
import { EstadoOperacion } from "../../entity/operacion.entity.js";

/**
 * Obtiene las estadísticas completas del dashboard gerencial
 * @returns {Promise<Object>} Objeto con todas las métricas del dashboard
 */
export async function obtenerDashboardGerencial() {
  try {
    const operacionRepository = AppDataSource.getRepository("Operacion");
    const clienteRepository = AppDataSource.getRepository("Cliente");
    const userRepository = AppDataSource.getRepository("User");
    const productoRepository = AppDataSource.getRepository("Producto");
    const materialRepository = AppDataSource.getRepository("Materiales");

    // Calcular fechas
    const ahora = new Date();
    const inicioHoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
    const inicioSemana = new Date(ahora);
    inicioSemana.setDate(ahora.getDate() - 7);
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);

    // ============= VENTAS =============
    // Ventas totales (todas las operaciones pagadas)
    const ventasTotales = await operacionRepository
      .createQueryBuilder("operacion")
      .select("COALESCE(SUM(operacion.costo_operacion), 0)", "total")
      .where("operacion.estado_operacion = :estado", { estado: EstadoOperacion.PAGADA })
      .getRawOne();

    // Ventas del mes
    const ventasMes = await operacionRepository
      .createQueryBuilder("operacion")
      .select("COALESCE(SUM(operacion.costo_operacion), 0)", "total")
      .where("operacion.estado_operacion = :estado", { estado: EstadoOperacion.PAGADA })
      .andWhere("operacion.fecha_creacion >= :inicioMes", { inicioMes })
      .getRawOne();

    // Ventas de la semana
    const ventasSemana = await operacionRepository
      .createQueryBuilder("operacion")
      .select("COALESCE(SUM(operacion.costo_operacion), 0)", "total")
      .where("operacion.estado_operacion = :estado", { estado: EstadoOperacion.PAGADA })
      .andWhere("operacion.fecha_creacion >= :inicioSemana", { inicioSemana })
      .getRawOne();

    // Ventas de hoy
    const ventasHoy = await operacionRepository
      .createQueryBuilder("operacion")
      .select("COALESCE(SUM(operacion.costo_operacion), 0)", "total")
      .where("operacion.estado_operacion = :estado", { estado: EstadoOperacion.PAGADA })
      .andWhere("operacion.fecha_creacion >= :inicioHoy", { inicioHoy })
      .getRawOne();

    // ============= CLIENTES =============
    // Total de clientes
    const totalClientes = await clienteRepository.count();

    // Clientes nuevos (este mes)
    const clientesNuevos = await clienteRepository
      .createQueryBuilder("cliente")
      .leftJoin("cliente.user", "user")
      .where("user.createdAt >= :inicioMes", { inicioMes })
      .getCount();

    // Clientes VIP
    const clientesVip = await clienteRepository
      .createQueryBuilder("cliente")
      .where("cliente.categoria_cliente = :categoria", { categoria: "vip" })
      .getCount();

    // Clientes Premium
    const clientesPremium = await clienteRepository
      .createQueryBuilder("cliente")
      .where("cliente.categoria_cliente = :categoria", { categoria: "premium" })
      .getCount();

    // ============= OPERACIONES =============
    // Total de operaciones
    const totalOperaciones = await operacionRepository.count();

    // Operaciones pendientes
    const operacionesPendientes = await operacionRepository
      .createQueryBuilder("operacion")
      .where("operacion.estado_operacion = :estado", { estado: EstadoOperacion.PENDIENTE })
      .getCount();

    // Operaciones en proceso
    const operacionesEnProceso = await operacionRepository
      .createQueryBuilder("operacion")
      .where("operacion.estado_operacion = :estado", { estado: EstadoOperacion.EN_PROCESO })
      .getCount();

    // Operaciones completadas (terminadas, completadas, entregadas, pagadas)
    const operacionesCompletadas = await operacionRepository
      .createQueryBuilder("operacion")
      .where("operacion.estado_operacion IN (:...estados)", {
        estados: [
          EstadoOperacion.TERMINADA,
          EstadoOperacion.COMPLETADA,
          EstadoOperacion.ENTREGADA,
          EstadoOperacion.PAGADA
        ]
      })
      .getCount();

    // ============= PRODUCTOS E INVENTARIO =============
    // Total de productos activos
    const totalProductos = await productoRepository
      .createQueryBuilder("producto")
      .where("producto.activo = :activo", { activo: true })
      .getCount();

    // Materiales con bajo stock (existencia < stock_minimo)
    const materialesBajoStock = await materialRepository
      .createQueryBuilder("material")
      .where("material.existencia_material < material.stock_minimo")
      .andWhere("material.activo = :activo", { activo: true })
      .getCount();

    // ============= MÉTRICAS ADICIONALES =============
    // Calcular tasa de conversión (operaciones pagadas vs total de operaciones)
    const operacionesPagadas = await operacionRepository
      .createQueryBuilder("operacion")
      .where("operacion.estado_operacion = :estado", { estado: EstadoOperacion.PAGADA })
      .getCount();

    const tasaConversion = totalOperaciones > 0
      ? ((operacionesPagadas / totalOperaciones) * 100).toFixed(1)
      : 0;

    // Calcular ticket promedio
    const ticketPromedio = operacionesPagadas > 0
      ? parseFloat(ventasTotales.total) / operacionesPagadas
      : 0;

    // Construir respuesta
    return {
      ventas: {
        total: parseFloat(ventasTotales.total) || 0,
        mes: parseFloat(ventasMes.total) || 0,
        semana: parseFloat(ventasSemana.total) || 0,
        hoy: parseFloat(ventasHoy.total) || 0
      },
      clientes: {
        total: totalClientes,
        nuevos: clientesNuevos,
        vip: clientesVip,
        premium: clientesPremium
      },
      operaciones: {
        total: totalOperaciones,
        pendientes: operacionesPendientes,
        enProceso: operacionesEnProceso,
        completadas: operacionesCompletadas
      },
      productos: {
        total: totalProductos,
        bajoStock: materialesBajoStock
      },
      metricas: {
        tasaConversion: parseFloat(tasaConversion),
        ticketPromedio: Math.round(ticketPromedio),
        satisfaccionCliente: 4.7 // TODO: Implementar sistema de encuestas/ratings
      }
    };
  } catch (error) {
    console.error("Error al obtener dashboard gerencial:", error);
    throw new Error("Error al obtener las estadísticas del dashboard");
  }
}

/**
 * Obtiene el resumen de ventas por período
 * @param {string} periodo - 'dia', 'semana', 'mes', 'año'
 * @returns {Promise<Object>} Resumen de ventas del período
 */
export async function obtenerResumenVentas(periodo = 'mes') {
  try {
    const operacionRepository = AppDataSource.getRepository("Operacion");
    const ahora = new Date();
    let fechaInicio;

    switch (periodo) {
      case 'dia':
        fechaInicio = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
        break;
      case 'semana':
        fechaInicio = new Date(ahora);
        fechaInicio.setDate(ahora.getDate() - 7);
        break;
      case 'mes':
        fechaInicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
        break;
      case 'año':
        fechaInicio = new Date(ahora.getFullYear(), 0, 1);
        break;
      default:
        fechaInicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    }

    const ventas = await operacionRepository
      .createQueryBuilder("operacion")
      .select([
        "COUNT(operacion.id_operacion) as total_operaciones",
        "COALESCE(SUM(operacion.costo_operacion), 0) as monto_total",
        "COALESCE(AVG(operacion.costo_operacion), 0) as ticket_promedio"
      ])
      .where("operacion.estado_operacion = :estado", { estado: EstadoOperacion.PAGADA })
      .andWhere("operacion.fecha_creacion >= :fechaInicio", { fechaInicio })
      .getRawOne();

    return {
      periodo,
      totalOperaciones: parseInt(ventas.total_operaciones) || 0,
      montoTotal: parseFloat(ventas.monto_total) || 0,
      ticketPromedio: Math.round(parseFloat(ventas.ticket_promedio)) || 0,
      fechaInicio,
      fechaFin: ahora
    };
  } catch (error) {
    console.error("Error al obtener resumen de ventas:", error);
    throw new Error("Error al obtener el resumen de ventas");
  }
}

/**
 * Obtiene el top de productos más vendidos
 * @param {number} limit - Cantidad de productos a retornar
 * @returns {Promise<Array>} Array de productos más vendidos
 */
export async function obtenerTopProductos(limit = 10) {
  try {
    const productoOperacionRepository = AppDataSource.getRepository("ProductoOperacion");

    const topProductos = await productoOperacionRepository
      .createQueryBuilder("po")
      .select([
        "producto.id_producto as id",
        "producto.nombre_producto as nombre",
        "producto.categoria_producto as categoria",
        "COUNT(po.id_producto_operacion) as total_vendidos",
        "COALESCE(SUM(po.cantidad_producto), 0) as cantidad_total"
      ])
      .leftJoin("po.producto", "producto")
      .leftJoin("po.operacion", "operacion")
      .where("operacion.estado_operacion = :estado", { estado: EstadoOperacion.PAGADA })
      .groupBy("producto.id_producto")
      .addGroupBy("producto.nombre_producto")
      .addGroupBy("producto.categoria_producto")
      .orderBy("cantidad_total", "DESC")
      .limit(limit)
      .getRawMany();

    return topProductos.map(p => ({
      id: p.id,
      nombre: p.nombre,
      categoria: p.categoria,
      totalVendidos: parseInt(p.total_vendidos) || 0,
      cantidadTotal: parseInt(p.cantidad_total) || 0
    }));
  } catch (error) {
    console.error("Error al obtener top productos:", error);
    throw new Error("Error al obtener los productos más vendidos");
  }
}
