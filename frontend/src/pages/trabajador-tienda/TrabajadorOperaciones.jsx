// frontend/src/pages/trabajador-tienda/TrabajadorOperaciones.jsx
import { useState, useEffect } from 'react';
import Table from '@components/Table';
import Search from '@components/Search';
import PopupCreateOperacion from '@components/popup/trabajadorTienda/PopupCreateOperacion';
import PopupUpdateOperacion from '@components/popup/trabajadorTienda/PopupUpdateOperacion';
import AddIcon from '@assets/AddIcon.svg';
import UpdateIcon from '@assets/updateIcon.svg';
import DeleteIcon from '@assets/deleteIcon.svg';
import { 
  getOperations, 
  createOperation,
  updateOperacion,
  updateEstadoOperacion,
  deleteOperacion,
  getProducts,
  getClients
} from '@services/operacion.service';
import { showSuccessAlert, showErrorAlert, deleteDataAlert } from '@helpers/sweetAlert.js';

const TrabajadorOperations = () => {
  const [operations, setOperations] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [filter, setFilter] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('');
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    await Promise.all([
      loadOperations(),
      loadClientes(),
      loadProductos()
    ]);
  };

  const loadOperations = async () => {
    setLoading(true);
    try {
      console.log('📦 Cargando operaciones...');
      const response = await getOperations();
      
      if (response.status === 'Success') {
        // ✅ Formatear según estructura del backend
        const formattedOps = (response.data || []).map(op => ({
          id_operacion: op.id_operacion,
          cliente: op.cliente?.nombreCompleto || 'Sin cliente',
          descripcion: op.descripcion_operacion || 'Sin descripción',
          estado: op.estado_operacion,
          costo: parseFloat(op.costo_operacion || 0),
          fecha_entrega: op.fecha_entrega_estimada 
            ? new Date(op.fecha_entrega_estimada).toLocaleDateString('es-CL')
            : 'Sin fecha',
          // Guardar datos completos para edición
          _raw: op
        }));
        
        console.log('✅ Operaciones formateadas:', formattedOps.length);
        setOperations(formattedOps);
      } else {
        showErrorAlert('Error', 'No se pudieron cargar las operaciones');
      }
    } catch (error) {
      console.error('❌ Error al cargar operaciones:', error);
      showErrorAlert('Error', 'Error al cargar operaciones');
    } finally {
      setLoading(false);
    }
  };

  const loadClientes = async () => {
    try {
      console.log('👥 Cargando clientes...');
      const response = await getClients();
      
      if (response.status === 'Success') {
        // ✅ Formatear clientes para el select
        const clientesFormateados = (response.data || []).map(cliente => ({
          id_cliente: cliente.id,
          nombre_completo: cliente.nombreCompleto,
          email: cliente.email,
          telefono: cliente.telefono
        }));
        
        console.log('✅ Clientes cargados:', clientesFormateados.length);
        setClientes(clientesFormateados);
      }
    } catch (error) {
      console.error('❌ Error al cargar clientes:', error);
      // No mostramos alerta para no bloquear la UI
    }
  };

  const loadProductos = async () => {
    try {
      console.log('📦 Cargando productos...');
      const response = await getProducts();
      
      if (response.status === 'Success') {
        // ✅ Filtrar solo productos activos
        const productosActivos = (response.data || []).filter(p => p.activo);
        
        console.log('✅ Productos cargados:', productosActivos.length);
        setProductos(productosActivos);
      }
    } catch (error) {
      console.error('❌ Error al cargar productos:', error);
      // No mostramos alerta para no bloquear la UI
    }
  };

  const handleCreateOperation = async (operationData) => {
    try {
      console.log('📤 Creando operación:', operationData);
      const response = await createOperation(operationData);
      
      if (response.status === 'Success') {
        showSuccessAlert('Éxito', 'Operación creada correctamente');
        await loadOperations();
        return true;
      } else {
        showErrorAlert('Error', response.message || 'Error al crear operación');
        return false;
      }
    } catch (error) {
      console.error('❌ Error al crear operación:', error);
      showErrorAlert('Error', 'Error al crear operación');
      return false;
    }
  };

  const handleUpdateOperation = async (id, operationData) => {
    try {
      console.log('📤 Actualizando operación:', id, operationData);
      const response = await updateOperacion(id, operationData);
      
      if (response.status === 'Success') {
        showSuccessAlert('Éxito', 'Operación actualizada correctamente');
        await loadOperations();
        return true;
      } else {
        showErrorAlert('Error', response.message || 'Error al actualizar');
        return false;
      }
    } catch (error) {
      console.error('❌ Error al actualizar operación:', error);
      showErrorAlert('Error', 'Error al actualizar operación');
      return false;
    }
  };

  const handleDeleteOperation = async (id) => {
    try {
      const result = await deleteDataAlert();
      if (result.isConfirmed) {
        const response = await deleteOperacion(id);
        
        if (response.status === 'Success') {
          showSuccessAlert('Éxito', 'Operación anulada correctamente');
          await loadOperations();
          return true;
        } else {
          showErrorAlert('Error', response.message || 'Error al anular');
          return false;
        }
      }
      return false;
    } catch (error) {
      console.error('❌ Error al anular operación:', error);
      showErrorAlert('Error', 'Error al anular operación');
      return false;
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const response = await updateEstadoOperacion(id, newStatus);
      
      if (response.status === 'Success') {
        showSuccessAlert('Éxito', `Estado actualizado a: ${getEstadoLabel(newStatus)}`);
        await loadOperations();
        return true;
      } else {
        showErrorAlert('Error', response.message || 'Error al actualizar estado');
        return false;
      }
    } catch (error) {
      console.error('❌ Error al actualizar estado:', error);
      showErrorAlert('Error', 'Error al actualizar estado');
      return false;
    }
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('es-CL', { 
      style: 'currency', 
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getEstadoLabel = (estado) => {
    const labels = {
      'cotizacion': 'Cotización',
      'orden_trabajo': 'Orden de Trabajo',
      'pendiente': 'Pendiente',
      'en_proceso': 'En Proceso',
      'terminada': 'Terminada',
      'completada': 'Completada',
      'entregada': 'Entregada',
      'pagada': 'Pagada',
      'anulada': 'Anulada'
    };
    return labels[estado] || estado;
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'cotizacion': 'bg-blue-100 text-blue-800',
      'orden_trabajo': 'bg-cyan-100 text-cyan-800',
      'pendiente': 'bg-orange-100 text-orange-800',
      'en_proceso': 'bg-yellow-100 text-yellow-800',
      'terminada': 'bg-purple-100 text-purple-800',
      'completada': 'bg-green-100 text-green-800',
      'entregada': 'bg-teal-100 text-teal-800',
      'pagada': 'bg-emerald-100 text-emerald-800',
      'anulada': 'bg-red-100 text-red-800'
    };
    
    const statusLabels = {
      'cotizacion': 'Cotización',
      'orden_trabajo': 'Orden de Trabajo',
      'pendiente': 'Pendiente',
      'en_proceso': 'En Proceso',
      'terminada': 'Terminada',
      'completada': 'Completada',
      'entregada': 'Entregada',
      'pagada': 'Pagada',
      'anulada': 'Anulada'
    };
    
    return `<span class="px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}">${statusLabels[status] || status}</span>`;
  };

  const columns = [
    { 
      title: "ID", 
      field: "id_operacion", 
      width: 80,
      headerSort: true 
    },
    { 
      title: "Cliente", 
      field: "cliente", 
      width: 200,
      headerSort: true 
    },
    { 
      title: "Descripción", 
      field: "descripcion", 
      width: 250,
      headerSort: false 
    },
    { 
      title: "Estado", 
      field: "estado", 
      width: 140,
      formatter: (cell) => getStatusBadge(cell.getValue()),
      headerSort: true
    },
    { 
      title: "Costo", 
      field: "costo", 
      width: 120,
      formatter: (cell) => formatMoney(cell.getValue()),
      headerSort: true
    },
    { 
      title: "Entrega", 
      field: "fecha_entrega", 
      width: 120,
      headerSort: true
    },
    {
      title: "Acciones",
      width: 150,
      headerSort: false,
      formatter: (cell) => {
        const rowData = cell.getRow().getData();
        const id = rowData.id_operacion;
        return `
          <div class="flex gap-2 justify-center">
            <button class="edit-btn p-2 hover:bg-stone-100 rounded-lg transition-colors" 
                    data-id="${id}" 
                    title="Editar">
              <img src="${UpdateIcon}" alt="Editar" class="w-5 h-5" />
            </button>
            <button class="status-btn p-2 hover:bg-blue-100 rounded-lg transition-colors" 
                    data-id="${id}" 
                    title="Cambiar estado">
              🔄
            </button>
            <button class="delete-btn p-2 hover:bg-red-100 rounded-lg transition-colors" 
                    data-id="${id}" 
                    title="Anular">
              <img src="${DeleteIcon}" alt="Anular" class="w-5 h-5" />
            </button>
          </div>
        `;
      },
      cellClick: (e, cell) => {
        const button = e.target.closest('button');
        if (!button) return;

        const id = parseInt(button.dataset.id);
        const rowData = cell.getRow().getData();
        const operation = rowData._raw;

        if (button.classList.contains('edit-btn')) {
          setSelectedOperation(operation);
          setShowUpdatePopup(true);
        } 
        else if (button.classList.contains('status-btn')) {
          // ✅ Ciclo de estados según el backend
          const statuses = [
            'cotizacion', 'orden_trabajo', 'pendiente', 
            'en_proceso', 'terminada', 'completada', 
            'entregada', 'pagada'
          ];
          const currentIndex = statuses.indexOf(operation.estado_operacion);
          const nextStatus = statuses[(currentIndex + 1) % statuses.length];
          
          handleUpdateStatus(id, nextStatus);
        }
        else if (button.classList.contains('delete-btn')) {
          handleDeleteOperation(id);
        }
      }
    }
  ];

  // ✅ Filtrado inteligente
  const operacionesFiltradas = operations.filter(op => {
    const matchEstado = !estadoFilter || op.estado === estadoFilter;
    const matchBusqueda = !filter || 
      op.cliente.toLowerCase().includes(filter.toLowerCase()) ||
      op.descripcion.toLowerCase().includes(filter.toLowerCase()) ||
      op.id_operacion.toString().includes(filter);
    
    return matchEstado && matchBusqueda;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-gray-200 border-t-stone-600 rounded-full animate-spin"></div>
          <span className="absolute inset-0 flex items-center justify-center text-3xl">📋</span>
        </div>
        <p className="text-gray-600 text-lg font-semibold animate-pulse">Cargando operaciones...</p>
        <p className="text-gray-500 text-sm">Obteniendo datos actualizados</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-8">
      <div className="pt-[calc(9vh+1rem)] px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
              <span className="text-4xl md:text-5xl">📋</span>
              Gestión de Operaciones
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <span>Administra pedidos y operaciones de venta</span>
              <span className="px-2 py-0.5 bg-stone-600 text-white rounded-full text-xs font-semibold">
                {operacionesFiltradas.length} de {operations.length}
              </span>
            </p>
          </div>
          
          <button
            onClick={() => setShowCreatePopup(true)}
            className="bg-gradient-to-r from-stone-600 to-stone-700 hover:from-stone-700 
            hover:to-stone-800 text-white font-semibold px-6 py-3 rounded-xl shadow-lg 
            hover:shadow-xl transition-all duration-300 flex items-center gap-2 
            transform hover:scale-105"
          >
            <img src={AddIcon} alt="Agregar" className="w-5 h-5 filter brightness-0 invert" />
            Nueva Operación
          </button>
        </div>
        
        {/* Filtros */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span>🔍</span> Filtros de búsqueda
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 block">
                🔎 Búsqueda general
              </label>
              <Search 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)} 
                placeholder="Buscar por ID, cliente o descripción..."
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 block">
                📊 Filtrar por estado
              </label>
              <select 
                value={estadoFilter}
                onChange={(e) => setEstadoFilter(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg 
                focus:border-stone-500 focus:ring-2 focus:ring-stone-200 
                focus:outline-none transition-all"
              >
                <option value="">Todos los estados</option>
                <option value="cotizacion">💭 Cotización</option>
                <option value="orden_trabajo">📝 Orden de Trabajo</option>
                <option value="pendiente">⏳ Pendiente</option>
                <option value="en_proceso">⚙️ En Proceso</option>
                <option value="terminada">✅ Terminada</option>
                <option value="completada">🎉 Completada</option>
                <option value="entregada">🚚 Entregada</option>
                <option value="pagada">💰 Pagada</option>
                <option value="anulada">❌ Anulada</option>
              </select>
            </div>
          </div>

          {(filter || estadoFilter) && (
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  setFilter('');
                  setEstadoFilter('');
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg 
                transition-colors text-sm font-medium flex items-center gap-2"
              >
                <span>🔄</span> Limpiar filtros
              </button>
            </div>
          )}
        </div>
        
        {/* Tabla */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          {operacionesFiltradas.length === 0 ? (
            <div className="py-12 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-5xl">📭</span>
                </div>
                <div>
                  <p className="text-gray-700 text-lg font-semibold mb-1">
                    No hay operaciones que mostrar
                  </p>
                  <p className="text-gray-500 text-sm">
                    {filter || estadoFilter 
                      ? 'Intenta cambiar los filtros de búsqueda' 
                      : 'Crea una nueva operación para comenzar'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <Table 
              data={operacionesFiltradas}
              columns={columns}
              filter=""
              dataToFilter="descripcion"
              initialSortName="id_operacion"
              onSelectionChange={(selected) => {
                if (selected.length > 0) {
                  setSelectedOperation(selected[0]._raw);
                }
              }}
            />
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 bg-white inline-block px-6 py-3 rounded-full shadow-sm">
            Mostrando <span className="font-bold text-stone-600">{operacionesFiltradas.length}</span> de <span className="font-bold text-stone-600">{operations.length}</span> operaciones
          </p>
        </div>
      </div>
      
      {/* Popups */}
      <PopupCreateOperacion 
        show={showCreatePopup}
        setShow={setShowCreatePopup}
        clientes={clientes}
        productos={productos}
        onSubmit={handleCreateOperation}
      />
      
      <PopupUpdateOperacion 
        show={showUpdatePopup}
        setShow={setShowUpdatePopup}
        operacion={selectedOperation}
        clientes={clientes}
        productos={productos}
        onSubmit={handleUpdateOperation}
      />
    </div>
  );
};

export default TrabajadorOperations;