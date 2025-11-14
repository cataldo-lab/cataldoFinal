/**
 * Regex básico para formato de RUT (más permisivo)
 * Acepta: 12.345.678-9 o 12345678-9
 */
export const RUT_FORMAT_REGEX = /^(?:\d{1,2}(?:\.\d{3}){2}|\d{7,8})-[\dkK]$/;

/**
 * Regex estricto para validación de RUT en formularios
 * Valida rangos específicos y formatos con/sin puntos
 * Acepta:
 * - Con puntos: 21.308.770-3, 1.234.567-8, 29.999.999-9
 * - Sin puntos: 21308770-3, 1234567-8, 29999999-9
 */
export const RUT_PATTERN_STRICT = /^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/;

/**
 * Mensaje de error estándar para validación de RUT
 */
export const RUT_ERROR_MESSAGE = "Debe ser xx.xxx.xxx-x o xxxxxxxx-x";

/**
 * Configuración de validación para campos de RUT en formularios
 * Uso: {...RUT_VALIDATION_CONFIG}
 */
export const RUT_VALIDATION_CONFIG = {
  minLength: 9,
  maxLength: 12,
  pattern: RUT_PATTERN_STRICT,
  patternMessage: RUT_ERROR_MESSAGE
};

/**
 * Comprueba únicamente el formato del RUT (puntos/guion/dv).
 * NOTA: esto NO verifica que el dígito verificador sea correcto — para eso usa la función de checksum.
 * @param {string} rut
 * @returns {boolean}
 */
export const rutTieneFormatoValido = (rut) => {
  if (!rut || typeof rut !== "string") return false;
  return RUT_FORMAT_REGEX.test(rut.trim());
};

/**
 * Valida el formato estricto del RUT (usado en formularios)
 * @param {string} rut
 * @returns {boolean}
 */
export const rutTieneFormatoEstricto = (rut) => {
  if (!rut || typeof rut !== "string") return false;
  return RUT_PATTERN_STRICT.test(rut.trim());
};

/**
 * Normaliza un RUT: quita puntos, pone mayúscula el DV y devuelve "cuerpo-dv"
 * @param {string} rut
 * @returns {string} e.j. "23770330-1" o "" si inválido
 */
export const normalizarRut = (rut) => {
  if (!rut || typeof rut !== "string") return "";
  const valor = rut.replace(/\./g, "").replace(/-/g, "").trim().toUpperCase();
  if (valor.length <= 1) return "";
  const cuerpo = valor.slice(0, -1);
  const dv = valor.slice(-1);
  return `${cuerpo}-${dv}`;
};