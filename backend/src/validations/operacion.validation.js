"use strict";
import Joi from "joi";

// Estados válidos de operación (según la entidad)
const EstadosOperacion = [
  "cotizacion",
  "orden_trabajo",
  "pendiente",
  "en_proceso",
  "terminada",
  "completada",
  "entregada",
  "pagada",
  "anulada"
];

// Validación para crear operación
export const createOperacionValidation = Joi.object({
  estado_operacion: Joi.string()
    .valid(...EstadosOperacion)
    .default("pendiente")
    .messages({
      "string.base": "El estado de la operación debe ser de tipo texto.",
      "any.only": `El estado de la operación debe ser uno de: ${EstadosOperacion.join(", ")}.`,
    }),
  costo_operacion: Joi.number()
    .min(0)
    .precision(2)
    .allow(null)
    .messages({
      "number.base": "El costo de la operación debe ser un número.",
      "number.min": "El costo de la operación no puede ser negativo.",
    }),
  cantidad_abono: Joi.number()
    .min(0)
    .precision(2)
    .allow(null)
    .default(0)
    .messages({
      "number.base": "La cantidad de abono debe ser un número.",
      "number.min": "La cantidad de abono no puede ser negativa.",
    }),
  descripcion_operacion: Joi.string()
    .max(1000)
    .allow(null, "")
    .messages({
      "string.base": "La descripción de la operación debe ser de tipo texto.",
      "string.max": "La descripción de la operación debe tener como máximo 1000 caracteres.",
    }),
  fecha_entrega_estimada: Joi.date()
    .min('now')
    .allow(null)
    .messages({
      "date.base": "La fecha de entrega estimada debe ser una fecha válida.",
      "date.min": "La fecha de entrega estimada no puede ser en el pasado.",
    }),
  id_user: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El ID del usuario debe ser un número.",
      "number.integer": "El ID del usuario debe ser un número entero.",
      "number.positive": "El ID del usuario debe ser un número positivo.",
      "any.required": "El ID del usuario es obligatorio.",
    }),
}).unknown(false).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
});

// Validación para actualizar operación
export const updateOperacionValidation = Joi.object({
  estado_operacion: Joi.string()
    .valid(...EstadosOperacion)
    .messages({
      "string.base": "El estado de la operación debe ser de tipo texto.",
      "any.only": `El estado de la operación debe ser uno de: ${EstadosOperacion.join(", ")}.`,
    }),
  costo_operacion: Joi.number()
    .min(0)
    .precision(2)
    .allow(null)
    .messages({
      "number.base": "El costo de la operación debe ser un número.",
      "number.min": "El costo de la operación no puede ser negativo.",
    }),
  cantidad_abono: Joi.number()
    .min(0)
    .precision(2)
    .allow(null)
    .messages({
      "number.base": "La cantidad de abono debe ser un número.",
      "number.min": "La cantidad de abono no puede ser negativa.",
    }),
  descripcion_operacion: Joi.string()
    .max(1000)
    .allow(null, "")
    .messages({
      "string.base": "La descripción de la operación debe ser de tipo texto.",
      "string.max": "La descripción de la operación debe tener como máximo 1000 caracteres.",
    }),
  fecha_entrega_estimada: Joi.date()
    .allow(null)
    .messages({
      "date.base": "La fecha de entrega estimada debe ser una fecha válida.",
    }),
  fecha_primer_abono: Joi.date()
    .allow(null)
    .messages({
      "date.base": "La fecha del primer abono debe ser una fecha válida.",
    }),
}).min(1).unknown(false).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
  "object.min": "Debe proporcionar al menos un campo para actualizar.",
});

// Validación para agregar abono
export const agregarAbonoValidation = Joi.object({
  cantidad_abono: Joi.number()
    .min(0.01)
    .precision(2)
    .required()
    .messages({
      "number.base": "La cantidad de abono debe ser un número.",
      "number.min": "La cantidad de abono debe ser mayor a 0.",
      "any.required": "La cantidad de abono es obligatoria.",
    }),
}).unknown(false).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
});

// Validación para query params de operaciones
export const operacionesQueryValidation = Joi.object({
  estado: Joi.string()
    .valid(...EstadosOperacion)
    .messages({
      "string.base": "El estado debe ser de tipo texto.",
      "any.only": `El estado debe ser uno de: ${EstadosOperacion.join(", ")}.`,
    }),
  id_user: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El ID del usuario debe ser un número.",
      "number.integer": "El ID del usuario debe ser un número entero.",
      "number.positive": "El ID del usuario debe ser un número positivo.",
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

// Validación para ID de operación
export const operacionIdValidation = Joi.object({
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
