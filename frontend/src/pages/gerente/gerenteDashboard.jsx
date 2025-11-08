// frontend/src/pages/gerente/gerenteDashboard.jsx

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
  FaArrowUp
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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(value || 0);
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
          <div className="bg-white rounded-xl shadow-lg p-6 border border-stone-200 hover:shadow-xl transition-shadow">
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
          <div className="bg-white rounded-xl shadow-lg p-6 border border-stone-200 hover:shadow-xl transition-shadow">
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
          <div className="bg-white rounded-xl shadow-lg p-6 border border-stone-200 hover:shadow-xl transition-shadow">
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
          <div className="bg-white rounded-xl shadow-lg p-6 border border-stone-200 hover:shadow-xl transition-shadow">
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
                    className="flex items-center justify-between p-3 bg-stone-50 rounded-lg border border-stone-200 hover:border-stone-300 transition-colors"
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
                  regular: { color: 'bg-stone-50 border-stone-200 text-stone', icon: FaUsers },
                  vip: { color: 'bg-yellow-50 border-yellow-200 text-yellow', icon: FaTrophy },
                  premium: { color: 'bg-purple-50 border-purple-200 text-purple', icon: FaTrophy }
                };

                const config = categoriaConfig[categoria.categoria] || {
                  color: 'bg-stone-50 border-stone-200 text-stone',
                  icon: FaUsers
                };
                const Icon = config.icon;

                return (
                  <div
                    key={categoria.categoria}
                    className={`p-3 ${config.color.split(' ')[0]} rounded-lg border ${config.color.split(' ')[1]}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Icon className={`${config.color.split(' ')[2]}-600`} />
                        <span className={`text-sm font-medium ${config.color.split(' ')[2]}-700 capitalize`}>
                          {categoria.categoria}
                        </span>
                      </div>
                      <span className={`text-xl font-bold ${config.color.split(' ')[2]}-700`}>
                        {categoria.cantidad}
                      </span>
                    </div>
                    <p className={`text-xs ${config.color.split(' ')[2]}-600`}>
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
          <div className="bg-white rounded-xl shadow-lg p-6 border border-stone-200">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-stone-50 to-stone-100 rounded-lg border border-stone-200">
              <p className="text-sm font-medium text-stone-700 mb-2">Tasa de Conversión</p>
              <p className="text-4xl font-bold text-stone-800">
                {indicadores?.conversion?.porcentaje_conversion || 0}%
              </p>
              <p className="text-xs text-stone-600 mt-2 flex items-center gap-1">
                <FaArrowUp className="text-green-600" />
                {indicadores?.conversion?.ventas} ventas
              </p>
            </div>

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
    </div>
  );
};

export default GerenteDashboard;
