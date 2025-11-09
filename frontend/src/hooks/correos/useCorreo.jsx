// frontend/src/hooks/correos/useCorreo.jsx

import { useState, useEffect, useCallback } from 'react';
import { getAllClientes } from '@services/clienteData.service';

/**
 * Hook para manejar el servicio de correos
 * Incluye obtención de clientes, envío de correos e historial
 * @param {Object} options - Opciones de configuración
 * @param {boolean} options.autoFetch - Si debe cargar automáticamente clientes e historial (default: true)
 * @returns {Object} Estado y funciones para manejar correos
 */
export const useCorreo = ({ autoFetch = true } = {}) => {
  // Estados para clientes
  const [clientes, setClientes] = useState([]);
  const [clientesLoading, setClientesLoading] = useState(autoFetch);
  const [clientesError, setClientesError] = useState(null);

  // Estados para historial
  const [historial, setHistorial] = useState([]);
  const [historialLoading, setHistorialLoading] = useState(false);
  const [historialError, setHistorialError] = useState(null);

  // Estados para envío
  const [enviando, setEnviando] = useState(false);
  const [envioError, setEnvioError] = useState(null);

  /**
   * Obtiene la lista de clientes desde el backend
   */
  const fetchClientes = useCallback(async () => {
    try {
      setClientesLoading(true);
      setClientesError(null);

      const response = await getAllClientes();

      if (response.status === 'Success' && response.data) {
        // Formatear los datos para el selector
        const clientesFormateados = response.data.map(cliente => ({
          id: cliente.id_usuario,
          nombreCompleto: cliente.nombre_completo,
          email: cliente.email,
          telefono: cliente.telefono,
          categoria: cliente.categoria
        }));
        setClientes(clientesFormateados);
      } else {
        setClientesError(response.message || 'Error al cargar clientes');
      }
    } catch (error) {
      const errorMessage = error.message || 'Error al cargar clientes';
      setClientesError(errorMessage);
      console.error('Error en fetchClientes:', error);
    } finally {
      setClientesLoading(false);
    }
  }, []);

  /**
   * Obtiene el historial de correos enviados
   * TODO: Implementar cuando el backend esté listo
   */
  const fetchHistorial = useCallback(async (filtros = {}) => {
    try {
      setHistorialLoading(true);
      setHistorialError(null);

      // TODO: Descomentar cuando el backend esté implementado
      // const response = await getHistorialCorreos(filtros);
      // ... procesamiento de response

      // Por ahora, retornar array vacío
      setHistorial([]);
    } catch (error) {
      const errorMessage = error.message || 'Error al cargar historial';
      setHistorialError(errorMessage);
      console.error('Error en fetchHistorial:', error);
      setHistorial([]);
    } finally {
      setHistorialLoading(false);
    }
  }, []);

  /**
   * Envía un correo electrónico
   * TODO: Implementar cuando el backend esté listo
   * @param {Object} correoData - Datos del correo
   * @param {string} correoData.destinatario - Email del destinatario
   * @param {string} correoData.asunto - Asunto del correo
   * @param {string} correoData.mensaje - Contenido del mensaje
   * @param {string} correoData.tipo - Tipo de plantilla (opcional)
   * @returns {Promise<Object>} Resultado del envío
   */
  const enviar = useCallback(async (correoData) => {
    try {
      setEnviando(true);
      setEnvioError(null);

      // TODO: Descomentar cuando el backend esté implementado
      // const response = await enviarCorreo({
      //   destinatario: correoData.destinatario,
      //   asunto: correoData.asunto,
      //   mensaje: correoData.mensaje,
      //   tipo: correoData.tipo || 'personalizado'
      // });

      // Por ahora, simular éxito
      console.log('Simulando envío de correo:', correoData);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Recargar historial después de enviar (cuando esté implementado)
      // await fetchHistorial();

      return { success: true, message: 'Correo enviado exitosamente (simulado - pendiente implementación backend)' };
    } catch (error) {
      const errorMessage = error.message || 'No se pudo enviar el correo';
      setEnvioError(errorMessage);
      console.error('Error en enviar:', error);
      return { success: false, message: errorMessage };
    } finally {
      setEnviando(false);
    }
  }, []);

  /**
   * Recarga todos los datos (clientes e historial)
   */
  const refetchAll = useCallback(async () => {
    await Promise.all([fetchClientes(), fetchHistorial()]);
  }, [fetchClientes, fetchHistorial]);

  // Cargar datos iniciales si autoFetch está habilitado
  useEffect(() => {
    if (autoFetch) {
      fetchClientes();
      fetchHistorial();
    }
  }, [autoFetch, fetchClientes, fetchHistorial]);

  return {
    // Datos de clientes
    clientes,
    clientesLoading,
    clientesError,

    // Datos de historial
    historial,
    historialLoading,
    historialError,

    // Estados de envío
    enviando,
    envioError,

    // Funciones
    fetchClientes,
    fetchHistorial,
    enviar,
    refetchAll
  };
};
