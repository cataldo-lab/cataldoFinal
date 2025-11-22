"use strict";
import {
    createProductoService,
    getProductosService,
    getProductoByIdService,
    updateProductoService,
    deleteProductoService,
    getCategoriasService
} from "../../services/staff/producto.service.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess
} from "../../handlers/responseHandlers.js";
import {
    createProductoValidation,
    updateProductoValidation,
    productosQueryValidation,
    productoIdValidation
} from "../../validations/producto.validation.js";

/**
 * POST /api/productos
 * Crear un nuevo producto
 */
export async function createProducto(req, res) {
    try {
        const productoData = req.body;

        // Validar datos con Joi
        const { error } = createProductoValidation.validate(productoData);
        if (error) return handleErrorClient(res, 400, error.message);

        const [producto, errorService] = await createProductoService(productoData);

        if (errorService) return handleErrorClient(res, 400, errorService);

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
        // Convertir strings a booleanos para validación
        const queryParams = {
            categoria: req.query.categoria,
            activo: req.query.activo !== undefined ? req.query.activo === 'true' : undefined,
            servicio: req.query.servicio !== undefined ? req.query.servicio === 'true' : undefined,
            oferta: req.query.oferta !== undefined ? req.query.oferta === 'true' : undefined
        };

        // Limpiar filtros vacíos antes de validar
        const filtros = {};
        Object.keys(queryParams).forEach(key => {
            if (queryParams[key] !== undefined) filtros[key] = queryParams[key];
        });

        // Validar query params
        const { error } = productosQueryValidation.validate(filtros);
        if (error) return handleErrorClient(res, 400, error.message);

        const [productos, errorService] = await getProductosService(filtros);

        if (errorService) return handleErrorServer(res, 500, errorService);

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

        // Validar ID
        const { error } = productoIdValidation.validate({ id: parseInt(id) });
        if (error) return handleErrorClient(res, 400, error.message);

        const [producto, errorService] = await getProductoByIdService(parseInt(id));

        if (errorService) return handleErrorClient(res, 404, errorService);

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

        // Validar ID
        const { error: idError } = productoIdValidation.validate({ id: parseInt(id) });
        if (idError) return handleErrorClient(res, 400, idError.message);

        // Validar datos a actualizar
        const { error: bodyError } = updateProductoValidation.validate(datosActualizados);
        if (bodyError) return handleErrorClient(res, 400, bodyError.message);

        const [producto, errorService] = await updateProductoService(
            parseInt(id),
            datosActualizados
        );

        if (errorService) return handleErrorClient(res, 404, errorService);

        handleSuccess(res, 200, "Producto actualizado exitosamente", producto);

    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

/**
 * DELETE /api/productos/:id
 */
export async function deleteProducto(req, res) {
    try {
        const { id } = req.params;

        // Validar ID
        const { error } = productoIdValidation.validate({ id: parseInt(id) });
        if (error) return handleErrorClient(res, 400, error.message);

        const [producto, errorService] = await deleteProductoService(parseInt(id));

        if (errorService) return handleErrorClient(res, 404, errorService);

        handleSuccess(res, 200, "Producto eliminado exitosamente", producto);

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