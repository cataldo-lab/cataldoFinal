"use strict";
import Joi from "joi";
import { TipoCorreo, EstadoEnvio } from "../entity/correo.entity.js";

/**
 * Validación para enviar un correo
 */
export const enviarCorreoValidation = Joi.object({
  destinatario: Joi.string()
    .email()
    .max(255)
    .required()
    .messages({
      "string.empty": "El destinatario no puede estar vacío",
      "string.email": "El destinatario debe ser un email válido",
      "any.required": "El destinatario es obligatorio"
    }),
  asunto: Joi.string()
    .max(255)
    .required()
    .messages({
      "string.empty": "El asunto no puede estar vacío",
      "any.required": "El asunto es obligatorio"
    }),
  mensaje: Joi.string()
    .required()
    .messages({
      "string.empty": "El mensaje no puede estar vacío",
      "any.required": "El mensaje es obligatorio"
    }),
  tipo: Joi.string()
    .valid(...Object.values(TipoCorreo))
    .optional()
    .messages({
      "any.only": "El tipo de correo no es válido"
    }),
  idCliente: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      "number.base": "El ID del cliente debe ser un número",
      "number.integer": "El ID del cliente debe ser un número entero",
      "number.positive": "El ID del cliente debe ser positivo"
    }),
  idOperacion: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      "number.base": "El ID de la operación debe ser un número",
      "number.integer": "El ID de la operación debe ser un número entero",
      "number.positive": "El ID de la operación debe ser positivo"
    })
}).unknown(false);

/**
 * Validación para envío masivo
 */
export const enviarCorreoMasivoValidation = Joi.object({
  destinatarios: Joi.array()
    .items(Joi.string().email())
    .min(1)
    .max(100)
    .required()
    .messages({
      "array.min": "Debe incluir al menos un destinatario",
      "array.max": "No puede enviar más de 100 correos a la vez",
      "any.required": "La lista de destinatarios es obligatoria"
    }),
  asunto: Joi.string()
    .max(255)
    .required()
    .messages({
      "string.empty": "El asunto no puede estar vacío",
      "any.required": "El asunto es obligatorio"
    }),
  mensaje: Joi.string()
    .required()
    .messages({
      "string.empty": "El mensaje no puede estar vacío",
      "any.required": "El mensaje es obligatorio"
    }),
  tipo: Joi.string()
    .valid(...Object.values(TipoCorreo))
    .optional()
    .messages({
      "any.only": "El tipo de correo no es válido"
    })
}).unknown(false);

/**
 * Validación para filtros de historial
 */
export const filtrosHistorialValidation = Joi.object({
  idCliente: Joi.number()
    .integer()
    .positive()
    .optional(),
  estado: Joi.string()
    .valid(...Object.values(EstadoEnvio))
    .optional(),
  tipo: Joi.string()
    .valid(...Object.values(TipoCorreo))
    .optional(),
  fechaInicio: Joi.date()
    .optional(),
  fechaFin: Joi.date()
    .optional()
    .when('fechaInicio', {
      is: Joi.exist(),
      then: Joi.date().min(Joi.ref('fechaInicio')),
      otherwise: Joi.date()
    }),
  limit: Joi.number()
    .integer()
    .positive()
    .max(100)
    .optional()
    .default(50),
  offset: Joi.number()
    .integer()
    .min(0)
    .optional()
    .default(0)
}).unknown(false);
