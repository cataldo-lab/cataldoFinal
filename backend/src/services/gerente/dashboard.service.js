"use strict";
import { AppDataSource } from "../../config/configDb.js";
import { Between } from "typeorm";

/**
 * Obtiene resumen general del dashboard para gerente
 * @returns {Promise<Object>} Resumen con operaciones, ingresos y clientes activos
 */
export async function getResumenGeneral() {
  try {
    const operacionRepo = AppDataSource.getRepository("Operacion");
    const userRepo = AppDataSource.getRepository("User");

    // Fechas del mes actual
    const ahora = new Date();
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    const finMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0, 23, 59, 59);

    // 1. Operaciones por estado (mes actual)
    const operacionesPorEstado = await operacionRepo
      .createQueryBuilder("operacion")
      .select("operacion.estado_operacion", "estado")
      .addSelect("COUNT(*)", "cantidad")
      .addSelect("COALESCE(SUM(operacion.costo_operacion), 0)", "monto_total")
      .where("operacion.fecha_creacion BETWEEN :inicio AND :fin", { inicio: inicioMes, fin: finMes })
      .groupBy("operacion.estado_operacion")
      .getRawMany();

    // 2. Total de operaciones del mes
    const totalOperacionesMes = await operacionRepo
      .createQueryBuilder("operacion")
      .where("operacion.fecha_creacion BETWEEN :inicio AND :fin", { inicio: inicioMes, fin: finMes })
      .getCount();

    // 3. Ingresos y pendientes
    const ingresosTotales = await operacionRepo
      .createQueryBuilder("operacion")
      .select("COALESCE(SUM(operacion.cantidad_abono), 0)", "total_abonado")
      .addSelect("COALESCE(SUM(operacion.costo_operacion), 0)", "total_operaciones")
      .addSelect("COALESCE(SUM(operacion.costo_operacion - operacion.cantidad_abono), 0)", "pendiente_cobro")
      .where("operacion.estado_operacion != :anulada", { anulada: "anulada" })
      .andWhere("operacion.fecha_creacion BETWEEN :inicio AND :fin", { inicio: inicioMes, fin: finMes })
      .getRawOne();

    // 4. Clientes activos (con operaciones en el mes)
    const clientesActivos = await userRepo
      .createQueryBuilder("user")
      .innerJoin("user.operaciones", "operacion")
      .where("user.rol = :rol", { rol: "cliente" })
      .andWhere("operacion.fecha_creacion BETWEEN :inicio AND :fin", { inicio: inicioMes, fin: finMes })
      .distinctOn(["user.id"])
      .getCount();

    // 5. Total de clientes registrados
    const totalClientes = await userRepo
      .createQueryBuilder("user")
      .where("user.rol = :rol", { rol: "cliente" })
      .getCount();

    // Formatear operaciones por estado como objeto
    const operacionesFormateadas = {};
    operacionesPorEstado.forEach(item => {
      operacionesFormateadas[item.estado] = {
        cantidad: parseInt(item.cantidad),
        monto_total: parseFloat(item.monto_total)
      };
    });

    return {
      success: true,
      periodo: {
        mes: ahora.getMonth() + 1,
        año: ahora.getFullYear(),
        desde: inicioMes,
        hasta: finMes
      },
      operaciones: {
        total_mes: totalOperacionesMes,
        por_estado: operacionesFormateadas
      },
      ingresos: {
        total_operaciones: parseFloat(ingresosTotales.total_operaciones),
        total_abonado: parseFloat(ingresosTotales.total_abonado),
        pendiente_cobro: parseFloat(ingresosTotales.pendiente_cobro),
        porcentaje_abonado: ingresosTotales.total_operaciones > 0
          ? ((ingresosTotales.total_abonado / ingresosTotales.total_operaciones) * 100).toFixed(2)
          : 0
      },
      clientes: {
        activos_mes: clientesActivos,
        total_registrados: totalClientes
      }
    };
  } catch (error) {
    console.error("Error en getResumenGeneral:", error);
    throw error;
  }
}

/**
 * Obtiene métricas de ventas por período
 * @param {Date} fechaInicio - Fecha de inicio del período
 * @param {Date} fechaFin - Fecha de fin del período
 * @returns {Promise<Object>} Métricas de ventas
 */
export async function getMetricasVentas(fechaInicio, fechaFin) {
  try {
    const productoOperacionRepo = AppDataSource.getRepository("ProductoOperacion");

    // 1. Top 10 productos más vendidos
    const topProductos = await productoOperacionRepo
      .createQueryBuilder("po")
      .innerJoinAndSelect("po.producto", "producto")
      .select("producto.nombre_producto", "nombre")
      .addSelect("producto.categoria_producto", "categoria")
      .addSelect("SUM(po.cantidad)", "total_vendido")
      .addSelect("SUM(po.precio_total)", "ingresos_generados")
      .where("po.fecha_agregado BETWEEN :inicio AND :fin", { inicio: fechaInicio, fin: fechaFin })
      .groupBy("producto.id_producto")
      .addGroupBy("producto.nombre_producto")
      .addGroupBy("producto.categoria_producto")
      .orderBy("SUM(po.cantidad)", "DESC")
      .limit(10)
      .getRawMany();

    // 2. Ventas por categoría de producto
    const ventasPorCategoria = await productoOperacionRepo
      .createQueryBuilder("po")
      .innerJoin("po.producto", "producto")
      .select("producto.categoria_producto", "categoria")
      .addSelect("COUNT(DISTINCT po.id_operacion)", "num_operaciones")
      .addSelect("SUM(po.cantidad)", "unidades_vendidas")
      .addSelect("SUM(po.precio_total)", "ingresos")
      .where("po.fecha_agregado BETWEEN :inicio AND :fin", { inicio: fechaInicio, fin: fechaFin })
      .groupBy("producto.categoria_producto")
      .orderBy("SUM(po.precio_total)", "DESC")
      .getRawMany();

    // 3. Productos vs Servicios
    const productoVsServicio = await productoOperacionRepo
      .createQueryBuilder("po")
      .innerJoin("po.producto", "producto")
      .select("producto.servicio", "es_servicio")
      .addSelect("COUNT(*)", "cantidad")
      .addSelect("SUM(po.precio_total)", "total_ingresos")
      .where("po.fecha_agregado BETWEEN :inicio AND :fin", { inicio: fechaInicio, fin: fechaFin })
      .groupBy("producto.servicio")
      .getRawMany();

    // 4. Total de ventas del período
    const totalVentas = await productoOperacionRepo
      .createQueryBuilder("po")
      .select("SUM(po.precio_total)", "total")
      .addSelect("COUNT(DISTINCT po.id_operacion)", "num_operaciones")
      .where("po.fecha_agregado BETWEEN :inicio AND :fin", { inicio: fechaInicio, fin: fechaFin })
      .getRawOne();

    // Formatear productos vs servicios
    const pvsFormateado = {
      productos: { cantidad: 0, ingresos: 0 },
      servicios: { cantidad: 0, ingresos: 0 }
    };

    productoVsServicio.forEach(item => {
      if (item.es_servicio) {
        pvsFormateado.servicios = {
          cantidad: parseInt(item.cantidad),
          ingresos: parseFloat(item.total_ingresos)
        };
      } else {
        pvsFormateado.productos = {
          cantidad: parseInt(item.cantidad),
          ingresos: parseFloat(item.total_ingresos)
        };
      }
    });

    return {
      success: true,
      periodo: { desde: fechaInicio, hasta: fechaFin },
      top_productos: topProductos.map(p => ({
        nombre: p.nombre,
        categoria: p.categoria,
        total_vendido: parseInt(p.total_vendido),
        ingresos_generados: parseFloat(p.ingresos_generados)
      })),
      por_categoria: ventasPorCategoria.map(c => ({
        categoria: c.categoria,
        num_operaciones: parseInt(c.num_operaciones),
        unidades_vendidas: parseInt(c.unidades_vendidas),
        ingresos: parseFloat(c.ingresos)
      })),
      productos_vs_servicios: pvsFormateado,
      totales: {
        ventas_totales: parseFloat(totalVentas.total || 0),
        num_operaciones: parseInt(totalVentas.num_operaciones || 0)
      }
    };
  } catch (error) {
    console.error("Error en getMetricasVentas:", error);
    throw error;
  }
}

/**
 * Obtiene estado del inventario de materiales
 * @returns {Promise<Object>} Estado de materiales con alertas
 */
export async function getEstadoInventario() {
  try {
    const materialRepo = AppDataSource.getRepository("Materiales");

    // 1. Materiales críticos (existencia < 50% stock mínimo)
    const materialesCriticos = await materialRepo
      .createQueryBuilder("material")
      .leftJoinAndSelect("material.proveedor", "proveedor")
      .where("material.existencia_material < (material.stock_minimo * 0.5)")
      .andWhere("material.activo = true")
      .orderBy("(material.existencia_material::float / material.stock_minimo::float)", "ASC")
      .getMany();

    // 2. Materiales con stock bajo (< stock mínimo pero >= 50%)
    const materialesBajos = await materialRepo
      .createQueryBuilder("material")
      .leftJoinAndSelect("material.proveedor", "proveedor")
      .where("material.existencia_material < material.stock_minimo")
      .andWhere("material.existencia_material >= (material.stock_minimo * 0.5)")
      .andWhere("material.activo = true")
      .orderBy("(material.existencia_material::float / material.stock_minimo::float)", "ASC")
      .getMany();

    // 3. Valor total del inventario
    const valorInventario = await materialRepo
      .createQueryBuilder("material")
      .select("SUM(material.existencia_material * material.precio_unitario)", "valor_total")
      .addSelect("COUNT(*)", "total_materiales")
      .addSelect("SUM(material.existencia_material)", "total_unidades")
      .where("material.activo = true")
      .getRawOne();

    // 4. Resumen por categoría de unidad
    const porCategoriaUnidad = await materialRepo
      .createQueryBuilder("material")
      .select("material.categoria_unidad", "categoria")
      .addSelect("COUNT(*)", "cantidad_materiales")
      .addSelect("SUM(material.existencia_material)", "total_existencia")
      .where("material.activo = true")
      .groupBy("material.categoria_unidad")
      .getRawMany();

    return {
      success: true,
      alertas: {
        criticos: {
          cantidad: materialesCriticos.length,
          materiales: materialesCriticos.map(m => ({
            id: m.id_material,
            nombre: m.nombre_material,
            existencia: m.existencia_material,
            stock_minimo: m.stock_minimo,
            porcentaje_stock: ((m.existencia_material / m.stock_minimo) * 100).toFixed(1),
            proveedor: m.proveedor?.rol_proveedor || "Sin proveedor",
            unidad_medida: m.unidad_medida
          }))
        },
        bajo_stock: {
          cantidad: materialesBajos.length,
          materiales: materialesBajos.map(m => ({
            id: m.id_material,
            nombre: m.nombre_material,
            existencia: m.existencia_material,
            stock_minimo: m.stock_minimo,
            porcentaje_stock: ((m.existencia_material / m.stock_minimo) * 100).toFixed(1),
            proveedor: m.proveedor?.rol_proveedor || "Sin proveedor",
            unidad_medida: m.unidad_medida
          }))
        }
      },
      inventario_total: {
        valor_total: parseFloat(valorInventario.valor_total || 0),
        total_materiales: parseInt(valorInventario.total_materiales || 0),
        total_unidades: parseInt(valorInventario.total_unidades || 0)
      },
      por_categoria: porCategoriaUnidad.map(c => ({
        categoria: c.categoria || "sin_categoria",
        cantidad_materiales: parseInt(c.cantidad_materiales),
        total_existencia: parseInt(c.total_existencia)
      }))
    };
  } catch (error) {
    console.error("Error en getEstadoInventario:", error);
    throw error;
  }
}

/**
 * Obtiene estadísticas de clientes
 * @returns {Promise<Object>} Estadísticas de clientes
 */
export async function getEstadisticasClientes() {
  try {
    const clienteRepo = AppDataSource.getRepository("Cliente");
    const userRepo = AppDataSource.getRepository("User");

    const ahora = new Date();
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);

    // 1. Clientes por categoría
    const clientesPorCategoria = await clienteRepo
      .createQueryBuilder("cliente")
      .innerJoin("cliente.user", "user")
      .select("cliente.categoria_cliente", "categoria")
      .addSelect("COUNT(*)", "cantidad")
      .addSelect("AVG(cliente.descuento_cliente)", "descuento_promedio")
      .where("user.rol = :rol", { rol: "cliente" })
      .groupBy("cliente.categoria_cliente")
      .getRawMany();

    // 2. Nuevos clientes del mes
    const nuevosClientesMes = await userRepo
      .createQueryBuilder("user")
      .where("user.rol = :rol", { rol: "cliente" })
      .andWhere("user.createdAt >= :inicio", { inicio: inicioMes })
      .getCount();

    // 3. Clientes con operaciones pendientes/en proceso
    const clientesConPendientes = await userRepo
      .createQueryBuilder("user")
      .innerJoin("user.operaciones", "operacion")
      .where("user.rol = :rol", { rol: "cliente" })
      .andWhere("operacion.estado_operacion IN (:...estados)", {
        estados: ["cotizacion", "pendiente", "en_proceso", "orden_trabajo"]
      })
      .distinctOn(["user.id"])
      .getCount();

    // 4. Top 10 clientes (por monto total abonado)
    const topClientes = await userRepo
      .createQueryBuilder("user")
      .innerJoinAndSelect("user.cliente", "cliente")
      .innerJoin("user.operaciones", "operacion")
      .select("user.id", "id")
      .addSelect("user.nombreCompleto", "nombre")
      .addSelect("cliente.categoria_cliente", "categoria")
      .addSelect("COUNT(operacion.id_operacion)", "total_operaciones")
      .addSelect("SUM(operacion.cantidad_abono)", "total_gastado")
      .where("user.rol = :rol", { rol: "cliente" })
      .groupBy("user.id")
      .addGroupBy("user.nombreCompleto")
      .addGroupBy("cliente.categoria_cliente")
      .orderBy("SUM(operacion.cantidad_abono)", "DESC")
      .limit(10)
      .getRawMany();

    return {
      success: true,
      por_categoria: clientesPorCategoria.map(c => ({
        categoria: c.categoria,
        cantidad: parseInt(c.cantidad),
        descuento_promedio: parseFloat(c.descuento_promedio || 0).toFixed(2)
      })),
      nuevos_mes: nuevosClientesMes,
      con_operaciones_activas: clientesConPendientes,
      top_clientes: topClientes.map(c => ({
        id: c.id,
        nombre: c.nombre,
        categoria: c.categoria,
        total_operaciones: parseInt(c.total_operaciones),
        total_gastado: parseFloat(c.total_gastado || 0)
      }))
    };
  } catch (error) {
    console.error("Error en getEstadisticasClientes:", error);
    throw error;
  }
}

/**
 * Obtiene métricas de satisfacción del cliente basadas en encuestas
 * @param {Date} fechaInicio - Fecha de inicio
 * @param {Date} fechaFin - Fecha de fin
 * @returns {Promise<Object>} Métricas de satisfacción
 */
export async function getSatisfaccionCliente(fechaInicio, fechaFin) {
  try {
    const encuestaRepo = AppDataSource.getRepository("Encuesta");

    // 1. Promedios generales
    const promedios = await encuestaRepo
      .createQueryBuilder("encuesta")
      .select("AVG(encuesta.nota_pedido)", "promedio_pedido")
      .addSelect("AVG(encuesta.nota_repartidor)", "promedio_repartidor")
      .addSelect("COUNT(*)", "total_encuestas")
      .where("encuesta.fecha_encuesta BETWEEN :inicio AND :fin", { inicio: fechaInicio, fin: fechaFin })
      .getRawOne();

    // 2. Distribución de notas de pedido
    const distribucionPedido = await encuestaRepo
      .createQueryBuilder("encuesta")
      .select("encuesta.nota_pedido", "nota")
      .addSelect("COUNT(*)", "cantidad")
      .where("encuesta.fecha_encuesta BETWEEN :inicio AND :fin", { inicio: fechaInicio, fin: fechaFin })
      .groupBy("encuesta.nota_pedido")
      .orderBy("encuesta.nota_pedido", "DESC")
      .getRawMany();

    // 3. Distribución de notas de repartidor
    const distribucionRepartidor = await encuestaRepo
      .createQueryBuilder("encuesta")
      .select("encuesta.nota_repartidor", "nota")
      .addSelect("COUNT(*)", "cantidad")
      .where("encuesta.fecha_encuesta BETWEEN :inicio AND :fin", { inicio: fechaInicio, fin: fechaFin })
      .groupBy("encuesta.nota_repartidor")
      .orderBy("encuesta.nota_repartidor", "DESC")
      .getRawMany();

    // 4. Encuestas con notas bajas (< 4)
    const encuestasBajas = await encuestaRepo
      .createQueryBuilder("encuesta")
      .innerJoinAndSelect("encuesta.operacion", "operacion")
      .innerJoinAndSelect("operacion.cliente", "cliente")
      .where("(encuesta.nota_pedido < 4 OR encuesta.nota_repartidor < 4)")
      .andWhere("encuesta.fecha_encuesta BETWEEN :inicio AND :fin", { inicio: fechaInicio, fin: fechaFin })
      .andWhere("encuesta.comentario IS NOT NULL")
      .orderBy("encuesta.fecha_encuesta", "DESC")
      .limit(10)
      .getMany();

    return {
      success: true,
      periodo: { desde: fechaInicio, hasta: fechaFin },
      promedios: {
        nota_pedido: parseFloat(promedios.promedio_pedido || 0).toFixed(2),
        nota_repartidor: parseFloat(promedios.promedio_repartidor || 0).toFixed(2),
        total_encuestas: parseInt(promedios.total_encuestas || 0)
      },
      distribucion: {
        pedido: distribucionPedido.map(d => ({
          nota: parseInt(d.nota),
          cantidad: parseInt(d.cantidad)
        })),
        repartidor: distribucionRepartidor.map(d => ({
          nota: parseInt(d.nota),
          cantidad: parseInt(d.cantidad)
        }))
      },
      alertas_bajas: encuestasBajas.map(e => ({
        id_encuesta: e.id_encuesta,
        nota_pedido: e.nota_pedido,
        nota_repartidor: e.nota_repartidor,
        comentario: e.comentario,
        fecha: e.fecha_encuesta,
        cliente: e.operacion.cliente.nombreCompleto,
        id_operacion: e.operacion.id_operacion
      }))
    };
  } catch (error) {
    console.error("Error en getSatisfaccionCliente:", error);
    throw error;
  }
}

/**
 * Obtiene indicadores operacionales
 * @param {Date} fechaInicio - Fecha de inicio
 * @param {Date} fechaFin - Fecha de fin
 * @returns {Promise<Object>} Indicadores operacionales
 */
export async function getIndicadoresOperacionales(fechaInicio, fechaFin) {
  try {
    const operacionRepo = AppDataSource.getRepository("Operacion");

    // 1. Tasa de conversión de cotización a venta
    const tasaConversion = await operacionRepo
      .createQueryBuilder("operacion")
      .select("COUNT(CASE WHEN estado_operacion = 'cotizacion' THEN 1 END)", "cotizaciones")
      .addSelect("COUNT(CASE WHEN estado_operacion IN ('pendiente', 'en_proceso', 'terminada', 'completada', 'entregada', 'pagada') THEN 1 END)", "ventas")
      .where("operacion.fecha_creacion BETWEEN :inicio AND :fin", { inicio: fechaInicio, fin: fechaFin })
      .getRawOne();

    const porcentajeConversion = tasaConversion.cotizaciones > 0
      ? ((tasaConversion.ventas / (parseInt(tasaConversion.ventas) + parseInt(tasaConversion.cotizaciones))) * 100).toFixed(2)
      : 0;

    // 2. Porcentaje de abono vs costo total
    const estadoAbonos = await operacionRepo
      .createQueryBuilder("operacion")
      .select("SUM(costo_operacion)", "total_costo")
      .addSelect("SUM(cantidad_abono)", "total_abonado")
      .where("estado_operacion != 'anulada'")
      .andWhere("operacion.fecha_creacion BETWEEN :inicio AND :fin", { inicio: fechaInicio, fin: fechaFin })
      .getRawOne();

    const porcentajeAbonado = estadoAbonos.total_costo > 0
      ? ((estadoAbonos.total_abonado / estadoAbonos.total_costo) * 100).toFixed(2)
      : 0;

    // 3. Operaciones completadas en el período
    const operacionesCompletadas = await operacionRepo
      .createQueryBuilder("operacion")
      .where("operacion.estado_operacion IN (:...estados)", {
        estados: ["completada", "entregada", "pagada"]
      })
      .andWhere("operacion.fecha_creacion BETWEEN :inicio AND :fin", { inicio: fechaInicio, fin: fechaFin })
      .getCount();

    // 4. Proyección de ingresos pendientes
    const proyeccion = await operacionRepo
      .createQueryBuilder("operacion")
      .select("SUM(operacion.costo_operacion)", "total_proyectado")
      .addSelect("SUM(operacion.cantidad_abono)", "ya_abonado")
      .addSelect("COUNT(*)", "num_operaciones")
      .where("operacion.estado_operacion IN (:...estados)", {
        estados: ["pendiente", "en_proceso", "terminada"]
      })
      .getRawOne();

    return {
      success: true,
      periodo: { desde: fechaInicio, hasta: fechaFin },
      conversion: {
        cotizaciones: parseInt(tasaConversion.cotizaciones),
        ventas: parseInt(tasaConversion.ventas),
        porcentaje_conversion: parseFloat(porcentajeConversion)
      },
      abonos: {
        total_costo: parseFloat(estadoAbonos.total_costo || 0),
        total_abonado: parseFloat(estadoAbonos.total_abonado || 0),
        porcentaje_abonado: parseFloat(porcentajeAbonado)
      },
      operaciones_completadas: operacionesCompletadas,
      proyeccion_ingresos: {
        total_proyectado: parseFloat(proyeccion.total_proyectado || 0),
        ya_abonado: parseFloat(proyeccion.ya_abonado || 0),
        por_cobrar: parseFloat((proyeccion.total_proyectado || 0) - (proyeccion.ya_abonado || 0)),
        num_operaciones_pendientes: parseInt(proyeccion.num_operaciones || 0)
      }
    };
  } catch (error) {
    console.error("Error en getIndicadoresOperacionales:", error);
    throw error;
  }
}
