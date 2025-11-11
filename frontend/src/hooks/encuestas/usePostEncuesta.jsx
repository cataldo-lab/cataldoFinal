// frontend/src/hooks/encuestas/usePostEncuesta.jsx
import { useState } from 'react';
import { crearEncuesta } from '@services/encuesta.service.js';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert.js';

/**
 * Hook para crear encuestas
 * @param {Function} fetchOperacionesSinEncuesta - Función para recargar operaciones sin encuesta
 * @param {Function} fetchEncuestas - Función opcional para recargar lista de encuestas
 * @returns {Object} Estado y función para crear encuestas
 */
const usePostEncuesta = (fetchOperacionesSinEncuesta, fetchEncuestas) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Crea una nueva encuesta
   * @param {Object} encuestaData - Datos de la encuesta
   * @param {number} encuestaData.id_operacion - ID de la operación
   * @param {number} encuestaData.nota_pedido - Nota del pedido (1-7)
   * @param {number} encuestaData.nota_repartidor - Nota del repartidor (1-7)
   * @param {string} encuestaData.comentario - Comentario opcional
   * @returns {Promise<boolean>} True si fue exitoso, false si falló
   */
  const handleCreateEncuesta = async (encuestaData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Validar datos antes de enviar
      if (!encuestaData.id_operacion) {
        const errorMsg = 'Debes seleccionar una operación';
        setError(errorMsg);
        showErrorAlert('Error', errorMsg);
        return false;
      }

      if (!encuestaData.nota_pedido || !encuestaData.nota_repartidor) {
        const errorMsg = 'Las calificaciones son obligatorias';
        setError(errorMsg);
        showErrorAlert('Error', errorMsg);
        return false;
      }

      // Validar rango de notas
      if (encuestaData.nota_pedido < 1 || encuestaData.nota_pedido > 7 ||
          encuestaData.nota_repartidor < 1 || encuestaData.nota_repartidor > 7) {
        const errorMsg = 'Las calificaciones deben estar entre 1 y 7';
        setError(errorMsg);
        showErrorAlert('Error', errorMsg);
        return false;
      }

      // Llamar al servicio
      const result = await crearEncuesta({
        id_operacion: parseInt(encuestaData.id_operacion),
        nota_pedido: parseInt(encuestaData.nota_pedido),
        nota_repartidor: parseInt(encuestaData.nota_repartidor),
        comentario: encuestaData.comentario?.trim() || null
      });

      // Verificar si hay errores en la respuesta
      if (!result || !result.success) {
        const errorMsg = result?.message || 'Error al crear encuesta';
        setError(errorMsg);
        showErrorAlert('Error', errorMsg);
        return false;
      }

      // Si todo fue exitoso
      showSuccessAlert('¡Éxito!', 'Encuesta creada correctamente');

      // Actualizar las listas
      if (fetchOperacionesSinEncuesta) {
        await fetchOperacionesSinEncuesta();
      }

      if (fetchEncuestas) {
        await fetchEncuestas();
      }

      return true;
    } catch (error) {
      const errorMessage = error.message || 'Error al crear encuesta';
      setError(errorMessage);
      showErrorAlert('Error', errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleCreateEncuesta,
    isLoading,
    error
  };
};

export default usePostEncuesta;
