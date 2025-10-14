"use strict";
import { AppDataSource } from "../config/configDb.js";
import { Operacion } from "../entity/operacion.entity.js";
import { ProductoOperacion } from "../entity/producto_operacion.entity.js";
import { Historial } from "../entity/historial.entity.js";
import { Producto } from "../entity/producto.entity.js";
import { User } from "../entity/personas/user.entity.js";

/**
 * Crear una nueva operación con sus productos
 */
export async function createOperacionService(operacionData) {
    try {
        const operacionRepository = AppDataSource.getRepository("Operacion");
        const productoOperacionRepository = AppDataSource.getRepository("ProductoOperacion");
        const historialRepository = AppDataSource.getRepository("Historial");
        const userRepository = AppDataSource.getRepository("User");
        const productoRepository = AppDataSource.getRepository("Producto");

        // Validar que el cliente existe y tiene rol cliente
        const cliente = await userRepository.findOne({
            where: { id: operacionData.id_cliente }
        });

        if (!cliente) {
            return [null, "Cliente no encontrado"];
        }

        if (cliente.rol !== "cliente") {
            return [null, "El usuario seleccionado no es un cliente"];
        }

        // Validar que los productos existen
        if (!operacionData.productos || operacionData.productos.length === 0) {
            return [null, "Debe agregar al menos un producto a la operación"];
        }

        // Calcular costo total de la operación
        let costoTotal = 0;
        const productosValidados = [];

        for (const prod of operacionData.productos) {
            const producto = await productoRepository.findOne({
                where: { id_producto: prod.id_producto }
            });

            if (!producto) {
                return [null, `Producto con ID ${prod.id_producto} no encontrado`];
            }

            if (!producto.activo) {
                return [null, `El producto ${producto.nombre_producto} no está activo`];
            }

            const precioUnitario = prod.precio_unitario || producto.precio_venta;
            const cantidad = prod.cantidad || 1;
            const precioTotal = precioUnitario * cantidad;

            costoTotal += precioTotal;

            productosValidados.push({
                producto: producto,
                cantidad: cantidad,
                precio_unitario: precioUnitario,
                precio_total: precioTotal,
                especificaciones: prod.especificaciones || null
            });
        }

        // Crear la operación
        const nuevaOperacion = operacionRepository.create({
            cliente: cliente,
            estado_operacion: operacionData.estado_operacion || "pendiente",
            costo_operacion: costoTotal,
            cantidad_abono: operacionData.cantidad_abono || 0,
            descripcion_operacion: operacionData.descripcion_operacion || null,
            fecha_entrega_estimada: operacionData.fecha_entrega_estimada || null
        });

        const operacionGuardada = await operacionRepository.save(nuevaOperacion);

        // Crear los registros en producto_operacion
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

        // Crear registro en historial
        const estadoInicial = {};
        estadoInicial[operacionGuardada.estado_operacion] = true;

        const historial = historialRepository.create({
            operacion: operacionGuardada,
            ...estadoInicial
        });

        await historialRepository.save(historial);

        // Retornar operación completa con relaciones
        const operacionCompleta = await operacionRepository.findOne({
            where: { id_operacion: operacionGuardada.id_operacion },
            relations: ["cliente", "productosOperacion", "productosOperacion.producto", "historial"]
        });

        return [operacionCompleta, null];

    } catch (error) {
        console.error("Error al crear operación:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Obtener todas las operaciones con filtros opcionales
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
 * Actualizar estado de operación
 */
export async function updateEstadoOperacionService(id, nuevoEstado) {
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
            return [null, "Estado no válido"];
        }

        // Actualizar estado
        operacion.estado_operacion = nuevoEstado;
        await operacionRepository.save(operacion);

        // Registrar en historial
        const nuevoHistorial = {};
        nuevoHistorial[nuevoEstado] = true;

        const historial = historialRepository.create({
            operacion: operacion,
            ...nuevoHistorial
        });

        await historialRepository.save(historial);

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

/**
 * Actualizar operación completa
 */
export async function updateOperacionService(id, datosActualizados) {
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
            operacion.cantidad_abono = datosActualizados.cantidad_abono;
        }

        if (datosActualizados.fecha_entrega_estimada !== undefined) {
            operacion.fecha_entrega_estimada = datosActualizados.fecha_entrega_estimada;
        }

        await operacionRepository.save(operacion);

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
 * Eliminar (anular) operación
 */
export async function deleteOperacionService(id) {
    try {
        const operacionRepository = AppDataSource.getRepository("Operacion");

        const operacion = await operacionRepository.findOne({
            where: { id_operacion: id }
        });

        if (!operacion) {
            return [null, "Operación no encontrada"];
        }

        // En lugar de eliminar, cambiar estado a anulada
        return await updateEstadoOperacionService(id, "anulada");

    } catch (error) {
        console.error("Error al eliminar operación:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Obtener estadísticas del dashboard
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
            ingresosMes
        }, null];

    } catch (error) {
        console.error("Error al obtener estadísticas:", error);
        return [null, "Error interno del servidor"];
    }
}