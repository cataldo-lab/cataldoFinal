import { useState, useEffect } from 'react';
import { getMiPerfil, formatearFecha } from '@services/cliente.service';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaIdCard,
  FaBirthdayCake,
  FaWhatsapp,
  FaStar,
  FaPercentage,
  FaShieldAlt,
  FaCalendarAlt,
  FaExclamationCircle,
  FaUserCircle,
  FaEdit,
  FaHome
} from 'react-icons/fa';

const MiPerfil = () => {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
      setLoading(true);
      const response = await getMiPerfil();

      if (response.status === 'Success') {
        setPerfil(response.data);
      } else {
        setError(response.message || 'Error al cargar el perfil');
      }
    } catch (err) {
      console.error('Error al cargar perfil:', err);
      setError('Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  // Obtener badge de categoría
  const getCategoriaColor = (categoria) => {
    const colores = {
      'regular': 'bg-gray-100 text-gray-800',
      'vip': 'bg-purple-100 text-purple-800',
      'premium': 'bg-yellow-100 text-yellow-800'
    };
    return colores[categoria] || 'bg-gray-100 text-gray-800';
  };

  const getCategoriaIcon = (categoria) => {
    const iconos = {
      'regular': FaUser,
      'vip': FaStar,
      'premium': FaShieldAlt
    };
    return iconos[categoria] || FaUser;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tu perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-red-50 p-8 rounded-lg">
          <FaExclamationCircle className="text-red-500 text-5xl mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error al cargar perfil</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={cargarPerfil}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-gray-50 p-8 rounded-lg">
          <FaUserCircle className="text-gray-300 text-6xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No se encontró el perfil
          </h3>
        </div>
      </div>
    );
  }

  const IconoCategoria = getCategoriaIcon(perfil.datosCliente?.categoria);

  return (
    <div className="w-full max-w-7xl mx-auto bg-gray-100 min-h-screen pt-20">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 h-full">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-2">
            <FaUserCircle className="text-blue-500" />
            Mi Perfil
          </h1>
          <p className="text-gray-600">Información de tu cuenta y datos personales</p>
        </div>

        {/* Información principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Card principal con avatar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                    {perfil.nombreCompleto?.charAt(0).toUpperCase()}
                  </div>
                  {perfil.datosCliente?.categoria && (
                    <div className={`absolute -bottom-2 -right-2 ${getCategoriaColor(perfil.datosCliente.categoria)} px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-md`}>
                      <IconoCategoria />
                      {perfil.datosCliente.categoria.toUpperCase()}
                    </div>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">{perfil.nombreCompleto}</h2>
                <p className="text-gray-500 text-sm mb-2">{perfil.email}</p>
                <p className="text-blue-600 text-xs font-medium uppercase tracking-wide">{perfil.rol}</p>
              </div>

              {/* Descuento si existe */}
              {perfil.datosCliente?.descuento > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    
                    <p className="text-sm text-gray-600 mb-1">Descuento especial</p>
                    <p className="text-3xl font-bold text-green-600">{perfil.datosCliente.descuento}%</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Información de contacto */}
          <div className="lg:col-span-2 ">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 h-full">

              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaUser className="text-blue-500" />
                Información Personal
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* RUT */}
                <div className="flex items-start gap-3">
                  <FaIdCard className="text-gray-400 mt-1 text-xl flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">RUT</p>
                    <p className="text-gray-800 font-semibold">{perfil.rut}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <FaEnvelope className="text-gray-400 mt-1 text-xl flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Email</p>
                    <p className="text-gray-800 font-semibold break-all">{perfil.email}</p>
                  </div>
                </div>

                {/* Teléfono */}
                {perfil.telefono && (
                  <div className="flex items-start gap-3">
                    <FaPhone className="text-gray-400 mt-1 text-xl flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Teléfono</p>
                      <p className="text-gray-800 font-semibold">{perfil.telefono}</p>
                    </div>
                  </div>
                )}

                {/* WhatsApp */}
                {perfil.datosCliente?.whatsapp && (
                  <div className="flex items-start gap-3">
                    <FaWhatsapp className="text-green-500 mt-1 text-xl flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500 font-medium">WhatsApp</p>
                      <p className="text-gray-800 font-semibold">{perfil.datosCliente.whatsapp}</p>
                    </div>
                  </div>
                )}

                {/* Correo alterno */}
                {perfil.datosCliente?.correo_alterno && (
                  <div className="flex items-start gap-3 md:col-span-2">
                    <FaEnvelope className="text-gray-400 mt-1 text-xl flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Email alternativo</p>
                      <p className="text-gray-800 font-semibold">{perfil.datosCliente.correo_alterno}</p>
                    </div>
                  </div>
                )}

                {/* Cumpleaños */}
                {perfil.datosCliente?.cumpleanos && (
                  <div className="flex items-start gap-3">
                    <FaBirthdayCake className="text-pink-500 mt-1 text-xl flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Cumpleaños</p>
                      <p className="text-gray-800 font-semibold">{formatearFecha(perfil.datosCliente.cumpleanos)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

           
          </div>
        </div>

        {/* Información adicional */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Información de cuenta */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaCalendarAlt className="text-blue-500" />
              Información de Cuenta
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Fecha de registro</span>
                <span className="font-semibold text-gray-800">{formatearFecha(perfil.createdAt)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Última actualización</span>
                <span className="font-semibold text-gray-800">{formatearFecha(perfil.updatedAt)}</span>
              </div>
              {perfil.datosCliente?.id_cliente && (
                <div className="flex justify-between items-center py-2">
                 
                </div>
              )}
            </div>
          </div>

          {/* Preferencias y configuración */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaShieldAlt className="text-blue-500" />
              Privacidad
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium">Uso de datos</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  perfil.datosCliente?.acepta_uso_datos
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {perfil.datosCliente?.acepta_uso_datos ? 'Aceptado' : 'No aceptado'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Botón de edición (placeholder) */}
        {/* <div className="mt-8 text-center">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg transition flex items-center gap-2 mx-auto">
            <FaEdit />
            Editar Perfil
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default MiPerfil;
