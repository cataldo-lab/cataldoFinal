

import { useState, useEffect } from 'react';
import { useClienteDetalle } from '@hooks/clientes/useClienteDetalle';
import { useUpdateCliente } from '@hooks/clientes/useUpdateCliente';


const EditarClienteModal = ({ isOpen, onClose, onSuccess, clienteId }) => {
  const { usuario, clienteDetalle, loading: loadingData } = useClienteDetalle(clienteId);
  const { updateFull, loading, error, resetState } = useUpdateCliente();

  const [formData, setFormData] = useState({
    nombreCompleto: '',
    email: '',
    telefono: '',
    whatsapp_cliente: '',
    correo_alterno_cliente: '',
    categoria_cliente: 'regular',
    descuento_cliente: 0,
    cumpleanos_cliente: '',
    Acepta_uso_datos: false
  });

  useEffect(() => {
    if (usuario && clienteDetalle) {
      setFormData({
        nombreCompleto: usuario.nombreCompleto || '',
        email: usuario.email || '',
        telefono: usuario.telefono || '',
        whatsapp_cliente: clienteDetalle.whatsapp_cliente || '',
        correo_alterno_cliente: clienteDetalle.correo_alterno_cliente || '',
        categoria_cliente: clienteDetalle.categoria_cliente || 'regular',
        descuento_cliente: clienteDetalle.descuento_cliente || 0,
        cumpleanos_cliente: clienteDetalle.cumpleanos_cliente || '',
        Acepta_uso_datos: clienteDetalle.Acepta_uso_datos || false
      });
    }
  }, [usuario, clienteDetalle]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      nombreCompleto: formData.nombreCompleto,
      email: formData.email,
      telefono: formData.telefono
    };

    const clienteData = {
      whatsapp_cliente: formData.whatsapp_cliente,
      correo_alterno_cliente: formData.correo_alterno_cliente,
      categoria_cliente: formData.categoria_cliente,
      descuento_cliente: parseFloat(formData.descuento_cliente),
      cumpleanos_cliente: formData.cumpleanos_cliente || null,
      Acepta_uso_datos: formData.Acepta_uso_datos
    };

    const resultado = await updateFull(clienteId, userData, clienteData);

    if (resultado.success) {
      alert('✅ Cliente actualizado exitosamente');
      onSuccess();
    }
  };

  const handleCancel = () => {
    resetState();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal titulo="Editar Cliente" onClose={handleCancel} size="large">
      {loadingData ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando datos del cliente...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="cliente-form">
          <fieldset>
            <legend>📋 Datos de Usuario</legend>
            
            <div className="form-group">
              <label htmlFor="nombreCompleto">Nombre Completo</label>
              <input
                type="text"
                id="nombreCompleto"
                name="nombreCompleto"
                value={formData.nombreCompleto}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </fieldset>

          <fieldset>
            <legend>👤 Datos de Cliente</legend>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="whatsapp_cliente">WhatsApp</label>
                <input
                  type="tel"
                  id="whatsapp_cliente"
                  name="whatsapp_cliente"
                  value={formData.whatsapp_cliente}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="correo_alterno_cliente">Email Alterno</label>
                <input
                  type="email"
                  id="correo_alterno_cliente"
                  name="correo_alterno_cliente"
                  value={formData.correo_alterno_cliente}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="categoria_cliente">Categoría</label>
                <select
                  id="categoria_cliente"
                  name="categoria_cliente"
                  value={formData.categoria_cliente}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="regular">Regular</option>
                  <option value="vip">VIP</option>
                  <option value="premium">Premium</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="descuento_cliente">Descuento (%)</label>
                <input
                  type="number"
                  id="descuento_cliente"
                  name="descuento_cliente"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.descuento_cliente}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="cumpleanos_cliente">Cumpleaños</label>
              <input
                type="date"
                id="cumpleanos_cliente"
                name="cumpleanos_cliente"
                value={formData.cumpleanos_cliente}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="Acepta_uso_datos"
                  checked={formData.Acepta_uso_datos}
                  onChange={handleChange}
                />
                <span>Acepta uso de datos personales</span>
              </label>
            </div>
          </fieldset>

          {error && (
            <div className="alert alert-danger">
              ❌ {error}
            </div>
          )}

          <div className="form-actions">
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
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? '⏳ Guardando...' : '💾 Guardar Cambios'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default popUpEditarCliente;