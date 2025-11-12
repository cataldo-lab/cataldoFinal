import { useState, useEffect } from 'react';
import {
  getMisPedidos,
  getMiPedidoById,
  getEstadoPedidoLabel,
  getEstadoPedidoColor,
  formatearFecha,
  formatearFechaHora,
  formatearMoneda,
  tieneSaldoPendiente,
  calcularPorcentajeAvance
} from '@services/cliente.service';
import {
  FaBox,
  FaSearch,
  FaFilter,
  FaEye,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaBoxOpen,
  FaClipboardList,
  FaCalendarAlt,
  FaDollarSign,
  FaCheckCircle,
  FaExclamationCircle,
  FaClock,
  FaTruck,
  FaHistory
} from 'react-icons/fa';

const MisPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [pedidosFiltrados, setPedidosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para filtros
  const [filtroEstado, setFiltroEstado] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Estados para modal de detalle
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  // Cargar pedidos al montar el componente
  useEffect(() => {
    cargarPedidos();
  }, []);

  // Aplicar filtros cuando cambian
  useEffect(() => {
    aplicarFiltros();
  }, [pedidos, filtroEstado, busqueda]);

  const cargarPedidos = async () => {
    try {
      setLoading(true);
      const response = await getMisPedidos();

      if (response.status === 'Success') {
        setPedidos(response.data || []);
      } else {
        setError(response.message || 'Error al cargar los pedidos');
      }
    } catch (err) {
      console.error('Error al cargar pedidos:', err);
      setError('Error al cargar los pedidos');
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let resultado = [...pedidos];

    // Filtrar por estado
    if (filtroEstado && filtroEstado !== 'todos') {
      resultado = resultado.filter(p => p.estado_operacion === filtroEstado);
    }

    // Filtrar por búsqueda
    if (busqueda.trim()) {
      const textoBusqueda = busqueda.toLowerCase();
      resultado = resultado.filter(p =>
        p.id_operacion.toString().includes(textoBusqueda) ||
        p.descripcion_operacion?.toLowerCase().includes(textoBusqueda) ||
        getEstadoPedidoLabel(p.estado_operacion).toLowerCase().includes(textoBusqueda)
      );
    }

    setPedidosFiltrados(resultado);
  };

  const verDetalle = async (pedido) => {
    try {
      setLoadingDetalle(true);
      setMostrarDetalle(true);

      const response = await getMiPedidoById(pedido.id_operacion);

      if (response.status === 'Success') {
        setPedidoSeleccionado(response.data);
      } else {
        setPedidoSeleccionado(pedido);
      }
    } catch (err) {
      console.error('Error al cargar detalle:', err);
      setPedidoSeleccionado(pedido);
    } finally {
      setLoadingDetalle(false);
    }
  };

  const cerrarDetalle = () => {
    setMostrarDetalle(false);
    setPedidoSeleccionado(null);
  };

  const limpiarFiltros = () => {
    setFiltroEstado('');
    setBusqueda('');
  };

  // Estadísticas rápidas
  const estadisticas = {
    total: pedidos.length,
    enProceso: pedidos.filter(p => p.estado_operacion === 'en_proceso').length,
    completados: pedidos.filter(p => ['completada', 'entregada', 'pagada'].includes(p.estado_operacion)).length,
    pendientes: pedidos.filter(p => p.estado_operacion === 'pendiente').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tus pedidos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-red-50 p-8 rounded-lg">
          <FaExclamationCircle className="text-red-500 text-5xl mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error al cargar pedidos</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={cargarPedidos}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto w-full bg-gray-100 min-h-screen pt-20 ">
      <div className="w-full px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-2">
            <FaBox className="text-blue-500" />
            Mis Pedidos
          </h1>
          <p className="text-gray-600">Gestiona y visualiza todos tus pedidos</p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Total Pedidos</p>
                <p className="text-3xl font-bold text-blue-600">{estadisticas.total}</p>
              </div>
              <FaBoxOpen className="text-blue-500 text-4xl opacity-20" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">En Proceso</p>
                <p className="text-3xl font-bold text-yellow-600">{estadisticas.enProceso}</p>
              </div>
              <FaClipboardList className="text-yellow-500 text-4xl opacity-20" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Completados</p>
                <p className="text-3xl font-bold text-green-600">{estadisticas.completados}</p>
              </div>
              <FaCheckCircle className="text-green-500 text-4xl opacity-20" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Pendientes</p>
                <p className="text-3xl font-bold text-orange-600">{estadisticas.pendientes}</p>
              </div>
              <FaExclamationCircle className="text-orange-500 text-4xl opacity-20" />
            </div>
          </div>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar pedido por descripción..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Botón de filtros */}
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition border border-gray-300"
            >
              <FaFilter />
              Filtros
              {mostrarFiltros ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </div>

          {/* Panel de filtros */}
          {mostrarFiltros && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todos los estados</option>
                    <option value="cotizacion">Cotización</option>
                    <option value="orden_trabajo">Orden de Trabajo</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="en_proceso">En Proceso</option>
                    <option value="terminada">Terminada</option>
                    <option value="completada">Completada</option>
                    <option value="entregada">Entregada</option>
                    <option value="pagada">Pagada</option>
                    <option value="anulada">Anulada</option>
                  </select>
                </div>

                <div className="md:col-span-2 flex items-end">
                  <button
                    onClick={limpiarFiltros}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition"
                  >
                    Limpiar filtros
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Lista de pedidos */}
        {pedidosFiltrados.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FaBoxOpen className="text-gray-300 text-6xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No se encontraron pedidos
            </h3>
            <p className="text-gray-500">
              {pedidos.length === 0
                ? 'Aún no tienes pedidos registrados'
                : 'Intenta ajustar los filtros de búsqueda'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pedidosFiltrados.map((pedido) => (
              <PedidoCard
                key={pedido.id_operacion}
                pedido={pedido}
                onVerDetalle={verDetalle}
              />
            ))}
          </div>
        )}

        {/* Modal de detalle */}
        {mostrarDetalle && (
          <ModalDetallePedido
            pedido={pedidoSeleccionado}
            loading={loadingDetalle}
            onClose={cerrarDetalle}
          />
        )}
      </div>
    </div>
  );
};

// Componente para tarjeta de pedido - FORMATO VERTICAL
const PedidoCard = ({ pedido, onVerDetalle }) => {
  const porcentajeAvance = calcularPorcentajeAvance(pedido.estado_operacion);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow p-6 w-full">
      {/* Header del pedido */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoPedidoColor(pedido.estado_operacion)}`}>
            {getEstadoPedidoLabel(pedido.estado_operacion)}
          </span>
        </div>
        <button
          onClick={() => onVerDetalle(pedido)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
        >
          <FaEye />
          Ver Detalle
        </button>
      </div>

      {/* Descripción */}
      <p className="text-gray-600 text-sm mb-4">
        {pedido.descripcion_operacion || 'Sin descripción'}
      </p>

      {/* Grid de información - AHORA OCUPA TODO EL ANCHO */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-gray-400" />
          <div>
            <p className="text-gray-500 text-xs">Creado</p>
            <p className="font-medium text-gray-700">{formatearFecha(pedido.fecha_creacion)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <FaDollarSign className="text-gray-400" />
          <div>
            <p className="text-gray-500 text-xs">Costo Total</p>
            <p className="font-medium text-gray-700">{formatearMoneda(pedido.costo_operacion)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <FaCheckCircle className="text-gray-400" />
          <div>
            <p className="text-gray-500 text-xs">Abonado</p>
            <p className="font-medium text-green-600">{formatearMoneda(pedido.cantidad_abono)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <FaExclamationCircle className={tieneSaldoPendiente(pedido) ? 'text-orange-400' : 'text-green-400'} />
          <div>
            <p className="text-gray-500 text-xs">Saldo</p>
            <p className={`font-medium ${tieneSaldoPendiente(pedido) ? 'text-orange-600' : 'text-green-600'}`}>
              {formatearMoneda(pedido.saldo_pendiente)}
            </p>
          </div>
        </div>
      </div>

      {/* Barra de progreso - AHORA OCUPA TODO EL ANCHO */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">Progreso del pedido</span>
          <span className="text-xs font-medium text-gray-700">{porcentajeAvance}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${porcentajeAvance}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

// Modal de detalle del pedido
const ModalDetallePedido = ({ pedido, loading, onClose }) => {
  if (!pedido) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-xl mt-20">
          <h2 className="text-2xl font-bold text-gray-800">
            Detalle del Pedido 
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <FaTimes className="text-2xl" />
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando detalles...</p>
          </div>
        ) : (
          <div className="p-6">
            {/* Estado y fechas */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Estado</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getEstadoPedidoColor(pedido.estado_operacion)}`}>
                    {getEstadoPedidoLabel(pedido.estado_operacion)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Fecha de creación</p>
                  <p className="font-medium text-gray-700">{formatearFechaHora(pedido.fecha_creacion)}</p>
                </div>
                {pedido.fecha_entrega_estimada && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Entrega estimada</p>
                    <p className="font-medium text-gray-700">{formatearFecha(pedido.fecha_entrega_estimada)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Descripción */}
            {pedido.descripcion_operacion && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Descripción</h3>
                <p className="text-gray-600">{pedido.descripcion_operacion}</p>
              </div>
            )}

            {/* Productos */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Productos</h3>
              <div className="space-y-3">
                {pedido.productos && pedido.productos.length > 0 ? (
                  pedido.productos.map((prod) => (
                    <div
                      key={prod.id_producto_operacion}
                      className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-1">
                            {prod.producto?.nombre_producto || 'Producto sin nombre'}
                          </h4>
                          {prod.producto?.categoria_producto && (
                            <p className="text-sm text-gray-500 mb-1">
                              Categoría: {prod.producto.categoria_producto}
                            </p>
                          )}
                          {prod.especificaciones && (
                            <p className="text-sm text-gray-600 mt-2">
                              {prod.especificaciones}
                            </p>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-sm text-gray-500">Cantidad: {prod.cantidad}</p>
                          <p className="text-sm text-gray-500">
                            Unitario: {formatearMoneda(prod.precio_unitario)}
                          </p>
                          <p className="font-semibold text-gray-800 mt-1">
                            Total: {formatearMoneda(prod.precio_total)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No hay productos en este pedido</p>
                )}
              </div>
            </div>

            {/* Resumen financiero */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Resumen Financiero</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Costo total:</span>
                  <span className="font-semibold text-gray-800">
                    {formatearMoneda(pedido.costo_operacion)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Abonado:</span>
                  <span className="font-semibold text-green-600">
                    {formatearMoneda(pedido.cantidad_abono)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-blue-200">
                  <span className="font-semibold text-gray-700">Saldo pendiente:</span>
                  <span className={`font-bold text-lg ${tieneSaldoPendiente(pedido) ? 'text-orange-600' : 'text-green-600'}`}>
                    {formatearMoneda(pedido.saldo_pendiente)}
                  </span>
                </div>
              </div>
            </div>

            {/* Historial (si existe) */}
            {pedido.historial && pedido.historial.length > 0 && (
                <div className="mt-6">
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex justify-end rounded-b-xl">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MisPedidos;