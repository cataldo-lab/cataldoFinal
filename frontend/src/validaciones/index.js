// frontend/src/validaciones/index.js

/**
 * Archivo central de exportación de validaciones
 * Importar desde aquí para usar las validaciones en cualquier parte del frontend
 *
 * @example
 * import { validarRUT, validarEmail } from '@validaciones';
 */

export {
  // Validaciones principales
  validarRUT,
  validarEmail,
  validarTelefono,

  // Formateadores
  formatearRUT,
  formatearTelefono,

  // Validaciones generales
  validarNoVacio,
  validarLongitudMinima,
  validarLongitudMaxima,
  validarRangoLongitud,
  validarNumeroPositivo,
  validarEnteroPositivo,
  validarURL,
  validarFecha,
  validarFechaPosterior
} from './validaciones.js';
