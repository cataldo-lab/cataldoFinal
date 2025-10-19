// backend/src/services/gerente&Trabajador/material.service.js
"use strict";
import { AppDataSource } from "../../config/configDb.js";
import { detectarCategoria } from "../../entity/materiales.entity.js";

/**
 * Crear un nuevo material
 */
export async function createMaterialService(materialData) {
    try {
        const materialRepository = AppDataSource.getRepository("Materiales");
        const proveedorRepository = AppDataSource.getRepository("Proveedores");

        // Validar datos básicos
        if (!materialData.nombre_material) {
            return [null, "El nombre del material es obligatorio"];
        }

        if (!materialData.unidad_medida) {
            return [null, "La unidad de medida es obligatoria"];
        }

        if (!materialData.precio_unitario || materialData.precio_unitario <= 0) {
            return [null, "El precio unitario debe ser mayor a 0"];
        }

        // Buscar proveedor (opcional)
        let proveedor = null;
        if (materialData.id_proveedor) {
            proveedor = await proveedorRepository.findOne({
                where: { id_proveedor: materialData.id_proveedor }
            });
            
            if (!proveedor) {
                return [null, "Proveedor no encontrado"];
            }
        }

        // Detectar categoría automáticamente basada en unidad de medida
        const categoria = detectarCategoria(materialData.unidad_medida);

        // Crear material
        const nuevoMaterial = materialRepository.create({
            nombre_material: materialData.nombre_material,
            existencia_material: materialData.existencia_material || 0,
            categoria_unidad: categoria,
            unidad_medida: materialData.unidad_medida,
            precio_unitario: materialData.precio_unitario,
            stock_minimo: materialData.stock_minimo || 1,
            activo: materialData.activo !== undefined ? materialData.activo : true,
            proveedor: proveedor
        });

        const materialGuardado = await materialRepository.save(nuevoMaterial);

        return [materialGuardado, null];

    } catch (error) {
        console.error("Error al crear material:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Obtener todos los materiales con filtros
 */
export async function getMaterialesService(filtros = {}) {
    try {
        const materialRepository = AppDataSource.getRepository("Materiales");

        const queryBuilder = materialRepository
            .createQueryBuilder("material")
            .leftJoinAndSelect("material.proveedor", "proveedor")
            .orderBy("material.nombre_material", "ASC");

        // Aplicar filtros
        if (filtros.categoria_unidad) {
            queryBuilder.andWhere("material.categoria_unidad = :categoria", {
                categoria: filtros.categoria_unidad
            });
        }

        if (filtros.activo !== undefined) {
            queryBuilder.andWhere("material.activo = :activo", {
                activo: filtros.activo
            });
        }

        if (filtros.bajo_stock === 'true') {
            queryBuilder.andWhere("material.existencia_material <= material.stock_minimo");
        }

        if (filtros.id_proveedor) {
            queryBuilder.andWhere("proveedor.id_proveedor = :proveedorId", {
                proveedorId: filtros.id_proveedor
            });
        }

        const materiales = await queryBuilder.getMany();

        return [materiales, null];

    } catch (error) {
        console.error("Error al obtener materiales:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Obtener un material por ID
 */
export async function getMaterialByIdService(id) {
    try {
        const materialRepository = AppDataSource.getRepository("Materiales");

        const material = await materialRepository.findOne({
            where: { id_material: id },
            relations: ["proveedor", "productos", "productos.producto"]
        });

        if (!material) {
            return [null, "Material no encontrado"];
        }

        return [material, null];

    } catch (error) {
        console.error("Error al obtener material:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Actualizar material
 */
export async function updateMaterialService(id, datosActualizados) {
    try {
        const materialRepository = AppDataSource.getRepository("Materiales");

        const material = await materialRepository.findOne({
            where: { id_material: id }
        });

        if (!material) {
            return [null, "Material no encontrado"];
        }

        // Actualizar campos permitidos
        const camposActualizables = [
            'nombre_material',
            'existencia_material',
            'unidad_medida',
            'precio_unitario',
            'stock_minimo',
            'activo'
        ];

        camposActualizables.forEach(campo => {
            if (datosActualizados[campo] !== undefined) {
                material[campo] = datosActualizados[campo];
            }
        });

        // Si cambia la unidad de medida, actualizar categoría
        if (datosActualizados.unidad_medida) {
            material.categoria_unidad = detectarCategoria(datosActualizados.unidad_medida);
        }

        await materialRepository.save(material);

        const materialActualizado = await materialRepository.findOne({
            where: { id_material: id },
            relations: ["proveedor"]
        });

        return [materialActualizado, null];

    } catch (error) {
        console.error("Error al actualizar material:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Actualizar solo el stock de un material
 */
export async function updateStockMaterialService(id, cantidad, operacion = 'set') {
    try {
        const materialRepository = AppDataSource.getRepository("Materiales");

        const material = await materialRepository.findOne({
            where: { id_material: id }
        });

        if (!material) {
            return [null, "Material no encontrado"];
        }

        // Calcular nuevo stock según operación
        let nuevoStock = material.existencia_material;

        switch (operacion) {
            case 'add':
                nuevoStock += cantidad;
                break;
            case 'subtract':
                nuevoStock -= cantidad;
                if (nuevoStock < 0) {
                    return [null, "No hay suficiente stock disponible"];
                }
                break;
            case 'set':
                nuevoStock = cantidad;
                break;
            default:
                return [null, "Operación no válida. Use: 'add', 'subtract', o 'set'"];
        }

        material.existencia_material = nuevoStock;
        await materialRepository.save(material);

        return [material, null];

    } catch (error) {
        console.error("Error al actualizar stock:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Eliminar (desactivar) material
 */
export async function deleteMaterialService(id) {
    try {
        const materialRepository = AppDataSource.getRepository("Materiales");

        const material = await materialRepository.findOne({
            where: { id_material: id }
        });

        if (!material) {
            return [null, "Material no encontrado"];
        }

        // Desactivar en lugar de eliminar
        material.activo = false;
        await materialRepository.save(material);

        return [material, null];

    } catch (error) {
        console.error("Error al eliminar material:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Obtener materiales con stock bajo
 */
export async function getMaterialesBajoStockService() {
    try {
        const materialRepository = AppDataSource.getRepository("Materiales");

        const materiales = await materialRepository
            .createQueryBuilder("material")
            .leftJoinAndSelect("material.proveedor", "proveedor")
            .where("material.existencia_material <= material.stock_minimo")
            .andWhere("material.activo = :activo", { activo: true })
            .orderBy("material.existencia_material", "ASC")
            .getMany();

        return [materiales, null];

    } catch (error) {
        console.error("Error al obtener materiales bajo stock:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Obtener alertas de stock
 */
export async function getAlertasStockService() {
    try {
        const materialRepository = AppDataSource.getRepository("Materiales");

        const materiales = await materialRepository
            .createQueryBuilder("material")
            .leftJoinAndSelect("material.proveedor", "proveedor")
            .where("material.activo = :activo", { activo: true })
            .getMany();

        const alertas = {
            critico: [],  // Stock = 0
            bajo: [],     // Stock <= stock_minimo
            medio: [],    // Stock <= stock_minimo * 1.5
            normal: []    // Stock > stock_minimo * 1.5
        };

        materiales.forEach(material => {
            if (material.existencia_material === 0) {
                alertas.critico.push(material);
            } else if (material.existencia_material <= material.stock_minimo) {
                alertas.bajo.push(material);
            } else if (material.existencia_material <= material.stock_minimo * 1.5) {
                alertas.medio.push(material);
            } else {
                alertas.normal.push(material);
            }
        });

        return [alertas, null];

    } catch (error) {
        console.error("Error al obtener alertas:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Helper: Determinar estado del stock
 */
function getEstadoStock(material) {
    if (material.existencia_material === 0) {
        return { nivel: "critico", mensaje: "Sin stock" };
    } else if (material.existencia_material <= material.stock_minimo) {
        return { nivel: "bajo", mensaje: "Stock bajo" };
    } else if (material.existencia_material <= material.stock_minimo * 1.5) {
        return { nivel: "medio", mensaje: "Stock medio" };
    } else {
        return { nivel: "normal", mensaje: "Stock adecuado" };
    }
}

/**
 * Obtener un material con TODO su detalle (proveedor, compras, productos que lo usan)
 */
export async function getMaterialDetalleCompletoService(id_material) {
    try {
        const materialRepository = AppDataSource.getRepository("Materiales");
        const compraRepository = AppDataSource.getRepository("CompraMaterial");

        // 1. Obtener material con proveedor
        const material = await materialRepository.findOne({
            where: { id_material: id_material },
            relations: ["proveedor", "productos", "productos.producto"]
        });

        if (!material) {
            return [null, "Material no encontrado"];
        }

        // 2. Obtener historial de compras del material
        const compras = await compraRepository.find({
            where: { material: { id_material: id_material } },
            relations: ["proveedor", "usuario"],
            order: { fecha_compra: "DESC" }
        });

        // 3. Calcular estadísticas de compras
        const totalCompras = compras.length;
        const comprasPendientes = compras.filter(c => c.estado === "pendiente").length;
        const comprasRecibidas = compras.filter(c => c.estado === "recibida").length;
        
        const totalInvertido = compras
            .filter(c => c.estado === "recibida")
            .reduce((sum, c) => sum + parseFloat(c.precio_total), 0);

        const cantidadTotalComprada = compras
            .filter(c => c.estado === "recibida")
            .reduce((sum, c) => sum + parseFloat(c.cantidad), 0);

        // 4. Obtener productos que usan este material
        const productosQueUsan = material.productos.map(pm => ({
            id_producto: pm.producto.id_producto,
            nombre_producto: pm.producto.nombre_producto,
            cantidad_necesaria: pm.cantidad_necesaria,
            costo_unitario: pm.costo_unitario
        }));

        // 5. Formatear compras
        const comprasFormateadas = compras.map(c => ({
            id_compra: c.id_compra,
            cantidad: parseFloat(c.cantidad),
            precio_unitario: parseFloat(c.precio_unitario),
            precio_total: parseFloat(c.precio_total),
            fecha_compra: c.fecha_compra,
            fecha_entrega_estimada: c.fecha_entrega_estimada,
            fecha_entrega_real: c.fecha_entrega_real,
            estado: c.estado,
            tipo_documento: c.tipo_documento,
            numero_documento: c.numero_documento,
            proveedor: {
                id_proveedor: c.proveedor.id_proveedor,
                nombre_representanter: c.proveedor.nombre_representanter,
                apellido_representante: c.proveedor.apellido_representante,
                fono_proveedor: c.proveedor.fono_proveedor
            },
            usuario_registro: c.usuario ? {
                id: c.usuario.id,
                nombreCompleto: c.usuario.nombreCompleto,
                email: c.usuario.email
            } : null,
            observaciones: c.observaciones
        }));

        // 6. Construir respuesta completa
        const respuesta = {
            material: {
                id_material: material.id_material,
                nombre_material: material.nombre_material,
                existencia_material: material.existencia_material,
                categoria_unidad: material.categoria_unidad,
                unidad_medida: material.unidad_medida,
                precio_unitario: parseFloat(material.precio_unitario),
                stock_minimo: material.stock_minimo,
                activo: material.activo,
                estado_stock: getEstadoStock(material),
                proveedor: material.proveedor ? {
                    id_proveedor: material.proveedor.id_proveedor,
                    rol_proveedor: material.proveedor.rol_proveedor,
                    rut_proveedor: material.proveedor.rut_proveedor,
                    nombre_representanter: material.proveedor.nombre_representanter,
                    apellido_representante: material.proveedor.apellido_representante,
                    fono_proveedor: material.proveedor.fono_proveedor,
                    correo_proveedor: material.proveedor.correo_proveedor
                } : null
            },
            estadisticas_compras: {
                total_compras: totalCompras,
                compras_pendientes: comprasPendientes,
                compras_recibidas: comprasRecibidas,
                cantidad_total_comprada: cantidadTotalComprada,
                total_invertido: parseFloat(totalInvertido.toFixed(2)),
                precio_promedio_compra: totalCompras > 0 
                    ? parseFloat((totalInvertido / cantidadTotalComprada).toFixed(2))
                    : 0
            },
            historial_compras: comprasFormateadas,
            productos_que_usan: productosQueUsan
        };

        return [respuesta, null];

    } catch (error) {
        console.error("Error al obtener detalle completo del material:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Obtener todos los materiales CON información resumida de proveedor y compras
 */
export async function getMaterialesConResumenService(filtros = {}) {
    try {
        const materialRepository = AppDataSource.getRepository("Materiales");
        const compraRepository = AppDataSource.getRepository("CompraMaterial");

        // Construir query
        const queryBuilder = materialRepository
            .createQueryBuilder("material")
            .leftJoinAndSelect("material.proveedor", "proveedor")
            .orderBy("material.nombre_material", "ASC");

        // Aplicar filtros
        if (filtros.categoria_unidad) {
            queryBuilder.andWhere("material.categoria_unidad = :categoria", {
                categoria: filtros.categoria_unidad
            });
        }

        if (filtros.activo !== undefined) {
            queryBuilder.andWhere("material.activo = :activo", {
                activo: filtros.activo
            });
        }

        if (filtros.bajo_stock === 'true') {
            queryBuilder.andWhere("material.existencia_material <= material.stock_minimo");
        }

        if (filtros.id_proveedor) {
            queryBuilder.andWhere("proveedor.id_proveedor = :proveedorId", {
                proveedorId: filtros.id_proveedor
            });
        }

        const materiales = await queryBuilder.getMany();

        // Para cada material, obtener resumen de compras
        const materialesConResumen = await Promise.all(
            materiales.map(async (material) => {
                const compras = await compraRepository.find({
                    where: { material: { id_material: material.id_material } }
                });

                const ultimaCompra = compras.length > 0 
                    ? compras.reduce((prev, curr) => 
                        new Date(prev.fecha_compra) > new Date(curr.fecha_compra) ? prev : curr
                    )
                    : null;

                const comprasPendientes = compras.filter(c => c.estado === "pendiente").length;

                return {
                    id_material: material.id_material,
                    nombre_material: material.nombre_material,
                    existencia_material: material.existencia_material,
                    unidad_medida: material.unidad_medida,
                    categoria_unidad: material.categoria_unidad,
                    precio_unitario: parseFloat(material.precio_unitario),
                    stock_minimo: material.stock_minimo,
                    activo: material.activo,
                    estado_stock: getEstadoStock(material),
                    proveedor: material.proveedor ? {
                        id_proveedor: material.proveedor.id_proveedor,
                        nombre_completo: `${material.proveedor.nombre_representanter} ${material.proveedor.apellido_representante}`,
                        fono_proveedor: material.proveedor.fono_proveedor,
                        correo_proveedor: material.proveedor.correo_proveedor
                    } : null,
                    resumen_compras: {
                        total_compras: compras.length,
                        compras_pendientes: comprasPendientes,
                        ultima_compra: ultimaCompra ? {
                            fecha: ultimaCompra.fecha_compra,
                            cantidad: parseFloat(ultimaCompra.cantidad),
                            precio_unitario: parseFloat(ultimaCompra.precio_unitario)
                        } : null
                    }
                };
            })
        );

        return [materialesConResumen, null];

    } catch (error) {
        console.error("Error al obtener materiales con resumen:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Obtener análisis de proveedor (cuánto y qué materiales le hemos comprado)
 */
export async function getAnalisisProveedorService(id_proveedor) {
    try {
        const proveedorRepository = AppDataSource.getRepository("Proveedores");
        const materialRepository = AppDataSource.getRepository("Materiales");
        const compraRepository = AppDataSource.getRepository("CompraMaterial");

        // Verificar proveedor
        const proveedor = await proveedorRepository.findOne({
            where: { id_proveedor: id_proveedor }
        });

        if (!proveedor) {
            return [null, "Proveedor no encontrado"];
        }

        // Materiales de este proveedor
        const materiales = await materialRepository.find({
            where: { proveedor: { id_proveedor: id_proveedor } }
        });

        // Compras a este proveedor
        const compras = await compraRepository.find({
            where: { proveedor: { id_proveedor: id_proveedor } },
            relations: ["material"],
            order: { fecha_compra: "DESC" }
        });

        // Estadísticas
        const totalCompras = compras.length;
        const comprasRecibidas = compras.filter(c => c.estado === "recibida");
        const comprasPendientes = compras.filter(c => c.estado === "pendiente");
        
        const totalGastado = comprasRecibidas.reduce(
            (sum, c) => sum + parseFloat(c.precio_total), 0
        );

        // Análisis por material
        const materialesAnalisis = materiales.map(material => {
            const comprasMaterial = compras.filter(c => c.material.id_material === material.id_material);
            const comprasRecibidasMaterial = comprasMaterial.filter(c => c.estado === "recibida");
            
            const totalComprado = comprasRecibidasMaterial.reduce(
                (sum, c) => sum + parseFloat(c.cantidad), 0
            );
            
            const totalGastadoMaterial = comprasRecibidasMaterial.reduce(
                (sum, c) => sum + parseFloat(c.precio_total), 0
            );

            return {
                id_material: material.id_material,
                nombre_material: material.nombre_material,
                unidad_medida: material.unidad_medida,
                stock_actual: material.existencia_material,
                total_compras: comprasMaterial.length,
                total_comprado: totalComprado,
                total_gastado: parseFloat(totalGastadoMaterial.toFixed(2)),
                precio_promedio: totalComprado > 0 
                    ? parseFloat((totalGastadoMaterial / totalComprado).toFixed(2))
                    : 0
            };
        });

        const respuesta = {
            proveedor: {
                id_proveedor: proveedor.id_proveedor,
                rol_proveedor: proveedor.rol_proveedor,
                rut_proveedor: proveedor.rut_proveedor,
                nombre_completo: `${proveedor.nombre_representanter} ${proveedor.apellido_representante}`,
                fono_proveedor: proveedor.fono_proveedor,
                correo_proveedor: proveedor.correo_proveedor
            },
            estadisticas: {
                total_materiales_suministrados: materiales.length,
                total_compras: totalCompras,
                compras_recibidas: comprasRecibidas.length,
                compras_pendientes: comprasPendientes.length,
                total_gastado: parseFloat(totalGastado.toFixed(2))
            },
            materiales_suministrados: materialesAnalisis,
            ultimas_compras: compras.slice(0, 10).map(c => ({
                id_compra: c.id_compra,
                material: c.material.nombre_material,
                cantidad: parseFloat(c.cantidad),
                precio_total: parseFloat(c.precio_total),
                fecha_compra: c.fecha_compra,
                estado: c.estado
            }))
        };

        return [respuesta, null];

    } catch (error) {
        console.error("Error al obtener análisis de proveedor:", error);
        return [null, "Error interno del servidor"];
    }
}