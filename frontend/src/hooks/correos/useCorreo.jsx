// frontend/src/hooks/correos/useCorreo.jsx

import { useState, useEffect, useCallback } from 'react';
import { getAllClientes } from '@services/clienteData.service';
import {
  enviarCorreo as enviarCorreoService,
  obtenerHistorialCorreos
} from '@services/correos.service';

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
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

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
      setLoading(true);
      setError(null);

      const resultado = await getAllClientes();

      if (resultado.success) {
        const clientesData = resultado.data?.clientes || resultado.data || [];
        // Formatear los datos para el selector
        const clientesFormateados = clientesData.map(cliente => ({
          id: cliente.id_usuario,
          nombreCompleto: cliente.nombre_completo,
          email: cliente.email,
          telefono: cliente.telefono,
          categoria: cliente.categoria
        }));
        setClientes(clientesFormateados);
        setTotal(resultado.data?.total || clientesFormateados.length);
      } else {
        setError(resultado.message || 'Error al cargar clientes');
      }
    } catch (err) {
      setError(err.message || 'Error al cargar clientes');
      console.error('Error en fetchClientes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtiene el historial de correos enviados
   */
  const fetchHistorial = useCallback(async (filtros = {}) => {
    try {
      setHistorialLoading(true);
      setHistorialError(null);

      const resultado = await obtenerHistorialCorreos(filtros);

      if (resultado.success) {
        const correosData = resultado.data?.correos || [];

        // Formatear los datos para la UI
        const correosFormateados = correosData.map(correo => ({
          id: correo.id_postventa,
          destinatario: correo.destinatario_nombre || correo.destinatario_email,
          email: correo.destinatario_email,
          asunto: correo.asunto,
          tipo: correo.tipo_correo,
          estado: correo.estado_envio,
          fecha: new Date(correo.fecha_envio || correo.fecha_creacion).toLocaleString('es-CL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }),
          mensaje: correo.mensaje
        }));

        setHistorial(correosFormateados);
      } else {
        setHistorialError(resultado.message || 'Error al cargar historial');
        setHistorial([]);
      }
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

      const response = await enviarCorreoService({
        destinatario: correoData.destinatario,
        asunto: correoData.asunto,
        mensaje: correoData.mensaje,
        tipo: correoData.tipo || 'personalizado'
      });

      // Recargar historial después de enviar exitosamente
      if (response.success) {
        await fetchHistorial();
      }

      return {
        success: response.success || true,
        message: response.message || 'Correo enviado exitosamente'
      };
    } catch (error) {
      const errorMessage = error.message || 'No se pudo enviar el correo';
      setEnvioError(errorMessage);
      console.error('Error en enviar:', error);
      return { success: false, message: errorMessage };
    } finally {
      setEnviando(false);
    }
  }, [fetchHistorial]);

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
    total,
    loading,
    error,

    // Datos de historial
    historial,
    historialLoading,
    historialError,

    // Estados de envío
    enviando,
    envioError,

    // Funciones
    refetch: fetchClientes,
    fetchHistorial,
    enviar,
    refetchAll
  };
};
