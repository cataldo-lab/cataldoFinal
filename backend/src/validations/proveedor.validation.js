"use strict";
import Joi from "joi";
import { createRepresentanteValidation } from "./representante.validation.js";

// Validación para crear proveedor
export const createProveedorValidation = Joi.object({
  rol_proveedor: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      "string.empty": "El rol del proveedor no puede estar vacío.",
      "any.required": "El rol del proveedor es obligatorio.",
      "string.base": "El rol del proveedor debe ser de tipo texto.",
      "string.min": "El rol del proveedor debe tener al menos 3 caracteres.",
      "string.max": "El rol del proveedor debe tener como máximo 50 caracteres.",
    }),
  rut_proveedor: Joi.string()
    .min(9)
    .max(12)
    .required()
    .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/)
    .messages({
      "string.empty": "El rut del proveedor no puede estar vacío.",
      "any.required": "El rut del proveedor es obligatorio.",
      "string.base": "El rut del proveedor debe ser de tipo string.",
      "string.min": "El rut del proveedor debe tener como mínimo 9 caracteres.",
      "string.max": "El rut del proveedor debe tener como máximo 12 caracteres.",
      "string.pattern.base": "Formato rut inválido, debe ser xx.xxx.xxx-x o xxxxxxxx-x.",
    }),
  fono_proveedor: Joi.string()
    .min(8)
    .max(15)
    .required()
    .pattern(/^\+?[0-9]{8,15}$/)
    .messages({
      "string.empty": "El teléfono del proveedor no puede estar vacío.",
      "any.required": "El teléfono del proveedor es obligatorio.",
      "string.base": "El teléfono del proveedor debe ser de tipo texto.",
      "string.min": "El teléfono del proveedor debe tener al menos 8 dígitos.",
      "string.max": "El teléfono del proveedor debe tener como máximo 15 dígitos.",
      "string.pattern.base": "El teléfono debe tener un formato válido.",
    }),
  correo_proveedor: Joi.string()
    .email()
    .max(100)
    .required()
    .messages({
      "string.empty": "El correo del proveedor no puede estar vacío.",
      "any.required": "El correo del proveedor es obligatorio.",
      "string.base": "El correo del proveedor debe ser de tipo texto.",
      "string.email": "El correo del proveedor debe ser un email válido.",
      "string.max": "El correo del proveedor debe tener como máximo 100 caracteres.",
    }),
}).unknown(false).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
});

// Validación para actualizar proveedor
export const updateProveedorValidation = Joi.object({
  rol_proveedor: Joi.string()
    .min(3)
    .max(50)
    .messages({
      "string.base": "El rol del proveedor debe ser de tipo texto.",
      "string.min": "El rol del proveedor debe tener al menos 3 caracteres.",
      "string.max": "El rol del proveedor debe tener como máximo 50 caracteres.",
    }),
  rut_proveedor: Joi.string()
    .min(9)
    .max(12)
    .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/)
    .messages({
      "string.base": "El rut del proveedor debe ser de tipo string.",
      "string.min": "El rut del proveedor debe tener como mínimo 9 caracteres.",
      "string.max": "El rut del proveedor debe tener como máximo 12 caracteres.",
      "string.pattern.base": "Formato rut inválido, debe ser xx.xxx.xxx-x o xxxxxxxx-x.",
    }),
  fono_proveedor: Joi.string()
    .min(8)
    .max(15)
    .pattern(/^\+?[0-9]{8,15}$/)
    .messages({
      "string.base": "El teléfono del proveedor debe ser de tipo texto.",
      "string.min": "El teléfono del proveedor debe tener al menos 8 dígitos.",
      "string.max": "El teléfono del proveedor debe tener como máximo 15 dígitos.",
      "string.pattern.base": "El teléfono debe tener un formato válido.",
    }),
  correo_proveedor: Joi.string()
    .email()
    .max(100)
    .messages({
      "string.base": "El correo del proveedor debe ser de tipo texto.",
      "string.email": "El correo del proveedor debe ser un email válido.",
      "string.max": "El correo del proveedor debe tener como máximo 100 caracteres.",
    }),
}).min(1).unknown(false).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
  "object.min": "Debe proporcionar al menos un campo para actualizar.",
});

// Validación para crear proveedor con representante
export const createProveedorConRepresentanteValidation = Joi.object({
  proveedor: createProveedorValidation.required().messages({
    "any.required": "Los datos del proveedor son obligatorios.",
  }),
  representante: createRepresentanteValidation
    .fork(['id_proveedor'], (schema) => schema.optional())
    .required()
    .messages({
      "any.required": "Los datos del representante son obligatorios.",
    }),
}).unknown(false).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
});

// Validación para query params de proveedores
export const proveedoresQueryValidation = Joi.object({
  rol_proveedor: Joi.string()
    .min(3)
    .max(50)
    .messages({
      "string.base": "El rol del proveedor debe ser de tipo texto.",
      "string.min": "El rol del proveedor debe tener al menos 3 caracteres.",
      "string.max": "El rol del proveedor debe tener como máximo 50 caracteres.",
    }),
  search: Joi.string()
    .min(1)
    .max(100)
    .messages({
      "string.base": "El término de búsqueda debe ser de tipo texto.",
      "string.min": "El término de búsqueda debe tener al menos 1 carácter.",
      "string.max": "El término de búsqueda debe tener como máximo 100 caracteres.",
    }),
}).unknown(false).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
});

// Validación para ID de proveedor
export const proveedorIdValidation = Joi.object({
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
