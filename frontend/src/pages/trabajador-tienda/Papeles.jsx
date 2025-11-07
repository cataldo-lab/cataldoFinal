// frontend/src/pages/trabajador-tienda/Papeles.jsx
import { useState, useMemo, useEffect } from 'react';
import { useGetClientesConCompras } from '@hooks/papeles/useGetClientesConCompras';
import { useGetClienteConComprasById } from '@hooks/papeles/useGetClienteConComprasById';
import { getProductos } from '@services/producto.service';
import { updateEstadoOperacion, EstadosOperacion, getEstadoLabel, getEstadoColor } from '@services/operacion.service';
import CrearOperacionModal from '@components/operaciones/CrearOperacionModal';
import { FaEye, FaUser, FaFileInvoiceDollar, FaChartLine, FaSearch, FaTimes, FaFilter, FaPlus, FaHistory } from 'react-icons/fa';

const Papeles = () => {
    const [selectedClienteId, setSelectedClienteId] = useState(null);

    // Estados para filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [filterOperaciones, setFilterOperaciones] = useState('all'); // all, 0, 1, 2+
    const [filterDeuda, setFilterDeuda] = useState('all'); // all, con_deuda, sin_deuda
    const [sortBy, setSortBy] = useState('nombre'); // nombre, operaciones, gastado, pendiente
    const [sortOrder, setSortOrder] = useState('asc'); // asc, desc
    const [showFilters, setShowFilters] = useState(false);

    // Estados para modal de crear operación
    const [showCrearModal, setShowCrearModal] = useState(false);
    const [productos, setProductos] = useState([]);

    // Estados para cambio de estado de operaciones
    const [cambiandoEstado, setCambiandoEstado] = useState({});
    const [mensajeEstado, setMensajeEstado] = useState({ tipo: null, texto: null });
    
    const { 
        clientes, 
        estadisticas, 
        loading: loadingClientes, 
        error: errorClientes, 
        fetchClientes 
    } = useGetClientesConCompras(true);

    const {
        cliente,
        loading: loadingCliente,
        fetchCliente,
        reset: resetCliente
    } = useGetClienteConComprasById();

    // Cargar productos activos
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await getProductos({ activo: true });
                if (response.status === 'Success' && response.data) {
                    setProductos(response.data);
                }
            } catch (error) {
                console.error('Error al cargar productos:', error);
            }
        };
        fetchProductos();
    }, []);

    // Filtrar y ordenar clientes
    const clientesFiltrados = useMemo(() => {
        let resultado = [...clientes];

        // Filtro de búsqueda
        if (searchTerm.trim() !== '') {
            const search = searchTerm.toLowerCase();
            resultado = resultado.filter(cliente => 
                cliente.nombreCompleto.toLowerCase().includes(search) ||
                cliente.email.toLowerCase().includes(search) ||
                cliente.rut.toLowerCase().includes(search)
            );
        }

        // Filtro de operaciones
        if (filterOperaciones !== 'all') {
            if (filterOperaciones === '0') {
                resultado = resultado.filter(c => c.resumen_compras.total_operaciones === 0);
            } else if (filterOperaciones === '1') {
                resultado = resultado.filter(c => c.resumen_compras.total_operaciones === 1);
            } else if (filterOperaciones === '2+') {
                resultado = resultado.filter(c => c.resumen_compras.total_operaciones >= 2);
            }
        }

        // Filtro de deuda
        if (filterDeuda !== 'all') {
            if (filterDeuda === 'con_deuda') {
                resultado = resultado.filter(c => c.resumen_compras.total_pendiente > 0);
            } else if (filterDeuda === 'sin_deuda') {
                resultado = resultado.filter(c => c.resumen_compras.total_pendiente === 0);
            }
        }

        // Ordenamiento
        resultado.sort((a, b) => {
            let compareA, compareB;

            switch (sortBy) {
                case 'nombre':
                    compareA = a.nombreCompleto.toLowerCase();
                    compareB = b.nombreCompleto.toLowerCase();
                    break;
                case 'operaciones':
                    compareA = a.resumen_compras.total_operaciones;
                    compareB = b.resumen_compras.total_operaciones;
                    break;
                case 'gastado':
                    compareA = a.resumen_compras.total_gastado;
                    compareB = b.resumen_compras.total_gastado;
                    break;
                case 'pendiente':
                    compareA = a.resumen_compras.total_pendiente;
                    compareB = b.resumen_compras.total_pendiente;
                    break;
                default:
                    compareA = a.nombreCompleto.toLowerCase();
                    compareB = b.nombreCompleto.toLowerCase();
            }

            if (sortOrder === 'asc') {
                return compareA > compareB ? 1 : compareA < compareB ? -1 : 0;
            } else {
                return compareA < compareB ? 1 : compareA > compareB ? -1 : 0;
            }
        });

        return resultado;
    }, [clientes, searchTerm, filterOperaciones, filterDeuda, sortBy, sortOrder]);

    // Limpiar todos los filtros
    const limpiarFiltros = () => {
        setSearchTerm('');
        setFilterOperaciones('all');
        setFilterDeuda('all');
        setSortBy('nombre');
        setSortOrder('asc');
    };

    // Verificar si hay filtros activos
    const hayFiltrosActivos = searchTerm !== '' || filterOperaciones !== 'all' || filterDeuda !== 'all' || sortBy !== 'nombre' || sortOrder !== 'asc';

    const handleVerDetalles = async (id_cliente) => {
        setSelectedClienteId(id_cliente);
        await fetchCliente(id_cliente);
    };

    const handleCloseModal = () => {
        setSelectedClienteId(null);
        resetCliente();
    };

    const handleOperacionCreada = (nuevaOperacion) => {
        fetchClientes(); // Refrescar lista de clientes
        setShowCrearModal(false);
    };

    const handleCambiarEstado = async (idOperacion, nuevoEstado, compra) => {
        // Validación para estado "pagada"
        if (nuevoEstado === EstadosOperacion.PAGADA) {
            const saldoPendiente = parseFloat(compra.saldo_pendiente || 0);
            const costoOperacion = parseFloat(compra.costo_operacion || 0);
            const cantidadAbono = parseFloat(compra.cantidad_abono || 0);

            // El saldo pendiente debe ser exactamente 0 y el abono debe ser igual al costo total
            if (saldoPendiente !== 0 || cantidadAbono !== costoOperacion) {
                setMensajeEstado({
                    tipo: 'error',
                    texto: `No se puede marcar como "Pagada". El saldo pendiente debe ser $0 y el monto abonado debe ser igual al total de la operación. Actual: Abonado ${formatCurrency(cantidadAbono)} de ${formatCurrency(costoOperacion)}, Pendiente: ${formatCurrency(saldoPendiente)}`
                });

                // Limpiar mensaje después de 5 segundos
                setTimeout(() => {
                    setMensajeEstado({ tipo: null, texto: null });
                }, 5000);

                return; // No continuar con el cambio de estado
            }
        }

        setCambiandoEstado(prev => ({ ...prev, [idOperacion]: true }));
        setMensajeEstado({ tipo: null, texto: null });

        try {
            const response = await updateEstadoOperacion(idOperacion, nuevoEstado);

            if (response.status === 'Success') {
                setMensajeEstado({
                    tipo: 'success',
                    texto: `Estado actualizado a "${getEstadoLabel(nuevoEstado)}" exitosamente`
                });

                // Refrescar datos del cliente
                if (selectedClienteId) {
                    await fetchCliente(selectedClienteId);
                }
                await fetchClientes();

                // Limpiar mensaje después de 3 segundos
                setTimeout(() => {
                    setMensajeEstado({ tipo: null, texto: null });
                }, 3000);
            } else {
                setMensajeEstado({
                    tipo: 'error',
                    texto: response.message || 'Error al actualizar el estado'
                });
            }
        } catch (error) {
            console.error('Error al cambiar estado:', error);
            setMensajeEstado({
                tipo: 'error',
                texto: 'Error de conexión al cambiar el estado'
            });
        } finally {
            setCambiandoEstado(prev => ({ ...prev, [idOperacion]: false }));
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(value);
    };

    if (loadingClientes) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-stone-200 rounded-full"></div>
                        <div className="w-16 h-16 border-4 border-stone-600 rounded-full animate-spin absolute top-0 border-t-transparent"></div>
                    </div>
                    <p className="mt-4 text-stone-600 font-medium">Cargando clientes...</p>
                </div>
            </div>
        );
    }

    if (errorClientes) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">
                <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 max-w-md shadow-lg">
                    <div className="flex items-center mb-2">
                        <span className="text-2xl mr-3">❌</span>
                        <h3 className="text-lg font-semibold text-red-800">Error</h3>
                    </div>
                    <p className="text-red-700 mb-4">{errorClientes}</p>
                    <button 
                        onClick={fetchClientes}
                        className="w-full px-4 py-2 bg-stone-600 text-white rounded-lg hover:bg-stone-700 transition-colors font-medium"
                    >
                        🔄 Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto pt-20">
                
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-stone-800 mb-2 flex items-center gap-3">
                            <FaFileInvoiceDollar className="text-stone-600" />
                            Papeles - Clientes con Compras
                        </h1>
                        <p className="text-stone-600">Gestión de clientes y sus operaciones</p>
                    </div>
                    <button
                        onClick={() => setShowCrearModal(true)}
                        className="px-6 py-3 bg-stone-600 text-white rounded-lg hover:bg-stone-700 transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl font-medium"
                    >
                        <FaPlus />
                        Nueva Operación
                    </button>
                </div>

                {/* Estadísticas Generales */}
                {estadisticas && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-stone-600 uppercase tracking-wide">Total Clientes</p>
                                    <p className="text-3xl font-bold text-stone-800 mt-2">
                                        {estadisticas.total_clientes}
                                    </p>
                                </div>
                                <FaUser className="text-4xl text-blue-500 opacity-20" />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-stone-600 uppercase tracking-wide">Total Operaciones</p>
                                    <p className="text-3xl font-bold text-stone-800 mt-2">
                                        {estadisticas.total_operaciones}
                                    </p>
                                </div>
                                <FaChartLine className="text-4xl text-purple-500 opacity-20" />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-stone-600 uppercase tracking-wide">Total Facturado</p>
                                    <p className="text-2xl font-bold text-green-600 mt-2">
                                        {formatCurrency(estadisticas.total_facturado)}
                                    </p>
                                </div>
                                <span className="text-4xl opacity-20">💰</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-stone-600 uppercase tracking-wide">Por Cobrar</p>
                                    <p className="text-2xl font-bold text-red-600 mt-2">
                                        {formatCurrency(estadisticas.total_por_cobrar)}
                                    </p>
                                </div>
                                <span className="text-4xl opacity-20">⏳</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Panel de Filtros */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        
                        {/* Barra de búsqueda */}
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre, email o RUT..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-10 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-all"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600"
                                    >
                                        <FaTimes />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Botón de filtros (móvil) */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-stone-600 text-white rounded-lg hover:bg-stone-700 transition-colors"
                        >
                            <FaFilter />
                            Filtros
                            {hayFiltrosActivos && (
                                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    !
                                </span>
                            )}
                        </button>

                        {/* Filtros (desktop siempre visible, móvil condicional) */}
                        <div className={`flex flex-col lg:flex-row gap-3 ${showFilters ? 'block' : 'hidden lg:flex'}`}>
                            {/* Filtro de operaciones */}
                            <select
                                value={filterOperaciones}
                                onChange={(e) => setFilterOperaciones(e.target.value)}
                                className="px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent bg-white"
                            >
                                <option value="all">Todas las operaciones</option>
                                <option value="0">Sin operaciones</option>
                                <option value="1">1 operación</option>
                                <option value="2+">2+ operaciones</option>
                            </select>

                            {/* Filtro de deuda */}
                            <select
                                value={filterDeuda}
                                onChange={(e) => setFilterDeuda(e.target.value)}
                                className="px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent bg-white"
                            >
                                <option value="all">Todos los estados</option>
                                <option value="con_deuda">Con deuda pendiente</option>
                                <option value="sin_deuda">Sin deuda</option>
                            </select>

                            {/* Ordenar por */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent bg-white"
                            >
                                <option value="nombre">Ordenar por nombre</option>
                                <option value="operaciones">Ordenar por operaciones</option>
                                <option value="gastado">Ordenar por total gastado</option>
                                <option value="pendiente">Ordenar por pendiente</option>
                            </select>

                            {/* Dirección de orden */}
                            <button
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                className="px-4 py-2.5 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors bg-white"
                                title={sortOrder === 'asc' ? 'Ascendente' : 'Descendente'}
                            >
                                {sortOrder === 'asc' ? '↑' : '↓'}
                            </button>

                            {/* Limpiar filtros */}
                            {hayFiltrosActivos && (
                                <button
                                    onClick={limpiarFiltros}
                                    className="px-4 py-2.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium flex items-center gap-2"
                                >
                                    <FaTimes />
                                    Limpiar
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Resumen de filtros activos */}
                    {clientesFiltrados.length !== clientes.length && (
                        <div className="mt-4 pt-4 border-t border-stone-200">
                            <p className="text-sm text-stone-600">
                                Mostrando <span className="font-bold text-stone-800">{clientesFiltrados.length}</span> de <span className="font-bold text-stone-800">{clientes.length}</span> clientes
                            </p>
                        </div>
                    )}
                </div>

                {/* Tabla de Clientes */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="px-6 py-4 bg-gradient-to-r from-stone-600 to-stone-700 border-b border-stone-200">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            <FaUser />
                            Lista de Clientes ({clientesFiltrados.length})
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-stone-200">
                            <thead className="bg-stone-50">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-stone-700 uppercase tracking-wider">
                                        Cliente
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-stone-700 uppercase tracking-wider">
                                        RUT
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-stone-700 uppercase tracking-wider">
                                        Operaciones
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-stone-700 uppercase tracking-wider">
                                        Total Gastado
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-stone-700 uppercase tracking-wider">
                                        Pendiente
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-stone-700 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-stone-200">
                                {clientesFiltrados.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center">
                                                <span className="text-6xl mb-4">🔍</span>
                                                <p className="text-stone-500 text-lg">
                                                    {hayFiltrosActivos 
                                                        ? 'No se encontraron clientes con los filtros aplicados'
                                                        : 'No hay clientes con compras registradas'
                                                    }
                                                </p>
                                                {hayFiltrosActivos && (
                                                    <button
                                                        onClick={limpiarFiltros}
                                                        className="mt-4 px-6 py-2 bg-stone-600 text-white rounded-lg hover:bg-stone-700 transition-colors"
                                                    >
                                                        Limpiar filtros
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    clientesFiltrados.map((cliente) => (
                                        <tr key={cliente.id} className="hover:bg-stone-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-stone-200 rounded-full flex items-center justify-center">
                                                        <FaUser className="text-stone-600" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-stone-900">
                                                            {cliente.nombreCompleto}
                                                        </div>
                                                        <div className="text-sm text-stone-500">
                                                            {cliente.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-stone-600 font-mono">
                                                    {cliente.rut}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                    {cliente.resumen_compras.total_operaciones}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <span className="text-sm font-bold text-green-600">
                                                    {formatCurrency(cliente.resumen_compras.total_gastado)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <span className={`text-sm font-bold ${
                                                    cliente.resumen_compras.total_pendiente > 0 
                                                        ? 'text-red-600' 
                                                        : 'text-green-600'
                                                }`}>
                                                    {formatCurrency(cliente.resumen_compras.total_pendiente)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <button
                                                    onClick={() => handleVerDetalles(cliente.id)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-stone-600 text-white rounded-lg hover:bg-stone-700 transition-colors text-sm font-medium shadow-sm hover:shadow-md"
                                                >
                                                    <FaEye />
                                                    Ver Detalles
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal de Crear Operación */}
                <CrearOperacionModal
                    isOpen={showCrearModal}
                    onClose={() => setShowCrearModal(false)}
                    onSuccess={handleOperacionCreada}
                    clientes={clientes}
                    productos={productos}
                />

               {selectedClienteId && cliente && (
    <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseModal();
        }}
    >
        <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header del Modal - FIJO */}
            <div className="bg-gradient-to-r from-stone-600 to-stone-700 px-6 py-5 flex justify-between items-center flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                        <FaUser className="text-white text-xl" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">
                            {cliente.nombreCompleto}
                        </h2>
                        <p className="text-stone-200 text-sm">{cliente.email}</p>
                    </div>
                </div>
                <button
                    onClick={handleCloseModal}
                    className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Contenido con Scroll */}
            <div className="flex-1 overflow-y-auto">
                {loadingCliente ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-stone-200 rounded-full"></div>
                            <div className="w-16 h-16 border-4 border-stone-600 rounded-full animate-spin absolute top-0 border-t-transparent"></div>
                        </div>
                    </div>
                ) : (
                    <div className="p-6 space-y-6">
                        {/* Mensaje de éxito/error */}
                        {mensajeEstado.texto && (
                            <div className={`p-4 rounded-lg border ${
                                mensajeEstado.tipo === 'success'
                                    ? 'bg-green-50 border-green-500 text-green-800'
                                    : 'bg-red-50 border-red-500 text-red-800'
                            }`}>
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">{mensajeEstado.tipo === 'success' ? '✅' : '❌'}</span>
                                    <p className="font-medium">{mensajeEstado.texto}</p>
                                </div>
                            </div>
                        )}
                        {/* Información Personal - Compacta */}
                        <div className="bg-stone-50 rounded-lg p-4">
                            <h3 className="text-lg font-bold text-stone-800 mb-3 flex items-center gap-2">
                                <span>👤</span>
                                Información Personal
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                <div>
                                    <p className="text-stone-600 font-medium">RUT</p>
                                    <p className="font-mono text-stone-800">{cliente.rut}</p>
                                </div>
                                <div>
                                    <p className="text-stone-600 font-medium">Teléfono</p>
                                    <p className="text-stone-800">{cliente.telefono || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-stone-600 font-medium">Categoría</p>
                                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium mt-1">
                                        {cliente.info_cliente?.categoria_cliente || 'Regular'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Resumen de Compras - Grid compacto */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                                <p className="text-xs text-blue-700 font-medium">Operaciones</p>
                                <p className="text-2xl font-bold text-blue-900 mt-1">
                                    {cliente.resumen_compras.total_operaciones}
                                </p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                                <p className="text-xs text-green-700 font-medium">Total Gastado</p>
                                <p className="text-lg font-bold text-green-900 mt-1">
                                    {formatCurrency(cliente.resumen_compras.total_gastado)}
                                </p>
                            </div>
                            <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                                <p className="text-xs text-yellow-700 font-medium">Abonado</p>
                                <p className="text-lg font-bold text-yellow-900 mt-1">
                                    {formatCurrency(cliente.resumen_compras.total_abonado)}
                                </p>
                            </div>
                            <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                                <p className="text-xs text-red-700 font-medium">Pendiente</p>
                                <p className="text-lg font-bold text-red-900 mt-1">
                                    {formatCurrency(cliente.resumen_compras.total_pendiente)}
                                </p>
                            </div>
                        </div>

                        {/* Historial de Compras - Diseño lineal y compacto */}
                        <div>
                            <h3 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
                                <span>🛒</span>
                                Historial de Compras ({cliente.compras?.length || 0})
                            </h3>

                            {/* Lista de compras con scroll interno */}
                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-custom">
                                {cliente.compras && cliente.compras.length > 0 ? (
                                    cliente.compras.map((compra) => (
                                        <div
                                            key={compra.id_operacion}
                                            className="border border-stone-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                                        >
                                            {/* Header de la compra - Una línea */}
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-lg font-bold text-stone-800">
                                                        #{compra.id_operacion}
                                                    </span>
                                                    <span className="text-xs text-stone-500">
                                                        {new Date(compra.fecha_creacion).toLocaleDateString('es-CL')}
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xl font-bold text-green-600">
                                                        {formatCurrency(compra.costo_operacion)}
                                                    </p>
                                                    {compra.saldo_pendiente > 0 && (
                                                        <p className="text-xs text-red-600 font-medium">
                                                            Pdte: {formatCurrency(compra.saldo_pendiente)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Selector de estado */}
                                            <div className="mb-3">
                                                <label className="block text-xs font-bold text-stone-700 mb-1">
                                                    Cambiar Estado:
                                                </label>
                                                <select
                                                    value={compra.estado_operacion}
                                                    onChange={(e) => handleCambiarEstado(compra.id_operacion, e.target.value, compra)}
                                                    disabled={cambiandoEstado[compra.id_operacion]}
                                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent text-sm ${
                                                        cambiandoEstado[compra.id_operacion] ? 'opacity-50 cursor-not-allowed' : ''
                                                    } ${
                                                        compra.estado_operacion === 'completada' || compra.estado_operacion === 'pagada' || compra.estado_operacion === 'entregada' ? 'bg-green-50 border-green-300' :
                                                        compra.estado_operacion === 'en_proceso' ? 'bg-blue-50 border-blue-300' :
                                                        compra.estado_operacion === 'pendiente' ? 'bg-yellow-50 border-yellow-300' :
                                                        compra.estado_operacion === 'anulada' ? 'bg-red-50 border-red-300' :
                                                        'bg-stone-50 border-stone-300'
                                                    }`}
                                                >
                                                    <option value={EstadosOperacion.COTIZACION}>
                                                        {getEstadoLabel(EstadosOperacion.COTIZACION)}
                                                    </option>
                                                    <option value={EstadosOperacion.ORDEN_TRABAJO}>
                                                        {getEstadoLabel(EstadosOperacion.ORDEN_TRABAJO)}
                                                    </option>
                                                    <option value={EstadosOperacion.PENDIENTE}>
                                                        {getEstadoLabel(EstadosOperacion.PENDIENTE)}
                                                    </option>
                                                    <option value={EstadosOperacion.EN_PROCESO}>
                                                        {getEstadoLabel(EstadosOperacion.EN_PROCESO)}
                                                    </option>
                                                    <option value={EstadosOperacion.TERMINADA}>
                                                        {getEstadoLabel(EstadosOperacion.TERMINADA)}
                                                    </option>
                                                    <option value={EstadosOperacion.COMPLETADA}>
                                                        {getEstadoLabel(EstadosOperacion.COMPLETADA)}
                                                    </option>
                                                    <option value={EstadosOperacion.ENTREGADA}>
                                                        {getEstadoLabel(EstadosOperacion.ENTREGADA)}
                                                    </option>
                                                    <option value={EstadosOperacion.PAGADA}>
                                                        {getEstadoLabel(EstadosOperacion.PAGADA)}
                                                    </option>
                                                    <option value={EstadosOperacion.ANULADA}>
                                                        {getEstadoLabel(EstadosOperacion.ANULADA)}
                                                    </option>
                                                </select>
                                                {cambiandoEstado[compra.id_operacion] && (
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <div className="w-3 h-3 border-2 border-stone-500 rounded-full animate-spin border-t-transparent"></div>
                                                        <span className="text-xs text-stone-500">Actualizando estado...</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Historial de cambios */}
                                            {compra.historial && compra.historial.length > 0 && (
                                                <div className="mb-3 border-t border-stone-100 pt-3">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <FaHistory className="text-stone-600 text-xs" />
                                                        <p className="text-xs font-bold text-stone-700">
                                                            Historial de Cambios ({compra.historial.length}):
                                                        </p>
                                                    </div>
                                                    <div className="space-y-1 max-h-32 overflow-y-auto">
                                                        {compra.historial
                                                            .sort((a, b) => new Date(b.fecha_cambio) - new Date(a.fecha_cambio))
                                                            .map((hist, idx) => {
                                                                // Determinar qué estado fue activado
                                                                const estadoActivado = Object.entries(hist).find(([key, value]) =>
                                                                    value === true && key !== 'id_h_operacion' && key !== 'fecha_cambio'
                                                                );

                                                                if (!estadoActivado) return null;

                                                                const [estado] = estadoActivado;
                                                                const colorEstado = getEstadoColor(estado);

                                                                return (
                                                                    <div
                                                                        key={hist.id_h_operacion || idx}
                                                                        className={`flex justify-between items-center text-xs bg-${colorEstado}-50 rounded px-2 py-1 border border-${colorEstado}-200`}
                                                                    >
                                                                        <div className="flex items-center gap-2">
                                                                            <span className={`w-2 h-2 bg-${colorEstado}-500 rounded-full`}></span>
                                                                            <span className="font-medium text-stone-700">
                                                                                {getEstadoLabel(estado)}
                                                                            </span>
                                                                        </div>
                                                                        <span className="text-stone-500">
                                                                            {new Date(hist.fecha_cambio).toLocaleDateString('es-CL', {
                                                                                year: 'numeric',
                                                                                month: 'short',
                                                                                day: 'numeric',
                                                                                hour: '2-digit',
                                                                                minute: '2-digit'
                                                                            })}
                                                                        </span>
                                                                    </div>
                                                                );
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            )}

                                            {/* Productos - Lista compacta */}
                                            {compra.productos && compra.productos.length > 0 && (
                                                <div className="border-t border-stone-100 pt-3">
                                                    <p className="text-xs font-bold text-stone-700 mb-2">
                                                        Productos ({compra.productos.length}):
                                                    </p>
                                                    <div className="space-y-1">
                                                        {compra.productos.map((prod) => (
                                                            <div 
                                                                key={prod.id_producto_operacion} 
                                                                className="flex justify-between items-center text-xs bg-stone-50 rounded px-3 py-2"
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <span className="w-6 h-6 bg-stone-200 rounded-full flex items-center justify-center text-stone-600 font-bold">
                                                                        {prod.cantidad}
                                                                    </span>
                                                                    <span className="text-stone-700 font-medium">
                                                                        {prod.producto?.nombre_producto}
                                                                    </span>
                                                                </div>
                                                                <span className="font-bold text-stone-800">
                                                                    {formatCurrency(prod.precio_total)}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 bg-stone-50 rounded-lg">
                                        <span className="text-6xl">📦</span>
                                        <p className="text-stone-500 mt-4">No hay compras registradas</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
)}
            </div>
        </div>
    );
};

export default Papeles;