"use strict";
import Joi from "joi";

// Validación para crear representante
export const createRepresentanteValidation = Joi.object({
  nombre_representante: Joi.string()
    .min(3)
    .max(100)
    .required()
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .messages({
      "string.empty": "El nombre del representante no puede estar vacío.",
      "any.required": "El nombre del representante es obligatorio.",
      "string.base": "El nombre del representante debe ser de tipo texto.",
      "string.min": "El nombre del representante debe tener al menos 3 caracteres.",
      "string.max": "El nombre del representante debe tener como máximo 100 caracteres.",
      "string.pattern.base": "El nombre del representante solo puede contener letras y espacios.",
    }),
  apellido_representante: Joi.string()
    .min(3)
    .max(100)
    .required()
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .messages({
      "string.empty": "El apellido del representante no puede estar vacío.",
      "any.required": "El apellido del representante es obligatorio.",
      "string.base": "El apellido del representante debe ser de tipo texto.",
      "string.min": "El apellido del representante debe tener al menos 3 caracteres.",
      "string.max": "El apellido del representante debe tener como máximo 100 caracteres.",
      "string.pattern.base": "El apellido del representante solo puede contener letras y espacios.",
    }),
  rut_representante: Joi.string()
    .min(9)
    .max(12)
    .required()
    .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/)
    .messages({
      "string.empty": "El rut del representante no puede estar vacío.",
      "any.required": "El rut del representante es obligatorio.",
      "string.base": "El rut del representante debe ser de tipo string.",
      "string.min": "El rut del representante debe tener como mínimo 9 caracteres.",
      "string.max": "El rut del representante debe tener como máximo 12 caracteres.",
      "string.pattern.base": "Formato rut inválido, debe ser xx.xxx.xxx-x o xxxxxxxx-x.",
    }),
  cargo_representante: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.empty": "El cargo del representante no puede estar vacío.",
      "any.required": "El cargo del representante es obligatorio.",
      "string.base": "El cargo del representante debe ser de tipo texto.",
      "string.min": "El cargo del representante debe tener al menos 3 caracteres.",
      "string.max": "El cargo del representante debe tener como máximo 100 caracteres.",
    }),
  fono_representante: Joi.string()
    .min(8)
    .max(15)
    .required()
    .pattern(/^\+?[0-9]{8,15}$/)
    .messages({
      "string.empty": "El teléfono del representante no puede estar vacío.",
      "any.required": "El teléfono del representante es obligatorio.",
      "string.base": "El teléfono del representante debe ser de tipo texto.",
      "string.min": "El teléfono del representante debe tener al menos 8 dígitos.",
      "string.max": "El teléfono del representante debe tener como máximo 15 dígitos.",
      "string.pattern.base": "El teléfono debe tener un formato válido.",
    }),
  correo_representante: Joi.string()
    .email()
    .max(100)
    .required()
    .messages({
      "string.empty": "El correo del representante no puede estar vacío.",
      "any.required": "El correo del representante es obligatorio.",
      "string.base": "El correo del representante debe ser de tipo texto.",
      "string.email": "El correo del representante debe ser un email válido.",
      "string.max": "El correo del representante debe tener como máximo 100 caracteres.",
    }),
  id_proveedor: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El ID del proveedor debe ser un número.",
      "number.integer": "El ID del proveedor debe ser un número entero.",
      "number.positive": "El ID del proveedor debe ser un número positivo.",
    }),
}).unknown(false).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
});

// Validación para actualizar representante
export const updateRepresentanteValidation = Joi.object({
  nombre_representante: Joi.string()
    .min(3)
    .max(100)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .messages({
      "string.base": "El nombre del representante debe ser de tipo texto.",
      "string.min": "El nombre del representante debe tener al menos 3 caracteres.",
      "string.max": "El nombre del representante debe tener como máximo 100 caracteres.",
      "string.pattern.base": "El nombre del representante solo puede contener letras y espacios.",
    }),
  apellido_representante: Joi.string()
    .min(3)
    .max(100)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .messages({
      "string.base": "El apellido del representante debe ser de tipo texto.",
      "string.min": "El apellido del representante debe tener al menos 3 caracteres.",
      "string.max": "El apellido del representante debe tener como máximo 100 caracteres.",
      "string.pattern.base": "El apellido del representante solo puede contener letras y espacios.",
    }),
  rut_representante: Joi.string()
    .min(9)
    .max(12)
    .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/)
    .messages({
      "string.base": "El rut del representante debe ser de tipo string.",
      "string.min": "El rut del representante debe tener como mínimo 9 caracteres.",
      "string.max": "El rut del representante debe tener como máximo 12 caracteres.",
      "string.pattern.base": "Formato rut inválido, debe ser xx.xxx.xxx-x o xxxxxxxx-x.",
    }),
  cargo_representante: Joi.string()
    .min(3)
    .max(100)
    .messages({
      "string.base": "El cargo del representante debe ser de tipo texto.",
      "string.min": "El cargo del representante debe tener al menos 3 caracteres.",
      "string.max": "El cargo del representante debe tener como máximo 100 caracteres.",
    }),
  fono_representante: Joi.string()
    .min(8)
    .max(15)
    .pattern(/^\+?[0-9]{8,15}$/)
    .messages({
      "string.base": "El teléfono del representante debe ser de tipo texto.",
      "string.min": "El teléfono del representante debe tener al menos 8 dígitos.",
      "string.max": "El teléfono del representante debe tener como máximo 15 dígitos.",
      "string.pattern.base": "El teléfono debe tener un formato válido.",
    }),
  correo_representante: Joi.string()
    .email()
    .max(100)
    .messages({
      "string.base": "El correo del representante debe ser de tipo texto.",
      "string.email": "El correo del representante debe ser un email válido.",
      "string.max": "El correo del representante debe tener como máximo 100 caracteres.",
    }),
  id_proveedor: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El ID del proveedor debe ser un número.",
      "number.integer": "El ID del proveedor debe ser un número entero.",
      "number.positive": "El ID del proveedor debe ser un número positivo.",
    }),
}).min(1).unknown(false).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
  "object.min": "Debe proporcionar al menos un campo para actualizar.",
});

// Validación para ID de representante
export const representanteIdValidation = Joi.object({
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
