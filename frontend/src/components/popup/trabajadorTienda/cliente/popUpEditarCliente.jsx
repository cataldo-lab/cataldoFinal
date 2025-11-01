// frontend/src/components/popup/trabajadorTienda/cliente/popUpEditarCliente.jsx

import { useState, useEffect } from 'react';
import { useClienteDetalle } from '@hooks/clientes/useClienteDetalle';
import { useUpdateCliente } from '@hooks/clientes/useUpdateCliente';
import XIcon from '@assets/XIcon.svg';
import UpdateIcon from '@assets/updateIcon.svg';
import PersonIcon from '@assets/PersonIcon.svg';
import IdentityCardIcon from '@assets/IdentityCardIcon.svg';

const PopUpEditarCliente = ({ isOpen, onClose, onSuccess, clienteId }) => {
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
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4 mt-20">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-stone-200">
          <div className="flex items-center space-x-2">
            <img src={UpdateIcon} alt="" className="w-6 h-6" />
            <h2 className="text-xl font-semibold text-stone-800">
              Editar Cliente
            </h2>
          </div>
          <button 
            className="absolute top-4 right-4 p-2 hover:bg-stone-100 rounded-lg transition-colors"
            onClick={onClose}
          >
            <img src={XIcon} alt="Cerrar" className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {loadingData ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-stone-200 rounded-full"></div>
                <div className="w-16 h-16 border-4 border-stone-600 rounded-full animate-spin absolute top-0 border-t-transparent"></div>
              </div>
              <p className="mt-4 text-stone-600">Cargando datos del cliente...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Sección Datos de Usuario */}
              <div className="bg-stone-50 rounded-lg p-5">
                <div className="flex items-center space-x-2 mb-4">
                  <img src={PersonIcon} alt="" className="w-5 h-5" />
                  <h3 className="font-semibold text-stone-800">Datos de Usuario</h3>
                </div>

                <div className="space-y-4">
                  {/* NOMBRE COMPLETO - SIN ICONOS EN INPUT */}
                  <div>
                    <label htmlFor="nombreCompleto" className="block text-sm font-medium text-stone-700 mb-1">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      id="nombreCompleto"
                      name="nombreCompleto"
                      value={formData.nombreCompleto}
                      onChange={handleChange}
                      autoComplete="off"
                      style={{
                        backgroundImage: 'none',
                        backgroundRepeat: 'no-repeat',
                        WebkitAppearance: 'none',
                        MozAppearance: 'none'
                      }}
                      className="w-full px-4 py-2.5 border border-stone-300 
                      rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-all text-stone-900 bg-white"
                      placeholder="Ej: Juan Pérez González"
                      required
                    />
                  </div>

                  {/* EMAIL - SIN ICONOS EN INPUT */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">
                      Email Principal
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="off"
                      style={{
                        backgroundImage: 'none',
                        backgroundRepeat: 'no-repeat',
                        WebkitAppearance: 'none',
                        MozAppearance: 'none'
                      }}
                      className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-all text-stone-900 bg-white"
                      placeholder="ejemplo@correo.com"
                      required
                    />
                  </div>

                  {/* TELÉFONO */}
                  <div>
                    <label htmlFor="telefono" className="block text-sm font-medium text-stone-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-all text-stone-900 bg-white"
                      placeholder="+56 9 1234 5678"
                    />
                  </div>
                </div>
              </div>

              {/* Sección Datos de Cliente */}
              <div className="bg-stone-50 rounded-lg p-5">
                <div className="flex items-center space-x-2 mb-4">
                  <img src={IdentityCardIcon} alt="" className="w-5 h-5" />
                  <h3 className="font-semibold text-stone-800">Datos de Cliente</h3>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* WHATSAPP */}
                    <div>
                      <label htmlFor="whatsapp_cliente" className="block text-sm font-medium text-stone-700 mb-1">
                        WhatsApp
                      </label>
                      <input
                        type="tel"
                        id="whatsapp_cliente"
                        name="whatsapp_cliente"
                        value={formData.whatsapp_cliente}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-all text-stone-900 bg-white"
                        placeholder="+56 9 1234 5678"
                      />
                    </div>

                    {/* EMAIL ALTERNO - SIN ICONOS */}
                    <div>
                      <label htmlFor="correo_alterno_cliente" className="block text-sm font-medium text-stone-700 mb-1">
                        Email Alterno
                      </label>
                      <input
                        type="email"
                        id="correo_alterno_cliente"
                        name="correo_alterno_cliente"
                        value={formData.correo_alterno_cliente}
                        onChange={handleChange}
                        style={{
                        backgroundImage: 'none',
                        backgroundRepeat: 'no-repeat',
                        WebkitAppearance: 'none',
                        MozAppearance: 'none'
                      }}
                        className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-all text-stone-900 bg-white"
                        placeholder="correo.secundario@ejemplo.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* CATEGORÍA */}
                    <div>
                      <label htmlFor="categoria_cliente" className="block text-sm font-medium text-stone-700 mb-1">
                        Categoría
                      </label>
                      <select
                        id="categoria_cliente"
                        name="categoria_cliente"
                        value={formData.categoria_cliente}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-all appearance-none bg-white text-stone-900 cursor-pointer"
                        style={{ 
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                          backgroundPosition: 'right 0.5rem center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '1.5em 1.5em'
                        }}
                      >
                        <option value="regular">👤 Regular</option>
                        <option value="vip">⭐ VIP</option>
                        <option value="premium">💎 Premium</option>
                      </select>
                    </div>

                    {/* DESCUENTO */}
                    <div>
                      <label htmlFor="descuento_cliente" className="block text-sm font-medium text-stone-700 mb-1">
                        Descuento (%)
                      </label>
                      <input
                        type="number"
                        id="descuento_cliente"
                        name="descuento_cliente"
                        min="0"
                        max="100"
                        step="0.01"
                        value={formData.descuento_cliente}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-all text-stone-900 bg-white"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* CUMPLEAÑOS */}
                  <div>
                    <label htmlFor="cumpleanos_cliente" className="block text-sm font-medium text-stone-700 mb-1">
                      Fecha de Cumpleaños
                    </label>
                    <input
                      type="date"
                      id="cumpleanos_cliente"
                      name="cumpleanos_cliente"
                      value={formData.cumpleanos_cliente}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-all text-stone-900 bg-white"
                    />
                  </div>

                  {/* CHECKBOX DATOS */}
                  <div className="pt-2">
                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        name="Acepta_uso_datos"
                        checked={formData.Acepta_uso_datos}
                        onChange={handleChange}
                        className="w-5 h-5 rounded border-stone-300 text-stone-600 focus:ring-2 focus:ring-stone-500 cursor-pointer"
                      />
                      <span className="text-stone-700 select-none group-hover:text-stone-900 transition-colors">
                        Acepta uso de datos personales
                      </span>
                    </label>
                  </div>
                </div>
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
                  className="px-6 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium rounded-lg transition-colors"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`px-6 py-2.5 bg-stone-600 hover:bg-stone-700 text-white font-medium rounded-lg transition-all flex items-center space-x-2 ${
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
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <img src={UpdateIcon} alt="" className="w-4 h-4 filter brightness-0 invert" />
                      <span>Guardar Cambios</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopUpEditarCliente;