"use strict";
import Joi from "joi";

// Validación para crear encuesta
export const createEncuestaValidation = Joi.object({
  nota_pedido: Joi.number()
    .integer()
    .min(1)
    .max(7)
    .default(4)
    .messages({
      "number.base": "La nota del pedido debe ser un número.",
      "number.integer": "La nota del pedido debe ser un número entero.",
      "number.min": "La nota del pedido debe ser al menos 1.",
      "number.max": "La nota del pedido debe ser como máximo 7.",
    }),
  nota_repartidor: Joi.number()
    .integer()
    .min(1)
    .max(7)
    .default(4)
    .messages({
      "number.base": "La nota del repartidor debe ser un número.",
      "number.integer": "La nota del repartidor debe ser un número entero.",
      "number.min": "La nota del repartidor debe ser al menos 1.",
      "number.max": "La nota del repartidor debe ser como máximo 7.",
    }),
  comentario: Joi.string()
    .max(255)
    .allow(null, "")
    .messages({
      "string.base": "El comentario debe ser de tipo texto.",
      "string.max": "El comentario debe tener como máximo 255 caracteres.",
    }),
  id_operacion: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El ID de la operación debe ser un número.",
      "number.integer": "El ID de la operación debe ser un número entero.",
      "number.positive": "El ID de la operación debe ser un número positivo.",
      "any.required": "El ID de la operación es obligatorio.",
    }),
}).unknown(false).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
});

// Validación para actualizar encuesta
export const updateEncuestaValidation = Joi.object({
  nota_pedido: Joi.number()
    .integer()
    .min(1)
    .max(7)
    .messages({
      "number.base": "La nota del pedido debe ser un número.",
      "number.integer": "La nota del pedido debe ser un número entero.",
      "number.min": "La nota del pedido debe ser al menos 1.",
      "number.max": "La nota del pedido debe ser como máximo 7.",
    }),
  nota_repartidor: Joi.number()
    .integer()
    .min(1)
    .max(7)
    .messages({
      "number.base": "La nota del repartidor debe ser un número.",
      "number.integer": "La nota del repartidor debe ser un número entero.",
      "number.min": "La nota del repartidor debe ser al menos 1.",
      "number.max": "La nota del repartidor debe ser como máximo 7.",
    }),
  comentario: Joi.string()
    .max(255)
    .allow(null, "")
    .messages({
      "string.base": "El comentario debe ser de tipo texto.",
      "string.max": "El comentario debe tener como máximo 255 caracteres.",
    }),
}).min(1).unknown(false).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
  "object.min": "Debe proporcionar al menos un campo para actualizar.",
});

// Validación para ID de encuesta
export const encuestaIdValidation = Joi.object({
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

// Validación para query params de encuestas
export const encuestasQueryValidation = Joi.object({
  id_operacion: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El ID de la operación debe ser un número.",
      "number.integer": "El ID de la operación debe ser un número entero.",
      "number.positive": "El ID de la operación debe ser un número positivo.",
    }),
  nota_minima: Joi.number()
    .integer()
    .min(1)
    .max(7)
    .messages({
      "number.base": "La nota mínima debe ser un número.",
      "number.integer": "La nota mínima debe ser un número entero.",
      "number.min": "La nota mínima debe ser al menos 1.",
      "number.max": "La nota mínima debe ser como máximo 7.",
    }),
  fecha_desde: Joi.date()
    .messages({
      "date.base": "La fecha desde debe ser una fecha válida.",
    }),
  fecha_hasta: Joi.date()
    .min(Joi.ref('fecha_desde'))
    .messages({
      "date.base": "La fecha hasta debe ser una fecha válida.",
      "date.min": "La fecha hasta debe ser posterior a la fecha desde.",
    }),
}).unknown(false).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
});
