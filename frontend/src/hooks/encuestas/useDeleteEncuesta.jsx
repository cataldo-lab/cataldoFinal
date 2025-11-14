// frontend/src/hooks/encuestas/useDeleteEncuesta.jsx
import { useState } from 'react';
import { eliminarEncuesta } from '@services/encuesta.service.js';
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';


const useDeleteEncuesta = (fetchEncuestas, fetchOperacionesSinEncuesta) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  const handleDelete = async (encuesta) => {
    if (!encuesta || !encuesta.id_encuesta) {
      showErrorAlert('Error', 'No hay encuesta seleccionada');
      return false;
    }

    try {
      // Mostrar alerta de confirmación
      const result = await deleteDataAlert();

      if (result.isConfirmed) {
        setIsLoading(true);
        setError(null);

        // Llamar al servicio
        const response = await eliminarEncuesta(encuesta.id_encuesta);

        // Verificar si hay errores en la respuesta
        if (!response || !response.success) {
          const errorMsg = response?.message || 'Error al eliminar encuesta';
          setError(errorMsg);
          showErrorAlert('Error', errorMsg);
          return false;
        }

        // Si todo fue exitoso
        showSuccessAlert('¡Eliminado!', 'La encuesta ha sido eliminada correctamente');

        // Actualizar las listas
        if (fetchEncuestas) {
          await fetchEncuestas();
        }

        if (fetchOperacionesSinEncuesta) {
          await fetchOperacionesSinEncuesta();
        }

        return true;
      } else {
        showErrorAlert('Cancelado', 'La operación ha sido cancelada');
        return false;
      }
    } catch (error) {
      const errorMessage = error.message || 'Error al eliminar encuesta';
      setError(errorMessage);
      showErrorAlert('Error', errorMessage);
      console.error('Error al eliminar encuesta:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleDelete,
    isLoading,
    error
  };
};

export default useDeleteEncuesta;
