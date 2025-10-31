
import { useState } from 'react';
import { useCreateCliente } from '@hooks/clientes/useCreateCliente';
import '@styles/trabajadorTienda/ClienteModals.css';


const CrearClienteModal = ({ isOpen, onClose, onSuccess }) => {
  const { createFull, loading, error, resetState } = useCreateCliente();

  const [formData, setFormData] = useState({
    nombreCompleto: '',
    email: '',
    password: '',
    rut: '',
    telefono: '',
    whatsapp_cliente: '',
    correo_alterno_cliente: '',
    categoria_cliente: 'regular',
    descuento_cliente: 0,
    cumpleanos_cliente: '',
    Acepta_uso_datos: false
  });

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
      password: formData.password,
      rut: formData.rut,
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

    const resultado = await createFull(userData, clienteData);

    if (resultado.success) {
      alert('✅ Cliente creado exitosamente');
      resetForm();
      onSuccess();
    }
  };

  const resetForm = () => {
    setFormData({
      nombreCompleto: '',
      email: '',
      password: '',
      rut: '',
      telefono: '',
      whatsapp_cliente: '',
      correo_alterno_cliente: '',
      categoria_cliente: 'regular',
      descuento_cliente: 0,
      cumpleanos_cliente: '',
      Acepta_uso_datos: false
    });
    resetState();
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal titulo="Crear Nuevo Cliente" onClose={handleCancel} size="large">
      <form onSubmit={handleSubmit} className="cliente-form">
        <fieldset>
          <legend>📋 Datos de Usuario</legend>
          
          <div className="form-group">
            <label htmlFor="nombreCompleto">Nombre Completo *</label>
            <input
              type="text"
              id="nombreCompleto"
              name="nombreCompleto"
              value={formData.nombreCompleto}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Juan Pérez"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="juan@ejemplo.com"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="rut">RUT *</label>
              <input
                type="text"
                id="rut"
                name="rut"
                placeholder="12345678-9"
                value={formData.rut}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                placeholder="+56912345678"
                value={formData.telefono}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="form-control"
              placeholder="Mínimo 6 caracteres"
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
                placeholder="+56912345678"
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
                placeholder="alternativo@ejemplo.com"
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
            {loading ? '⏳ Creando...' : '✅ Crear Cliente'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CrearClienteModal;