// frontend/src/pages/gerente/gerenteDashboard.jsx

import { useState } from 'react';
import { useDashboard } from '@hooks/dashboard/useDashboard';
import {
  FaChartLine,
  FaUsers,
  FaShoppingCart,
  FaDollarSign,
  FaBox,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaTrophy,
  FaCalendarAlt,
  FaSync,
  FaChartBar,
  FaStar,
  FaArrowUp,
  FaTimes
} from 'react-icons/fa';

const GerenteDashboard = () => {
  const {
    loading,
    error,
    resumen,
    ventas,
    inventario,
    clientes,
    satisfaccion,
    indicadores,
    cargarDashboard
  } = useDashboard();

  const [modalAbierto, setModalAbierto] = useState(null);
  const [datosModal, setDatosModal] = useState(null);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(value || 0);
  };

  const abrirModal = (tipo, datos) => {
    setModalAbierto(tipo);
    setDatosModal(datos);
  };

  const cerrarModal = () => {
    setModalAbierto(null);
    setDatosModal(null);
  };

  const Modal = ({ tipo, datos, onClose }) => {
    if (!tipo || !datos) return null;

    const renderContenidoModal = () => {
      switch (tipo) {
        case 'ingresos':
          return (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-stone-800 mb-4">Detalles de Ingresos del Mes</h3>
              <div className="space-y-3">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700 mb-1">Total Abonado</p>
                  <p className="text-3xl font-bold text-green-800">{formatCurrency(datos.total_abonado)}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700 mb-1">Total de Operaciones</p>
                  <p className="text-3xl font-bold text-blue-800">{formatCurrency(datos.total_operaciones)}</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm text-orange-700 mb-1">Pendiente de Cobro</p>
                  <p className="text-3xl font-bold text-orange-800">{formatCurrency(datos.pendiente_cobro)}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-700 mb-1">Porcentaje Abonado</p>
                  <p className="text-3xl font-bold text-purple-800">{datos.porcentaje_abonado}%</p>
                  <div className="w-full bg-purple-200 rounded-full h-3 mt-2">
                    <div
                      className="bg-purple-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${datos.porcentaje_abonado}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          );

        case 'pendiente':
          return (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-stone-800 mb-4">Detalle de Cuentas por Cobrar</h3>
              <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-300">
                <p className="text-sm text-orange-700 mb-1">Monto Pendiente</p>
                <p className="text-4xl font-bold text-orange-800">{formatCurrency(datos.pendiente_cobro)}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <p className="text-xs text-stone-600">Total Operaciones</p>
                  <p className="text-xl font-bold text-stone-800">{formatCurrency(datos.total_operaciones)}</p>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <p className="text-xs text-stone-600">Ya Abonado</p>
                  <p className="text-xl font-bold text-stone-800">{formatCurrency(datos.total_abonado)}</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">Para alcanzar el 100% faltan cobrar:</p>
                <p className="text-2xl font-bold text-blue-800 mt-1">{formatCurrency(datos.pendiente_cobro)}</p>
              </div>
            </div>
          );

        case 'operaciones':
          return (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-stone-800 mb-4">Detalles de Operaciones del Mes</h3>
              <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-300">
                <p className="text-sm text-blue-700 mb-1">Total de Operaciones</p>
                <p className="text-4xl font-bold text-blue-800">{datos.total_mes}</p>
              </div>
              {datos.por_estado && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-stone-700">Distribución por Estado:</p>
                  {Object.entries(datos.por_estado).map(([estado, data]) => {
                    const estadoConfig = {
                      cotizacion: { color: 'stone', label: 'Cotización' },
                      orden_trabajo: { color: 'blue', label: 'Orden de Trabajo' },
                      pendiente: { color: 'orange', label: 'Pendientes' },
                      en_proceso: { color: 'blue', label: 'En Proceso' },
                      terminada: { color: 'purple', label: 'Terminadas' },
                      completada: { color: 'green', label: 'Completadas' }
                    };
                    const config = estadoConfig[estado] || { color: 'stone', label: estado };
                    return (
                      <div key={estado} className={`p-3 bg-${config.color}-50 rounded-lg border border-${config.color}-200`}>
                        <div className="flex justify-between items-center">
                          <span className={`text-sm font-medium text-${config.color}-700 capitalize`}>{config.label}</span>
                          <div className="text-right">
                            <p className={`text-xl font-bold text-${config.color}-800`}>{data.cantidad}</p>
                            <p className="text-xs text-stone-600">{formatCurrency(data.monto_total)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );

        case 'clientes':
          return (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-stone-800 mb-4">Detalles de Clientes del Mes</h3>
              <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-300">
                <p className="text-sm text-purple-700 mb-1">Clientes Activos este Mes</p>
                <p className="text-4xl font-bold text-purple-800">{datos.activos_mes}</p>
              </div>
              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                <p className="text-sm text-stone-700 mb-1">Total Registrados</p>
                <p className="text-3xl font-bold text-stone-800">{datos.total_registrados}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-700 mb-1">Nuevos este Mes</p>
                <p className="text-3xl font-bold text-green-800">{clientes?.nuevos_mes || 0}</p>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">Tasa de Activación:</p>
                <p className="text-2xl font-bold text-blue-800 mt-1">
                  {((datos.activos_mes / datos.total_registrados) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          );

        case 'estado_operacion':
          return (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-stone-800 mb-4">Operaciones: {datos.label}</h3>
              <div className={`p-6 bg-${datos.color}-50 rounded-lg border-2 border-${datos.color}-300`}>
                <p className="text-sm text-stone-700 mb-1">Cantidad</p>
                <p className="text-4xl font-bold text-stone-800">{datos.cantidad}</p>
              </div>
              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                <p className="text-sm text-stone-700 mb-1">Monto Total</p>
                <p className="text-3xl font-bold text-stone-800">{formatCurrency(datos.monto_total)}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">Monto Promedio por Operación:</p>
                <p className="text-xl font-bold text-blue-800 mt-1">
                  {formatCurrency(datos.monto_total / datos.cantidad)}
                </p>
              </div>
            </div>
          );

        case 'categoria_cliente':
          return (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-stone-800 mb-4 capitalize">Clientes {datos.categoria}</h3>
              <div className={`p-6 bg-${datos.color}-50 rounded-lg border-2 border-${datos.color}-300`}>
                <p className="text-sm text-stone-700 mb-1">Cantidad</p>
                <p className="text-4xl font-bold text-stone-800">{datos.cantidad}</p>
              </div>
              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                <p className="text-sm text-stone-700 mb-1">Descuento Promedio</p>
                <p className="text-3xl font-bold text-stone-800">{datos.descuento_promedio}%</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">Representa:</p>
                <p className="text-xl font-bold text-blue-800 mt-1">
                  {((datos.cantidad / resumen?.clientes?.total_registrados) * 100).toFixed(1)}% del total
                </p>
              </div>
            </div>
          );

        case 'inventario':
          return (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-stone-800 mb-4">Detalle de Inventario</h3>
              <div className="p-6 bg-stone-50 rounded-lg border-2 border-stone-300">
                <p className="text-sm text-stone-700 mb-1">Valor Total del Inventario</p>
                <p className="text-4xl font-bold text-stone-800">
                  {formatCurrency(datos.inventario_total?.valor_total)}
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700 mb-1">Total de Materiales</p>
                <p className="text-3xl font-bold text-blue-800">{datos.inventario_total?.total_materiales}</p>
              </div>
              {datos.alertas && (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-stone-700">Alertas de Stock:</p>
                  {datos.alertas.criticos?.cantidad > 0 && (
                    <div className="p-4 bg-red-50 rounded-lg border-2 border-red-300">
                      <div className="flex items-center gap-2 mb-2">
                        <FaExclamationTriangle className="text-red-600" />
                        <p className="text-sm font-bold text-red-700">Stock Crítico</p>
                      </div>
                      <p className="text-3xl font-bold text-red-800">{datos.alertas.criticos.cantidad}</p>
                      <p className="text-xs text-red-600 mt-1">Materiales requieren reposición urgente</p>
                    </div>
                  )}
                  {datos.alertas.bajo_stock?.cantidad > 0 && (
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-2 mb-2">
                        <FaExclamationTriangle className="text-orange-600" />
                        <p className="text-sm font-bold text-orange-700">Stock Bajo</p>
                      </div>
                      <p className="text-3xl font-bold text-orange-800">{datos.alertas.bajo_stock.cantidad}</p>
                      <p className="text-xs text-orange-600 mt-1">Materiales próximos a agotarse</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );

        default:
          return <p>No hay información disponible</p>;
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white border-b border-stone-200 p-6 flex justify-between items-center rounded-t-2xl">
            <h2 className="text-2xl font-bold text-stone-800">Información Detallada</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-stone-100 rounded-full transition-colors"
            >
              <FaTimes className="text-xl text-stone-600" />
            </button>
          </div>
          <div className="p-6">
            {renderContenidoModal()}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-20 h-20 border-4 border-stone-200 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-stone-600 rounded-full animate-spin absolute top-0 border-t-transparent"></div>
          </div>
          <p className="mt-4 text-stone-700 font-semibold text-lg">Cargando dashboard...</p>
          <p className="mt-2 text-stone-500 text-sm">Obteniendo datos del sistema</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border border-stone-200">
          <div className="text-center">
            <FaExclamationTriangle className="text-6xl mb-4 mx-auto text-red-500" />
            <h2 className="text-2xl font-bold text-stone-800 mb-2">Error al cargar dashboard</h2>
            <p className="text-stone-600 mb-6">{error}</p>
            <button
              onClick={cargarDashboard}
              className="bg-stone-600 hover:bg-stone-700 text-white px-6 py-3 rounded-lg transition-colors font-medium flex items-center gap-2 mx-auto"
            >
              <FaSync /> Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 p-6">
      <div className="max-w-7xl mx-auto pt-[calc(9vh)]">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-stone-800 flex items-center gap-3">
                <FaChartLine className="text-stone-600" />
                Dashboard Gerencial
              </h1>
              <p className="text-stone-600 mt-2">
                Vista general del negocio - {new Date().toLocaleDateString('es-CL', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-stone-200">
                <FaCalendarAlt className="text-stone-500" />
                <span className="text-sm font-medium text-stone-700">
                  {new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <button
                onClick={cargarDashboard}
                className="bg-stone-600 hover:bg-stone-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors font-medium flex items-center gap-2"
              >
                <FaSync className="text-sm" />
                Actualizar
              </button>
            </div>
          </div>
        </div>

        {/* Tarjetas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Ingresos Totales */}
          <div
            onClick={() => abrirModal('ingresos', resumen?.ingresos)}
            className="bg-white rounded-xl shadow-lg p-6 border border-stone-200 hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FaDollarSign className="text-2xl text-green-600" />
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-600">
                {resumen?.ingresos?.porcentaje_abonado}%
              </span>
            </div>
            <h3 className="text-sm font-medium text-stone-600 mb-1">Ingresos del Mes</h3>
            <p className="text-2xl font-bold text-stone-800">
              {formatCurrency(resumen?.ingresos?.total_abonado)}
            </p>
            <p className="text-xs text-stone-500 mt-2">
              De {formatCurrency(resumen?.ingresos?.total_operaciones)} totales
            </p>
          </div>

          {/* Pendiente de Cobro */}
          <div
            onClick={() => abrirModal('pendiente', resumen?.ingresos)}
            className="bg-white rounded-xl shadow-lg p-6 border border-stone-200 hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FaChartLine className="text-2xl text-orange-600" />
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-orange-100 text-orange-600">
                Por cobrar
              </span>
            </div>
            <h3 className="text-sm font-medium text-stone-600 mb-1">Pendiente de Cobro</h3>
            <p className="text-2xl font-bold text-stone-800">
              {formatCurrency(resumen?.ingresos?.pendiente_cobro)}
            </p>
            <p className="text-xs text-stone-500 mt-2">Saldo por cobrar</p>
          </div>

          {/* Operaciones del Mes */}
          <div
            onClick={() => abrirModal('operaciones', resumen?.operaciones)}
            className="bg-white rounded-xl shadow-lg p-6 border border-stone-200 hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaShoppingCart className="text-2xl text-blue-600" />
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-600">
                Mes actual
              </span>
            </div>
            <h3 className="text-sm font-medium text-stone-600 mb-1">Operaciones del Mes</h3>
            <p className="text-2xl font-bold text-stone-800">
              {resumen?.operaciones?.total_mes || 0}
            </p>
            <p className="text-xs text-stone-500 mt-2">Total de órdenes</p>
          </div>

          {/* Clientes Activos */}
          <div
            onClick={() => abrirModal('clientes', resumen?.clientes)}
            className="bg-white rounded-xl shadow-lg p-6 border border-stone-200 hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaUsers className="text-2xl text-purple-600" />
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-purple-100 text-purple-600">
                Activos
              </span>
            </div>
            <h3 className="text-sm font-medium text-stone-600 mb-1">Clientes del Mes</h3>
            <p className="text-2xl font-bold text-stone-800">
              {resumen?.clientes?.activos_mes || 0}
            </p>
            <p className="text-xs text-stone-500 mt-2">
              De {resumen?.clientes?.total_registrados} registrados
            </p>
          </div>
        </div>

        {/* Grid Principal - 3 Columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Operaciones por Estado */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-stone-100 rounded-lg">
                <FaShoppingCart className="text-2xl text-stone-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-800">Operaciones</h3>
                <p className="text-xs text-stone-500">Por estado</p>
              </div>
            </div>

            <div className="space-y-3">
              {Object.entries(resumen?.operaciones?.por_estado || {}).map(([estado, data]) => {
                const estadoConfig = {
                  cotizacion: { color: 'stone', icon: FaClock, label: 'Cotización' },
                  orden_trabajo: { color: 'blue', icon: FaChartBar, label: 'Orden de Trabajo' },
                  pendiente: { color: 'orange', icon: FaClock, label: 'Pendientes' },
                  en_proceso: { color: 'blue', icon: FaSync, label: 'En Proceso' },
                  terminada: { color: 'purple', icon: FaCheckCircle, label: 'Terminadas' },
                  completada: { color: 'green', icon: FaCheckCircle, label: 'Completadas' }
                };

                const config = estadoConfig[estado] || { color: 'stone', icon: FaBox, label: estado };
                const Icon = config.icon;

                return (
                  <div
                    key={estado}
                    onClick={() => abrirModal('estado_operacion', { ...data, label: config.label, color: config.color })}
                    className="flex items-center justify-between p-3 bg-stone-50 rounded-lg border border-stone-200 hover:border-stone-400 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="text-stone-600" />
                      <span className="text-sm font-medium text-stone-700">
                        {config.label}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-stone-800">
                        {data.cantidad}
                      </span>
                      <p className="text-xs text-stone-500">
                        {formatCurrency(data.monto_total)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Clientes por Categoría */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-stone-100 rounded-lg">
                <FaUsers className="text-2xl text-stone-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-800">Clientes</h3>
                <p className="text-xs text-stone-500">Por categoría</p>
              </div>
            </div>

            <div className="space-y-3">
              {clientes?.por_categoria?.map((categoria) => {
                const categoriaConfig = {
                  regular: { color: 'stone', bgClass: 'bg-stone-50', borderClass: 'border-stone-200', icon: FaUsers },
                  vip: { color: 'yellow', bgClass: 'bg-yellow-50', borderClass: 'border-yellow-200', icon: FaTrophy },
                  premium: { color: 'purple', bgClass: 'bg-purple-50', borderClass: 'border-purple-200', icon: FaTrophy }
                };

                const config = categoriaConfig[categoria.categoria] || {
                  color: 'stone',
                  bgClass: 'bg-stone-50',
                  borderClass: 'border-stone-200',
                  icon: FaUsers
                };
                const Icon = config.icon;

                return (
                  <div
                    key={categoria.categoria}
                    onClick={() => abrirModal('categoria_cliente', { ...categoria, color: config.color })}
                    className={`p-3 ${config.bgClass} rounded-lg border ${config.borderClass} hover:shadow-md hover:border-${config.color}-400 transition-all cursor-pointer`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Icon className={`text-${config.color}-600`} />
                        <span className={`text-sm font-medium text-${config.color}-700 capitalize`}>
                          {categoria.categoria}
                        </span>
                      </div>
                      <span className={`text-xl font-bold text-${config.color}-700`}>
                        {categoria.cantidad}
                      </span>
                    </div>
                    <p className={`text-xs text-${config.color}-600`}>
                      Descuento: {categoria.descuento_promedio}%
                    </p>
                  </div>
                );
              })}

              <div className="pt-3 border-t border-stone-200">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <span className="text-sm font-medium text-green-700">Nuevos este mes</span>
                  <span className="text-xl font-bold text-green-700">{clientes?.nuevos_mes || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Inventario */}
          <div
            onClick={() => abrirModal('inventario', inventario)}
            className="bg-white rounded-xl shadow-lg p-6 border border-stone-200 hover:shadow-xl hover:border-stone-400 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-stone-100 rounded-lg">
                <FaBox className="text-2xl text-stone-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-800">Inventario</h3>
                <p className="text-xs text-stone-500">Materiales</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-stone-50 rounded-lg">
                <p className="text-sm font-medium text-stone-700 mb-1">Valor Total</p>
                <p className="text-2xl font-bold text-stone-800">
                  {formatCurrency(inventario?.inventario_total?.valor_total)}
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  {inventario?.inventario_total?.total_materiales} materiales
                </p>
              </div>

              {inventario?.alertas?.criticos?.cantidad > 0 && (
                <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                  <div className="flex items-center gap-3 mb-2">
                    <FaExclamationTriangle className="text-2xl text-red-600" />
                    <div>
                      <p className="text-sm font-bold text-red-700">Stock Crítico</p>
                      <p className="text-xs text-red-600">Requiere atención urgente</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-red-700">
                    {inventario.alertas.criticos.cantidad}
                  </span>
                </div>
              )}

              {inventario?.alertas?.bajo_stock?.cantidad > 0 && (
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaExclamationTriangle className="text-orange-600" />
                      <span className="text-sm font-medium text-orange-700">Stock Bajo</span>
                    </div>
                    <span className="text-xl font-bold text-orange-700">
                      {inventario.alertas.bajo_stock.cantidad}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Indicadores Clave */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-stone-200 mb-8">
          <h3 className="text-lg font-bold text-stone-800 mb-6 flex items-center gap-2">
            <FaChartLine className="text-stone-600" />
            Indicadores Operacionales
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            

            <div className="p-6 bg-gradient-to-br from-stone-50 to-stone-100 rounded-lg border border-stone-200">
              <p className="text-sm font-medium text-stone-700 mb-2">Satisfacción Cliente</p>
              <p className="text-4xl font-bold text-stone-800 flex items-center gap-2">
                {satisfaccion?.promedios?.nota_pedido || 0}
                <FaStar className="text-yellow-500 text-2xl" />
              </p>
              <p className="text-xs text-stone-600 mt-2">
                {satisfaccion?.promedios?.total_encuestas || 0} encuestas
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-stone-50 to-stone-100 rounded-lg border border-stone-200">
              <p className="text-sm font-medium text-stone-700 mb-2">Abonos Recibidos</p>
              <p className="text-4xl font-bold text-stone-800">
                {indicadores?.abonos?.porcentaje_abonado || 0}%
              </p>
              <p className="text-xs text-stone-600 mt-2">
                {formatCurrency(indicadores?.abonos?.total_abonado)}
              </p>
            </div>
          </div>
        </div>

        {/* Proyección */}
        {indicadores?.proyeccion_ingresos && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-stone-200">
            <h3 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
              <FaDollarSign className="text-stone-600" />
              Proyección de Ingresos Pendientes
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-700 mb-1">Total Proyectado</p>
                <p className="text-xl font-bold text-blue-700">
                  {formatCurrency(indicadores.proyeccion_ingresos.total_proyectado)}
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm font-medium text-green-700 mb-1">Ya Abonado</p>
                <p className="text-xl font-bold text-green-700">
                  {formatCurrency(indicadores.proyeccion_ingresos.ya_abonado)}
                </p>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm font-medium text-orange-700 mb-1">Por Cobrar</p>
                <p className="text-xl font-bold text-orange-700">
                  {formatCurrency(indicadores.proyeccion_ingresos.por_cobrar)}
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                <p className="text-sm font-medium text-stone-700 mb-1">Operaciones</p>
                <p className="text-xl font-bold text-stone-800">
                  {indicadores.proyeccion_ingresos.num_operaciones_pendientes}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalAbierto && <Modal tipo={modalAbierto} datos={datosModal} onClose={cerrarModal} />}
    </div>
  );
};

export default GerenteDashboard;
