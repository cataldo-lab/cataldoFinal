"use strict";
import Joi from "joi";

const domainEmailValidator = (value, helper) => {
  if (!value.endsWith("@gmail.cl")) {
    return helper.message(
      "El correo electrónico debe finalizar en @gmail.cl."
    );
  }
  return value;
};

// Validación para datos de usuario al crear/actualizar cliente
export const userDataValidation = Joi.object({
  nombreCompleto: Joi.string()
    .min(15)
    .max(50)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .required()
    .messages({
      "string.empty": "El nombre completo no puede estar vacío.",
      "any.required": "El nombre completo es obligatorio.",
      "string.base": "El nombre completo debe ser de tipo texto.",
      "string.min": "El nombre completo debe tener al menos 15 caracteres.",
      "string.max": "El nombre completo debe tener como máximo 50 caracteres.",
      "string.pattern.base": "El nombre completo solo puede contener letras y espacios.",
    }),
  rut: Joi.string()
    .min(9)
    .max(12)
    .required()
    .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/)
    .messages({
      "string.empty": "El rut no puede estar vacío.",
      "any.required": "El rut es obligatorio.",
      "string.base": "El rut debe ser de tipo string.",
      "string.min": "El rut debe tener como mínimo 9 caracteres.",
      "string.max": "El rut debe tener como máximo 12 caracteres.",
      "string.pattern.base": "Formato rut inválido, debe ser xx.xxx.xxx-x o xxxxxxxx-x.",
    }),
  email: Joi.string()
    .min(15)
    .max(35)
    .email()
    .required()
    .messages({
      "string.empty": "El correo electrónico no puede estar vacío.",
      "any.required": "El correo electrónico es obligatorio.",
      "string.base": "El correo electrónico debe ser de tipo texto.",
      "string.email": "El correo electrónico debe finalizar en @gmail.cl.",
      "string.min": "El correo electrónico debe tener al menos 15 caracteres.",
      "string.max": "El correo electrónico debe tener como máximo 35 caracteres.",
    })
    .custom(domainEmailValidator, "Validación dominio email"),
  password: Joi.string()
    .min(8)
    .max(26)
    .pattern(/^[a-zA-Z0-9]+$/)
    .messages({
      "string.empty": "La contraseña no puede estar vacía.",
      "string.base": "La contraseña debe ser de tipo texto.",
      "string.min": "La contraseña debe tener al menos 8 caracteres.",
      "string.max": "La contraseña debe tener como máximo 26 caracteres.",
      "string.pattern.base": "La contraseña solo puede contener letras y números.",
    }),
  telefono: Joi.string()
    .pattern(/^\+?[0-9]{8,15}$/)
    .allow("", null)
    .messages({
      "string.base": "El teléfono debe ser de tipo string.",
      "string.pattern.base": "El teléfono debe tener entre 8 y 15 dígitos.",
    }),
}).unknown(false).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
});

// Validación para datos de cliente
export const clienteDataValidation = Joi.object({
  cumpleanos_cliente: Joi.date()
    .max('now')
    .allow(null)
    .messages({
      "date.base": "La fecha de cumpleaños debe ser una fecha válida.",
      "date.max": "La fecha de cumpleaños no puede ser futura.",
    }),
  whatsapp_cliente: Joi.string()
    .max(20)
    .pattern(/^\+?[0-9]{8,20}$/)
    .allow(null, "")
    .messages({
      "string.base": "El WhatsApp debe ser de tipo texto.",
      "string.max": "El WhatsApp debe tener como máximo 20 caracteres.",
      "string.pattern.base": "El WhatsApp debe tener un formato válido.",
    }),
  correo_alterno_cliente: Joi.string()
    .email()
    .max(50)
    .allow(null, "")
    .messages({
      "string.base": "El correo alterno debe ser de tipo texto.",
      "string.email": "El correo alterno debe ser un email válido.",
      "string.max": "El correo alterno debe tener como máximo 50 caracteres.",
    }),
  categoria_cliente: Joi.string()
    .valid('regular', 'vip', 'premium')
    .messages({
      "string.base": "La categoría debe ser de tipo texto.",
      "any.only": "La categoría debe ser: regular, vip o premium.",
    }),
  descuento_cliente: Joi.number()
    .min(0)
    .max(100)
    .precision(2)
    .allow(null)
    .messages({
      "number.base": "El descuento debe ser un número.",
      "number.min": "El descuento no puede ser negativo.",
      "number.max": "El descuento no puede ser mayor a 100.",
    }),
  Acepta_uso_datos: Joi.boolean()
    .messages({
      "boolean.base": "La aceptación de uso de datos debe ser verdadero o falso.",
    }),
}).unknown(false).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
});

// Validación completa para crear perfil
export const createPerfilFullValidation = Joi.object({
  userData: userDataValidation.required().messages({
    "any.required": "Los datos de usuario son obligatorios.",
  }),
  clienteData: clienteDataValidation.required().messages({
    "any.required": "Los datos de cliente son obligatorios.",
  }),
}).unknown(false).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
});

// Validación para actualizar perfil
export const updatePerfilValidation = Joi.object({
  userData: userDataValidation.fork(
    ['nombreCompleto', 'rut', 'email'],
    (schema) => schema.optional()
  ),
  clienteData: clienteDataValidation,
}).or('userData', 'clienteData').unknown(false).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
  "object.missing": "Debe proporcionar al menos userData o clienteData.",
});

// Validación para búsqueda de clientes
export const searchClientesValidation = Joi.object({
  nombre: Joi.string()
    .min(1)
    .max(100)
    .messages({
      "string.base": "El nombre debe ser de tipo texto.",
      "string.min": "El nombre debe tener al menos 1 carácter.",
      "string.max": "El nombre debe tener como máximo 100 caracteres.",
    }),
  categoria: Joi.string()
    .valid('regular', 'vip', 'premium')
    .messages({
      "string.base": "La categoría debe ser de tipo texto.",
      "any.only": "La categoría debe ser: regular, vip o premium.",
    }),
  email: Joi.string()
    .email()
    .messages({
      "string.base": "El email debe ser de tipo texto.",
      "string.email": "Debe proporcionar un email válido.",
    }),
}).unknown(false).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
});

// Validación para bloquear cliente
export const blockClienteValidation = Joi.object({
  motivo: Joi.string()
    .max(255)
    .allow("", null)
    .messages({
      "string.base": "El motivo debe ser de tipo texto.",
      "string.max": "El motivo debe tener como máximo 255 caracteres.",
    }),
}).unknown(false).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
});
