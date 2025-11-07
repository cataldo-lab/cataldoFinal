// frontend/src/pages/trabajador-tienda/TrabajadorDashboard.jsx
import { useTrabajadorDashboard } from '../../hooks/Dashboard/useTrabajadorDashborad.jsx';

import { FaExclamationTriangle,
         FaCheckCircle, FaBox, 
         FaDollarSign, FaWarehouse, 
         FaClipboardList, FaUsers, 
         FaHandshake, FaClock } from 'react-icons/fa';

import { MdSpaceDashboard } from "react-icons/md";


const TrabajadorDashboard = () => {
    const { stats, loading, error, reloadStats } = useTrabajadorDashboard();

    // Estado de carga
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mb-4"></div>
                    <p className="text-xl text-gray-600 font-medium">Cargando estadísticas...</p>
                </div>
            </div>
        );
    }

    // Estado de error
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="max-w-md w-full bg-red-50 border-l-4 border-red-500 rounded-lg p-6 shadow-lg">
                    <div className="flex items-center mb-4">
                        <span className="text-3xl mr-3">❌</span>
                        <h3 className="text-lg font-semibold text-red-800">Error al cargar datos</h3>
                    </div>
                    <p className="text-red-700 mb-4">{error}</p>
                    <button 
                        onClick={reloadStats}
                        className="w-full bg-blue-900 hover:bg-blue-800 text-white
                         font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    >
                        🔄 Reintentar
                    </button>
                </div>
            </div>
        );
    }

    // Sin datos
    if (!stats) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center bg-white p-8 rounded-xl shadow-md">
                    <span className="text-6xl mb-4 block">📊</span>
                    <p className="text-xl text-gray-600">No hay estadísticas disponibles</p>
                </div>
            </div>
        );
    }

    // Formatear moneda
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(value);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto pt-20">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-stone-700 mb-2">
                            <MdSpaceDashboard className="inline-block mr-2" />
                            Panel de Trabajador Tienda
                        </h1>
                        <p className="text-gray-600">Dashboard de gestión y estadísticas</p>
                    </div>
                    <button 
                        onClick={reloadStats}
                        className="flex items-center gap-2 bg-stone-600 hover:bg-stone-800 
                        text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 
                        transform hover:scale-105 hover:shadow-lg"
                    >
                        <span className="text-xl"></span>
                        <span>Actualizar</span>
                    </button>
                </div>

                {/* Grid de Estadísticas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Operaciones Pendientes */}
                    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 
                    border-l-4 border-stone-500 transform hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                                Pendientes
                            </h3>
                            <span className="text-3xl"></span>
                        </div>
                        <p className="text-5xl font-bold text-blue-900 mb-2">
                            {stats.operacionesPendientes || 0}
                        </p>
                        <p className="text-sm text-gray-500">Por iniciar</p>
                    </div>

                    {/* En Proceso */}
                    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-stone-500 transform hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                                En Proceso
                            </h3>
                            <span className="text-3xl"></span>
                        </div>
                        <p className="text-5xl font-bold text-blue-900 mb-2">
                            {stats.operacionesEnProceso || 0}
                        </p>
                        <p className="text-sm text-gray-500">En fabricación</p>
                    </div>

                    {/* Total Productos */}
                    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 
                    border-l-4 border-stone-500 transform hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                                Productos
                            </h3>
                            <span className="text-3xl"></span>
                        </div>
                        <p className="text-5xl font-bold text-blue-900 mb-2">
                            {stats.productoCount || 0}
                        </p>
                        <p className="text-sm text-gray-500">Productos activos</p>
                    </div>

                    {/* Materiales Bajo Stock */}
                    <div className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border-l-4 ${
                        stats.materialesBajoStock > 0 ? 'border-red-500 bg-red-50' : 'border-stone-500'
                    } transform hover:-translate-y-1`}>
                        <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                            Stock Bajo
                        </h3>
                        <span className="text-3xl">
                            {stats.materialesBajoStock > 0 ? (
                                <FaExclamationTriangle className="w-8 h-8 text-yellow-500" />
                            ) : (
                                <FaCheckCircle className="w-8 h-8 text-green-500" />
                            )}
                        </span>
                     </div>
                                            <p className={`text-5xl font-bold mb-2 ${
                            stats.materialesBajoStock > 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                            {stats.materialesBajoStock || 0}
                        </p>
                        <p className={`text-sm ${
                            stats.materialesBajoStock > 0 ? 'text-red-600 font-semibold' : 'text-gray-500'
                        }`}>
                            {stats.materialesBajoStock > 0 ? 'Requiere atención' : 'Stock adecuado'}
                        </p>
                    </div>
                </div>

                {/* Ingresos del Mes */}
                {stats.ingresosMesActual !== undefined && (
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600
                     rounded-2xl shadow-xl p-8 mb-8 text-white transform hover:scale-[1.02] transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold opacity-90 mb-2">
                                 Ingresos del Mes Actual
                                </h3>
                                <p className="text-5xl font-bold">
                                    {formatCurrency(stats.ingresosMesActual)}
                                </p>
                                <p className="text-sm opacity-80 mt-2">
                                    Operaciones completadas este mes
                                </p>
                            </div>
                            <div className="text-8xl opacity-30">
                                <FaDollarSign className="text-8xl opacity-40" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Accesos Rápidos */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-stone-900 mb-6 flex items-center gap-2">
                        <span className="text-3xl"></span>
                        Accesos Rápidos
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        <button 
                            onClick={() => window.location.href = '/trabajador/operations'}
                            className="bg-gradient-to-r from-stone-600 to-stone-500 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
                        >
                            <FaClipboardList className="text-2xl" /> 
                            <span>Ver Operaciones</span>
                        </button>
                        
                        <button 
                            onClick={() => window.location.href = '/trabajador/products'}
                            className="bg-gradient-to-r from-stone-600 to-stone-500 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
                        >
                            <FaBox className="text-2xl" /> 
                            <span>Gestionar Productos</span>
                        </button>
                        
                        <button 
                            onClick={() => window.location.href = '/trabajador/materiales'}
                            className="bg-gradient-to-r from-stone-600 to-stone-500 hover:from-orange-700 hover:to-orange-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
                        >
                            <FaWarehouse className="text-2xl" /> 
                            <span>Ver Materiales</span>
                        </button>
                        
                        <button 
                            onClick={() => window.location.href = '/trabajador/clientes'}
                            className="bg-gradient-to-r from-stone-600 to-stone-500 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
                        >
                            <FaUsers className="text-2xl" />
                            <span>Ver Clientes</span>
                        </button>
                        <button 
                            onClick={() => window.location.href = '/trabajador/proveedores'}
                            className="bg-gradient-to-r from-stone-600 to-stone-500 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
                        >
                            <FaHandshake className="text-2xl" />
                            <span>Proveedores</span>
                        </button>
                    </div>
                </div>

                {/* Footer con fecha */}
                {stats.fecha_consulta && (
                    <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500 bg-white inline-block px-6 py-3 rounded-full shadow-sm">
                        <FaClock className="inline mr-2" /> 
                        Última actualización: {new Date(stats.fecha_consulta).toLocaleString('es-CL')}
                    </p>
                </div>
                )}
            </div>
        </div>
    );
};

export default TrabajadorDashboard;