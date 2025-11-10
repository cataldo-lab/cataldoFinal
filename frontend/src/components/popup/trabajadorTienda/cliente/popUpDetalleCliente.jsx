// frontend/src/components/popup/trabajadorTienda/cliente/popUpDetalleCliente.jsx

import { useClienteDetalle } from '@hooks/clientes/useClienteDetalle';
import XIcon from '@assets/XIcon.svg';
import PersonIcon from '@assets/PersonIcon.svg';
import IdentityCardIcon from '@assets/IdentityCardIcon.svg';
import UpdateIcon from '@assets/updateIcon.svg';

const PopUpDetalleCliente = ({ isOpen, onClose, onEditar, clienteId }) => {
  const { usuario, clienteDetalle, loading } = useClienteDetalle(clienteId);

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
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-stone-50 to-stone-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-stone-100 rounded-lg">
                <svg className="w-6 h-6 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                Detalle del Cliente
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <img src={XIcon} alt="Cerrar" className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
                  <div className="w-16 h-16 border-4 borde-stone-600 rounded-full animate-spin absolute top-0 border-t-transparent"></div>
                </div>
                <p className="text-gray-600 font-medium">Cargando detalles...</p>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                
                {/* Sección: Información de Usuario */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center gap-2 mb-5">
                    <img src={PersonIcon} alt="" className="w-5 h-5" />
                    <h3 className="text-lg font-semibold text-gray-800">Información de Usuario</h3>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-[1fr_2fr] gap-2">
                    

                    {/* Nombre Completo */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Nombre Completo</p>
                      <p className="text-base font-semibold text-gray-800">{usuario?.nombreCompleto}</p>
                    </div>

                    {/* Email */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Email</p>
                      <p className="text-base text-gray-700 break-all">{usuario?.email}</p>
                    </div>

                    {/* RUT */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">RUT</p>
                      <p className="text-base font-semibold text-gray-800">{usuario?.rut}</p>
                    </div>

                    {/* Teléfono */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Teléfono</p>
                      <p className="text-base text-gray-700">{usuario?.telefono || '—'}</p>
                    </div>

                    {/* Estado */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Estado</p>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${
                        usuario?.rol === 'bloqueado' 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {usuario?.rol === 'bloqueado' ? '🔒 Bloqueado' : '✅ Activo'}
                      </span>
                    </div>

                    {/* Fecha de Registro */}
                    <div className="bg-white rounded-lg p-4 shadow-sm md:col-span-2">
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Fecha de Registro</p>
                      <p className="text-base text-gray-700">
                        {usuario?.createdAt
                          ? new Date(usuario.createdAt).toLocaleDateString('es-CL', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : '—'}
                      </p>
                    </div>

                    {/* Dirección - Calle */}
                    <div className="bg-white rounded-lg p-4 shadow-sm md:col-span-2">
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Dirección (Calle)</p>
                      <p className="text-base text-gray-700">{usuario?.calle || '—'}</p>
                    </div>

                    {/* Comuna */}
                    {usuario?.comuna && (
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-xs font-medium text-gray-500 uppercase mb-1">Comuna</p>
                        <p className="text-base text-gray-700">{usuario.comuna.nombre_comuna}</p>
                      </div>
                    )}

                    {/* Provincia */}
                    {usuario?.comuna?.provincia && (
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-xs font-medium text-gray-500 uppercase mb-1">Provincia</p>
                        <p className="text-base text-gray-700">{usuario.comuna.provincia.nombre_provincia}</p>
                      </div>
                    )}

                    {/* Región */}
                    {usuario?.comuna?.provincia?.region && (
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-xs font-medium text-gray-500 uppercase mb-1">Región</p>
                        <p className="text-base text-gray-700">{usuario.comuna.provincia.region.nombre_region}</p>
                      </div>
                    )}

                    {/* País */}
                    {usuario?.comuna?.provincia?.region?.pais && (
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-xs font-medium text-gray-500 uppercase mb-1">País</p>
                        <p className="text-base text-gray-700">{usuario.comuna.provincia.region.pais.nombre_pais}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sección: Información de Cliente */}
                {clienteDetalle && (
                  <div className="bg-gradient-to-br from-stone-50 to-stone-50 rounded-xl p-6 border border-indigo-200">
                    <div className="flex items-center gap-2 mb-5">
                      <img src={IdentityCardIcon} alt="" className="w-5 h-5" />
                      <h3 className="text-lg font-semibold text-gray-800">Información de Cliente</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      

                      {/* Categoría */}
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-xs font-medium text-gray-500 uppercase mb-1">Categoría</p>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${
                          clienteDetalle.categoria_cliente === 'vip' 
                            ? 'bg-yellow-100 text-yellow-700' 
                            : clienteDetalle.categoria_cliente === 'premium'
                            ? 'bg-stone-100 text-stone-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {clienteDetalle.categoria_cliente === 'vip' && '⭐ VIP'}
                          {clienteDetalle.categoria_cliente === 'premium' && '💎 Premium'}
                          {(!clienteDetalle.categoria_cliente || clienteDetalle.categoria_cliente === 'regular') && '👤 Regular'}
                        </span>
                      </div>

                      {/* Descuento */}
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-xs font-medium text-gray-500 uppercase mb-1">Descuento</p>
                        <p className="text-2xl font-bold text-stone-600">
                          {clienteDetalle.descuento_cliente || 0}%
                        </p>
                      </div>

                      {/* WhatsApp */}
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-xs font-medium text-gray-500 uppercase mb-1">WhatsApp</p>
                        <p className="text-base text-gray-700">{clienteDetalle.whatsapp_cliente || '—'}</p>
                      </div>

                      {/* Email Alterno */}
                      <div className="bg-white rounded-lg p-4 shadow-sm md:col-span-2">
                        <p className="text-xs font-medium text-gray-500 uppercase mb-1">Email Alterno</p>
                        <p className="text-base text-gray-700 break-all">
                          {clienteDetalle.correo_alterno_cliente || '—'}
                        </p>
                      </div>

                      {/* Cumpleaños */}
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-xs font-medium text-gray-500 uppercase mb-1">Cumpleaños</p>
                        <p className="text-base text-gray-700">
                          {clienteDetalle.cumpleanos_cliente 
                            ? new Date(clienteDetalle.cumpleanos_cliente).toLocaleDateString('es-CL', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })
                            : '—'}
                        </p>
                      </div>

                      {/* Acepta uso de datos */}
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-xs font-medium text-gray-500 uppercase mb-1">Uso de Datos</p>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${
                          clienteDetalle.Acepta_uso_datos 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {clienteDetalle.Acepta_uso_datos ? '✅ Acepta' : '❌ No acepta'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer con botones */}
          {!loading && (
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cerrar
                </button>
                <button
                  onClick={onEditar}
                  className="px-6 py-2.5 bg-stone-600 text-white font-medium rounded-lg hover:bg-stone-700 transition-colors flex items-center gap-2"
                >
                  <img src={UpdateIcon} alt="" className="w-4 h-4 filter brightness-0 invert" />
                  <span>Editar Cliente</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PopUpDetalleCliente;