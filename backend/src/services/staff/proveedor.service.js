// backend/src/services/gerente&Trabajador/proveedor.service.js
"use strict";
import { AppDataSource } from "../../config/configDb.js";

/**
 * ========================================
 * SERVICIOS DE PROVEEDORES
 * ========================================
 */

/**
 * Crear un nuevo proveedor
 */
export async function createProveedorService(proveedorData) {
    try {
        const proveedorRepository = AppDataSource.getRepository("Proveedores");

        // Validar datos obligatorios
        if (!proveedorData.rol_proveedor) {
            return [null, "El rol del proveedor es obligatorio"];
        }

        if (!proveedorData.rut_proveedor) {
            return [null, "El RUT del proveedor es obligatorio"];
        }

        if (!proveedorData.correo_proveedor) {
            return [null, "El correo del proveedor es obligatorio"];
        }

        if (!proveedorData.nombre_representante) {  // ✅ CORREGIDO
            return [null, "El nombre del representante es obligatorio"];
        }

        if (!proveedorData.apellido_representante) {
            return [null, "El apellido del representante es obligatorio"];
        }

        // Verificar que el RUT no exista
        const rutExistente = await proveedorRepository.findOne({
            where: { rut_proveedor: proveedorData.rut_proveedor }
        });

        if (rutExistente) {
            return [null, "Ya existe un proveedor con este RUT"];
        }

        // Crear proveedor
        const nuevoProveedor = proveedorRepository.create({
            rol_proveedor: proveedorData.rol_proveedor,
            rut_proveedor: proveedorData.rut_proveedor,
            nombre_representante: proveedorData.nombre_representante,  // ✅ CORREGIDO
            apellido_representante: proveedorData.apellido_representante,
            rut_representante: proveedorData.rut_representante,
            fono_proveedor: proveedorData.fono_proveedor,
            correo_proveedor: proveedorData.correo_proveedor
        });

        const proveedorGuardado = await proveedorRepository.save(nuevoProveedor);

        return [proveedorGuardado, null];

    } catch (error) {
        console.error("Error al crear proveedor:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Obtener todos los proveedores
 */
export async function getProveedoresService(filtros = {}) {
    try {
        const proveedorRepository = AppDataSource.getRepository("Proveedores");

        const queryBuilder = proveedorRepository
            .createQueryBuilder("proveedor")
            .leftJoinAndSelect("proveedor.materiales", "materiales")
            .orderBy("proveedor.rol_proveedor", "ASC");

        // Aplicar filtros
        if (filtros.rol_proveedor) {
            queryBuilder.andWhere("proveedor.rol_proveedor ILIKE :rol", {
                rol: `%${filtros.rol_proveedor}%`
            });
        }

        if (filtros.search) {
            queryBuilder.andWhere(
                "(proveedor.nombre_representante ILIKE :search OR " +  // ✅ CORREGIDO
                "proveedor.apellido_representante ILIKE :search OR " +
                "proveedor.correo_proveedor ILIKE :search OR " +
                "proveedor.rut_proveedor ILIKE :search OR " +
                "proveedor.rol_proveedor ILIKE :search)",
                { search: `%${filtros.search}%` }
            );
        }

        const proveedores = await queryBuilder.getMany();

        return [proveedores, null];

    } catch (error) {
        console.error("Error al obtener proveedores:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Obtener un proveedor por ID con toda su información
 */
export async function getProveedorByIdService(id) {
    try {
        const proveedorRepository = AppDataSource.getRepository("Proveedores");
        const representanteRepository = AppDataSource.getRepository("Representante");
        const compraRepository = AppDataSource.getRepository("CompraMaterial");

        // Obtener proveedor con materiales
        const proveedor = await proveedorRepository.findOne({
            where: { id_proveedor: id },
            relations: ["materiales"]
        });

        if (!proveedor) {
            return [null, "Proveedor no encontrado"];
        }

        // Obtener representantes del proveedor
        const representantes = await representanteRepository.find({
            where: { proveedor: { id_proveedor: id } },  // ✅ CORREGIDO: proveedor en singular
            order: { creado_en: "DESC" }
        });

        // Obtener historial de compras
        const compras = await compraRepository.find({
            where: { proveedor: { id_proveedor: id } },
            relations: ["material", "usuario"],
            order: { fecha_compra: "DESC" },
            take: 20
        });

        // Calcular estadísticas
        const totalCompras = compras.length;
        const comprasRecibidas = compras.filter(c => c.estado === "recibida");
        const comprasPendientes = compras.filter(c => c.estado === "pendiente");
        const comprasCanceladas = compras.filter(c => c.estado === "cancelada");
        
        const totalGastado = comprasRecibidas.reduce(
            (sum, c) => sum + parseFloat(c.precio_total), 0
        );

        const cantidadTotalComprada = comprasRecibidas.reduce(
            (sum, c) => sum + parseFloat(c.cantidad), 0
        );

        const ultimaCompra = compras.length > 0 ? compras[0] : null;

        // Formatear materiales suministrados
        const materialesFormateados = proveedor.materiales.map(m => ({
            id_material: m.id_material,
            nombre_material: m.nombre_material,
            unidad_medida: m.unidad_medida,
            precio_unitario: parseFloat(m.precio_unitario),
            existencia_material: m.existencia_material,
            stock_minimo: m.stock_minimo,
            activo: m.activo,
            estado_stock: m.existencia_material <= m.stock_minimo ? "bajo" : "normal"
        }));

        // Formatear representantes
        const representantesFormateados = representantes.map(r => ({
            id_representante: r.id_representante,
            nombre_completo: `${r.nombre_representante} ${r.apellido_representante}`,
            nombre_representante: r.nombre_representante,
            apellido_representante: r.apellido_representante,
            rut_representante: r.rut_representante,
            cargo_representante: r.cargo_representante,
            fono_representante: r.fono_representante,
            correo_representante: r.correo_representante,
            fecha_registro: r.creado_en
        }));

        // Formatear últimas compras
        const comprasFormateadas = compras.slice(0, 10).map(c => ({
            id_compra: c.id_compra,
            material: c.material ? c.material.nombre_material : "N/A",
            cantidad: parseFloat(c.cantidad),
            precio_unitario: parseFloat(c.precio_unitario),
            precio_total: parseFloat(c.precio_total),
            fecha_compra: c.fecha_compra,
            fecha_entrega_estimada: c.fecha_entrega_estimada,
            fecha_entrega_real: c.fecha_entrega_real,
            estado: c.estado,
            tipo_documento: c.tipo_documento,
            numero_documento: c.numero_documento,
            usuario_registro: c.usuario ? {
                id: c.usuario.id,
                nombreCompleto: c.usuario.nombreCompleto,
                email: c.usuario.email
            } : null,
            observaciones: c.observaciones
        }));

        // Construir respuesta completa
        const respuesta = {
            proveedor: {
                id_proveedor: proveedor.id_proveedor,
                rol_proveedor: proveedor.rol_proveedor,
                rut_proveedor: proveedor.rut_proveedor,
                nombre_completo: `${proveedor.nombre_representante} ${proveedor.apellido_representante}`,  // ✅ CORREGIDO
                nombre_representante: proveedor.nombre_representante,  // ✅ CORREGIDO
                apellido_representante: proveedor.apellido_representante,
                rut_representante: proveedor.rut_representante,
                fono_proveedor: proveedor.fono_proveedor,
                correo_proveedor: proveedor.correo_proveedor
            },
            materiales_suministrados: materialesFormateados,
            representantes: representantesFormateados,
            estadisticas: {
                total_materiales: proveedor.materiales.length,
                materiales_activos: proveedor.materiales.filter(m => m.activo).length,
                materiales_bajo_stock: proveedor.materiales.filter(m => 
                    m.existencia_material <= m.stock_minimo
                ).length,
                total_compras: totalCompras,
                compras_recibidas: comprasRecibidas.length,
                compras_pendientes: comprasPendientes.length,
                compras_canceladas: comprasCanceladas.length,
                cantidad_total_comprada: cantidadTotalComprada,
                total_gastado: parseFloat(totalGastado.toFixed(2)),
                precio_promedio: cantidadTotalComprada > 0 
                    ? parseFloat((totalGastado / cantidadTotalComprada).toFixed(2))
                    : 0,
                ultima_compra: ultimaCompra ? {
                    fecha: ultimaCompra.fecha_compra,
                    material: ultimaCompra.material ? ultimaCompra.material.nombre_material : "N/A",
                    monto: parseFloat(ultimaCompra.precio_total)
                } : null
            },
            ultimas_compras: comprasFormateadas
        };

        return [respuesta, null];

    } catch (error) {
        console.error("Error al obtener proveedor:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Actualizar proveedor
 */
export async function updateProveedorService(id, datosActualizados) {
    try {
        const proveedorRepository = AppDataSource.getRepository("Proveedores");

        const proveedor = await proveedorRepository.findOne({
            where: { id_proveedor: id }
        });

        if (!proveedor) {
            return [null, "Proveedor no encontrado"];
        }

        // Si se actualiza el RUT, verificar que no exista
        if (datosActualizados.rut_proveedor && datosActualizados.rut_proveedor !== proveedor.rut_proveedor) {
            const rutExistente = await proveedorRepository.findOne({
                where: { rut_proveedor: datosActualizados.rut_proveedor }
            });

            if (rutExistente) {
                return [null, "Ya existe un proveedor con este RUT"];
            }
        }

        // Actualizar campos permitidos
        const camposActualizables = [
            'rol_proveedor',
            'rut_proveedor',
            'nombre_representante',  // ✅ CORREGIDO
            'apellido_representante',
            'rut_representante',
            'fono_proveedor',
            'correo_proveedor'
        ];

        camposActualizables.forEach(campo => {
            if (datosActualizados[campo] !== undefined) {
                proveedor[campo] = datosActualizados[campo];
            }
        });

        await proveedorRepository.save(proveedor);

        const proveedorActualizado = await proveedorRepository.findOne({
            where: { id_proveedor: id },
            relations: ["materiales"]
        });

        return [proveedorActualizado, null];

    } catch (error) {
        console.error("Error al actualizar proveedor:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Eliminar proveedor
 */
export async function deleteProveedorService(id) {
    try {
        const proveedorRepository = AppDataSource.getRepository("Proveedores");

        const proveedor = await proveedorRepository.findOne({
            where: { id_proveedor: id },
            relations: ["materiales"]
        });

        if (!proveedor) {
            return [null, "Proveedor no encontrado"];
        }

        // Verificar si tiene materiales asociados
        if (proveedor.materiales && proveedor.materiales.length > 0) {
            return [null, "No se puede eliminar el proveedor porque tiene materiales asociados"];
        }

        await proveedorRepository.remove(proveedor);

        return [{ mensaje: "Proveedor eliminado exitosamente" }, null];

    } catch (error) {
        console.error("Error al eliminar proveedor:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * ========================================
 * SERVICIOS DE REPRESENTANTES
 * ========================================
 */

/**
 * Crear representante para un proveedor
 */
export async function createRepresentanteService(id_proveedor, representanteData) {
    try {
        const representanteRepository = AppDataSource.getRepository("Representante");
        const proveedorRepository = AppDataSource.getRepository("Proveedores");

        // Validar que el proveedor existe
        const proveedor = await proveedorRepository.findOne({
            where: { id_proveedor: id_proveedor }
        });

        if (!proveedor) {
            return [null, "Proveedor no encontrado"];
        }

        // Validar datos obligatorios
        if (!representanteData.nombre_representante) {
            return [null, "El nombre del representante es obligatorio"];
        }

        if (!representanteData.apellido_representante) {
            return [null, "El apellido del representante es obligatorio"];
        }

        if (!representanteData.rut_representante) {
            return [null, "El RUT del representante es obligatorio"];
        }

        if (!representanteData.cargo_representante) {
            return [null, "El cargo del representante es obligatorio"];
        }

        // Crear representante
        const nuevoRepresentante = representanteRepository.create({
            nombre_representante: representanteData.nombre_representante,
            apellido_representante: representanteData.apellido_representante,
            rut_representante: representanteData.rut_representante,
            cargo_representante: representanteData.cargo_representante,
            fono_representante: representanteData.fono_representante,
            correo_representante: representanteData.correo_representante,
            proveedor: proveedor  // ✅ CORREGIDO: proveedor en singular
        });

        const representanteGuardado = await representanteRepository.save(nuevoRepresentante);

        return [representanteGuardado, null];

    } catch (error) {
        console.error("Error al crear representante:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Obtener representantes de un proveedor
 */
export async function getRepresentantesByProveedorService(id_proveedor) {
    try {
        const representanteRepository = AppDataSource.getRepository("Representante");
        const proveedorRepository = AppDataSource.getRepository("Proveedores");

        // Verificar que el proveedor existe
        const proveedor = await proveedorRepository.findOne({
            where: { id_proveedor: id_proveedor }
        });

        if (!proveedor) {
            return [null, "Proveedor no encontrado"];
        }

        // Obtener representantes
        const representantes = await representanteRepository.find({
            where: { proveedor: { id_proveedor: id_proveedor } },  // ✅ CORREGIDO: proveedor en singular
            order: { creado_en: "DESC" }
        });

        return [representantes, null];

    } catch (error) {
        console.error("Error al obtener representantes:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Actualizar representante
 */
export async function updateRepresentanteService(id_representante, datosActualizados) {
    try {
        const representanteRepository = AppDataSource.getRepository("Representante");

        const representante = await representanteRepository.findOne({
            where: { id_representante: id_representante }
        });

        if (!representante) {
            return [null, "Representante no encontrado"];
        }

        // Actualizar campos permitidos
        const camposActualizables = [
            'nombre_representante',
            'apellido_representante',
            'rut_representante',
            'cargo_representante',
            'fono_representante',
            'correo_representante'
        ];

        camposActualizables.forEach(campo => {
            if (datosActualizados[campo] !== undefined) {
                representante[campo] = datosActualizados[campo];
            }
        });

        await representanteRepository.save(representante);

        return [representante, null];

    } catch (error) {
        console.error("Error al actualizar representante:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Eliminar representante
 */
export async function deleteRepresentanteService(id_representante) {
    try {
        const representanteRepository = AppDataSource.getRepository("Representante");

        const representante = await representanteRepository.findOne({
            where: { id_representante: id_representante }
        });

        if (!representante) {
            return [null, "Representante no encontrado"];
        }

        await representanteRepository.remove(representante);

        return [{ mensaje: "Representante eliminado exitosamente" }, null];

    } catch (error) {
        console.error("Error al eliminar representante:", error);
        return [null, "Error interno del servidor"];
    }
}