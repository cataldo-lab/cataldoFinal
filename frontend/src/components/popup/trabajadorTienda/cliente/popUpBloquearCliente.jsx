import { useState } from 'react';
import { useDeleteCliente } from '@hooks/clientes/useDeleteCliente';
import '@styles/popup.css';

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
    <div className="bg">
      <div className="popup">

        {/* Botón cerrar */}
        <button className="close" onClick={handleCancel}>
          <img src="/icons/close.svg" alt="cerrar" />
        </button>

        {/* Contenido con scroll */}
        <div className="form">
          <h1 className="title">Bloquear Cliente</h1>

          <div className="warning-box">
            <span className="warning-icon">⚠️</span>
            <div>
              <p className="modal-description">¿Está seguro que desea bloquear al cliente?</p>
              <p className="cliente-nombre"><strong>{cliente?.nombreCompleto}</strong></p>
              <p className="modal-warning-text">El cliente no podrá acceder al sistema hasta que sea desbloqueado.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="motivo">Motivo del bloqueo (opcional)</label>
              <textarea
                id="motivo"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Ej: Cliente moroso, comportamiento inapropiado, etc."
                rows={4}
                className="form-control"
              />
              <small className="form-text">Este motivo quedará registrado en el sistema</small>
            </div>

            {error && <div className="alert alert-danger">❌ {error}</div>}

            <div className="modal-actions">
              <button type="button" onClick={handleCancel} className="btn btn-secondary" disabled={loading}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-danger" disabled={loading}>
                {loading ? '⏳ Bloqueando...' : '🔒 Bloquear Cliente'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PopUpBloquearCliente;
