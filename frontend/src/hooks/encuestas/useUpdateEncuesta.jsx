// frontend/src/hooks/encuestas/useUpdateEncuesta.jsx
import { useState } from 'react';
import { actualizarEncuesta } from '@services/encuesta.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';


const useUpdateEncuesta = (fetchEncuestas) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [dataEncuesta, setDataEncuesta] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Abre el popup de actualización con los datos de la encuesta seleccionada
   */
  const handleClickUpdate = () => {
    if (dataEncuesta) {
      setIsPopupOpen(true);
    }
  };

 
  const handleUpdate = async (updatedEncuestaData) => {
    if (!dataEncuesta || !dataEncuesta.id_encuesta) {
      showErrorAlert('Error', 'No hay encuesta seleccionada');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Validar rango de notas si se proporcionan
      if (updatedEncuestaData.nota_pedido !== undefined) {
        if (updatedEncuestaData.nota_pedido < 1 || updatedEncuestaData.nota_pedido > 7) {
          const errorMsg = 'La nota del pedido debe estar entre 1 y 7';
          setError(errorMsg);
          showErrorAlert('Error', errorMsg);
          return false;
        }
      }

      if (updatedEncuestaData.nota_repartidor !== undefined) {
        if (updatedEncuestaData.nota_repartidor < 1 || updatedEncuestaData.nota_repartidor > 7) {
          const errorMsg = 'La nota del repartidor debe estar entre 1 y 7';
          setError(errorMsg);
          showErrorAlert('Error', errorMsg);
          return false;
        }
      }

      // Llamar al servicio
      const result = await actualizarEncuesta(dataEncuesta.id_encuesta, {
        nota_pedido: updatedEncuestaData.nota_pedido !== undefined
          ? parseInt(updatedEncuestaData.nota_pedido)
          : undefined,
        nota_repartidor: updatedEncuestaData.nota_repartidor !== undefined
          ? parseInt(updatedEncuestaData.nota_repartidor)
          : undefined,
        comentario: updatedEncuestaData.comentario !== undefined
          ? updatedEncuestaData.comentario.trim() || null
          : undefined
      });

      // Verificar si hay errores en la respuesta
      if (!result || !result.success) {
        const errorMsg = result?.message || 'Error al actualizar encuesta';
        setError(errorMsg);
        showErrorAlert('Error', errorMsg);
        return false;
      }

      // Si todo fue exitoso
      showSuccessAlert('¡Actualizado!', 'La encuesta ha sido actualizada correctamente');
      setIsPopupOpen(false);

      // Actualizar la lista de encuestas
      if (fetchEncuestas) {
        await fetchEncuestas();
      }

      // Limpiar la encuesta seleccionada
      setDataEncuesta(null);
      return true;
    } catch (error) {
      const errorMessage = error.message || 'Error al actualizar encuesta';
      setError(errorMessage);
      showErrorAlert('Error', errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleClickUpdate,
    handleUpdate,
    isPopupOpen,
    setIsPopupOpen,
    dataEncuesta,
    setDataEncuesta,
    isLoading,
    error
  };
};

export default useUpdateEncuesta;
