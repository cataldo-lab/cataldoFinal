// frontend/src/pages/gerente/gerenteDashboard.jsx

import { useState, useEffect } from 'react';
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
  FaCalendarAlt
} from 'react-icons/fa';
import { getDashboardStats } from '../../services/gerente.service';

const GerenteDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    ventas: {
      total: 0,
      mes: 0,
      semana: 0,
      hoy: 0
    },
    clientes: {
      total: 0,
      nuevos: 0,
      vip: 0,
      premium: 0
    },
    operaciones: {
      total: 0,
      pendientes: 0,
      enProceso: 0,
      completadas: 0
    },
    productos: {
      total: 0,
      bajoStock: 0
    },
    metricas: {
      tasaConversion: 0,
      ticketPromedio: 0,
      satisfaccionCliente: 0
    }
  });

  useEffect(() => {
    cargarDashboard();
  }, []);

  const cargarDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDashboardStats();

      if (response && response.data) {
        setDashboardData(response.data);
      }
    } catch (err) {
      console.error('Error al cargar dashboard:', err);
      setError('Error al cargar las estadísticas del dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-20 h-20 border-4 border-stone-200 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-stone-600 rounded-full animate-spin absolute top-0 border-t-transparent"></div>
          </div>
          <p className="mt-4 text-stone-600 font-medium">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full border border-red-200">
          <div className="flex items-center gap-3 mb-4">
            <FaExclamationTriangle className="text-3xl text-red-600" />
            <h2 className="text-xl font-bold text-stone-800">Error al cargar datos</h2>
          </div>
          <p className="text-stone-600 mb-6">{error}</p>
          <button
            onClick={cargarDashboard}
            className="w-full px-4 py-2 bg-stone-600 text-white rounded-lg hover:bg-stone-700 transition-colors font-medium"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-stone-800 flex items-center gap-3">
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
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-stone-200">
              <FaCalendarAlt className="text-stone-500" />
              <span className="text-sm font-medium text-stone-700">
                {new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>

        {/* Tarjetas de Ventas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Ventas Totales */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-stone-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FaDollarSign className="text-2xl text-green-600" />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                +12.5%
              </span>
            </div>
            <h3 className="text-sm font-medium text-stone-600 mb-1">Ventas Totales</h3>
            <p className="text-2xl font-bold text-stone-800">{formatCurrency(dashboardData.ventas.total)}</p>
            <p className="text-xs text-stone-500 mt-2">Hist�rico acumulado</p>
          </div>

          {/* Ventas del Mes */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-stone-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaChartLine className="text-2xl text-blue-600" />
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                +8.3%
              </span>
            </div>
            <h3 className="text-sm font-medium text-stone-600 mb-1">Ventas del Mes</h3>
            <p className="text-2xl font-bold text-stone-800">{formatCurrency(dashboardData.ventas.mes)}</p>
            <p className="text-xs text-stone-500 mt-2">{new Date().toLocaleDateString('es-CL', { month: 'long' })}</p>
          </div>

          {/* Ventas de la Semana */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-stone-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaShoppingCart className="text-2xl text-purple-600" />
              </div>
              <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                +15.2%
              </span>
            </div>
            <h3 className="text-sm font-medium text-stone-600 mb-1">Ventas Semanales</h3>
            <p className="text-2xl font-bold text-stone-800">{formatCurrency(dashboardData.ventas.semana)}</p>
            <p className="text-xs text-stone-500 mt-2">�ltimos 7 d�as</p>
          </div>

          {/* Ventas de Hoy */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-stone-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FaCalendarAlt className="text-2xl text-orange-600" />
              </div>
              <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                Hoy
              </span>
            </div>
            <h3 className="text-sm font-medium text-stone-600 mb-1">Ventas de Hoy</h3>
            <p className="text-2xl font-bold text-stone-800">{formatCurrency(dashboardData.ventas.hoy)}</p>
            <p className="text-xs text-stone-500 mt-2">Actualizado en tiempo real</p>
          </div>
        </div>

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Clientes */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-stone-100 rounded-lg">
                <FaUsers className="text-2xl text-stone-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-800">Clientes</h3>
                <p className="text-xs text-stone-500">Gesti�n de clientes</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                <span className="text-sm font-medium text-stone-700">Total de Clientes</span>
                <span className="text-xl font-bold text-stone-800">{dashboardData.clientes.total}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <span className="text-sm font-medium text-green-700">Nuevos (Este mes)</span>
                <span className="text-xl font-bold text-green-700">{dashboardData.clientes.nuevos}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2">
                  <FaTrophy className="text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-700">Clientes VIP</span>
                </div>
                <span className="text-xl font-bold text-yellow-700">{dashboardData.clientes.vip}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2">
                  <FaTrophy className="text-purple-600" />
                  <span className="text-sm font-medium text-purple-700">Clientes Premium</span>
                </div>
                <span className="text-xl font-bold text-purple-700">{dashboardData.clientes.premium}</span>
              </div>
            </div>
          </div>

          {/* Operaciones */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaShoppingCart className="text-2xl text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-800">Operaciones</h3>
                <p className="text-xs text-stone-500">Estado de �rdenes</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                <span className="text-sm font-medium text-stone-700">Total Operaciones</span>
                <span className="text-xl font-bold text-stone-800">{dashboardData.operaciones.total}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2">
                  <FaClock className="text-orange-600" />
                  <span className="text-sm font-medium text-orange-700">Pendientes</span>
                </div>
                <span className="text-xl font-bold text-orange-700">{dashboardData.operaciones.pendientes}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <FaChartLine className="text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">En Proceso</span>
                </div>
                <span className="text-xl font-bold text-blue-700">{dashboardData.operaciones.enProceso}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-600" />
                  <span className="text-sm font-medium text-green-700">Completadas</span>
                </div>
                <span className="text-xl font-bold text-green-700">{dashboardData.operaciones.completadas}</span>
              </div>
            </div>
          </div>

          {/* Productos e Inventario */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaBox className="text-2xl text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-800">Inventario</h3>
                <p className="text-xs text-stone-500">Control de productos</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                <span className="text-sm font-medium text-stone-700">Total Productos</span>
                <span className="text-xl font-bold text-stone-800">{dashboardData.productos.total}</span>
              </div>

              {dashboardData.productos.bajoStock > 0 && (
                <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                  <div className="flex items-center gap-3 mb-2">
                    <FaExclamationTriangle className="text-2xl text-red-600" />
                    <div>
                      <p className="text-sm font-bold text-red-700">Alerta de Stock</p>
                      <p className="text-xs text-red-600">Productos con stock bajo</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm font-medium text-red-700">Productos afectados</span>
                    <span className="text-2xl font-bold text-red-700">{dashboardData.productos.bajoStock}</span>
                  </div>
                  <button className="w-full mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                    Ver Productos
                  </button>
                </div>
              )}

              <div className="p-4 bg-stone-50 rounded-lg">
                <p className="text-xs text-stone-600 mb-2">Estado del inventario</p>
                <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                    style={{ width: '85%' }}
                  />
                </div>
                <p className="text-xs text-stone-500 mt-2">85% con stock �ptimo</p>
              </div>
            </div>
          </div>
        </div>

        {/* Resumen R�pido */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-stone-200">
          <h3 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
            <FaChartLine className="text-stone-600" />
            Resumen Ejecutivo
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
              <p className="text-sm font-medium text-green-700 mb-1">Tasa de Conversi�n</p>
              <p className="text-3xl font-bold text-green-700">{dashboardData.metricas?.tasaConversion || 0}%</p>
              <p className="text-xs text-green-600 mt-1">� +5.2% vs mes anterior</p>
            </div>

            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-700 mb-1">Ticket Promedio</p>
              <p className="text-3xl font-bold text-blue-700">{formatCurrency(dashboardData.metricas?.ticketPromedio || 0)}</p>
              <p className="text-xs text-blue-600 mt-1">� +3.8% vs mes anterior</p>
            </div>

            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
              <p className="text-sm font-medium text-purple-700 mb-1">Satisfacci�n Cliente</p>
              <p className="text-3xl font-bold text-purple-700">{dashboardData.metricas?.satisfaccionCliente || 0}/5.0</p>
              <p className="text-xs text-purple-600 mt-1">Basado en 156 rese�as</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GerenteDashboard;
