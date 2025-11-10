// frontend/src/pages/trabajador-tienda/TrabajadorDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrabajadorDashboard } from '../../hooks/Dashboard/useTrabajadorDashboard.jsx';
import { getOperaciones, getEstadoLabel, getEstadoColor } from '../../services/operacion.service.js';

import {
    FaExclamationTriangle,
    FaCheckCircle,
    FaBox,
    FaDollarSign,
    FaWarehouse,
    FaClipboardList,
    FaUsers,
    FaHandshake,
    FaClock,
    FaEnvelope,
    FaHourglassHalf,
    FaCog,
    FaSync,
    FaChartLine,
    FaTimesCircle,
    FaMoneyBillWave,
    FaCalendarTimes
} from 'react-icons/fa';

import { MdSpaceDashboard } from "react-icons/md";

// Modal para mostrar operaciones filtradas por estado
const OperacionesModal = ({ isOpen, onClose, estadoFiltro, titulo }) => {
    const [operaciones, setOperaciones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && estadoFiltro && estadoFiltro !== 'all') {
            fetchOperaciones();
        }
    }, [isOpen, estadoFiltro]);

    const fetchOperaciones = async () => {
        setLoading(true);
        setError(null);
        try {
            let response;
            let operacionesFiltradas = [];

            if (estadoFiltro === 'atrasadas') {
                // Para operaciones atrasadas, obtenemos todas y filtramos en el frontend
                response = await getOperaciones({});
                if (response.status === 'Success') {
                    const hoy = new Date();
                    hoy.setHours(0, 0, 0, 0);

                    // Filtrar operaciones atrasadas
                    operacionesFiltradas = (response.data || []).filter(op => {
                        const fechaEntrega = new Date(op.fecha_entrega_estimada);
                        const estadosFinales = ['completada', 'pagada', 'entregada', 'anulada'];
                        return fechaEntrega < hoy && !estadosFinales.includes(op.estado_operacion);
                    });
                }
            } else {
                // Para otros filtros, usar el filtro normal
                response = await getOperaciones({ estado_operacion: estadoFiltro });
                if (response.status === 'Success') {
                    operacionesFiltradas = response.data || [];
                }
            }

            if (response.status === 'Success') {
                setOperaciones(operacionesFiltradas);
            } else {
                setError(response.message || 'Error al cargar operaciones');
            }
        } catch (err) {
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(value);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No especificada';
        return new Date(dateString).toLocaleDateString('es-CL');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="bg-gradient-to-r from-stone-600 to-stone-700 text-white p-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                        {estadoFiltro === 'pendiente' && <FaHourglassHalf className="text-3xl" />}
                        {estadoFiltro === 'en_proceso' && <FaCog className="text-3xl animate-spin-slow" />}
                        {estadoFiltro === 'atrasadas' && <FaCalendarTimes className="text-3xl" />}
                        {titulo}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
                    >
                        <FaTimesCircle className="text-3xl" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    {loading && (
                        <div className="text-center py-12">
                            <FaSync className="inline-block animate-spin h-12 w-12 text-blue-900 mb-4" />
                            <p className="text-gray-600">Cargando operaciones...</p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}

                    {!loading && !error && operaciones.length === 0 && (
                        <div className="text-center py-12">
                            <FaClipboardList className="text-6xl text-gray-300 mx-auto mb-4" />
                            <p className="text-xl text-gray-500">No hay operaciones {titulo.toLowerCase()}</p>
                        </div>
                    )}

                    {!loading && !error && operaciones.length > 0 && (
                        <div className="grid grid-cols-1 gap-4">
                            {operaciones.map((op) => (
                                <div
                                    key={op.id_operacion}
                                    className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="text-lg font-bold text-stone-800">
                                                Operación #{op.id_operacion}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                Cliente: {op.cliente?.nombreCompleto || 'No especificado'}
                                            </p>
                                        </div>
                                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                            estadoFiltro === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                            estadoFiltro === 'en_proceso' ? 'bg-blue-100 text-blue-800' :
                                            estadoFiltro === 'atrasadas' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {getEstadoLabel(op.estado_operacion)}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <FaDollarSign className="text-green-600" />
                                            <div>
                                                <p className="text-xs text-gray-500">Monto Total</p>
                                                <p className="font-semibold">{formatCurrency(op.monto_total || 0)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <FaMoneyBillWave className="text-blue-600" />
                                            <div>
                                                <p className="text-xs text-gray-500">Saldo Pendiente</p>
                                                <p className="font-semibold">{formatCurrency(op.saldo_pendiente || 0)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <FaClock className="text-orange-600" />
                                            <div>
                                                <p className="text-xs text-gray-500">Fecha Estimada</p>
                                                <p className="font-semibold">{formatDate(op.fecha_entrega_estimada)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {op.descripcion_operacion && (
                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                            <p className="text-sm text-gray-600">
                                                <strong>Descripción:</strong> {op.descripcion_operacion}
                                            </p>
                                        </div>
                                    )}

                                    {/* Indicador de días de retraso para operaciones atrasadas */}
                                    {estadoFiltro === 'atrasadas' && op.fecha_entrega_estimada && (
                                        <div className="mt-3 pt-3 border-t border-red-200 bg-red-50 p-3 rounded-lg">
                                            <p className="text-sm text-red-700 font-semibold flex items-center gap-2">
                                                <FaCalendarTimes />
                                                Atrasada {Math.floor((new Date() - new Date(op.fecha_entrega_estimada)) / (1000 * 60 * 60 * 24))} días
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Componente reutilizable para tarjetas de estadísticas
const StatCard = ({ title, value, subtitle, icon: Icon, borderColor = 'border-stone-500', textColor = 'text-blue-900', bgColor = 'bg-white', onClick, isClickable = false }) => {
    const baseClasses = `${bgColor} rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border-l-4 ${borderColor} transform hover:-translate-y-1`;
    const clickableClasses = isClickable ? 'cursor-pointer' : '';

    const content = (
        <>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    {title}
                </h3>
                {Icon && <Icon className="w-8 h-8" />}
            </div>
            <p className={`text-5xl font-bold ${textColor} mb-2`}>
                {value}
            </p>
            <p className={`text-sm ${subtitle.includes('atención') ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                {subtitle}
            </p>
        </>
    );

    return isClickable ? (
        <button onClick={onClick} className={`${baseClasses} ${clickableClasses} text-left w-full`}>
            {content}
        </button>
    ) : (
        <div className={baseClasses}>
            {content}
        </div>
    );
};

// Componente reutilizable para botones de acceso rápido
const QuickAccessButton = ({ icon: Icon, label, onClick, colorFrom = 'stone-600', colorTo = 'stone-500', hoverFrom, hoverTo }) => (
    <button
        onClick={onClick}
        className={`bg-gradient-to-r from-${colorFrom} to-${colorTo} hover:from-${hoverFrom || 'blue-700'} hover:to-${hoverTo || 'blue-800'} text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2`}
    >
        <Icon className="text-2xl" />
        <span>{label}</span>
    </button>
);

const TrabajadorDashboard = () => {
    const navigate = useNavigate();
    const { stats, loading, error, reloadStats } = useTrabajadorDashboard();

    // Estados para el modal de operaciones
    const [modalState, setModalState] = useState({
        isOpen: false,
        estadoFiltro: null,
        titulo: ''
    });

    const abrirModalOperaciones = (estado, titulo) => {
        setModalState({
            isOpen: true,
            estadoFiltro: estado,
            titulo: titulo
        });
    };

    const cerrarModal = () => {
        setModalState({
            isOpen: false,
            estadoFiltro: null,
            titulo: ''
        });
    };

    // Estado de carga
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <FaSync className="inline-block animate-spin h-12 w-12 text-blue-900 mb-4" />
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
                        <FaTimesCircle className="text-3xl mr-3 text-red-600" />
                        <h3 className="text-lg font-semibold text-red-800">Error al cargar datos</h3>
                    </div>
                    <p className="text-red-700 mb-4">{error}</p>
                    <button
                        onClick={reloadStats}
                        className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
                    >
                        <FaSync className="text-lg" />
                        <span>Reintentar</span>
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
                    <FaChartLine className="text-6xl mb-4 inline-block text-gray-400" />
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
        <>
            {/* Modal de Operaciones */}
            <OperacionesModal
                isOpen={modalState.isOpen}
                onClose={cerrarModal}
                estadoFiltro={modalState.estadoFiltro}
                titulo={modalState.titulo}
            />

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
                            className="flex items-center gap-2 bg-stone-600 hover:bg-stone-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                        >
                            <FaSync className="text-lg" />
                            <span>Actualizar</span>
                        </button>
                    </div>

                    {/* Grid de Estadísticas - 5 columnas responsive */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
                        {/* Operaciones Pendientes - Clickeable */}
                        <StatCard
                            title="Pendientes"
                            value={stats.operacionesPendientes || 0}
                            subtitle="Por iniciar"
                            icon={FaHourglassHalf}
                            isClickable={true}
                            onClick={() => abrirModalOperaciones('pendiente', 'Operaciones Pendientes')}
                        />

                        {/* En Proceso - Clickeable */}
                        <StatCard
                            title="En Proceso"
                            value={stats.operacionesEnProceso || 0}
                            subtitle="En fabricación"
                            icon={FaCog}
                            isClickable={true}
                            onClick={() => abrirModalOperaciones('en_proceso', 'Operaciones en Proceso')}
                        />

                        {/* Operaciones Atrasadas - Clickeable */}
                        <StatCard
                            title="Atrasados"
                            value={stats.operacionesAtrasadas || 0}
                            subtitle={stats.operacionesAtrasadas > 0 ? 'Requiere atención urgente' : 'Sin atrasos'}
                            icon={FaCalendarTimes}
                            borderColor={stats.operacionesAtrasadas > 0 ? 'border-red-500' : 'border-stone-500'}
                            textColor={stats.operacionesAtrasadas > 0 ? 'text-red-600' : 'text-green-600'}
                            bgColor={stats.operacionesAtrasadas > 0 ? 'bg-red-50' : 'bg-white'}
                            isClickable={true}
                            onClick={() => abrirModalOperaciones('atrasadas', 'Operaciones Atrasadas')}
                        />

                        {/* Total Productos - Clickeable */}
                        <StatCard
                            title="Productos"
                            value={stats.productoCount || 0}
                            subtitle="Productos activos"
                            icon={FaBox}
                            isClickable={true}
                            onClick={() => navigate('/trabajador/products')}
                        />

                        {/* Materiales Bajo Stock - Clickeable con estado condicional */}
                        <StatCard
                            title="Stock Bajo"
                            value={stats.materialesBajoStock || 0}
                            subtitle={stats.materialesBajoStock > 0 ? 'Requiere atención' : 'Stock adecuado'}
                            icon={stats.materialesBajoStock > 0 ? FaExclamationTriangle : FaCheckCircle}
                            borderColor={stats.materialesBajoStock > 0 ? 'border-red-500' : 'border-stone-500'}
                            textColor={stats.materialesBajoStock > 0 ? 'text-red-600' : 'text-green-600'}
                            bgColor={stats.materialesBajoStock > 0 ? 'bg-red-50' : 'bg-white'}
                            isClickable={true}
                            onClick={() => navigate('/trabajador/materiales')}
                        />
                    </div>

                {/* Ingresos del Mes */}
                {stats.ingresosMesActual !== undefined && (
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-xl p-8 mb-8 text-white transform hover:scale-[1.02] transition-all duration-300">
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
                            <div>
                                <FaDollarSign className="text-8xl opacity-30" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Accesos Rápidos */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-stone-900 mb-6 flex items-center gap-2">
                        <FaChartLine className="text-2xl" />
                        Accesos Rápidos
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <QuickAccessButton
                            icon={FaClipboardList}
                            label="Papeles"
                            onClick={() => navigate('/trabajador/papeles')}
                            colorFrom="stone-600"
                            colorTo="stone-500"
                            hoverFrom="blue-700"
                            hoverTo="blue-800"
                        />

                        <QuickAccessButton
                            icon={FaBox}
                            label="Gestionar Productos"
                            onClick={() => navigate('/trabajador/products')}
                            colorFrom="stone-600"
                            colorTo="stone-500"
                            hoverFrom="purple-700"
                            hoverTo="purple-800"
                        />

                        <QuickAccessButton
                            icon={FaWarehouse}
                            label="Ver Materiales"
                            onClick={() => navigate('/trabajador/materiales')}
                            colorFrom="stone-600"
                            colorTo="stone-500"
                            hoverFrom="orange-700"
                            hoverTo="orange-800"
                        />

                        <QuickAccessButton
                            icon={FaUsers}
                            label="Ver Clientes"
                            onClick={() => navigate('/trabajador/clientes')}
                            colorFrom="stone-600"
                            colorTo="stone-500"
                            hoverFrom="green-700"
                            hoverTo="green-800"
                        />

                        <QuickAccessButton
                            icon={FaHandshake}
                            label="Proveedores"
                            onClick={() => navigate('/trabajador/proveedores')}
                            colorFrom="stone-600"
                            colorTo="stone-500"
                            hoverFrom="blue-700"
                            hoverTo="blue-800"
                        />

                        <QuickAccessButton
                            icon={FaEnvelope}
                            label="Servicio Correo"
                            onClick={() => navigate('/trabajador/correos')}
                            colorFrom="stone-600"
                            colorTo="stone-500"
                            hoverFrom="indigo-700"
                            hoverTo="indigo-800"
                        />
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
        </>
    );
};

export default TrabajadorDashboard;