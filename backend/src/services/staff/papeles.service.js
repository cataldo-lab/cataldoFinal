

"use strict";
import { AppDataSource } from "../../config/configDb.js";
import { Role } from "../../entity/personas/user.entity.js";


const userRepository = AppDataSource.getRepository("User");

export async function getClientesConComprasService() {
    try {
        // Obtener todos los usuarios con rol cliente con sus relaciones
        const clientes = await userRepository.find({
            where: { rol: Role.CLIENTE },
            relations: [
                "cliente",                              // User → Cliente (1:1)
                "comuna",                               // User → Comuna (N:1)
                "comuna.provincia",                     // Comuna → Provincia (N:1)
                "comuna.provincia.region",              // Provincia → Region (N:1)
                "operaciones",                          // User → Operacion (1:N)
                "operaciones.productosOperacion",       // Operacion → ProductoOperacion (1:N)
                "operaciones.productosOperacion.producto", // ProductoOperacion → Producto (N:1)
                "operaciones.historial",                // Operacion → Historial (1:N)
                "operaciones.encuesta"                  // Operacion → Encuesta (1:1)
            ],
            order: {
                createdAt: "DESC"
            }
        });

        // Formatear la información
        const clientesConCompras = clientes.map(user => {
            const totalCompras = user.operaciones?.length || 0;
            const totalGastado = user.operaciones?.reduce((sum, op) => 
                sum + parseFloat(op.costo_operacion || 0), 0) || 0;
            const totalAbonado = user.operaciones?.reduce((sum, op) => 
                sum + parseFloat(op.cantidad_abono || 0), 0) || 0;
            const totalPendiente = totalGastado - totalAbonado;

            // Contar operaciones por estado
            const operacionesPorEstado = user.operaciones?.reduce((acc, op) => {
                acc[op.estado_operacion] = (acc[op.estado_operacion] || 0) + 1;
                return acc;
            }, {}) || {};

            return {
                // ========== TABLA: USER ==========
                id: user.id,
                rut: user.rut,
                nombreCompleto: user.nombreCompleto,
                email: user.email,
                telefono: user.telefono,
                rol: user.rol,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,

                // ========== TABLA: COMUNA, PROVINCIA, REGION ==========
                direccion: {
                    comuna: user.comuna?.nombre_comuna || null,
                    provincia: (user.comuna?.provincia && user.comuna.provincia.nombre_provincia) 
                        ? user.comuna.provincia.nombre_provincia 
                        : null,
                    region: (user.comuna?.provincia?.region && user.comuna.provincia.region.nombre_region) 
                        ? user.comuna.provincia.region.nombre_region 
                        : null,
                    id_comuna: user.comuna?.id_comuna || null,
                    id_provincia: user.comuna?.provincia?.id_provincia || null,
                    id_region: user.comuna?.provincia?.region?.id_region || null,
                    tiene_direccion_completa: !!(user.comuna && user.comuna.provincia && user.comuna.provincia.region)
                },

                // ========== TABLA: CLIENTE ==========
                info_cliente: user.cliente ? {
                    id_cliente: user.cliente.id_cliente,
                    cumpleanos_cliente: user.cliente.cumpleanos_cliente || null,
                    whatsapp_cliente: user.cliente.whatsapp_cliente || null,
                    correo_alterno_cliente: user.cliente.correo_alterno_cliente || null,
                    categoria_cliente: user.cliente.categoria_cliente || "regular",
                    descuento_cliente: parseFloat(user.cliente.descuento_cliente || 0),
                    acepta_uso_datos: user.cliente.Acepta_uso_datos || false
                } : null,

                // ========== RESUMEN DE COMPRAS ==========
                resumen_compras: {
                    total_operaciones: totalCompras,
                    total_gastado: parseFloat(totalGastado.toFixed(2)),
                    total_abonado: parseFloat(totalAbonado.toFixed(2)),
                    total_pendiente: parseFloat(totalPendiente.toFixed(2)),
                    promedio_compra: totalCompras > 0 ? parseFloat((totalGastado / totalCompras).toFixed(2)) : 0,
                    operaciones_por_estado: operacionesPorEstado
                },

                // ========== TABLA: OPERACION → PRODUCTO_OPERACION → PRODUCTO ==========
                compras: user.operaciones?.map(operacion => ({
                    // DATOS DE OPERACION
                    id_operacion: operacion.id_operacion,
                    estado_operacion: operacion.estado_operacion,
                    costo_operacion: parseFloat(operacion.costo_operacion || 0),
                    cantidad_abono: parseFloat(operacion.cantidad_abono || 0),
                    saldo_pendiente: parseFloat(operacion.costo_operacion || 0) - parseFloat(operacion.cantidad_abono || 0),
                    descripcion_operacion: operacion.descripcion_operacion || null,
                    fecha_creacion: operacion.fecha_creacion,
                    fecha_entrega_estimada: operacion.fecha_entrega_estimada || null,

                    // DATOS DE PRODUCTO_OPERACION Y PRODUCTO
                    productos: operacion.productosOperacion?.map(po => ({
                        // Datos de la tabla intermedia ProductoOperacion
                        id_producto_operacion: po.id_producto_operacion,
                        cantidad: po.cantidad || 0,
                        precio_unitario: parseFloat(po.precio_unitario || 0),
                        precio_total: parseFloat(po.precio_total || 0),
                        especificaciones: po.especificaciones || null,
                        fecha_agregado: po.fecha_agregado,
                        
                        // Datos de la tabla Producto
                        producto: po.producto ? {
                            id_producto: po.producto.id_producto,
                            nombre_producto: po.producto.nombre_producto,
                            categoria_producto: po.producto.categoria_producto,
                            descripcion_producto: po.producto.descripcion_producto || null,
                            precio_venta: parseFloat(po.producto.precio_venta || 0),
                            servicio: po.producto.servicio || false,
                            activo: po.producto.activo || true
                        } : null
                    })) || [],

                    // DATOS DE HISTORIAL
                    ultimo_historial: operacion.historial?.length > 0
                        ? operacion.historial.sort((a, b) => 
                            new Date(b.fecha_cambio) - new Date(a.fecha_cambio))[0]
                        : null,

                    // DATOS DE ENCUESTA
                    encuesta: operacion.encuesta ? {
                        id_encuesta: operacion.encuesta.id_encuesta,
                        nota_pedido: operacion.encuesta.nota_pedido || null,
                        nota_repartidor: operacion.encuesta.nota_repartidor || null,
                        comentario: operacion.encuesta.comentario || null,
                        fecha_encuesta: operacion.encuesta.fecha_encuesta
                    } : null,

                    // RESUMEN DE LA OPERACION
                    total_productos: operacion.productosOperacion?.length || 0,
                    total_unidades: operacion.productosOperacion?.reduce((sum, po) => 
                        sum + (po.cantidad || 0), 0) || 0,
                    tiene_encuesta: !!operacion.encuesta,
                    esta_pagado: parseFloat(operacion.cantidad_abono || 0) >= parseFloat(operacion.costo_operacion || 0)
                })).sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion)) || []
            };
        });

        return {
            success: true,
            data: clientesConCompras,
            count: clientesConCompras.length,
            message: "Clientes con compras obtenidos exitosamente",
            estadisticas_generales: {
                total_clientes: clientesConCompras.length,
                clientes_con_direccion_completa: clientesConCompras.filter(c => 
                    c.direccion.tiene_direccion_completa).length,
                total_operaciones: clientesConCompras.reduce((sum, c) => 
                    sum + c.resumen_compras.total_operaciones, 0),
                total_facturado: parseFloat(clientesConCompras.reduce((sum, c) => 
                    sum + c.resumen_compras.total_gastado, 0).toFixed(2)),
                total_cobrado: parseFloat(clientesConCompras.reduce((sum, c) => 
                    sum + c.resumen_compras.total_abonado, 0).toFixed(2)),
                total_por_cobrar: parseFloat(clientesConCompras.reduce((sum, c) => 
                    sum + c.resumen_compras.total_pendiente, 0).toFixed(2))
            }
        };
    } catch (error) {
        console.error("Error al obtener clientes con compras:", error);
        return {
            success: false,
            message: "Error al obtener los clientes con sus compras",
            error: error.message
        };
    }
}

/**
 * Obtiene un cliente específico con todas sus compras
 * Tablas: User → Cliente, User → Operacion → ProductoOperacion → Producto
 * @param {number} id_usuario - ID del usuario cliente
 * @returns {Promise<Object>} Cliente con sus operaciones
 */
export async function getClienteConComprasByIdService(id_usuario) {
    try {
        const user = await userRepository.findOne({
            where: { 
                id: id_usuario,
                rol: Role.CLIENTE 
            },
            relations: [
                "cliente",                                      // User → Cliente (1:1)
                "comuna",                                       // User → Comuna (N:1)
                "comuna.provincia",                             // Comuna → Provincia (N:1)
                "comuna.provincia.region",                      // Provincia → Region (N:1)
                "operaciones",                                  // User → Operacion (1:N)
                "operaciones.productosOperacion",               // Operacion → ProductoOperacion (1:N)
                "operaciones.productosOperacion.producto",      // ProductoOperacion → Producto (N:1)
                "operaciones.historial",                        // Operacion → Historial (1:N)
                "operaciones.encuesta"                          // Operacion → Encuesta (1:1)
            ]
        });

        if (!user) {
            return {
                success: false,
                message: "Cliente no encontrado"
            };
        }

        const totalCompras = user.operaciones?.length || 0;
        const totalGastado = user.operaciones?.reduce((sum, op) => 
            sum + parseFloat(op.costo_operacion || 0), 0) || 0;
        const totalAbonado = user.operaciones?.reduce((sum, op) => 
            sum + parseFloat(op.cantidad_abono || 0), 0) || 0;
        const totalPendiente = totalGastado - totalAbonado;

        const operacionesPorEstado = user.operaciones?.reduce((acc, op) => {
            acc[op.estado_operacion] = (acc[op.estado_operacion] || 0) + 1;
            return acc;
        }, {}) || {};

        // Análisis de encuestas
        const encuestasRespondidas = user.operaciones?.filter(op => op.encuesta).length || 0;
        const promedioNotaPedido = encuestasRespondidas > 0
            ? user.operaciones
                .filter(op => op.encuesta)
                .reduce((sum, op) => sum + (op.encuesta.nota_pedido || 0), 0) / encuestasRespondidas
            : 0;
        const promedioNotaRepartidor = encuestasRespondidas > 0
            ? user.operaciones
                .filter(op => op.encuesta)
                .reduce((sum, op) => sum + (op.encuesta.nota_repartidor || 0), 0) / encuestasRespondidas
            : 0;

        const clienteConCompras = {
            // ========== TABLA: USER ==========
            id: user.id,
            rut: user.rut,
            nombreCompleto: user.nombreCompleto,
            email: user.email,
            telefono: user.telefono,
            rol: user.rol,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,

            // ========== TABLA: COMUNA, PROVINCIA, REGION ==========
            direccion: {
                comuna: user.comuna?.nombre_comuna || null,
                provincia: (user.comuna?.provincia && user.comuna.provincia.nombre_provincia) 
                    ? user.comuna.provincia.nombre_provincia 
                    : null,
                region: (user.comuna?.provincia?.region && user.comuna.provincia.region.nombre_region) 
                    ? user.comuna.provincia.region.nombre_region 
                    : null,
                id_comuna: user.comuna?.id_comuna || null,
                id_provincia: user.comuna?.provincia?.id_provincia || null,
                id_region: user.comuna?.provincia?.region?.id_region || null,
                tiene_direccion_completa: !!(user.comuna && user.comuna.provincia && user.comuna.provincia.region)
            },

            // ========== TABLA: CLIENTE ==========
            info_cliente: user.cliente ? {
                id_cliente: user.cliente.id_cliente,
                cumpleanos_cliente: user.cliente.cumpleanos_cliente || null,
                whatsapp_cliente: user.cliente.whatsapp_cliente || null,
                correo_alterno_cliente: user.cliente.correo_alterno_cliente || null,
                categoria_cliente: user.cliente.categoria_cliente || "regular",
                descuento_cliente: parseFloat(user.cliente.descuento_cliente || 0),
                acepta_uso_datos: user.cliente.Acepta_uso_datos || false
            } : null,

            // ========== RESUMEN DE COMPRAS ==========
            resumen_compras: {
                total_operaciones: totalCompras,
                total_gastado: parseFloat(totalGastado.toFixed(2)),
                total_abonado: parseFloat(totalAbonado.toFixed(2)),
                total_pendiente: parseFloat(totalPendiente.toFixed(2)),
                promedio_compra: totalCompras > 0 ? parseFloat((totalGastado / totalCompras).toFixed(2)) : 0,
                operaciones_por_estado: operacionesPorEstado,
                encuestas_respondidas: encuestasRespondidas,
                promedio_nota_pedido: parseFloat(promedioNotaPedido.toFixed(2)),
                promedio_nota_repartidor: parseFloat(promedioNotaRepartidor.toFixed(2))
            },

            // ========== TABLA: OPERACION → PRODUCTO_OPERACION → PRODUCTO ==========
            compras: user.operaciones?.map(operacion => ({
                // DATOS DE OPERACION
                id_operacion: operacion.id_operacion,
                estado_operacion: operacion.estado_operacion,
                costo_operacion: parseFloat(operacion.costo_operacion || 0),
                cantidad_abono: parseFloat(operacion.cantidad_abono || 0),
                saldo_pendiente: parseFloat(operacion.costo_operacion || 0) - parseFloat(operacion.cantidad_abono || 0),
                descripcion_operacion: operacion.descripcion_operacion || null,
                fecha_creacion: operacion.fecha_creacion,
                fecha_entrega_estimada: operacion.fecha_entrega_estimada || null,

                // DATOS DE PRODUCTO_OPERACION Y PRODUCTO
                productos: operacion.productosOperacion?.map(po => ({
                    // Datos de ProductoOperacion
                    id_producto_operacion: po.id_producto_operacion,
                    cantidad: po.cantidad || 0,
                    precio_unitario: parseFloat(po.precio_unitario || 0),
                    precio_total: parseFloat(po.precio_total || 0),
                    especificaciones: po.especificaciones || null,
                    fecha_agregado: po.fecha_agregado,
                    
                    // Datos de Producto
                    producto: po.producto ? {
                        id_producto: po.producto.id_producto,
                        nombre_producto: po.producto.nombre_producto,
                        categoria_producto: po.producto.categoria_producto,
                        descripcion_producto: po.producto.descripcion_producto || null,
                        precio_venta: parseFloat(po.producto.precio_venta || 0),
                        servicio: po.producto.servicio || false,
                        activo: po.producto.activo || true
                    } : null
                })) || [],

                // DATOS DE HISTORIAL
                historial: operacion.historial?.map(h => ({
                    id_h_operacion: h.id_h_operacion,
                    cotizacion: h.cotizacion || false,
                    orden_trabajo: h.orden_trabajo || false,
                    pendiente: h.pendiente || false,
                    en_proceso: h.en_proceso || false,
                    terminada: h.terminada || false,
                    completada: h.completada || false,
                    pagada: h.pagada || false,
                    entregada: h.entregada || false,
                    anulada: h.anulada || false,
                    fecha_cambio: h.fecha_cambio
                })).sort((a, b) => new Date(b.fecha_cambio) - new Date(a.fecha_cambio)) || [],

                // DATOS DE ENCUESTA
                encuesta: operacion.encuesta ? {
                    id_encuesta: operacion.encuesta.id_encuesta,
                    nota_pedido: operacion.encuesta.nota_pedido || null,
                    nota_repartidor: operacion.encuesta.nota_repartidor || null,
                    comentario: operacion.encuesta.comentario || null,
                    fecha_encuesta: operacion.encuesta.fecha_encuesta
                } : null,

                // RESUMEN DE LA OPERACION
                total_productos: operacion.productosOperacion?.length || 0,
                total_unidades: operacion.productosOperacion?.reduce((sum, po) => 
                    sum + (po.cantidad || 0), 0) || 0,
                tiene_encuesta: !!operacion.encuesta,
                esta_pagado: parseFloat(operacion.cantidad_abono || 0) >= parseFloat(operacion.costo_operacion || 0),
                porcentaje_pagado: operacion.costo_operacion > 0 
                    ? parseFloat(((operacion.cantidad_abono / operacion.costo_operacion) * 100).toFixed(2))
                    : 0
            })).sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion)) || []
        };

        return {
            success: true,
            data: clienteConCompras,
            message: "Cliente con compras obtenido exitosamente"
        };
    } catch (error) {
        console.error("Error al obtener cliente con compras por ID:", error);
        return {
            success: false,
            message: "Error al obtener el cliente con sus compras",
            error: error.message
        };
    }
}

/**
 * Obtiene clientes con compras filtrado por rango de fechas
 */
export async function getClientesConComprasPorFechasService(fecha_inicio, fecha_fin) {
    try {
        const clientes = await userRepository.find({
            where: { rol: Role.CLIENTE },
            relations: [
                "cliente",
                "comuna",
                "comuna.provincia",
                "comuna.provincia.region",
                "operaciones",
                "operaciones.productosOperacion",
                "operaciones.productosOperacion.producto",
                "operaciones.historial",
                "operaciones.encuesta"
            ]
        });

        // Filtrar operaciones por fecha
        const clientesFiltrados = clientes.map(user => {
            const operacionesFiltradas = user.operaciones?.filter(op => {
                const fechaOp = new Date(op.fecha_creacion);
                const inicio = fecha_inicio ? new Date(fecha_inicio) : null;
                const fin = fecha_fin ? new Date(fecha_fin) : null;

                if (inicio && fin) {
                    return fechaOp >= inicio && fechaOp <= fin;
                } else if (inicio) {
                    return fechaOp >= inicio;
                } else if (fin) {
                    return fechaOp <= fin;
                }
                return true;
            }) || [];

            return {
                ...user,
                operaciones: operacionesFiltradas
            };
        }).filter(cliente => cliente.operaciones.length > 0);

        const totalCompras = clientesFiltrados.reduce((sum, c) =>
            sum + (c.operaciones?.length || 0), 0);
        const totalGastado = clientesFiltrados.reduce((sum, c) =>
            sum + c.operaciones.reduce((s, op) => s + parseFloat(op.costo_operacion || 0), 0), 0);

        return {
            success: true,
            data: clientesFiltrados,
            count: clientesFiltrados.length,
            message: "Clientes con compras filtrados por fecha obtenidos exitosamente",
            periodo: { fecha_inicio, fecha_fin },
            totales: {
                operaciones: totalCompras,
                facturado: parseFloat(totalGastado.toFixed(2))
            }
        };
    } catch (error) {
        console.error("Error al obtener clientes por fechas:", error);
        return {
            success: false,
            message: "Error al obtener clientes con compras por fechas",
            error: error.message
        };
    }
}

/**
 * Obtiene estadísticas avanzadas por periodo
 */
export async function getEstadisticasAvanzadasService(fecha_inicio, fecha_fin) {
    try {
        const clientes = await userRepository.find({
            where: { rol: Role.CLIENTE },
            relations: ["operaciones", "operaciones.productosOperacion", "operaciones.encuesta"]
        });

        let operacionesPeriodo = [];
        clientes.forEach(cliente => {
            const ops = cliente.operaciones?.filter(op => {
                const fechaOp = new Date(op.fecha_creacion);
                const inicio = fecha_inicio ? new Date(fecha_inicio) : null;
                const fin = fecha_fin ? new Date(fecha_fin) : null;

                if (inicio && fin) {
                    return fechaOp >= inicio && fechaOp <= fin;
                } else if (inicio) {
                    return fechaOp >= inicio;
                } else if (fin) {
                    return fechaOp <= fin;
                }
                return true;
            }) || [];
            operacionesPeriodo = operacionesPeriodo.concat(ops);
        });

        const totalVentas = operacionesPeriodo.reduce((sum, op) =>
            sum + parseFloat(op.costo_operacion || 0), 0);
        const totalCobrado = operacionesPeriodo.reduce((sum, op) =>
            sum + parseFloat(op.cantidad_abono || 0), 0);

        const estadisticasPorEstado = operacionesPeriodo.reduce((acc, op) => {
            if (!acc[op.estado_operacion]) {
                acc[op.estado_operacion] = { cantidad: 0, monto: 0 };
            }
            acc[op.estado_operacion].cantidad++;
            acc[op.estado_operacion].monto += parseFloat(op.costo_operacion || 0);
            return acc;
        }, {});

        return {
            success: true,
            data: {
                periodo: { fecha_inicio, fecha_fin },
                total_operaciones: operacionesPeriodo.length,
                total_ventas: parseFloat(totalVentas.toFixed(2)),
                total_cobrado: parseFloat(totalCobrado.toFixed(2)),
                total_pendiente: parseFloat((totalVentas - totalCobrado).toFixed(2)),
                ticket_promedio: operacionesPeriodo.length > 0
                    ? parseFloat((totalVentas / operacionesPeriodo.length).toFixed(2))
                    : 0,
                por_estado: estadisticasPorEstado,
                clientes_activos: new Set(operacionesPeriodo.map(op => op.id_usuario)).size
            },
            message: "Estadísticas avanzadas obtenidas exitosamente"
        };
    } catch (error) {
        console.error("Error al obtener estadísticas avanzadas:", error);
        return {
            success: false,
            message: "Error al obtener estadísticas avanzadas",
            error: error.message
        };
    }
}

/**
 * Crea una nueva operación enlazada con productos
 * Usa la tabla intermedia ProductoOperacion (N:N)
 * @param {Object} operacionData - Datos de la operación
 * @param {Array} productos - Array de productos [{id_producto, cantidad, precio_unitario, especificaciones}]
 * @returns {Promise<Object>} Operación creada con sus productos
 */
export async function createOperacionConProductosService(operacionData, productos) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const operacionRepository = queryRunner.manager.getRepository("Operacion");
        const productoRepository = queryRunner.manager.getRepository("Producto");
        const productoOperacionRepository = queryRunner.manager.getRepository("ProductoOperacion");
        const historialRepository = queryRunner.manager.getRepository("Historial");
        const clienteRepository = queryRunner.manager.getRepository("Cliente");

        // ========================================
        // 1. Validar entidades User y Cliente
        // ========================================

        // 1a. Validar que el User existe y tiene rol CLIENTE
        const userCliente = await userRepository.findOne({
            where: { id: operacionData.id_cliente, rol: Role.CLIENTE },
            relations: ["cliente"] // Cargar relación con Cliente
        });

        if (!userCliente) {
            await queryRunner.rollbackTransaction();
            return {
                success: false,
                message: `Usuario con ID ${operacionData.id_cliente} no encontrado o no tiene rol de cliente`
            };
        }

        // 1b. Validar que el User tenga registro en la tabla Cliente
        if (!userCliente.cliente) {
            await queryRunner.rollbackTransaction();
            return {
                success: false,
                message: `El usuario con ID ${operacionData.id_cliente} no tiene perfil de cliente completo. Debe crear primero el perfil de cliente.`
            };
        }

        // 2. Validar productos y calcular costo total
        if (!productos || productos.length === 0) {
            await queryRunner.rollbackTransaction();
            return {
                success: false,
                message: "Debe incluir al menos un producto en la operación"
            };
        }

        let costoTotal = 0;
        const productosValidados = [];

        for (const prod of productos) {
            // Validar que el producto existe
            const producto = await productoRepository.findOne({
                where: { id_producto: prod.id_producto, activo: true }
            });

            if (!producto) {
                await queryRunner.rollbackTransaction();
                return {
                    success: false,
                    message: `Producto con ID ${prod.id_producto} no encontrado o inactivo`
                };
            }

            // Validar cantidad
            if (!prod.cantidad || prod.cantidad <= 0) {
                await queryRunner.rollbackTransaction();
                return {
                    success: false,
                    message: `La cantidad del producto ${producto.nombre_producto} debe ser mayor a 0`
                };
            }

            // Usar precio_unitario del request o del producto
            const precioUnitario = prod.precio_unitario || parseFloat(producto.precio_venta);
            const precioTotal = precioUnitario * prod.cantidad;

            productosValidados.push({
                producto,
                cantidad: prod.cantidad,
                precio_unitario: precioUnitario,
                precio_total: precioTotal,
                especificaciones: prod.especificaciones || null
            });

            costoTotal += precioTotal;
        }

        // 3. Crear la operación
        const nuevaOperacion = operacionRepository.create({
            cliente: { id: operacionData.id_cliente },
            estado_operacion: operacionData.estado_operacion || "pendiente",
            costo_operacion: costoTotal,
            cantidad_abono: operacionData.cantidad_abono || 0,
            descripcion_operacion: operacionData.descripcion_operacion || null,
            fecha_entrega_estimada: operacionData.fecha_entrega_estimada || null
        });

        const operacionGuardada = await operacionRepository.save(nuevaOperacion);

        // 4. Crear registros en ProductoOperacion (tabla intermedia)
        const productosOperacion = [];
        for (const prodValidado of productosValidados) {
            const productoOperacion = productoOperacionRepository.create({
                operacion: { id_operacion: operacionGuardada.id_operacion },
                producto: { id_producto: prodValidado.producto.id_producto },
                cantidad: prodValidado.cantidad,
                precio_unitario: prodValidado.precio_unitario,
                precio_total: prodValidado.precio_total,
                especificaciones: prodValidado.especificaciones
            });

            const guardado = await productoOperacionRepository.save(productoOperacion);
            productosOperacion.push(guardado);
        }

        // 5. Crear registro inicial en Historial
        const estadoInicial = operacionData.estado_operacion || "pendiente";
        const historialInicial = historialRepository.create({
            operacion: { id_operacion: operacionGuardada.id_operacion },
            cotizacion: estadoInicial === "cotizacion",
            orden_trabajo: estadoInicial === "orden_trabajo",
            pendiente: estadoInicial === "pendiente",
            en_proceso: estadoInicial === "en_proceso",
            terminada: estadoInicial === "terminada",
            completada: estadoInicial === "completada",
            pagada: estadoInicial === "pagada",
            entregada: estadoInicial === "entregada",
            anulada: estadoInicial === "anulada"
        });

        await historialRepository.save(historialInicial);

        // 6. Commit de la transacción
        await queryRunner.commitTransaction();

        // 7. Cargar la operación completa con todas sus relaciones
        const operacionCompleta = await operacionRepository.findOne({
            where: { id_operacion: operacionGuardada.id_operacion },
            relations: [
                "cliente",
                "productosOperacion",
                "productosOperacion.producto",
                "historial"
            ]
        });

        return {
            success: true,
            message: "Operación creada exitosamente con sus productos",
            data: {
                id_operacion: operacionCompleta.id_operacion,
                estado_operacion: operacionCompleta.estado_operacion,
                costo_operacion: parseFloat(operacionCompleta.costo_operacion),
                cantidad_abono: parseFloat(operacionCompleta.cantidad_abono),
                saldo_pendiente: parseFloat(operacionCompleta.costo_operacion) - parseFloat(operacionCompleta.cantidad_abono),
                descripcion_operacion: operacionCompleta.descripcion_operacion,
                fecha_creacion: operacionCompleta.fecha_creacion,
                fecha_entrega_estimada: operacionCompleta.fecha_entrega_estimada,
                cliente: {
                    id: operacionCompleta.cliente.id,
                    nombreCompleto: operacionCompleta.cliente.nombreCompleto,
                    email: operacionCompleta.cliente.email,
                    rut: operacionCompleta.cliente.rut
                },
                productos: operacionCompleta.productosOperacion.map(po => ({
                    id_producto_operacion: po.id_producto_operacion,
                    cantidad: po.cantidad,
                    precio_unitario: parseFloat(po.precio_unitario),
                    precio_total: parseFloat(po.precio_total),
                    especificaciones: po.especificaciones,
                    producto: {
                        id_producto: po.producto.id_producto,
                        nombre_producto: po.producto.nombre_producto,
                        categoria_producto: po.producto.categoria_producto,
                        descripcion_producto: po.producto.descripcion_producto
                    }
                })),
                total_productos: operacionCompleta.productosOperacion.length,
                total_unidades: operacionCompleta.productosOperacion.reduce(
                    (sum, po) => sum + po.cantidad, 0
                )
            }
        };

    } catch (error) {
        await queryRunner.rollbackTransaction();
        console.error("Error al crear operación con productos:", error);
        return {
            success: false,
            message: "Error al crear la operación con productos",
            error: error.message
        };
    } finally {
        await queryRunner.release();
    }
}