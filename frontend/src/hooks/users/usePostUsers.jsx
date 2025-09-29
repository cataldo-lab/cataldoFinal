// usePostUsers.jsx
import { useState } from 'react';
import { createUser } from '@services/user.service.js';
import { toast } from 'react-toastify'; // Asumiendo que usas react-toastify para notificaciones

const usePostUsers = (fetchUsers) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleCreateUser = async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await createUser(userData);
      
      // Verificar si hay errores en la respuesta
      if (result.status === 'Client error' || result.status === 'Server error') {
        setError(result.message || 'Error al crear usuario');
        toast.error(result.message || 'Error al crear usuario');
        return false;
      }
      
      // Si todo fue exitoso
      toast.success('Usuario creado correctamente');
      if (fetchUsers) {
        fetchUsers(); // Actualizar la lista de usuarios
      }
      return true;
    } catch (error) {
      const errorMessage = error.message || 'Error al crear usuario';
      setError(errorMessage);
      toast.error(errorMessage);
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