"use strict";
import { AppDataSource } from "../../config/configDb.js";
// Puede ser usado tanto por gerente como empleado
/**
 * Crear un nuevo producto
 */
export async function createProductoService(productoData) {
    try {
        const productoRepository = AppDataSource.getRepository("Producto");
        const costoTercerosRepository = AppDataSource.getRepository("CostoTerceros");

        // Validar datos básicos
        if (!productoData.nombre_producto || !productoData.categoria_producto) {
            return [null, "Nombre y categoría del producto son obligatorios"];
        }

        if (!productoData.precio_venta || productoData.precio_venta <= 0) {
            return [null, "El precio de venta debe ser mayor a 0"];
        }

        // Buscar costos de terceros (opcional)
        let costoTerceros = null;
        if (productoData.id_costo_terceros) {
            costoTerceros = await costoTercerosRepository.findOne({
                where: { id_costos_terceros: productoData.id_costo_terceros }
            });
        }

        // Crear producto
        const nuevoProducto = productoRepository.create({
            nombre_producto: productoData.nombre_producto,
            categoria_producto: productoData.categoria_producto,
            descripcion_producto: productoData.descripcion_producto || null,
            costo_fabricacion: productoData.costo_fabricacion || 0,
            costo_barnizador: productoData.costo_barnizador || 0,
            costo_vidrio: productoData.costo_vidrio || 0,
            costo_tela: productoData.costo_tela || 0,
            costo_materiales_otros: productoData.costo_materiales_otros || 0,
            precio_venta: productoData.precio_venta,
            margen_ganancia: productoData.margen_ganancia || 30.00,
            oferta: productoData.oferta || false,
            servicio: productoData.servicio || false,
            activo: productoData.activo !== undefined ? productoData.activo : true,
            costoTerceros: costoTerceros
        });

        const productoGuardado = await productoRepository.save(nuevoProducto);

        return [productoGuardado, null];

    } catch (error) {
        console.error("Error al crear producto:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Obtener todos los productos con filtros
 */
export async function getProductosService(filtros = {}) {
    try {
        const productoRepository = AppDataSource.getRepository("Producto");

        const queryBuilder = productoRepository
            .createQueryBuilder("producto")
            .leftJoinAndSelect("producto.costoTerceros", "costoTerceros")
            .orderBy("producto.fecha_creacion", "DESC");

        // Aplicar filtros
        if (filtros.categoria) {
            queryBuilder.andWhere("producto.categoria_producto = :categoria", {
                categoria: filtros.categoria
            });
        }

        if (filtros.activo !== undefined) {
            queryBuilder.andWhere("producto.activo = :activo", {
                activo: filtros.activo
            });
        }

        if (filtros.servicio !== undefined) {
            queryBuilder.andWhere("producto.servicio = :servicio", {
                servicio: filtros.servicio
            });
        }

        if (filtros.oferta !== undefined) {
            queryBuilder.andWhere("producto.oferta = :oferta", {
                oferta: filtros.oferta
            });
        }

        const productos = await queryBuilder.getMany();

        return [productos, null];

    } catch (error) {
        console.error("Error al obtener productos:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Obtener un producto por ID
 */
export async function getProductoByIdService(id) {
    try {
        const productoRepository = AppDataSource.getRepository("Producto");

        const producto = await productoRepository.findOne({
            where: { id_producto: id },
            relations: ["costoTerceros", "materiales", "materiales.material"]
        });

        if (!producto) {
            return [null, "Producto no encontrado"];
        }

        return [producto, null];

    } catch (error) {
        console.error("Error al obtener producto:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Actualizar producto
 */
export async function updateProductoService(id, datosActualizados) {
    try {
        const productoRepository = AppDataSource.getRepository("Producto");

        const producto = await productoRepository.findOne({
            where: { id_producto: id }
        });

        if (!producto) {
            return [null, "Producto no encontrado"];
        }

        // Actualizar campos permitidos
        const camposActualizables = [
            'nombre_producto',
            'categoria_producto',
            'descripcion_producto',
            'costo_fabricacion',
            'costo_barnizador',
            'costo_vidrio',
            'costo_tela',
            'costo_materiales_otros',
            'precio_venta',
            'margen_ganancia',
            'oferta',
            'servicio',
            'activo'
        ];

        camposActualizables.forEach(campo => {
            if (datosActualizados[campo] !== undefined) {
                producto[campo] = datosActualizados[campo];
            }
        });

        producto.fecha_actualizacion = new Date();

        await productoRepository.save(producto);

        const productoActualizado = await productoRepository.findOne({
            where: { id_producto: id },
            relations: ["costoTerceros"]
        });

        return [productoActualizado, null];

    } catch (error) {
        console.error("Error al actualizar producto:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Eliminar (desactivar) producto
 */
export async function deleteProductoService(id) {
    try {
        const productoRepository = AppDataSource.getRepository("Producto");

        const producto = await productoRepository.findOne({
            where: { id_producto: id }
        });

        if (!producto) {
            return [null, "Producto no encontrado"];
        }

        // Desactivar en lugar de eliminar
        producto.activo = false;
        await productoRepository.save(producto);

        return [producto, null];

    } catch (error) {
        console.error("Error al eliminar producto:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Obtener categorías disponibles
 */
export async function getCategoriasService() {
    try {
        const productoRepository = AppDataSource.getRepository("Producto");

        const categorias = await productoRepository
            .createQueryBuilder("producto")
            .select("DISTINCT producto.categoria_producto", "categoria")
            .getRawMany();

        return [categorias.map(c => c.categoria), null];

    } catch (error) {
        console.error("Error al obtener categorías:", error);
        return [null, "Error interno del servidor"];
    }
}