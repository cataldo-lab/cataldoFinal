"use strict";
import { AppDataSource } from "../../config/configDb.js";
import { logAuditEvent, TipoEvento, NivelSeveridad } from "../audit.service.js";

//Dashboard stats service

export async function createOperacionService(operacionData, usuarioEmail) {
    try {

        if (!usuarioEmail) {
            return [null, "Se requiere email del usuario para crear la operación"];
        }

        const operacionRepository = AppDataSource.getRepository("Operacion");
        const productoOperacionRepository = AppDataSource.getRepository("ProductoOperacion");
        const historialRepository = AppDataSource.getRepository("Historial");
        const userRepository = AppDataSource.getRepository("User");
        const productoRepository = AppDataSource.getRepository("Producto");

        // ===== VALIDACIÓN 1: Cliente existe y tiene rol correcto =====
        const cliente = await userRepository.findOne({
            where: { id: operacionData.id_cliente }
        });

        if (!cliente) {
            await logAuditEvent({
                tipo: TipoEvento.OPERATION_CREATED,
                email: usuarioEmail,
                descripcion: `Intento fallido: cliente ${operacionData.id_cliente} no encontrado`,
                nivel: NivelSeveridad.WARNING,
                exito: false
            });
            return [null, "Cliente no encontrado"];
        }

        if (cliente.rol !== "cliente") {
            return [null, "El usuario seleccionado no es un cliente válido"];
        }

        // ===== VALIDACIÓN 2: Hay productos en la operación =====
        if (!operacionData.productos || operacionData.productos.length === 0) {
            return [null, "Debe agregar al menos un producto a la operación"];
        }

        // ===== VALIDACIÓN 3: Productos existen y están activos =====
        let costoTotal = 0;
        const productosValidados = [];

        for (const prod of operacionData.productos) {
            // Buscar producto en BD
            const producto = await productoRepository.findOne({
                where: { id_producto: prod.id_producto }
            });

            if (!producto) {
                return [null, `Producto con ID ${prod.id_producto} no encontrado`];
            }

            if (!producto.activo) {
                return [null, `El producto "${producto.nombre_producto}" no está activo`];
            }

            // Calcular precios
            const cantidad = prod.cantidad || 1;
            const precioUnitario = prod.precio_unitario || producto.precio_venta;
            const precioTotal = precioUnitario * cantidad;

            costoTotal += precioTotal;

            // Guardar datos validados
            productosValidados.push({
                producto: producto,
                cantidad: cantidad,
                precio_unitario: precioUnitario,
                precio_total: precioTotal,
                especificaciones: prod.especificaciones || null
            });
        }

        // ===== CREAR OPERACIÓN =====
        const nuevaOperacion = operacionRepository.create({
            cliente: cliente,
            estado_operacion: operacionData.estado_operacion || "pendiente",
            costo_operacion: costoTotal,
            cantidad_abono: operacionData.cantidad_abono || 0,
            descripcion_operacion: operacionData.descripcion_operacion || null,
            fecha_entrega_estimada: operacionData.fecha_entrega_estimada || null
        });

        const operacionGuardada = await operacionRepository.save(nuevaOperacion);

        // ===== CREAR RELACIONES PRODUCTO-OPERACIÓN =====
        for (const prodValidado of productosValidados) {
            const productoOperacion = productoOperacionRepository.create({
                operacion: operacionGuardada,
                producto: prodValidado.producto,
                cantidad: prodValidado.cantidad,
                precio_unitario: prodValidado.precio_unitario,
                precio_total: prodValidado.precio_total,
                especificaciones: prodValidado.especificaciones
            });

            await productoOperacionRepository.save(productoOperacion);
        }

        // ===== CREAR REGISTRO EN HISTORIAL =====
        const estadoInicial = {};
        estadoInicial[operacionGuardada.estado_operacion] = true;

        const historial = historialRepository.create({
            operacion: operacionGuardada,
            ...estadoInicial
        });

await historialRepository.save(historial);

        await historialRepository.save(historial);

        // ===== AUDITORÍA =====
        await logAuditEvent({
            tipo: TipoEvento.OPERATION_CREATED,
            email: usuarioEmail,
            descripcion: `Operación #${operacionGuardada.id_operacion} creada para ${cliente.nombreCompleto}`,
            entidad: "Operacion",
            idEntidad: operacionGuardada.id_operacion,
            datosDespues: {
                id_operacion: operacionGuardada.id_operacion,
                cliente_id: cliente.id,
                cliente_nombre: cliente.nombreCompleto,
                costo_total: costoTotal,
                cantidad_productos: productosValidados.length,
                estado: operacionGuardada.estado_operacion
            },
            nivel: NivelSeveridad.INFO,
            exito: true
        });

        // ===== RETORNAR OPERACIÓN COMPLETA =====
        const operacionCompleta = await operacionRepository.findOne({
            where: { id_operacion: operacionGuardada.id_operacion },
            relations: [
                "cliente",
                "productosOperacion",
                "productosOperacion.producto",
                "historial"
            ]
        });

        return [operacionCompleta, null];

    } catch (error) {
        console.error("Error al crear operación:", error);
        
        await logAuditEvent({
            tipo: TipoEvento.OPERATION_CREATED,
            email: usuarioEmail,
            descripcion: `Error al crear operación: ${error.message}`,
            nivel: NivelSeveridad.ERROR,
            exito: false
        });
        
        return [null, "Error interno del servidor"];
    }
}

/**
 * Obtener todas las operaciones con filtros
 * @param {Object} filtros - Filtros opcionales
 * @returns {Promise<[Array|null, string|null]>}
 */
export async function getOperacionesService(filtros = {}) {
    try {
        const operacionRepository = AppDataSource.getRepository("Operacion");

        const queryBuilder = operacionRepository
            .createQueryBuilder("operacion")
            .leftJoinAndSelect("operacion.cliente", "cliente")
            .leftJoinAndSelect("operacion.productosOperacion", "productosOperacion")
            .leftJoinAndSelect("productosOperacion.producto", "producto")
            .leftJoinAndSelect("operacion.historial", "historial")
            .orderBy("operacion.fecha_creacion", "DESC");

        // Aplicar filtros
        if (filtros.estado_operacion) {
            queryBuilder.andWhere("operacion.estado_operacion = :estado", {
                estado: filtros.estado_operacion
            });
        }

        if (filtros.id_cliente) {
            queryBuilder.andWhere("cliente.id = :clienteId", {
                clienteId: filtros.id_cliente
            });
        }

        if (filtros.fecha_desde) {
            queryBuilder.andWhere("operacion.fecha_creacion >= :fechaDesde", {
                fechaDesde: filtros.fecha_desde
            });
        }

        if (filtros.fecha_hasta) {
            queryBuilder.andWhere("operacion.fecha_creacion <= :fechaHasta", {
                fechaHasta: filtros.fecha_hasta
            });
        }

        const operaciones = await queryBuilder.getMany();

        return [operaciones, null];

    } catch (error) {
        console.error("Error al obtener operaciones:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Obtener una operación por ID
 * @param {number} id - ID de la operación
 * @returns {Promise<[Object|null, string|null]>}
 */
export async function getOperacionByIdService(id) {
    try {
        const operacionRepository = AppDataSource.getRepository("Operacion");

        const operacion = await operacionRepository.findOne({
            where: { id_operacion: id },
            relations: [
                "cliente",
                "cliente.comuna",
                "cliente.comuna.provincia",
                "cliente.comuna.provincia.region",
                "productosOperacion",
                "productosOperacion.producto",
                "historial",
                "encuesta"
            ]
        });

        if (!operacion) {
            return [null, "Operación no encontrada"];
        }

        return [operacion, null];

    } catch (error) {
        console.error("Error al obtener operación:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Actualizar estado de una operación
 * @param {number} id - ID de la operación
 * @param {string} nuevoEstado - Nuevo estado
 * @param {string} usuarioEmail - Email del empleado/gerente
 * @returns {Promise<[Object|null, string|null]>}
 */
export async function updateEstadoOperacionService(id, nuevoEstado, usuarioEmail) {
    try {
        const operacionRepository = AppDataSource.getRepository("Operacion");
        const historialRepository = AppDataSource.getRepository("Historial");

        const operacion = await operacionRepository.findOne({
            where: { id_operacion: id }
        });

        if (!operacion) {
            return [null, "Operación no encontrada"];
        }

        // Validar estado
        const estadosValidos = [
            "cotizacion",
            "orden_trabajo",
            "pendiente",
            "en_proceso",
            "terminada",
            "completada",
            "entregada",
            "pagada",
            "anulada"
        ];

        if (!estadosValidos.includes(nuevoEstado)) {
            return [null, `Estado no válido. Estados permitidos: ${estadosValidos.join(", ")}`];
        }

        const estadoAnterior = operacion.estado_operacion;

        // Actualizar estado
        operacion.estado_operacion = nuevoEstado;

        // Si cambia a "orden_trabajo" y no tiene fecha_primer_abono, registrarla
        if (nuevoEstado === "orden_trabajo" && !operacion.fecha_primer_abono) {
            operacion.fecha_primer_abono = new Date();
            console.log(`📅 Registrando fecha de primer abono para operación #${id}:`, operacion.fecha_primer_abono);
        }

        await operacionRepository.save(operacion);

        // Registrar en historial
        const nuevoHistorial = {};
        nuevoHistorial[nuevoEstado] = true;

        const historial = historialRepository.create({
            operacion: operacion,
            ...nuevoHistorial
        });

        await historialRepository.save(historial);

        // Auditoría
        await logAuditEvent({
            tipo: TipoEvento.OPERATION_STATUS_CHANGED,
            email: usuarioEmail,
            descripcion: `Operación #${id}: ${estadoAnterior} → ${nuevoEstado}`,
            entidad: "Operacion",
            idEntidad: id,
            datosAntes: { estado: estadoAnterior },
            datosDespues: { estado: nuevoEstado },
            nivel: NivelSeveridad.INFO,
            exito: true
        });

        // Retornar operación actualizada
        const operacionActualizada = await operacionRepository.findOne({
            where: { id_operacion: id },
            relations: ["cliente", "productosOperacion", "productosOperacion.producto", "historial"]
        });

        return [operacionActualizada, null];

    } catch (error) {
        console.error("Error al actualizar estado:", error);
        return [null, "Error interno del servidor"];
    }
}


export async function updateOperacionService(id, datosActualizados, usuarioEmail) {
    try {
        const operacionRepository = AppDataSource.getRepository("Operacion");

        const operacion = await operacionRepository.findOne({
            where: { id_operacion: id }
        });

        if (!operacion) {
            return [null, "Operación no encontrada"];
        }

        // Actualizar campos permitidos
        if (datosActualizados.descripcion_operacion !== undefined) {
            operacion.descripcion_operacion = datosActualizados.descripcion_operacion;
        }

        if (datosActualizados.cantidad_abono !== undefined) {
            // Validar que el abono no sea mayor que el costo
            if (datosActualizados.cantidad_abono > operacion.costo_operacion) {
                return [null, "El abono no puede ser mayor que el costo total"];
            }
            operacion.cantidad_abono = datosActualizados.cantidad_abono;
        }

        if (datosActualizados.fecha_entrega_estimada !== undefined) {
            operacion.fecha_entrega_estimada = datosActualizados.fecha_entrega_estimada;
        }

        await operacionRepository.save(operacion);

        // Auditoría
        await logAuditEvent({
            tipo: TipoEvento.OPERATION_UPDATED,
            email: usuarioEmail,
            descripcion: `Operación #${id} actualizada`,
            entidad: "Operacion",
            idEntidad: id,
            datosDespues: datosActualizados,
            nivel: NivelSeveridad.INFO,
            exito: true
        });

        const operacionActualizada = await operacionRepository.findOne({
            where: { id_operacion: id },
            relations: ["cliente", "productosOperacion", "productosOperacion.producto", "historial"]
        });

        return [operacionActualizada, null];

    } catch (error) {
        console.error("Error al actualizar operación:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Anular operación (solo gerente)
 * @param {number} id - ID de la operación
 * @param {string} usuarioEmail - Email del gerente
 * @returns {Promise<[Object|null, string|null]>}
 */
export async function deleteOperacionService(id, usuarioEmail) {
    try {
        const operacionRepository = AppDataSource.getRepository("Operacion");

        const operacion = await operacionRepository.findOne({
            where: { id_operacion: id },
            relations: ["cliente"]
        });

        if (!operacion) {
            return [null, "Operación no encontrada"];
        }

        const datosAntes = {
            id_operacion: operacion.id_operacion,
            cliente_id: operacion.cliente.id,
            cliente_nombre: operacion.cliente.nombreCompleto,
            costo: operacion.costo_operacion,
            estado: operacion.estado_operacion
        };

        // Cambiar estado a anulada (no eliminar físicamente)
        const resultado = await updateEstadoOperacionService(id, "anulada", usuarioEmail);

        // Auditoría
        await logAuditEvent({
            tipo: TipoEvento.OPERATION_CANCELLED,
            email: usuarioEmail,
            descripcion: `Operación #${id} anulada por gerente`,
            entidad: "Operacion",
            idEntidad: id,
            datosAntes: datosAntes,
            datosDespues: { estado: "anulada" },
            nivel: NivelSeveridad.WARNING,
            exito: true
        });

        return resultado;

    } catch (error) {
        console.error("Error al anular operación:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Obtener estadísticas del dashboard
 * @returns {Promise<[Object|null, string|null]>}
 */
export async function getDashboardStatsService() {
    try {
        const operacionRepository = AppDataSource.getRepository("Operacion");

        // Operaciones pendientes
        const pendientes = await operacionRepository.count({
            where: { estado_operacion: "pendiente" }
        });

        // Operaciones en proceso
        const enProceso = await operacionRepository.count({
            where: { estado_operacion: "en_proceso" }
        });

        // Ingresos del mes actual
        const fechaInicio = new Date();
        fechaInicio.setDate(1);
        fechaInicio.setHours(0, 0, 0, 0);

        const operacionesCompletadas = await operacionRepository
            .createQueryBuilder("operacion")
            .where("operacion.estado_operacion IN (:...estados)", {
                estados: ["completada", "pagada", "entregada"]
            })
            .andWhere("operacion.fecha_creacion >= :fechaInicio", { fechaInicio })
            .getMany();

        const ingresosMes = operacionesCompletadas.reduce(
            (sum, op) => sum + parseFloat(op.costo_operacion || 0),
            0
        );

        return [{
            pendientes,
            enProceso,
            ingresosMes: parseFloat(ingresosMes.toFixed(2))
        }, null];

    } catch (error) {
        console.error("Error al obtener estadísticas:", error);
        return [null, "Error interno del servidor"];
    }
}