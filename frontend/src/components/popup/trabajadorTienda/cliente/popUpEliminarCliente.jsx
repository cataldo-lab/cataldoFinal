// frontend/src/components/popup/trabajadorTienda/cliente/popUpEliminarCliente.jsx

import { useState } from 'react';
import { useDeleteCliente } from '@hooks/clientes/useDeleteCliente';
import DeleteIcon from '@assets/deleteIcon.svg';
import PasskeyIcon from '@assets/PasskeyIcon.svg';
import XIcon from '@assets/XIcon.svg';

const PopUpEliminarCliente = ({ isOpen, onClose, onSuccess, cliente }) => {
  const { deleteCliente, loading, error } = useDeleteCliente();
  const [tipoEliminacion, setTipoEliminacion] = useState('soft');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const softDelete = tipoEliminacion === 'soft';
    const mensaje = softDelete
      ? '¿Confirma que desea BLOQUEAR este cliente?'
      : '⚠️ ¿Confirma que desea ELIMINAR PERMANENTEMENTE este cliente?\n\nEsta acción NO se puede deshacer y se perderán todos los datos asociados.';

    if (window.confirm(mensaje)) {
      const resultado = await deleteCliente(cliente.id, softDelete);
      
      if (resultado.success) {
        alert(softDelete 
          ? '✅ Cliente bloqueado exitosamente' 
          : '✅ Cliente eliminado permanentemente'
        );
        onSuccess();
      } else {
        alert(`❌ Error: ${resultado.message}`);
      }
    }
  };

  const handleCancel = () => {
    setTipoEliminacion('soft');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-stone-200">
          <h2 className="text-xl font-semibold text-stone-800">
            Eliminar Cliente
          </h2>
          <button 
            className="absolute top-4 right-4 p-2 hover:bg-stone-100 rounded-lg transition-colors"
            onClick={onClose}
          >
            <img src={XIcon} alt="Cerrar" className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <p className="text-stone-600 mb-3">
            Seleccione el tipo de eliminación para:
          </p>

          <div className="bg-stone-50 rounded-lg px-4 py-3 mb-6">
            <p className="font-semibold text-stone-800 text-lg">
              {cliente?.nombreCompleto}
            </p>
            <p className="text-sm text-stone-500">
              {cliente?.email}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Radio Options */}
            <div className="space-y-3">
              {/* Soft Delete Option */}
              <label 
                className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  tipoEliminacion === 'soft' 
                    ? 'border-amber-500 bg-amber-50' 
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="tipoEliminacion"
                  value="soft"
                  checked={tipoEliminacion === 'soft'}
                  onChange={(e) => setTipoEliminacion(e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    tipoEliminacion === 'soft' ? 'bg-amber-100' : 'bg-stone-100'
                  }`}>
                    <img src={PasskeyIcon} alt="Bloquear" className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-stone-800">
                        Bloquear
                      </span>
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">
                        Recomendado
                      </span>
                    </div>
                    <p className="text-sm text-stone-600 mt-1">
                      El cliente será bloqueado pero sus datos se mantienen en el sistema. 
                      Puede ser reactivado posteriormente.
                    </p>
                  </div>
                </div>
              </label>

              {/* Hard Delete Option */}
              <label 
                className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  tipoEliminacion === 'hard' 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="tipoEliminacion"
                  value="hard"
                  checked={tipoEliminacion === 'hard'}
                  onChange={(e) => setTipoEliminacion(e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    tipoEliminacion === 'hard' ? 'bg-red-100' : 'bg-stone-100'
                  }`}>
                    <img src={DeleteIcon} alt="Eliminar" className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-stone-800">
                        Eliminar Permanentemente
                      </span>
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                        Irreversible
                      </span>
                    </div>
                    <p className="text-sm text-red-600 mt-1 font-medium">
                      ⚠️ Esta acción NO se puede deshacer. Se eliminarán todos los 
                      datos del cliente y su historial.
                    </p>
                  </div>
                </div>
              </label>
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

            {/* Warning for Hard Delete */}
            {tipoEliminacion === 'hard' && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                <div className="flex items-start space-x-2">
                  <span className="text-amber-600 mt-0.5">⚠️</span>
                  <div>
                    <p className="text-sm font-semibold text-amber-800">
                      Advertencia
                    </p>
                    <p className="text-sm text-amber-700 mt-1">
                      La eliminación permanente puede afectar registros relacionados 
                      como operaciones, pagos e historial.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium rounded-lg transition-colors"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={`px-4 py-2 font-medium rounded-lg transition-all flex items-center space-x-2 ${
                  tipoEliminacion === 'soft' 
                    ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                    : 'bg-red-500 hover:bg-red-600 text-white'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <img 
                      src={tipoEliminacion === 'soft' ? PasskeyIcon : DeleteIcon} 
                      alt="" 
                      className="w-4 h-4 filter brightness-0 invert"
                    />
                    <span>
                      {tipoEliminacion === 'soft' ? 'Bloquear' : 'Eliminar Permanentemente'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PopUpEliminarCliente;