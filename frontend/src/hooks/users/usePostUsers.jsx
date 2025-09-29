// frontend/src/hooks/users/usePostUsers.jsx
import { useState } from 'react';
import { createUser } from '@services/user.service.js';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert.js';

const usePostUsers = (fetchUsers) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleCreateUser = async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await createUser(userData);
      
      // Verificar si hay errores en la respuesta
      if (!result || (result.status !== 'Success')) {
        const errorMsg = result?.message || 'Error al crear usuario';
        setError(errorMsg);
        showErrorAlert('Error', errorMsg);
        return false;
      }
      
      // Si todo fue exitoso
      showSuccessAlert('Éxito', 'Usuario creado correctamente');
      if (fetchUsers) {
        fetchUsers(); // Actualizar la lista de usuarios
      }
      return true;
    } catch (error) {
      const errorMessage = error.message || 'Error al crear usuario';
      setError(errorMessage);
      showErrorAlert('Error', errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    handleCreateUser,
    isLoading,
    error
  };
};

export default usePostUsers;