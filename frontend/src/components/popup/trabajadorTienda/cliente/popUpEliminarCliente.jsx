// frontend/src/components/popup/trabajadorTienda/cliente/popUpEliminarCliente.jsx

import { useState } from 'react';
import { useDeleteCliente } from '@hooks/clientes/useDeleteCliente';

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
    <Modal titulo="Eliminar Cliente" onClose={handleCancel} size="small">
      <div className="modal-content-custom">
        <p className="modal-description">
          Seleccione el tipo de eliminación para:
        </p>
        <p className="cliente-nombre">
          <strong>{cliente?.nombreCompleto}</strong>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="radio-group">
            <label className={`radio-option ${tipoEliminacion === 'soft' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="tipoEliminacion"
                value="soft"
                checked={tipoEliminacion === 'soft'}
                onChange={(e) => setTipoEliminacion(e.target.value)}
              />
              <div className="radio-content">
                <div className="radio-header">
                  <span className="radio-icon">🔒</span>
                  <strong>Bloquear (Soft Delete)</strong>
                </div>
                <small>El cliente será bloqueado pero sus datos se mantienen en el sistema. Puede ser reactivado posteriormente.</small>
              </div>
            </label>

            <label className={`radio-option danger ${tipoEliminacion === 'hard' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="tipoEliminacion"
                value="hard"
                checked={tipoEliminacion === 'hard'}
                onChange={(e) => setTipoEliminacion(e.target.value)}
              />
              <div className="radio-content">
                <div className="radio-header">
                  <span className="radio-icon">🗑️</span>
                  <strong>Eliminar Permanentemente (Hard Delete)</strong>
                </div>
                <small className="text-danger">
                  ⚠️ Esta acción NO se puede deshacer. Se eliminarán todos los datos del cliente y su historial.
                </small>
              </div>
            </label>
          </div>

          {error && (
            <div className="alert alert-danger">
              ❌ {error}
            </div>
          )}

          {tipoEliminacion === 'hard' && (
            <div className="alert alert-warning">
              <strong>⚠️ Advertencia:</strong> La eliminación permanente puede afectar registros relacionados como operaciones, pagos e historial.
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`btn ${tipoEliminacion === 'soft' ? 'btn-warning' : 'btn-danger'}`}
              disabled={loading}
            >
              {loading ? '⏳ Procesando...' : (
                tipoEliminacion === 'soft' ? '🔒 Bloquear' : '🗑️ Eliminar Permanentemente'
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default PopUpEliminarCliente;