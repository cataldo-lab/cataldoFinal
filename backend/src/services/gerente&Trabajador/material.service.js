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