// backend/src/services/staff/proveedor.service.js
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
        const representanteRepository = AppDataSource.getRepository("Representante");

        // Validar datos obligatorios del proveedor
        if (!proveedorData.rol_proveedor) {
            return [null, "El rol del proveedor es obligatorio"];
        }

        if (!proveedorData.rut_proveedor) {
            return [null, "El RUT del proveedor es obligatorio"];
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
            fono_proveedor: proveedorData.fono_proveedor || null,
            correo_proveedor: proveedorData.correo_proveedor || null,
            nombre_representanter: proveedorData.nombre_representanter || null,
            apellido_representante: proveedorData.apellido_representante || null,
            rut_representante: proveedorData.rut_representante || null,
            activo: true
        });

        const proveedorGuardado = await proveedorRepository.save(nuevoProveedor);

        // Si viene información completa de representante, crear registro en tabla Representante
        if (proveedorData.representante) {
            const rep = proveedorData.representante;
            
            const nuevoRepresentante = representanteRepository.create({
                nombre_representante: rep.nombre_representante,
                apellido_representante: rep.apellido_representante,
                rut_representante: rep.rut_representante,
                cargo_representante: rep.cargo_representante,
                fono_representante: rep.fono_representante || null,
                correo_representante: rep.correo_representante || null,
                es_principal: true,
                activo: true,
                proveedor: proveedorGuardado
            });

            await representanteRepository.save(nuevoRepresentante);
        }

        // Retornar proveedor con sus relaciones
        const proveedorCompleto = await proveedorRepository.findOne({
            where: { id_proveedor: proveedorGuardado.id_proveedor },
            relations: ["representantes", "materiales"]
        });

        return [proveedorCompleto, null];

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
            .leftJoinAndSelect("proveedor.representantes", "representantes")
            .leftJoinAndSelect("proveedor.materiales", "materiales")
            .where("proveedor.activo = :activo", { activo: true })
            .orderBy("proveedor.rol_proveedor", "ASC");

        // Aplicar filtros
        if (filtros.rol_proveedor) {
            queryBuilder.andWhere("proveedor.rol_proveedor ILIKE :rol", {
                rol: `%${filtros.rol_proveedor}%`
            });
        }

        if (filtros.search) {
            queryBuilder.andWhere(
                "(proveedor.rol_proveedor ILIKE :search OR " +
                "proveedor.rut_proveedor ILIKE :search OR " +
                "proveedor.correo_proveedor ILIKE :search OR " +
                "proveedor.nombre_representanter ILIKE :search OR " +
                "proveedor.apellido_representante ILIKE :search OR " +
                "representantes.nombre_representante ILIKE :search OR " +
                "representantes.apellido_representante ILIKE :search)",
                { search: `%${filtros.search}%` }
            );
        }

        const proveedores = await queryBuilder.getMany();

        // Formatear respuesta
        const proveedoresFormateados = proveedores.map(p => ({
            id_proveedor: p.id_proveedor,
            rol_proveedor: p.rol_proveedor,
            rut_proveedor: p.rut_proveedor,
            fono_proveedor: p.fono_proveedor,
            correo_proveedor: p.correo_proveedor,
            // Representante embebido
            nombre_representanter: p.nombre_representanter,
            apellido_representante: p.apellido_representante,
            rut_representante: p.rut_representante,
            nombre_completo_rep: p.nombre_representanter && p.apellido_representante 
                ? `${p.nombre_representanter} ${p.apellido_representante}`
                : null,
            activo: p.activo,
            fecha_creacion: p.fecha_creacion,
            // Relaciones
            representantes_adicionales: p.representantes || [],
            total_representantes: (p.representantes || []).length,
            materiales: p.materiales || [],
            total_materiales: (p.materiales || []).length
        }));

        return [proveedoresFormateados, null];

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
        const compraRepository = AppDataSource.getRepository("CompraMaterial");

        // Obtener proveedor con relaciones
        const proveedor = await proveedorRepository.findOne({
            where: { id_proveedor: id },
            relations: ["representantes", "materiales"]
        });

        if (!proveedor) {
            return [null, "Proveedor no encontrado"];
        }

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
        
        const totalGastado = comprasRecibidas.reduce(
            (sum, c) => sum + parseFloat(c.precio_total || 0), 0
        );

        // Construir respuesta completa
        const respuesta = {
            proveedor: {
                id_proveedor: proveedor.id_proveedor,
                rol_proveedor: proveedor.rol_proveedor,
                rut_proveedor: proveedor.rut_proveedor,
                fono_proveedor: proveedor.fono_proveedor,
                correo_proveedor: proveedor.correo_proveedor,
                // Representante embebido
                nombre_representanter: proveedor.nombre_representanter,
                apellido_representante: proveedor.apellido_representante,
                rut_representante: proveedor.rut_representante,
                nombre_completo_rep: proveedor.nombre_representanter && proveedor.apellido_representante
                    ? `${proveedor.nombre_representanter} ${proveedor.apellido_representante}`
                    : null,
                activo: proveedor.activo,
                fecha_creacion: proveedor.fecha_creacion
            },
            representantes: (proveedor.representantes || []).map(r => ({
                id_representante: r.id_representante,
                nombre_completo: `${r.nombre_representante} ${r.apellido_representante}`,
                nombre_representante: r.nombre_representante,
                apellido_representante: r.apellido_representante,
                rut_representante: r.rut_representante,
                cargo_representante: r.cargo_representante,
                fono_representante: r.fono_representante,
                correo_representante: r.correo_representante,
                es_principal: r.es_principal,
                activo: r.activo
            })),
            materiales_suministrados: (proveedor.materiales || []).map(m => ({
                id_material: m.id_material,
                nombre_material: m.nombre_material,
                unidad_medida: m.unidad_medida,
                precio_unitario: parseFloat(m.precio_unitario || 0),
                existencia_material: m.existencia_material,
                stock_minimo: m.stock_minimo,
                activo: m.activo
            })),
            estadisticas: {
                total_materiales: (proveedor.materiales || []).length,
                total_compras: totalCompras,
                compras_recibidas: comprasRecibidas.length,
                compras_pendientes: comprasPendientes.length,
                total_gastado: parseFloat(totalGastado.toFixed(2))
            },
            ultimas_compras: compras.slice(0, 10).map(c => ({
                id_compra: c.id_compra,
                material: c.material?.nombre_material || "N/A",
                precio_total: parseFloat(c.precio_total || 0),
                fecha_compra: c.fecha_compra,
                estado: c.estado
            }))
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
        if (datosActualizados.rut_proveedor && 
            datosActualizados.rut_proveedor !== proveedor.rut_proveedor) {
            const rutExistente = await proveedorRepository.findOne({
                where: { rut_proveedor: datosActualizados.rut_proveedor }
            });

            if (rutExistente && rutExistente.id_proveedor !== id) {
                return [null, "Ya existe un proveedor con este RUT"];
            }
        }

        // Actualizar campos permitidos
        const camposActualizables = [
            'rol_proveedor',
            'rut_proveedor',
            'fono_proveedor',
            'correo_proveedor',
            'nombre_representanter',
            'apellido_representante',
            'rut_representante',
            'activo'
        ];

        camposActualizables.forEach(campo => {
            if (datosActualizados[campo] !== undefined) {
                proveedor[campo] = datosActualizados[campo];
            }
        });

        proveedor.fecha_actualizacion = new Date();

        await proveedorRepository.save(proveedor);

        const proveedorActualizado = await proveedorRepository.findOne({
            where: { id_proveedor: id },
            relations: ["representantes", "materiales"]
        });

        return [proveedorActualizado, null];

    } catch (error) {
        console.error("Error al actualizar proveedor:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Eliminar proveedor (soft delete)
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

        // Verificar si tiene materiales activos
        const materialesActivos = (proveedor.materiales || []).filter(m => m.activo);
        
        if (materialesActivos.length > 0) {
            return [null, `No se puede eliminar. Tiene ${materialesActivos.length} material(es) activo(s)`];
        }

        // Soft delete
        proveedor.activo = false;
        proveedor.fecha_actualizacion = new Date();
        await proveedorRepository.save(proveedor);

        return [{ mensaje: "Proveedor desactivado exitosamente" }, null];

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
        if (!representanteData.nombre_representante || !representanteData.apellido_representante) {
            return [null, "Nombre y apellido del representante son obligatorios"];
        }

        if (!representanteData.rut_representante) {
            return [null, "El RUT del representante es obligatorio"];
        }

        if (!representanteData.cargo_representante) {
            return [null, "El cargo del representante es obligatorio"];
        }

        // Si es principal, quitar el flag de otros
        if (representanteData.es_principal) {
            await representanteRepository
                .createQueryBuilder()
                .update()
                .set({ es_principal: false })
                .where("id_proveedor = :id_proveedor", { id_proveedor })
                .execute();
        }

        // Crear representante
        const nuevoRepresentante = representanteRepository.create({
            nombre_representante: representanteData.nombre_representante,
            apellido_representante: representanteData.apellido_representante,
            rut_representante: representanteData.rut_representante,
            cargo_representante: representanteData.cargo_representante,
            fono_representante: representanteData.fono_representante || null,
            correo_representante: representanteData.correo_representante || null,
            es_principal: representanteData.es_principal || false,
            activo: true,
            proveedor: proveedor
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
            where: { 
                proveedor: { id_proveedor: id_proveedor },
                activo: true
            },
            order: { 
                es_principal: "DESC",
                creado_en: "DESC" 
            }
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
            where: { id_representante: id_representante },
            relations: ["proveedor"]
        });

        if (!representante) {
            return [null, "Representante no encontrado"];
        }

        // Si se marca como principal, quitar el flag de otros
        if (datosActualizados.es_principal && !representante.es_principal) {
            await representanteRepository
                .createQueryBuilder()
                .update()
                .set({ es_principal: false })
                .where("id_proveedor = :id_proveedor", { 
                    id_proveedor: representante.proveedor.id_proveedor 
                })
                .execute();
        }

        // Actualizar campos permitidos
        const camposActualizables = [
            'nombre_representante',
            'apellido_representante',
            'rut_representante',
            'cargo_representante',
            'fono_representante',
            'correo_representante',
            'es_principal',
            'activo'
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
 * Eliminar representante (soft delete)
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

        // Soft delete
        representante.activo = false;
        await representanteRepository.save(representante);

        return [{ mensaje: "Representante desactivado exitosamente" }, null];

    } catch (error) {
        console.error("Error al eliminar representante:", error);
        return [null, "Error interno del servidor"];
    }
}