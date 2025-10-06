"use strict";
import { AppDataSource } from "../../config/configDb.js";
import TrabajadorTienda from "../entity/personas/trabajador_tienda.entity.js";
import { User } from "../../entity/personas/user.entity.js";
import { Cliente } from "../../entity/personas/cliente.entity.js";
import { Producto } from "../entity/producto.entity.js";
import { Producto_Operacion } from "../entity/producto_operacion.entity.js";
import { Pais } from "../../entity/direccion/pais.entity.js";
import { Region } from "../../entity/direccion/region.entity.js";
import { Comuna } from "../../entity/direccion/comuna.entity.js";
import { Direccion } from "../../entity/direccion/provincia.entity.js";
import { Operacion } from "../entity/operacion.entity.js";
import { Op } from "sequelize";

/**
 * Trabajador puede ver existencias de productos
 */
export const obtenerExistencias = async (req, res) => {
  try {
    const { categoria, estado, busqueda } = req.query;
    
    const whereClause = {};
    
    // Filtrar por categoría si se proporciona
    if (categoria) whereClause.categoria = categoria;
    
    // Filtrar por estado (activo/inactivo)
    if (estado) whereClause.activo = estado === 'true';
    
    // Búsqueda por nombre o código
    if (busqueda) {
      whereClause[Op.or] = [
        { nombre: { [Op.like]: `%${busqueda}%` } },
        { codigo: { [Op.like]: `%${busqueda}%` } }
      ];
    }

    const productos = await Producto.findAll({
      where: whereClause,
      attributes: [
        'id',
        'nombre',
        'codigo',
        'descripcion',
        'stock_actual',
        'stock_minimo',
        'precio',
        'categoria',
        'activo'
      ],
      order: [['nombre', 'ASC']]
    });

    // Identificar productos con stock bajo
    const productosConAlerta = productos.map(producto => ({
      ...producto.toJSON(),
      alerta_stock: producto.stock_actual <= producto.stock_minimo,
      estado_stock: producto.stock_actual === 0 ? 'SIN_STOCK' : 
                    producto.stock_actual <= producto.stock_minimo ? 'STOCK_BAJO' : 
                    'STOCK_OK'
    }));

    return res.status(200).json({
      success: true,
      data: productosConAlerta,
      resumen: {
        total_productos: productos.length,
        sin_stock: productosConAlerta.filter(p => p.estado_stock === 'SIN_STOCK').length,
        stock_bajo: productosConAlerta.filter(p => p.estado_stock === 'STOCK_BAJO').length,
        stock_ok: productosConAlerta.filter(p => p.estado_stock === 'STOCK_OK').length
      }
    });
  } catch (error) {
    console.error('Error al obtener existencias:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener existencias'
    });
  }
};

/**
 * Trabajador puede ver inventario completo con detalles
 */
export const obtenerInventario = async (req, res) => {
  try {
    const { pagina = 1, limite = 20 } = req.query;
    const offset = (pagina - 1) * limite;

    const { count, rows: productos } = await Producto.findAndCountAll({
      attributes: [
        'id',
        'nombre',
        'codigo',
        'descripcion',
        'categoria',
        'stock_actual',
        'stock_minimo',
        'stock_maximo',
        'precio',
        'costo',
        'ubicacion',
        'activo',
        'fecha_ultima_actualizacion'
      ],
      limit: parseInt(limite),
      offset: parseInt(offset),
      order: [['nombre', 'ASC']]
    });

    // Calcular valor total del inventario
    const valorTotal = productos.reduce((total, producto) => {
      return total + (producto.stock_actual * producto.costo);
    }, 0);

    return res.status(200).json({
      success: true,
      data: productos,
      paginacion: {
        total: count,
        pagina: parseInt(pagina),
        limite: parseInt(limite),
        total_paginas: Math.ceil(count / limite)
      },
      estadisticas: {
        valor_total_inventario: valorTotal,
        total_productos: count
      }
    });
  } catch (error) {
    console.error('Error al obtener inventario:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener inventario'
    });
  }
};

/**
 * Trabajador consulta producto específico con historial
 */
export const obtenerDetalleProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    // Obtener historial de movimientos del producto
    const movimientos = await Producto_Operacion.findAll({
      where: { productoId: id },
      include: [{
        model: Operacion,
        attributes: ['id', 'tipo_operacion', 'fecha_operacion', 'monto_total']
      }],
      order: [['createdAt', 'DESC']],
      limit: 20
    });

    return res.status(200).json({
      success: true,
      data: {
        producto,
        historial_movimientos: movimientos
      }
    });
  } catch (error) {
    console.error('Error al obtener detalle del producto:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener detalle del producto'
    });
  }
};

/**
 * Trabajador registra entrada de mercancía (aumenta stock)
 */
export const registrarEntradaMercancia = async (req, res) => {
  try {
    const { productoId, cantidad, motivo, observaciones } = req.body;
    const trabajadorId = req.user?.id; // ID del trabajador autenticado

    if (!productoId || !cantidad || cantidad <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos'
      });
    }

    const producto = await Producto.findByPk(productoId);

    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    // Actualizar stock
    const nuevoStock = producto.stock_actual + parseInt(cantidad);
    await producto.update({ 
      stock_actual: nuevoStock,
      fecha_ultima_actualizacion: new Date()
    });

    // Registrar el movimiento en operaciones
    const operacion = await Operacion.create({
      tipo_operacion: 'ENTRADA_INVENTARIO',
      fecha_operacion: new Date(),
      trabajadorId,
      motivo,
      observaciones,
      estado: 'COMPLETADA'
    });

    await Producto_Operacion.create({
      productoId,
      operacionId: operacion.id,
      cantidad: parseInt(cantidad),
      tipo_movimiento: 'ENTRADA'
    });

    return res.status(200).json({
      success: true,
      message: 'Entrada de mercancía registrada exitosamente',
      data: {
        producto: {
          id: producto.id,
          nombre: producto.nombre,
          stock_anterior: producto.stock_actual - cantidad,
          stock_actual: nuevoStock
        }
      }
    });
  } catch (error) {
    console.error('Error al registrar entrada de mercancía:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al registrar entrada de mercancía'
    });
  }
};

/**
 * Trabajador registra salida de mercancía (disminuye stock)
 */
export const registrarSalidaMercancia = async (req, res) => {
  try {
    const { productoId, cantidad, motivo, observaciones } = req.body;
    const trabajadorId = req.user?.id;

    if (!productoId || !cantidad || cantidad <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos'
      });
    }

    const producto = await Producto.findByPk(productoId);

    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    // Verificar que hay stock suficiente
    if (producto.stock_actual < cantidad) {
      return res.status(400).json({
        success: false,
        message: 'Stock insuficiente',
        data: {
          stock_actual: producto.stock_actual,
          cantidad_solicitada: cantidad
        }
      });
    }

    // Actualizar stock
    const nuevoStock = producto.stock_actual - parseInt(cantidad);
    await producto.update({ 
      stock_actual: nuevoStock,
      fecha_ultima_actualizacion: new Date()
    });

    // Registrar el movimiento
    const operacion = await Operacion.create({
      tipo_operacion: 'SALIDA_INVENTARIO',
      fecha_operacion: new Date(),
      trabajadorId,
      motivo,
      observaciones,
      estado: 'COMPLETADA'
    });

    await Producto_Operacion.create({
      productoId,
      operacionId: operacion.id,
      cantidad: parseInt(cantidad),
      tipo_movimiento: 'SALIDA'
    });

    return res.status(200).json({
      success: true,
      message: 'Salida de mercancía registrada exitosamente',
      data: {
        producto: {
          id: producto.id,
          nombre: producto.nombre,
          stock_anterior: producto.stock_actual + cantidad,
          stock_actual: nuevoStock
        }
      }
    });
  } catch (error) {
    console.error('Error al registrar salida de mercancía:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al registrar salida de mercancía'
    });
  }
};

/**
 * Trabajador obtiene alertas de stock bajo
 */
export const obtenerAlertasStock = async (req, res) => {
  try {
    const productosStockBajo = await Producto.findAll({
      where: {
        stock_actual: {
          [Op.lte]: AppDataSource.literal('stock_minimo')
        },
        activo: true
      },
      attributes: [
        'id',
        'nombre',
        'codigo',
        'categoria',
        'stock_actual',
        'stock_minimo',
        'ubicacion'
      ],
      order: [['stock_actual', 'ASC']]
    });

    // Clasificar alertas por criticidad
    const alertasCriticas = productosStockBajo.filter(p => p.stock_actual === 0);
    const alertasMedia = productosStockBajo.filter(p => p.stock_actual > 0 && p.stock_actual <= p.stock_minimo);

    return res.status(200).json({
      success: true,
      data: {
        criticas: alertasCriticas,
        medias: alertasMedia
      },
      resumen: {
        total_alertas: productosStockBajo.length,
        criticas: alertasCriticas.length,
        medias: alertasMedia.length
      }
    });
  } catch (error) {
    console.error('Error al obtener alertas de stock:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener alertas de stock'
    });
  }
};

/**
 * Trabajador realiza ajuste de inventario (corrección manual)
 */
export const ajustarInventario = async (req, res) => {
  try {
    const { productoId, cantidad_real, motivo } = req.body;
    const trabajadorId = req.user?.id;

    const producto = await Producto.findByPk(productoId);

    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    const stockAnterior = producto.stock_actual;
    const diferencia = cantidad_real - stockAnterior;

    // Actualizar stock
    await producto.update({ 
      stock_actual: cantidad_real,
      fecha_ultima_actualizacion: new Date()
    });

    // Registrar el ajuste
    const operacion = await Operacion.create({
      tipo_operacion: 'AJUSTE_INVENTARIO',
      fecha_operacion: new Date(),
      trabajadorId,
      motivo,
      observaciones: `Ajuste: ${stockAnterior} → ${cantidad_real} (${diferencia > 0 ? '+' : ''}${diferencia})`,
      estado: 'COMPLETADA'
    });

    await Producto_Operacion.create({
      productoId,
      operacionId: operacion.id,
      cantidad: Math.abs(diferencia),
      tipo_movimiento: diferencia > 0 ? 'ENTRADA' : 'SALIDA'
    });

    return res.status(200).json({
      success: true,
      message: 'Inventario ajustado exitosamente',
      data: {
        producto: producto.nombre,
        stock_anterior: stockAnterior,
        stock_nuevo: cantidad_real,
        diferencia
      }
    });
  } catch (error) {
    console.error('Error al ajustar inventario:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al ajustar inventario'
    });
  }
};

/**
 * Trabajador consulta operaciones del día
 */
export const obtenerOperacionesDia = async (req, res) => {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);

    const operaciones = await Operacion.findAll({
      where: {
        fecha_operacion: {
          [Op.gte]: hoy,
          [Op.lt]: manana
        }
      },
      include: [
        {
          model: Cliente,
          attributes: ['id', 'nombre', 'email']
        },
        {
          model: Producto_Operacion,
          include: [{ model: Producto }]
        }
      ],
      order: [['fecha_operacion', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      data: operaciones,
      resumen: {
        total_operaciones: operaciones.length,
        fecha: hoy.toLocaleDateString()
      }
    });
  } catch (error) {
    console.error('Error al obtener operaciones del día:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener operaciones'
    });
  }
};

/**
 * Trabajador genera reporte de movimientos de inventario
 */
export const generarReporteMovimientos = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin, tipo_movimiento } = req.query;

    const whereClause = {};
    
    if (fecha_inicio && fecha_fin) {
      whereClause.createdAt = {
        [Op.between]: [new Date(fecha_inicio), new Date(fecha_fin)]
      };
    }

    if (tipo_movimiento) {
      whereClause.tipo_movimiento = tipo_movimiento;
    }

    const movimientos = await Producto_Operacion.findAll({
      where: whereClause,
      include: [
        {
          model: Producto,
          attributes: ['id', 'nombre', 'codigo', 'categoria']
        },
        {
          model: Operacion,
          attributes: ['tipo_operacion', 'fecha_operacion', 'motivo']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Estadísticas del reporte
    const entradas = movimientos.filter(m => m.tipo_movimiento === 'ENTRADA');
    const salidas = movimientos.filter(m => m.tipo_movimiento === 'SALIDA');
    
    const totalEntradas = entradas.reduce((sum, m) => sum + m.cantidad, 0);
    const totalSalidas = salidas.reduce((sum, m) => sum + m.cantidad, 0);

    return res.status(200).json({
      success: true,
      data: movimientos,
      estadisticas: {
        total_movimientos: movimientos.length,
        entradas: {
          cantidad_operaciones: entradas.length,
          total_unidades: totalEntradas
        },
        salidas: {
          cantidad_operaciones: salidas.length,
          total_unidades: totalSalidas
        },
        periodo: {
          inicio: fecha_inicio || 'No especificado',
          fin: fecha_fin || 'No especificado'
        }
      }
    });
  } catch (error) {
    console.error('Error al generar reporte de movimientos:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al generar reporte'
    });
  }
};

/**
 * Trabajador busca productos por múltiples criterios
 */
export const buscarProductos = async (req, res) => {
  try {
    const { termino, categoria, precio_min, precio_max } = req.query;

    const whereClause = { activo: true };

    if (termino) {
      whereClause[Op.or] = [
        { nombre: { [Op.like]: `%${termino}%` } },
        { codigo: { [Op.like]: `%${termino}%` } },
        { descripcion: { [Op.like]: `%${termino}%` } }
      ];
    }

    if (categoria) whereClause.categoria = categoria;

    if (precio_min) whereClause.precio = { [Op.gte]: precio_min };
    if (precio_max) {
      whereClause.precio = whereClause.precio || {};
      whereClause.precio[Op.lte] = precio_max;
    }

    const productos = await Producto.findAll({
      where: whereClause,
      order: [['nombre', 'ASC']]
    });

    return res.status(200).json({
      success: true,
      data: productos,
      total: productos.length
    });
  } catch (error) {
    console.error('Error al buscar productos:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al buscar productos'
    });
  }
};

/**
 * Trabajador consulta su información personal
 */
export const obtenerPerfilTrabajador = async (req, res) => {
  try {
    const trabajadorId = req.user?.id;

    const trabajador = await TrabajadorTienda.findByPk(trabajadorId, {
      include: [{
        model: User,
        attributes: ['nombre', 'email', 'telefono']
      }],
      attributes: { exclude: ['password'] }
    });

    if (!trabajador) {
      return res.status(404).json({
        success: false,
        message: 'Trabajador no encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      data: trabajador
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener perfil'
    });
  }
};