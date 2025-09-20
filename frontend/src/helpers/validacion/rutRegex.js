export const RUT_FORMAT_REGEX = /^(?:\d{1,2}(?:\.\d{3}){2}|\d{7,8})-[\dkK]$/;

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