"use strict";
import Joi from "joi";

// Validación para crear producto
export const createProductoValidation = Joi.object({
  nombre_producto: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.empty": "El nombre del producto no puede estar vacío.",
      "any.required": "El nombre del producto es obligatorio.",
      "string.base": "El nombre del producto debe ser de tipo texto.",
      "string.min": "El nombre del producto debe tener al menos 3 caracteres.",
      "string.max": "El nombre del producto debe tener como máximo 100 caracteres.",
    }),
  categoria_producto: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.empty": "La categoría del producto no puede estar vacía.",
      "any.required": "La categoría del producto es obligatoria.",
      "string.base": "La categoría del producto debe ser de tipo texto.",
      "string.min": "La categoría del producto debe tener al menos 3 caracteres.",
      "string.max": "La categoría del producto debe tener como máximo 100 caracteres.",
    }),
  descripcion_producto: Joi.string()
    .max(500)
    .allow(null, "")
    .messages({
      "string.base": "La descripción del producto debe ser de tipo texto.",
      "string.max": "La descripción del producto debe tener como máximo 500 caracteres.",
    }),
  costo_fabricacion: Joi.number()
    .min(0)
    .precision(2)
    .required()
    .messages({
      "number.base": "El costo de fabricación debe ser un número.",
      "any.required": "El costo de fabricación es obligatorio.",
      "number.min": "El costo de fabricación no puede ser negativo.",
    }),
  costo_barnizador: Joi.number()
    .min(0)
    .precision(2)
    .default(0)
    .messages({
      "number.base": "El costo de barnizador debe ser un número.",
      "number.min": "El costo de barnizador no puede ser negativo.",
    }),
  costo_vidrio: Joi.number()
    .min(0)
    .precision(2)
    .default(0)
    .messages({
      "number.base": "El costo de vidrio debe ser un número.",
      "number.min": "El costo de vidrio no puede ser negativo.",
    }),
  costo_tela: Joi.number()
    .min(0)
    .precision(2)
    .default(0)
    .messages({
      "number.base": "El costo de tela debe ser un número.",
      "number.min": "El costo de tela no puede ser negativo.",
    }),
  costo_materiales_otros: Joi.number()
    .min(0)
    .precision(2)
    .allow(null)
    .default(0)
    .messages({
      "number.base": "El costo de otros materiales debe ser un número.",
      "number.min": "El costo de otros materiales no puede ser negativo.",
    }),
  precio_venta: Joi.number()
    .min(0)
    .precision(2)
    .required()
    .messages({
      "number.base": "El precio de venta debe ser un número.",
      "any.required": "El precio de venta es obligatorio.",
      "number.min": "El precio de venta no puede ser negativo.",
    }),
  margen_ganancia: Joi.number()
    .min(0)
    .max(100)
    .precision(2)
    .allow(null)
    .default(30)
    .messages({
      "number.base": "El margen de ganancia debe ser un número.",
      "number.min": "El margen de ganancia no puede ser negativo.",
      "number.max": "El margen de ganancia no puede ser mayor a 100%.",
    }),
  oferta: Joi.boolean()
    .default(false)
    .messages({
      "boolean.base": "El campo oferta debe ser verdadero o falso.",
    }),
  servicio: Joi.boolean()
    .default(false)
    .messages({
      "boolean.base": "El campo servicio debe ser verdadero o falso.",
    }),
  activo: Joi.boolean()
    .default(true)
    .messages({
      "boolean.base": "El campo activo debe ser verdadero o falso.",
    }),
  id_costo_terceros: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .messages({
      "number.base": "El ID de costo terceros debe ser un número.",
      "number.integer": "El ID de costo terceros debe ser un número entero.",
      "number.positive": "El ID de costo terceros debe ser un número positivo.",
    }),
}).unknown(false).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
});

// Validación para actualizar producto
export const updateProductoValidation = Joi.object({
  nombre_producto: Joi.string()
    .min(3)
    .max(100)
    .messages({
      "string.base": "El nombre del producto debe ser de tipo texto.",
      "string.min": "El nombre del producto debe tener al menos 3 caracteres.",
      "string.max": "El nombre del producto debe tener como máximo 100 caracteres.",
    }),
  categoria_producto: Joi.string()
    .min(3)
    .max(100)
    .messages({
      "string.base": "La categoría del producto debe ser de tipo texto.",
      "string.min": "La categoría del producto debe tener al menos 3 caracteres.",
      "string.max": "La categoría del producto debe tener como máximo 100 caracteres.",
    }),
  descripcion_producto: Joi.string()
    .max(500)
    .allow(null, "")
    .messages({
      "string.base": "La descripción del producto debe ser de tipo texto.",
      "string.max": "La descripción del producto debe tener como máximo 500 caracteres.",
    }),
  costo_fabricacion: Joi.number()
    .min(0)
    .precision(2)
    .messages({
      "number.base": "El costo de fabricación debe ser un número.",
      "number.min": "El costo de fabricación no puede ser negativo.",
    }),
  costo_barnizador: Joi.number()
    .min(0)
    .precision(2)
    .messages({
      "number.base": "El costo de barnizador debe ser un número.",
      "number.min": "El costo de barnizador no puede ser negativo.",
    }),
  costo_vidrio: Joi.number()
    .min(0)
    .precision(2)
    .messages({
      "number.base": "El costo de vidrio debe ser un número.",
      "number.min": "El costo de vidrio no puede ser negativo.",
    }),
  costo_tela: Joi.number()
    .min(0)
    .precision(2)
    .messages({
      "number.base": "El costo de tela debe ser un número.",
      "number.min": "El costo de tela no puede ser negativo.",
    }),
  costo_materiales_otros: Joi.number()
    .min(0)
    .precision(2)
    .allow(null)
    .messages({
      "number.base": "El costo de otros materiales debe ser un número.",
      "number.min": "El costo de otros materiales no puede ser negativo.",
    }),
  precio_venta: Joi.number()
    .min(0)
    .precision(2)
    .messages({
      "number.base": "El precio de venta debe ser un número.",
      "number.min": "El precio de venta no puede ser negativo.",
    }),
  margen_ganancia: Joi.number()
    .min(0)
    .max(100)
    .precision(2)
    .allow(null)
    .messages({
      "number.base": "El margen de ganancia debe ser un número.",
      "number.min": "El margen de ganancia no puede ser negativo.",
      "number.max": "El margen de ganancia no puede ser mayor a 100%.",
    }),
  oferta: Joi.boolean()
    .messages({
      "boolean.base": "El campo oferta debe ser verdadero o falso.",
    }),
  servicio: Joi.boolean()
    .messages({
      "boolean.base": "El campo servicio debe ser verdadero o falso.",
    }),
  activo: Joi.boolean()
    .messages({
      "boolean.base": "El campo activo debe ser verdadero o falso.",
    }),
  id_costo_terceros: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .messages({
      "number.base": "El ID de costo terceros debe ser un número.",
      "number.integer": "El ID de costo terceros debe ser un número entero.",
      "number.positive": "El ID de costo terceros debe ser un número positivo.",
    }),
}).min(1).unknown(false).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
  "object.min": "Debe proporcionar al menos un campo para actualizar.",
});

// Validación para query params de productos
export const productosQueryValidation = Joi.object({
  categoria: Joi.string()
    .min(3)
    .max(100)
    .messages({
      "string.base": "La categoría debe ser de tipo texto.",
      "string.min": "La categoría debe tener al menos 3 caracteres.",
      "string.max": "La categoría debe tener como máximo 100 caracteres.",
    }),
  activo: Joi.boolean()
    .messages({
      "boolean.base": "El campo activo debe ser verdadero o falso.",
    }),
  servicio: Joi.boolean()
    .messages({
      "boolean.base": "El campo servicio debe ser verdadero o falso.",
    }),
  oferta: Joi.boolean()
    .messages({
      "boolean.base": "El campo oferta debe ser verdadero o falso.",
    }),
}).unknown(false).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
});

// Validación para ID de producto
export const productoIdValidation = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El ID debe ser un número.",
      "number.integer": "El ID debe ser un número entero.",
      "number.positive": "El ID debe ser un número positivo.",
      "any.required": "El ID es obligatorio.",
    }),
}).unknown(false).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
});
