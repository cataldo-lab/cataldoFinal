// frontend/src/pages/trabajador-tienda/Operaciones.jsx
import { useState } from 'react';
import { useOperaciones } from '@/hooks/operaciones/useOperaciones';
import { useDeleteOperacion } from '@/hooks/operaciones/useDeleteOperacion';
import { 
  getEstadoLabel, 
  getEstadoColor, 
  calcularSaldoPendiente,
  EstadosOperacion 
} from '@/services/operacion.service';
import { showErrorAlert, showSuccessAlert, deleteDataAlert } from '@/helpers/sweetAlert.js';

// Componentes
import PopupDetalleOperacion from '@/components/trabajadorTienda/PopupDetalleOperacion';
import PopupCrearOperacion from '@/components/trabajadorTienda/PopupCrearOperacion';
import PopupEditarOperacion from '@/components/trabajadorTienda/PopupEditarOperacion';
import PopupCambiarEstado from '@/components/trabajadorTienda/PopupCambiarEstado';

// Icons
import AddIcon from '@/assets/AddIcon.svg';
import UpdateIcon from '@/assets/updateIcon.svg';
import DeleteIcon from '@/assets/deleteIcon.svg';
import SearchIcon from '@/assets/SearchIcon.svg';

export default function Operaciones() {
  const [filtros, setFiltros] = useState({
    estado_operacion: '',
    fecha_desde: '',
    fecha_hasta: ''
  });

  const { operaciones, loading, error, refetch, setFiltros: setFiltrosHook } = useOperaciones(filtros);
  
  const { deleteOp } = useDeleteOperacion({
    onSuccess: () => {
      showSuccessAlert('Éxito', 'Operación anulada correctamente');
      refetch();
    },
    onError: (err) => {
      showErrorAlert('Error', err.message || 'No se pudo anular la operación');
    },
    requireConfirmation: false
  });

  // Estados para popups
  const [showDetallePopup, setShowDetallePopup] = useState(false);
  const [showCrearPopup, setShowCrearPopup] = useState(false);
  const [showEditarPopup, setShowEditarPopup] = useState(false);
  const [showEstadoPopup, setShowEstadoPopup] = useState(false);
  const [operacionSeleccionada, setOperacionSeleccionada] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  // ===== HANDLERS =====

  const handleFiltroChange = (campo, valor) => {
    const nuevosFiltros = { ...filtros, [campo]: valor };
    setFiltros(nuevosFiltros);
    setFiltrosHook(nuevosFiltros);
  };

  const limpiarFiltros = () => {
    const filtrosVacios = {
      estado_operacion: '',
      fecha_desde: '',
      fecha_hasta: ''
    };
    setFiltros(filtrosVacios);
    setFiltrosHook(filtrosVacios);
  };

  const handleVerDetalle = (operacion) => {
    setOperacionSeleccionada(operacion);
    setShowDetallePopup(true);
  };

  const handleEditar = (operacion) => {
    setOperacionSeleccionada(operacion);
    setShowEditarPopup(true);
  };

  const handleCambiarEstado = (operacion) => {
    setOperacionSeleccionada(operacion);
    setShowEstadoPopup(true);
  };

  const handleDelete = async (id) => {
    try {
      const result = await deleteDataAlert();
      if (result.isConfirmed) {
        await deleteOp(id);
        setSelectedItems([]);
      }
    } catch (error) {
      showErrorAlert('Error', 'No se pudo anular la operación');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;
    
    try {
      const result = await deleteDataAlert();
      if (result.isConfirmed) {
        const promises = selectedItems.map(id => deleteOp(id));
        await Promise.all(promises);
        showSuccessAlert('Éxito', `${selectedItems.length} operaciones anuladas correctamente`);
        setSelectedItems([]);
      }
    } catch (error) {
      showErrorAlert('Error', 'No se pudieron anular las operaciones seleccionadas');
    }
  };

  const toggleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedItems(prev => 
      prev.length === operaciones.length 
        ? [] 
        : operaciones.map(op => op.id_operacion)
    );
  };

  // ===== UTILIDADES =====

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(value || 0);
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getEstadoBadge = (estado) => {
    const color = getEstadoColor(estado);
    const colorClasses = {
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      cyan: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      teal: 'bg-teal-100 text-teal-800 border-teal-200',
      emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      red: 'bg-red-100 text-red-800 border-red-200',
      gray: 'bg-gray-100 text-gray-800 border-gray-200'
    };

    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${colorClasses[color] || colorClasses.gray}`}>
        {getEstadoLabel(estado)}
      </span>
    );
  };

  // ===== COMPONENTES =====

  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center h-screen gap-4 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-gray-200 border-t-stone-600 rounded-full animate-spin"></div>
        <span className="absolute inset-0 flex items-center justify-center text-2xl">📋</span>
      </div>
      <p className="text-gray-600 text-lg font-semibold animate-pulse">Cargando operaciones...</p>
    </div>
  );

  const EmptyState = () => (
    <tr>
      <td colSpan="10" className="px-6 py-12 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-5xl">📭</span>
          </div>
          <div>
            <p className="text-gray-700 text-lg font-semibold mb-1">No hay operaciones que mostrar</p>
            <p className="text-gray-500 text-sm">Intenta cambiar los filtros o crear una nueva operación</p>
          </div>
          <button
            onClick={limpiarFiltros}
            className="mt-2 px-4 py-2 bg-stone-600 hover:bg-stone-700 text-white 
            rounded-lg text-sm font-medium transition-colors"
          >
            🔄 Limpiar filtros
          </button>
        </div>
      </td>
    </tr>
  );

  // ===== RENDER =====

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-8">
      <div className="pt-[calc(9vh+1rem)] px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* ===== HEADER ===== */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
              <span className="text-4xl md:text-5xl">📋</span>
              Gestión de Operaciones
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <span>Administra pedidos, cotizaciones y órdenes de trabajo</span>
              <span className="px-2 py-0.5 bg-stone-600 text-white rounded-full text-xs font-semibold">
                {operaciones.length} operaciones
              </span>
            </p>
          </div>
          
          <div className="flex gap-3 flex-wrap">
            {selectedItems.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold 
                px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 
                flex items-center gap-2 transform hover:scale-105"
              >
                <img src={DeleteIcon} alt="Anular" className="w-5 h-5 filter brightness-0 invert" />
                Anular ({selectedItems.length})
              </button>
            )}
            <button
              onClick={() => setShowCrearPopup(true)}
              className="bg-gradient-to-r from-stone-600 to-stone-700 hover:from-stone-700 
              hover:to-stone-800 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 transform hover:scale-105"
            >
              <img src={AddIcon} alt="Agregar" className="w-5 h-5 filter brightness-0 invert" />
              Nueva Operación
            </button>
          </div>
        </div>

        {/* ===== FILTROS ===== */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span>🔍</span> Filtros de búsqueda
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtro de Estado */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 block">
                📊 Estado
              </label>
              <select
                value={filtros.estado_operacion}
                onChange={(e) => handleFiltroChange('estado_operacion', e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg 
                focus:border-stone-500 focus:ring-2 focus:ring-stone-200 focus:outline-none transition-all"
              >
                <option value="">Todos los estados</option>
                {Object.values(EstadosOperacion).map(estado => (
                  <option key={estado} value={estado}>
                    {getEstadoLabel(estado)}
                  </option>
                ))}
              </select>
            </div>

            {/* Fecha Desde */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 block">
                📅 Desde
              </label>
              <input
                type="date"
                value={filtros.fecha_desde}
                onChange={(e) => handleFiltroChange('fecha_desde', e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg 
                focus:border-stone-500 focus:ring-2 focus:ring-stone-200 focus:outline-none transition-all"
              />
            </div>

            {/* Fecha Hasta */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 block">
                📅 Hasta
              </label>
              <input
                type="date"
                value={filtros.fecha_hasta}
                onChange={(e) => handleFiltroChange('fecha_hasta', e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg 
                focus:border-stone-500 focus:ring-2 focus:ring-stone-200 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={limpiarFiltros}
              className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg 
              transition-colors text-sm font-medium flex items-center gap-2"
            >
              <span>🔄</span> Limpiar filtros
            </button>
            <button
              onClick={refetch}
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg 
              transition-colors text-sm font-medium flex items-center gap-2"
            >
              <span>↻</span> Actualizar
            </button>
          </div>
        </div>

        {/* ===== TABLA ===== */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-stone-600 to-stone-700 text-white">
                <tr>
                  <th className="px-4 py-4 text-left">
                    <input 
                      type="checkbox" 
                      checked={selectedItems.length === operaciones.length && operaciones.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 accent-stone-400 cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">ID</th>
                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Cliente</th>
                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Descripción</th>
                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Estado</th>
                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Total</th>
                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Abonado</th>
                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Pendiente</th>
                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Entrega</th>
                  <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {operaciones.length === 0 ? (
                  <EmptyState />
                ) : (
                  operaciones.map((operacion, index) => {
                    const saldoPendiente = calcularSaldoPendiente(operacion);
                    
                    return (
                      <tr 
                        key={operacion.id_operacion} 
                        className={`hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                        }`}
                      >
                        <td className="px-4 py-4">
                          <input 
                            type="checkbox" 
                            checked={selectedItems.includes(operacion.id_operacion)}
                            onChange={() => toggleSelectItem(operacion.id_operacion)}
                            className="w-4 h-4 accent-stone-600 cursor-pointer"
                          />
                        </td>
                        
                        <td className="px-4 py-4">
                          <span className="font-bold text-stone-700">#{operacion.id_operacion}</span>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold text-gray-900">
                              {operacion.cliente?.nombreCompleto || 'Sin cliente'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {operacion.cliente?.email || '-'}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-4 max-w-xs">
                          <p className="text-sm text-gray-900 truncate" title={operacion.descripcion_operacion}>
                            {operacion.descripcion_operacion || '-'}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          {getEstadoBadge(operacion.estado_operacion)}
                        </td>

                        <td className="px-4 py-4">
                          <span className="text-base font-bold text-gray-900">
                            {formatCurrency(operacion.costo_operacion)}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="text-sm font-semibold text-green-700">
                            {formatCurrency(operacion.cantidad_abono)}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className={`text-sm font-bold ${
                            saldoPendiente > 0 ? 'text-orange-600' : 'text-green-600'
                          }`}>
                            {formatCurrency(saldoPendiente)}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="text-sm text-gray-700">
                            {formatDate(operacion.fecha_entrega_estimada)}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleVerDetalle(operacion)}
                              className="p-2.5 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                              title="Ver detalle"
                            >
                              <span className="text-xl group-hover:scale-110 transition-transform inline-block">👁️</span>
                            </button>
                            <button
                              onClick={() => handleCambiarEstado(operacion)}
                              className="p-2.5 hover:bg-purple-50 rounded-lg transition-all duration-200 group"
                              title="Cambiar estado"
                            >
                              <span className="text-xl group-hover:scale-110 transition-transform inline-block">🔄</span>
                            </button>
                            <button
                              onClick={() => handleEditar(operacion)}
                              className="p-2.5 hover:bg-stone-100 rounded-lg transition-all duration-200"
                              title="Editar"
                            >
                              <img src={UpdateIcon} alt="Editar" className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(operacion.id_operacion)}
                              className="p-2.5 hover:bg-red-50 rounded-lg transition-all duration-200"
                              title="Anular"
                              disabled={operacion.estado_operacion === EstadosOperacion.ANULADA}
                            >
                              <img 
                                src={DeleteIcon} 
                                alt="Anular" 
                                className={`w-5 h-5 ${
                                  operacion.estado_operacion === EstadosOperacion.ANULADA 
                                    ? 'opacity-50 cursor-not-allowed' 
                                    : ''
                                }`} 
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ===== FOOTER ===== */}
        <div className="mt-6 flex justify-between items-center flex-wrap gap-4">
          <div className="text-sm text-gray-600 bg-white px-6 py-3 rounded-full 
          shadow-sm border border-gray-100">
            Mostrando <span className="font-bold text-stone-600">{operaciones.length}</span> operaciones
            {selectedItems.length > 0 && (
              <span className="ml-2 text-orange-600">
                • <span className="font-bold">{selectedItems.length}</span> seleccionadas
              </span>
            )}
          </div>
          
          {/* Resumen financiero */}
          <div className="flex gap-4 flex-wrap">
            <div className="bg-green-100 border border-green-300 text-green-800 
            px-4 py-2 rounded-lg text-sm font-medium flex flex-col items-center">
              <span className="text-xs">Total Operaciones</span>
              <span className="font-bold">
                {formatCurrency(operaciones.reduce((sum, op) => sum + (parseFloat(op.costo_operacion) || 0), 0))}
              </span>
            </div>
            <div className="bg-orange-100 border border-orange-300 text-orange-800 
            px-4 py-2 rounded-lg text-sm font-medium flex flex-col items-center">
              <span className="text-xs">Pendiente de Pago</span>
              <span className="font-bold">
                {formatCurrency(operaciones.reduce((sum, op) => sum + calcularSaldoPendiente(op), 0))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== POPUPS ===== */}
      <PopupDetalleOperacion
        show={showDetallePopup}
        setShow={setShowDetallePopup}
        operacion={operacionSeleccionada}
        onRefresh={refetch}
      />

      <PopupCrearOperacion
        show={showCrearPopup}
        setShow={setShowCrearPopup}
        onSuccess={refetch}
      />

      <PopupEditarOperacion
        show={showEditarPopup}
        setShow={setShowEditarPopup}
        operacion={operacionSeleccionada}
        onSuccess={refetch}
      />

      <PopupCambiarEstado
        show={showEstadoPopup}
        setShow={setShowEstadoPopup}
        operacion={operacionSeleccionada}
        onSuccess={refetch}
      />
    </div>
  );
}