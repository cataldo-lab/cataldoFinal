// frontend/src/components/popup/trabajadorTienda/cliente/popUpBloquearCliente.jsx

import { useState } from 'react';
import { useDeleteCliente } from '@hooks/clientes/useDeleteCliente';
import XIcon from '@assets/XIcon.svg';
import PasskeyIcon from '@assets/PasskeyIcon.svg';

const PopUpBloquearCliente = ({ isOpen, onClose, onSuccess, cliente }) => {
  const { blockCliente, loading, error } = useDeleteCliente();
  const [motivo, setMotivo] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultado = await blockCliente(cliente.id, motivo);

    if (resultado.success) {
      alert('✅ Cliente bloqueado exitosamente');
      setMotivo('');
      onSuccess();
    } else {
      alert(`❌ Error: ${resultado.message}`);
    }
  };

  const handleCancel = () => {
    setMotivo('');
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
      <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 pointer-events-none">
        <div 
          className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative px-6 pt-6 pb-4 border-b border-stone-200">
            <div className="flex items-center space-x-2">
              <img src={PasskeyIcon} alt="" className="w-6 h-6" />
              <h2 className="text-xl font-semibold text-stone-800">
                Bloquear Cliente
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
            {/* Warning Box */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <span className="text-2xl flex-shrink-0">⚠️</span>
                <div className="flex-1">
                  <p className="text-sm text-amber-900 mb-2">
                    ¿Está seguro que desea bloquear al cliente?
                  </p>
                  <p className="font-semibold text-amber-900 mb-2">
                    {cliente?.nombreCompleto}
                  </p>
                  <p className="text-xs text-amber-800">
                    El cliente no podrá acceder al sistema hasta que sea desbloqueado.
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label 
                  htmlFor="motivo" 
                  className="block text-sm font-medium text-stone-700 mb-2"
                >
                  Motivo del bloqueo (opcional)
                </label>
                <textarea
                  id="motivo"
                  name="motivo"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Ej: Cliente moroso, comportamiento inapropiado, etc."
                  rows={4}
                  disabled={loading}
                  className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none disabled:bg-stone-50 disabled:cursor-not-allowed"
                />
                <p className="mt-1.5 text-xs text-stone-500">
                  Este motivo quedará registrado en el sistema
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
                  className={`px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-all flex items-center space-x-2 ${
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
                      <span>Bloqueando...</span>
                    </>
                  ) : (
                    <>
                      <img src={PasskeyIcon} alt="" className="w-4 h-4 filter brightness-0 invert" />
                      <span>Bloquear Cliente</span>
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

export default PopUpBloquearCliente;