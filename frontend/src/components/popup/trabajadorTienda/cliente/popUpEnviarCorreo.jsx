// frontend/src/components/popup/trabajadorTienda/cliente/popUpEnviarCorreo.jsx

import { useState } from 'react';
import { useSendEmail } from '@hooks/clientes/useSendEmail';
import XIcon from '@assets/XIcon.svg';

const PopUpEnviarCorreo = ({ isOpen, onClose, onSuccess, cliente }) => {
  const { sendEmail, loading, error } = useSendEmail();
  const [asunto, setAsunto] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!asunto.trim() || !mensaje.trim()) {
      alert('⚠️ Por favor complete el asunto y el mensaje');
      return;
    }

    const resultado = await sendEmail(cliente.id, asunto, mensaje);

    if (resultado.status === 'Success') {
      alert('✅ Correo enviado exitosamente');
      setAsunto('');
      setMensaje('');
      onSuccess();
    } else {
      alert(`❌ Error: ${resultado.message}`);
    }
  };

  const handleCancel = () => {
    setAsunto('');
    setMensaje('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop oscuro */}
      <div
        className="fixed inset-0 bg-black z-[9998]"
        style={{
          opacity: 0.6,
          backdropFilter: 'blur(4px)'
        }}
        onClick={handleCancel}
      />

      {/* Contenido del modal */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] justify-center items-center flex"
      onClick={onClose}>
        <div
          className="bg-white rounded-xl shadow-xl max-w-2xl w-full overflow-hidden pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative px-6 pt-6 pb-4 border-b border-stone-200">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">📧</span>
              <h2 className="text-xl font-semibold text-stone-800">
                Enviar Correo Electrónico
              </h2>
            </div>
            <button
              className="absolute top-4 right-4 p-2 hover:bg-stone-100 rounded-lg transition-colors"
              onClick={handleCancel}
              disabled={loading}
            >
              <img src={XIcon} alt="Cerrar" className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Client Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <span className="text-2xl flex-shrink-0">👤</span>
                <div className="flex-1">
                  <p className="text-sm text-blue-900 mb-1">
                    Destinatario:
                  </p>
                  <p className="font-semibold text-blue-900 mb-1">
                    {cliente?.nombreCompleto}
                  </p>
                  <p className="text-sm text-blue-800">
                    📨 {cliente?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Asunto */}
              <div>
                <label
                  htmlFor="asunto"
                  className="block text-sm font-medium text-stone-700 mb-2"
                >
                  Asunto <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="asunto"
                  name="asunto"
                  value={asunto}
                  onChange={(e) => setAsunto(e.target.value)}
                  placeholder="Ej: Información sobre su pedido"
                  disabled={loading}
                  className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-stone-50 disabled:cursor-not-allowed"
                  required
                />
              </div>

              {/* Mensaje */}
              <div>
                <label
                  htmlFor="mensaje"
                  className="block text-sm font-medium text-stone-700 mb-2"
                >
                  Mensaje <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  placeholder="Escriba aquí el mensaje que desea enviar al cliente..."
                  rows={8}
                  disabled={loading}
                  className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none disabled:bg-stone-50 disabled:cursor-not-allowed"
                  required
                />
                <p className="mt-1.5 text-xs text-stone-500">
                  El mensaje se enviará con formato HTML automáticamente
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  <p className="text-sm text-red-700 flex items-center">
                    <span className="mr-2">❌</span>
                    {error}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all flex items-center space-x-2 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-lg">📧</span>
                      <span>Enviar Correo</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default PopUpEnviarCorreo;
