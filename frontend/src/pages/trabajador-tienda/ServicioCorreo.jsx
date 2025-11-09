// frontend/src/pages/trabajador-tienda/ServicioCorreo.jsx
import { useState } from 'react';
import {
  FaEnvelope,
  FaPaperPlane,
  FaHistory,
  FaUserFriends,
  FaFileAlt,
  FaTimes,
  FaCheck,
  FaExclamationCircle,
  FaClock,
  FaFilePdf,
  FaTrash
} from 'react-icons/fa';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert.js';
import { useCorreo } from '@hooks/correos/useCorreo';

const ServicioCorreo = () => {
  const [activeTab, setActiveTab] = useState('enviar');
  const [modoEmail, setModoEmail] = useState('cliente'); // 'cliente' o 'manual'

  // Usar el hook personalizado
  const {
    clientes,
    total,
    loading,
    error,
    historial,
    historialLoading,
    enviando,
    enviar,
    refetch
  } = useCorreo();

  // Estado del formulario
  const [formData, setFormData] = useState({
    destinatario: '',
    asunto: '',
    mensaje: '',
    plantilla: '',
    archivo: null
  });

  // Plantillas predefinidas
  const plantillas = {
    cotizacion: {
      nombre: 'Envío de Cotización',
      asunto: 'Cotización de su pedido',
      mensaje: 'Estimado/a cliente,\n\nAdjuntamos la cotización solicitada para su revisión.\n\nSaludos cordiales,\nEquipo de Ventas'
    },
    confirmacion: {
      nombre: 'Confirmación de Pedido',
      asunto: 'Confirmación de su pedido',
      mensaje: 'Estimado/a cliente,\n\nLe confirmamos que su pedido ha sido recibido y está siendo procesado.\n\nSaludos cordiales,\nEquipo de Producción'
    },
    entrega: {
      nombre: 'Notificación de Entrega',
      asunto: 'Su pedido está listo',
      mensaje: 'Estimado/a cliente,\n\nLe informamos que su pedido está listo para ser retirado.\n\nSaludos cordiales,\nEquipo de Entregas'
    },
    seguimiento: {
      nombre: 'Seguimiento de Pedido',
      asunto: 'Estado de su pedido',
      mensaje: 'Estimado/a cliente,\n\nLe informamos sobre el estado actual de su pedido.\n\nSaludos cordiales,\nEquipo de Atención al Cliente'
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArchivoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Validar que sea PDF
      if (file.type !== 'application/pdf') {
        showErrorAlert('Error', 'Solo se permiten archivos PDF');
        e.target.value = '';
        return;
      }

      // Validar tamaño (máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        showErrorAlert('Error', 'El archivo no debe superar los 5MB');
        e.target.value = '';
        return;
      }

      setFormData(prev => ({
        ...prev,
        archivo: file
      }));
    }
  };

  const eliminarArchivo = () => {
    setFormData(prev => ({
      ...prev,
      archivo: null
    }));
    // Limpiar el input file
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  const cambiarModoEmail = (modo) => {
    setModoEmail(modo);
    // Limpiar destinatario al cambiar de modo
    setFormData(prev => ({
      ...prev,
      destinatario: ''
    }));
  };

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const aplicarPlantilla = (plantillaKey) => {
    const plantilla = plantillas[plantillaKey];
    if (plantilla) {
      setFormData(prev => ({
        ...prev,
        asunto: plantilla.asunto,
        mensaje: plantilla.mensaje,
        plantilla: plantillaKey
      }));
    }
  };

  const handleEnviarCorreo = async (e) => {
    e.preventDefault();

    if (!formData.destinatario || !formData.asunto || !formData.mensaje) {
      showErrorAlert('Error', 'Por favor complete todos los campos');
      return;
    }

    // Validar formato de email si es modo manual
    if (modoEmail === 'manual' && !validarEmail(formData.destinatario)) {
      showErrorAlert('Error', 'Por favor ingrese un email válido');
      return;
    }

    // Usar la función enviar del hook
    const resultado = await enviar({
      destinatario: formData.destinatario,
      asunto: formData.asunto,
      mensaje: formData.mensaje,
      tipo: formData.plantilla,
      archivo: formData.archivo
    });

    if (resultado.success) {
      showSuccessAlert('Correo enviado', resultado.message);

      // Limpiar formulario
      setFormData({
        destinatario: '',
        asunto: '',
        mensaje: '',
        plantilla: '',
        archivo: null
      });
      // Limpiar el input file
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      // Resetear al modo cliente
      setModoEmail('cliente');
    } else {
      showErrorAlert('Error', resultado.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto pt-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-stone-700 mb-2 flex items-center gap-3">
            <FaEnvelope className="text-stone-600" />
            Servicio de Correos
          </h1>
          <p className="text-gray-600">Gestión de comunicaciones con clientes</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-t-2xl shadow-md">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('enviar')}
              className={`flex-1 px-6 py-4 text-center font-semibold transition-all ${
                activeTab === 'enviar'
                  ? 'bg-stone-600 text-white rounded-tl-2xl'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FaPaperPlane className="inline mr-2" />
              Enviar Correo
            </button>
            <button
              onClick={() => setActiveTab('historial')}
              className={`flex-1 px-6 py-4 text-center font-semibold transition-all ${
                activeTab === 'historial'
                  ? 'bg-stone-600 text-white rounded-tr-2xl'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FaHistory className="inline mr-2" />
              Historial
            </button>
          </div>
        </div>

        {/* Contenido de Tabs */}
        <div className="bg-white rounded-b-2xl shadow-lg p-8">
          {activeTab === 'enviar' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Formulario de envío */}
              <div className="lg:col-span-2">
                <form onSubmit={handleEnviarCorreo} className="space-y-6">
                  {/* Destinatario */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-semibold text-gray-700">
                        <FaUserFriends className="inline mr-2" />
                        Destinatario
                      </label>
                      {/* Toggle modo de email */}
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                        <button
                          type="button"
                          onClick={() => cambiarModoEmail('cliente')}
                          className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                            modoEmail === 'cliente'
                              ? 'bg-stone-600 text-white shadow-sm'
                              : 'text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          Cliente Registrado
                        </button>
                        <button
                          type="button"
                          onClick={() => cambiarModoEmail('manual')}
                          className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                            modoEmail === 'manual'
                              ? 'bg-stone-600 text-white shadow-sm'
                              : 'text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          Email Manual
                        </button>
                      </div>
                    </div>

                    {/* Modo Cliente Registrado */}
                    {modoEmail === 'cliente' && (
                      <>
                        {error ? (
                          <div className="w-full px-4 py-3 border border-red-300 bg-red-50 rounded-lg text-red-700 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FaExclamationCircle />
                              <span>Error al cargar clientes</span>
                            </div>
                            <button
                              type="button"
                              onClick={refetch}
                              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                            >
                              Reintentar
                            </button>
                          </div>
                        ) : (
                          <select
                            name="destinatario"
                            value={formData.destinatario}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                            required
                            disabled={loading}
                          >
                            <option value="">
                              {loading ? 'Cargando clientes...' : 'Seleccione un cliente...'}
                            </option>
                            {clientes.map((cliente) => (
                              <option key={cliente.id} value={cliente.email}>
                                {cliente.nombreCompleto} - {cliente.email}
                              </option>
                            ))}
                          </select>
                        )}
                        {total > 0 && (
                          <p className="text-xs text-gray-500 mt-1">
                            {total} cliente{total !== 1 ? 's' : ''} disponible{total !== 1 ? 's' : ''}
                          </p>
                        )}
                      </>
                    )}

                    {/* Modo Email Manual */}
                    {modoEmail === 'manual' && (
                      <>
                        <input
                          type="email"
                          name="destinatario"
                          value={formData.destinatario}
                          onChange={handleInputChange}
                          placeholder="ejemplo@correo.com"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Ingrese el email del destinatario (puede ser cualquier email, no necesita estar registrado)
                        </p>
                      </>
                    )}
                  </div>

                  {/* Asunto */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaFileAlt className="inline mr-2" />
                      Asunto
                    </label>
                    <input
                      type="text"
                      name="asunto"
                      value={formData.asunto}
                      onChange={handleInputChange}
                      placeholder="Ingrese el asunto del correo"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Mensaje */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaEnvelope className="inline mr-2" />
                      Mensaje
                    </label>
                    <textarea
                      name="mensaje"
                      value={formData.mensaje}
                      onChange={handleInputChange}
                      placeholder="Escriba su mensaje aquí..."
                      rows="10"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent resize-none"
                      required
                    />
                  </div>

                  {/* Archivo adjunto */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaFilePdf className="inline mr-2" />
                      Archivo Adjunto (opcional)
                    </label>

                    {!formData.archivo ? (
                      <div className="relative">
                        <input
                          type="file"
                          accept=".pdf,application/pdf"
                          onChange={handleArchivoChange}
                          className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-stone-500 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-stone-50 file:text-stone-700 hover:file:bg-stone-100"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Solo archivos PDF, máximo 5MB
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between px-4 py-3 border-2 border-green-300 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FaFilePdf className="text-red-600 text-xl" />
                          <div>
                            <p className="text-sm font-semibold text-green-800">
                              {formData.archivo.name}
                            </p>
                            <p className="text-xs text-green-600">
                              {(formData.archivo.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={eliminarArchivo}
                          className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all flex items-center gap-1 text-sm font-semibold"
                        >
                          <FaTrash />
                          Eliminar
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Botón enviar */}
                  <button
                    type="submit"
                    disabled={enviando}
                    className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 ${
                      enviando
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-stone-600 to-stone-500 hover:from-stone-700 hover:to-stone-600 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {enviando ? (
                      <>
                        <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="inline mr-2" />
                        Enviar Correo
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Plantillas */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-stone-50 to-gray-100 rounded-xl p-6 border border-stone-200">
                  <h3 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
                    <FaFileAlt className="text-stone-600" />
                    Plantillas
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Seleccione una plantilla predefinida para agilizar el envío
                  </p>
                  <div className="space-y-3">
                    {Object.entries(plantillas).map(([key, plantilla]) => (
                      <button
                        key={key}
                        onClick={() => aplicarPlantilla(key)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all transform hover:scale-105 ${
                          formData.plantilla === key
                            ? 'bg-stone-600 text-white shadow-md'
                            : 'bg-white text-gray-700 hover:bg-stone-100 border border-gray-200'
                        }`}
                      >
                        <p className="font-semibold">{plantilla.nombre}</p>
                        <p className="text-xs mt-1 opacity-80">{plantilla.asunto}</p>
                      </button>
                    ))}
                  </div>

                  {formData.plantilla && (
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, plantilla: '', asunto: '', mensaje: '' }))}
                      className="w-full mt-4 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                    >
                      <FaTimes />
                      Limpiar plantilla
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'historial' && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-stone-800">
                  Historial de Correos Enviados
                </h3>
                <span className="bg-stone-100 px-4 py-2 rounded-full text-sm font-semibold text-stone-700">
                  Total: {historial.length}
                </span>
              </div>

              {historialLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-stone-600 mb-4"></div>
                  <p className="text-xl text-gray-500">Cargando historial...</p>
                </div>
              ) : historial.length === 0 ? (
                <div className="text-center py-12">
                  <FaEnvelope className="text-6xl text-gray-300 mx-auto mb-4" />
                  <p className="text-xl text-gray-500">No hay correos enviados aún</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {historial.map((correo) => (
                    <div
                      key={correo.id}
                      className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <FaUserFriends className="text-stone-600 text-xl" />
                            <div>
                              <h4 className="font-bold text-lg text-stone-800">
                                {correo.destinatario}
                              </h4>
                              <p className="text-sm text-gray-500">{correo.email}</p>
                            </div>
                          </div>
                          <p className="text-gray-700 font-semibold ml-8 mb-2">
                            {correo.asunto}
                          </p>
                          <div className="flex items-center gap-4 ml-8 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <FaClock />
                              {correo.fecha}
                            </span>
                            <span className="flex items-center gap-1">
                              {correo.estado === 'enviado' ? (
                                <>
                                  <FaCheck className="text-green-600" />
                                  <span className="text-green-600 font-semibold">Enviado</span>
                                </>
                              ) : (
                                <>
                                  <FaExclamationCircle className="text-yellow-600" />
                                  <span className="text-yellow-600 font-semibold">Pendiente</span>
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServicioCorreo;
