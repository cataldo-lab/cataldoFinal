// frontend/src/validaciones/validaciones.js

/**
 * ========================================
 * VALIDACIONES GENERALES
 * ========================================
 * Funciones de validación reutilizables para todo el frontend
 */

/**
 * Validar RUT chileno con algoritmo del módulo 11
 * @param {string} rut - RUT a validar (puede incluir puntos y guión)
 * @returns {boolean} true si el RUT es válido
 * @example
 * validarRUT('12.345.678-9') // true
 * validarRUT('12345678-9')   // true
 * validarRUT('12345678-0')   // false (DV incorrecto)
 */
export const validarRUT = (rut) => {
  if (!rut || typeof rut !== 'string') return false;

  // Limpiar el RUT (quitar puntos y guiones)
  const rutLimpio = rut.replace(/\./g, '').replace(/-/g, '');

  // Verificar formato básico (números + K o número)
  if (!/^[0-9]+[0-9kK]$/.test(rutLimpio)) return false;

  // Separar cuerpo y dígito verificador
  const cuerpo = rutLimpio.slice(0, -1);
  const dv = rutLimpio.slice(-1).toUpperCase();

  // Calcular dígito verificador esperado
  let suma = 0;
  let multiplicador = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i)) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const dvEsperado = 11 - (suma % 11);
  const dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();

  return dv === dvCalculado;
};

/**
 * Validar email con expresión regular
 * @param {string} email - Email a validar
 * @returns {boolean} true si el email es válido
 * @example
 * validarEmail('usuario@dominio.com') // true
 * validarEmail('invalido.com')        // false
 */
export const validarEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validar teléfono chileno
 * Acepta formatos: +56912345678, 56912345678, 912345678
 * @param {string} telefono - Teléfono a validar
 * @returns {boolean} true si el teléfono es válido
 * @example
 * validarTelefono('+56912345678')  // true
 * validarTelefono('912345678')     // true
 * validarTelefono('123')           // false
 */
export const validarTelefono = (telefono) => {
  if (!telefono || typeof telefono !== 'string') return false;

  // Limpiar espacios y signo +
  const telefonoLimpio = telefono.replace(/\s/g, '').replace(/\+/g, '');

  // Validar formato chileno: (56)?[2-9]\d{8}
  // - Código país 56 opcional
  // - Primer dígito del número debe ser 2-9
  // - Total 9 dígitos (sin código país) o 11 dígitos (con código país)
  const regex = /^(56)?[2-9]\d{8}$/;
  return regex.test(telefonoLimpio);
};

/**
 * Formatear RUT con puntos y guión
 * @param {string} rut - RUT sin formato
 * @returns {string} RUT formateado (ej: 12.345.678-9)
 * @example
 * formatearRUT('123456789') // '12.345.678-9'
 */
export const formatearRUT = (rut) => {
  if (!rut) return '';

  // Limpiar el RUT
  const rutLimpio = rut.replace(/\./g, '').replace(/-/g, '');

  if (rutLimpio.length < 2) return rutLimpio;

  // Separar cuerpo y dígito verificador
  const cuerpo = rutLimpio.slice(0, -1);
  const dv = rutLimpio.slice(-1);

  // Formatear el cuerpo con puntos (de derecha a izquierda)
  const cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `${cuerpoFormateado}-${dv}`;
};

/**
 * Formatear teléfono chileno
 * @param {string} telefono - Teléfono sin formato
 * @returns {string} Teléfono formateado (ej: +56 9 1234 5678)
 * @example
 * formatearTelefono('56912345678')  // '+56 9 1234 5678'
 * formatearTelefono('912345678')    // '+56 9 1234 5678'
 */
export const formatearTelefono = (telefono) => {
  if (!telefono) return '';

  // Limpiar el teléfono
  let telefonoLimpio = telefono.replace(/\s/g, '').replace(/\+/g, '');

  // Si no tiene código de país, agregarlo
  if (!telefonoLimpio.startsWith('56')) {
    telefonoLimpio = '56' + telefonoLimpio;
  }

  // Formatear: +56 9 1234 5678
  if (telefonoLimpio.length === 11) {
    return `+${telefonoLimpio.slice(0, 2)} ${telefonoLimpio.slice(2, 3)} ${telefonoLimpio.slice(3, 7)} ${telefonoLimpio.slice(7)}`;
  }

  return '+' + telefonoLimpio;
};

/**
 * Validar que un string no esté vacío
 * @param {string} value - Valor a validar
 * @returns {boolean} true si no está vacío
 */
export const validarNoVacio = (value) => {
  return value && typeof value === 'string' && value.trim() !== '';
};

/**
 * Validar longitud mínima
 * @param {string} value - Valor a validar
 * @param {number} minLength - Longitud mínima
 * @returns {boolean} true si cumple la longitud mínima
 */
export const validarLongitudMinima = (value, minLength) => {
  return value && typeof value === 'string' && value.trim().length >= minLength;
};

/**
 * Validar longitud máxima
 * @param {string} value - Valor a validar
 * @param {number} maxLength - Longitud máxima
 * @returns {boolean} true si cumple la longitud máxima
 */
export const validarLongitudMaxima = (value, maxLength) => {
  return value && typeof value === 'string' && value.trim().length <= maxLength;
};

/**
 * Validar rango de longitud
 * @param {string} value - Valor a validar
 * @param {number} minLength - Longitud mínima
 * @param {number} maxLength - Longitud máxima
 * @returns {boolean} true si cumple el rango
 */
export const validarRangoLongitud = (value, minLength, maxLength) => {
  const length = value?.trim().length || 0;
  return length >= minLength && length <= maxLength;
};

/**
 * Validar que un valor sea un número positivo
 * @param {number|string} value - Valor a validar
 * @returns {boolean} true si es un número positivo
 */
export const validarNumeroPositivo = (value) => {
  const num = Number(value);
  return !isNaN(num) && num > 0;
};

/**
 * Validar que un valor sea un número entero positivo
 * @param {number|string} value - Valor a validar
 * @returns {boolean} true si es un número entero positivo
 */
export const validarEnteroPositivo = (value) => {
  const num = Number(value);
  return Number.isInteger(num) && num > 0;
};

/**
 * Validar URL
 * @param {string} url - URL a validar
 * @returns {boolean} true si la URL es válida
 */
export const validarURL = (url) => {
  if (!url || typeof url !== 'string') return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validar fecha (formato YYYY-MM-DD)
 * @param {string} fecha - Fecha a validar
 * @returns {boolean} true si la fecha es válida
 */
export const validarFecha = (fecha) => {
  if (!fecha || typeof fecha !== 'string') return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(fecha)) return false;
  const date = new Date(fecha);
  return date instanceof Date && !isNaN(date);
};

/**
 * Validar que una fecha sea posterior a otra
 * @param {string} fecha1 - Primera fecha
 * @param {string} fecha2 - Segunda fecha
 * @returns {boolean} true si fecha1 > fecha2
 */
export const validarFechaPosterior = (fecha1, fecha2) => {
  const d1 = new Date(fecha1);
  const d2 = new Date(fecha2);
  return d1 > d2;
};
