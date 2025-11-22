"use strict";
import Joi from "joi";

// Enums de unidades de medida (según la entidad)
const UnidadesPeso = ["kg", "g", "lb", "oz"];
const UnidadesLongitud = ["m", "cm", "mm", "in", "ft"];
const UnidadesVolumen = ["lt", "ml", "gal"];
const UnidadesUnidad = ["unidad", "par", "mediadocena", "docena", "paquete"];
const TodasUnidades = [...UnidadesPeso, ...UnidadesLongitud, ...UnidadesVolumen, ...UnidadesUnidad, "otro"];

const CategoriaUnidad = ["peso", "longitud", "volumen", "unidad", "otro"];

// Validación para crear material
export const createMaterialValidation = Joi.object({
  nombre_material: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.empty": "El nombre del material no puede estar vacío.",
      "any.required": "El nombre del material es obligatorio.",
      "string.base": "El nombre del material debe ser de tipo texto.",
      "string.min": "El nombre del material debe tener al menos 3 caracteres.",
      "string.max": "El nombre del material debe tener como máximo 100 caracteres.",
    }),
  existencia_material: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .messages({
      "number.base": "La existencia del material debe ser un número.",
      "number.integer": "La existencia del material debe ser un número entero.",
      "number.min": "La existencia del material no puede ser negativa.",
    }),
  categoria_unidad: Joi.string()
    .valid(...CategoriaUnidad)
    .allow(null)
    .messages({
      "string.base": "La categoría de unidad debe ser de tipo texto.",
      "any.only": `La categoría de unidad debe ser una de: ${CategoriaUnidad.join(", ")}.`,
    }),
  unidad_medida: Joi.string()
    .valid(...TodasUnidades)
    .default("unidad")
    .required()
    .messages({
      "string.empty": "La unidad de medida no puede estar vacía.",
      "any.required": "La unidad de medida es obligatoria.",
      "string.base": "La unidad de medida debe ser de tipo texto.",
      "any.only": `La unidad de medida debe ser una de: ${TodasUnidades.join(", ")}.`,
    }),
  precio_unitario: Joi.number()
    .min(0)
    .precision(2)
    .required()
    .messages({
      "number.base": "El precio unitario debe ser un número.",
      "any.required": "El precio unitario es obligatorio.",
      "number.min": "El precio unitario no puede ser negativo.",
    }),
  stock_minimo: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      "number.base": "El stock mínimo debe ser un número.",
      "number.integer": "El stock mínimo debe ser un número entero.",
      "number.min": "El stock mínimo debe ser al menos 1.",
    }),
  activo: Joi.boolean()
    .default(true)
    .messages({
      "boolean.base": "El campo activo debe ser verdadero o falso.",
    }),
  id_proveedor: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .messages({
      "number.base": "El ID del proveedor debe ser un número.",
      "number.integer": "El ID del proveedor debe ser un número entero.",
      "number.positive": "El ID del proveedor debe ser un número positivo.",
    }),
}).unknown(false).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
});

// Validación para actualizar material
export const updateMaterialValidation = Joi.object({
  nombre_material: Joi.string()
    .min(3)
    .max(100)
    .messages({
      "string.base": "El nombre del material debe ser de tipo texto.",
      "string.min": "El nombre del material debe tener al menos 3 caracteres.",
      "string.max": "El nombre del material debe tener como máximo 100 caracteres.",
    }),
  existencia_material: Joi.number()
    .integer()
    .min(0)
    .messages({
      "number.base": "La existencia del material debe ser un número.",
      "number.integer": "La existencia del material debe ser un número entero.",
      "number.min": "La existencia del material no puede ser negativa.",
    }),
  categoria_unidad: Joi.string()
    .valid(...CategoriaUnidad)
    .allow(null)
    .messages({
      "string.base": "La categoría de unidad debe ser de tipo texto.",
      "any.only": `La categoría de unidad debe ser una de: ${CategoriaUnidad.join(", ")}.`,
    }),
  unidad_medida: Joi.string()
    .valid(...TodasUnidades)
    .messages({
      "string.base": "La unidad de medida debe ser de tipo texto.",
      "any.only": `La unidad de medida debe ser una de: ${TodasUnidades.join(", ")}.`,
    }),
  precio_unitario: Joi.number()
    .min(0)
    .precision(2)
    .messages({
      "number.base": "El precio unitario debe ser un número.",
      "number.min": "El precio unitario no puede ser negativo.",
    }),
  stock_minimo: Joi.number()
    .integer()
    .min(1)
    .messages({
      "number.base": "El stock mínimo debe ser un número.",
      "number.integer": "El stock mínimo debe ser un número entero.",
      "number.min": "El stock mínimo debe ser al menos 1.",
    }),
  activo: Joi.boolean()
    .messages({
      "boolean.base": "El campo activo debe ser verdadero o falso.",
    }),
  id_proveedor: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .messages({
      "number.base": "El ID del proveedor debe ser un número.",
      "number.integer": "El ID del proveedor debe ser un número entero.",
      "number.positive": "El ID del proveedor debe ser un número positivo.",
    }),
}).min(1).unknown(false).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
  "object.min": "Debe proporcionar al menos un campo para actualizar.",
});

// Validación para ID de material
export const materialIdValidation = Joi.object({
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

// Validación para query params de materiales
export const materialesQueryValidation = Joi.object({
  incluirInactivos: Joi.boolean()
    .messages({
      "boolean.base": "El parámetro incluirInactivos debe ser verdadero o falso.",
    }),
}).unknown(false).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
});
