"use strict";
import {
    createProductoService,
    getProductosService,
    getProductoByIdService,
    updateProductoService,
    deleteProductoService,
    getCategoriasService
} from "../../services/gerente&Trabajador/producto.service.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess
} from "../../handlers/responseHandlers.js";

/**
 * POST /api/productos
 * Crear un nuevo producto
 */
export async function createProducto(req, res) {
    try {
        const productoData = req.body;

        const [producto, error] = await createProductoService(productoData);

        if (error) return handleErrorClient(res, 400, error);

        handleSuccess(res, 201, "Producto creado exitosamente", producto);

    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

/**
 * GET /api/productos
 * Obtener todos los productos
 */
export async function getProductos(req, res) {
    try {
        const filtros = {
            categoria: req.query.categoria,
            activo: req.query.activo !== undefined ? req.query.activo === 'true' : undefined,
            servicio: req.query.servicio !== undefined ? req.query.servicio === 'true' : undefined,
            oferta: req.query.oferta !== undefined ? req.query.oferta === 'true' : undefined
        };

        // Limpiar filtros vacíos
        Object.keys(filtros).forEach(key => {
            if (filtros[key] === undefined) delete filtros[key];
        });

        const [productos, error] = await getProductosService(filtros);

        if (error) return handleErrorServer(res, 500, error);

        handleSuccess(res, 200, "Productos obtenidos exitosamente", productos);

    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

/**
 * GET /api/productos/:id
 * Obtener un producto por ID
 */
export async function getProductoById(req, res) {
    try {
        const { id } = req.params;

        const [producto, error] = await getProductoByIdService(parseInt(id));

        if (error) return handleErrorClient(res, 404, error);

        handleSuccess(res, 200, "Producto obtenido exitosamente", producto);

    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

/**
 * PUT /api/productos/:id
 * Actualizar producto
 */
export async function updateProducto(req, res) {
    try {
        const { id } = req.params;
        const datosActualizados = req.body;

        const [producto, error] = await updateProductoService(
            parseInt(id),
            datosActualizados
        );

        if (error) return handleErrorClient(res, 404, error);

        handleSuccess(res, 200, "Producto actualizado exitosamente", producto);

    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

/**
 * DELETE /api/productos/:id
 * Desactivar producto
 */
export async function deleteProducto(req, res) {
    try {
        const { id } = req.params;

        const [producto, error] = await deleteProductoService(parseInt(id));

        if (error) return handleErrorClient(res, 404, error);

        handleSuccess(res, 200, "Producto desactivado exitosamente", producto);

    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

/**
 * GET /api/productos/categorias
 * Obtener categorías disponibles
 */
export async function getCategorias(req, res) {
    try {
        const [categorias, error] = await getCategoriasService();

        if (error) return handleErrorServer(res, 500, error);

        handleSuccess(res, 200, "Categorías obtenidas exitosamente", categorias);

    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}