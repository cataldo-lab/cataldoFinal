// src/hooks/clientes/useSendEmail.jsx

import { useState, useCallback } from 'react';
import { sendEmailToCliente, sendBulkEmailToClientes } from '../../services/email.service.js';

/**
 * Hook para enviar correos a clientes
 * @returns {Object} { sendEmail, sendBulkEmail, loading, error, success, resetState }
 */
export const useSendEmail = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const sendEmail = useCallback(async (clienteId, asunto, mensaje) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const resultado = await sendEmailToCliente({
        clienteId,
        asunto,
        mensaje
      });

      if (resultado.status === 'Success') {
        setSuccess(true);
        return resultado;
      } else {
        setError(resultado.message || 'Error al enviar correo');
        return resultado;
      }
    } catch (err) {
      const errorMsg = err.message || 'Error al enviar correo electrónico';
      setError(errorMsg);
      console.error('Error en sendEmail:', err);
      return { status: 'Error', message: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const sendBulkEmail = useCallback(async (clienteIds, asunto, mensaje) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const resultado = await sendBulkEmailToClientes({
        clienteIds,
        asunto,
        mensaje
      });

      if (resultado.status === 'Success') {
        setSuccess(true);
        return resultado;
      } else {
        setError(resultado.message || 'Error al enviar correos');
        return resultado;
      }
    } catch (err) {
      const errorMsg = err.message || 'Error al enviar correos masivos';
      setError(errorMsg);
      console.error('Error en sendBulkEmail:', err);
      return { status: 'Error', message: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const resetState = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  return {
    sendEmail,
    sendBulkEmail,
    loading,
    error,
    success,
    resetState
  };
};
