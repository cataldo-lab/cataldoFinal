// frontend/src/components/popup/trabajadorTienda/cliente/popUpCrearCliente.jsx

import { useState } from 'react';
import { useCreateCliente } from '@hooks/clientes/useCreateCliente';

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
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] justify-center items-center flex"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 pointer-events-none">
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative px-6 py-5 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800 text-center">
              Crear Cliente
            </h1>
            <button 
              onClick={handleCancel}
              disabled={loading}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <span className="text-2xl text-gray-500">✖</span>
            </button>
          </div>

          {/* Form Container con Scroll */}
          <div className="overflow-y-auto max-h-[calc(90vh-140px)] px-6 py-5">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Sección: Datos de Usuario */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl"></span>
                  <h3 className="text-base font-semibold text-gray-700">Datos de Usuario</h3>
                </div>

                <div className="space-y-4">
                  {/* Nombre Completo */}
                  <div>
                    <label htmlFor="nombreCompleto" className="block text-sm font-medium text-gray-700 mb-1.5">
                      NOMBRE COMPLETO <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="nombreCompleto"
                        name="nombreCompleto"
                        value={formData.nombreCompleto}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                        disabled={loading}
                        style={{
                        backgroundImage: 'none',
                        backgroundRepeat: 'no-repeat',
                        WebkitAppearance: 'none',
                        MozAppearance: 'none'
                      }}
                        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder=""
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        
                      </span>
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                      EMAIL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="off"
                      required
                      disabled={loading}
                      style={{
                        backgroundImage: 'none',
                        backgroundRepeat: 'no-repeat',
                        WebkitAppearance: 'none',
                        MozAppearance: 'none'
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder=""
                    />
                  </div>

                  {/* RUT y Teléfono */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="rut" className="block text-sm font-medium text-gray-700 mb-1.5">
                        RUT <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="rut"
                          name="rut"
                          value={formData.rut}
                          onChange={handleChange}
                          autoComplete="off"
                          required
                          disabled={loading}
                          style={{
                          backgroundImage: 'none',
                          backgroundRepeat: 'no-repeat',
                          WebkitAppearance: 'none',
                          MozAppearance: 'none'
                        }}
                          className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                          placeholder=""
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                          
                        </span>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1.5">
                        TELÉFONO
                      </label>
                      <input
                        type="tel"
                        id="telefono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        autoComplete="off"
                        disabled={loading}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder=""
                      />
                    </div>
                  </div>

                  {/* Contraseña */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                      CONTRASEÑA <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                      required
                      minLength={6}
                      disabled={loading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder=""
                    />
                  </div>
                </div>
              </div>

              {/* Sección: Datos del Cliente */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl"></span>
                  <h3 className="text-base font-semibold text-gray-700">Datos del Cliente</h3>
                </div>

                <div className="space-y-4">
                  {/* WhatsApp y Email Alterno */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="whatsapp_cliente" className="block text-sm font-medium text-gray-700 mb-1.5">
                        WhatsApp
                      </label>
                      <input
                        type="tel"
                        id="whatsapp_cliente"
                        name="whatsapp_cliente"
                        value={formData.whatsapp_cliente}
                        onChange={handleChange}
                        autoComplete="off"
                        disabled={loading}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder=""
                      />
                    </div>

                    <div>
                      <label htmlFor="correo_alterno_cliente" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email Alterno
                      </label>
                      <input
                        type="email"
                        id="correo_alterno_cliente"
                        name="correo_alterno_cliente"
                        value={formData.correo_alterno_cliente}
                        onChange={handleChange}
                        autoComplete="off"
                        disabled={loading}
                        style={{
                        backgroundImage: 'none',
                        backgroundRepeat: 'no-repeat',
                        WebkitAppearance: 'none',
                        MozAppearance: 'none'
                      }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder=""
                      />
                    </div>
                  </div>

                  {/* Categoría y Descuento */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="categoria_cliente" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Categoría
                      </label>
                      <select
                        id="categoria_cliente"
                        name="categoria_cliente"
                        value={formData.categoria_cliente}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white disabled:bg-gray-100 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <option value="regular">Regular</option>
                        <option value="vip">VIP</option>
                        <option value="premium">Premium</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="descuento_cliente" className="block text-sm font-medium text-gray-700 mb-1.5">
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
                        disabled={loading}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder=""
                      />
                    </div>
                  </div>

                  {/* Cumpleaños */}
                  <div>
                    <label htmlFor="cumpleanos_cliente" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Cumpleaños
                    </label>
                    <input
                      type="date"
                      id="cumpleanos_cliente"
                      name="cumpleanos_cliente"
                      value={formData.cumpleanos_cliente}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Checkbox */}
                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="Acepta_uso_datos"
                      name="Acepta_uso_datos"
                      checked={formData.Acepta_uso_datos}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <label htmlFor="Acepta_uso_datos" className="text-sm text-gray-700 cursor-pointer select-none">
                      Acepta uso de datos personales
                    </label>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center gap-2">
                  <span>❌</span>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
            </form>
          </div>

          {/* Footer con botones */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2.5 bg-stone-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Creando...</span>
                  </>
                ) : (
                  <>
                    <span>Crear Cliente</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CrearClienteModal;