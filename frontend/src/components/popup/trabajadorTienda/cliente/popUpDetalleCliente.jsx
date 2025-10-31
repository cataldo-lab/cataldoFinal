
import { useClienteDetalle } from '@hooks/clientes/useClienteDetalle';
import '@styles/popup.css';

const PopUpDetalleCliente = ({ isOpen, onClose, onEditar, clienteId }) => {
  const { usuario, clienteDetalle, loading } = useClienteDetalle(clienteId);

  if (!isOpen) return null;

  return (
    <div className="bg">
      {loading ? (
        <div className="popup">
          <div className="spinner"></div>
          <p>Cargando detalles...</p>
        </div>
      ) : (
        <div className="detalle-modal-content">
          {/* Datos de Usuario */}
          <section className="detalle-section">
            <h3>📋 Información de Usuario</h3>
            <div className="detalle-grid">
              <div className="detalle-item">
                <strong>ID:</strong>
                <span>{usuario?.id}</span>
              </div>
              <div className="detalle-item">
                <strong>Nombre Completo:</strong>
                <span>{usuario?.nombreCompleto}</span>
              </div>
              <div className="detalle-item">
                <strong>Email:</strong>
                <span>{usuario?.email}</span>
              </div>
              <div className="detalle-item">
                <strong>RUT:</strong>
                <span>{usuario?.rut}</span>
              </div>
              <div className="detalle-item">
                <strong>Teléfono:</strong>
                <span>{usuario?.telefono || 'No especificado'}</span>
              </div>
              <div className="detalle-item">
                <strong>Rol:</strong>
                <span className={`badge badge-${usuario?.rol === 'bloqueado' ? 'danger' : 'success'}`}>
                  {usuario?.rol === 'bloqueado' ? '🔒 Bloqueado' : '✅ Activo'}
                </span>
              </div>
              <div className="detalle-item">
                <strong>Fecha de Registro:</strong>
                <span>
                  {usuario?.createdAt 
                    ? new Date(usuario.createdAt).toLocaleDateString('es-CL', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'No especificado'}
                </span>
              </div>
            </div>
          </section>

          {/* Datos de Cliente */}
          {clienteDetalle && (
            <section className="detalle-section">
              <h3>👤 Información de Cliente</h3>
              <div className="detalle-grid">
                <div className="detalle-item">
                  <strong>ID Cliente:</strong>
                  <span>{clienteDetalle.id_cliente}</span>
                </div>
                <div className="detalle-item">
                  <strong>Categoría:</strong>
                  <span className={`badge badge-${clienteDetalle.categoria_cliente || 'regular'}`}>
                    {clienteDetalle.categoria_cliente === 'vip' && '⭐ VIP'}
                    {clienteDetalle.categoria_cliente === 'premium' && '💎 Premium'}
                    {clienteDetalle.categoria_cliente === 'regular' && '👤 Regular'}
                    {!clienteDetalle.categoria_cliente && '👤 Regular'}
                  </span>
                </div>
                <div className="detalle-item">
                  <strong>Descuento:</strong>
                  <span className="descuento-value">
                    {clienteDetalle.descuento_cliente || 0}%
                  </span>
                </div>
                <div className="detalle-item">
                  <strong>WhatsApp:</strong>
                  <span>{clienteDetalle.whatsapp_cliente || 'No especificado'}</span>
                </div>
                <div className="detalle-item">
                  <strong>Email Alterno:</strong>
                  <span>{clienteDetalle.correo_alterno_cliente || 'No especificado'}</span>
                </div>
                <div className="detalle-item">
                  <strong>Cumpleaños:</strong>
                  <span>
                    {clienteDetalle.cumpleanos_cliente 
                      ? new Date(clienteDetalle.cumpleanos_cliente).toLocaleDateString('es-CL', {
                          day: 'numeric',
                          month: 'long'
                        })
                      : 'No especificado'}
                  </span>
                </div>
                <div className="detalle-item">
                  <strong>Acepta uso de datos:</strong>
                  <span className={clienteDetalle.Acepta_uso_datos ? 'text-success' : 'text-muted'}>
                    {clienteDetalle.Acepta_uso_datos ? '✅ Sí' : '❌ No'}
                  </span>
                </div>
              </div>
            </section>
          )}

          <div className="modal-actions">
            <button onClick={onClose} className="btn btn-secondary">
              Cerrar
            </button>
            <button onClick={onEditar} className="btn btn-primary">
              ✏️ Editar Cliente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PopUpDetalleCliente;