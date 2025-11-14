import { lazy } from 'react';

/**
 * Lazy loading con reintentos automáticos
 * @param {Function} importFn - Función de import dinámico
 * @param {number} retries - Número de reintentos (default: 3)
 * @param {number} delay - Delay entre reintentos en ms (default: 1000)
 * @returns {React.LazyExoticComponent}
 */
export function lazyWithRetry(importFn, retries = 3, delay = 1000) {
  return lazy(() => {
    return new Promise((resolve, reject) => {
      const attemptImport = (retriesLeft) => {
        importFn()
          .then(resolve)
          .catch((error) => {
            // Si no quedan reintentos, rechazar
            if (retriesLeft === 0) {
              console.error('Error al cargar el componente después de varios intentos:', error);
              reject(error);
              return;
            }

            console.warn(`Error al cargar componente. Reintentando... (${retriesLeft} intentos restantes)`);

            // Esperar y reintentar
            setTimeout(() => {
              attemptImport(retriesLeft - 1);
            }, delay);
          });
      };

      attemptImport(retries);
    });
  });
}
