// @helpers/fechaLatam.js

/**
 * Convierte una fecha a formato latinoamericano dd/mm/yyyy
 * @param {string|Date} fecha - Fecha en formato ISO, string o Date
 * @returns {string} Fecha en formato dd/mm/yyyy
 */
export const formatearFechaLatam = (fecha) => {
  const fechaObj = fecha instanceof Date ? fecha : new Date(fecha);

  if (isNaN(fechaObj)) return ""; // Fecha inválida

  const dia = String(fechaObj.getDate()).padStart(2, "0");
  const mes = String(fechaObj.getMonth() + 1).padStart(2, "0"); 
  const anio = fechaObj.getFullYear();

  return `${dia}/${mes}/${anio}`;
};
