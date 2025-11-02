// src/pages/trabajador-tienda/Proveedores.jsx

import { useState } from 'react';
import { useProveedoresConRepresentantes } from '@hooks/prooveedores/useProveedoresConRepresentantes.jsx';
import { useCreateProveedorConRepresentante } from '@hooks/prooveedores/useCreateProveedorConRepresentante.jsx';
import { useUpdateProveedor } from '@hooks/prooveedores/useUpdateProveedor.jsx';
import { useDeleteProveedor } from '@hooks/prooveedores/useDeleteProveedor.jsx';
import { useRepresentantes } from '@hooks/prooveedores/useRepresentantes.jsx';
import PopupCreateProveedorConRepresentante from '@components/popup/trabajadorTienda/proveedor/PopupCreateProveedorConRepresentante.jsx';
import PopupUpdateProveedor from '@components/popup/trabajadorTienda/proveedor/PopupUpdateProveedor.jsx';
import PopupCreateRepresentante from '@components/popup/trabajadorTienda/proveedor/PopupCreateRepresentante.jsx';
import PopupUpdateRepresentante from '@components/popup/trabajadorTienda/proveedor/PopupUpdateRepresentante.jsx';
import PopupViewProveedorDetails from '@components/popup/trabajadorTienda/proveedor/PopupViewProveedorDetails.jsx';
import { showSuccessAlert, showErrorAlert, deleteDataAlert } from '@helpers/sweetAlert.js';
import { FaHandshake } from "react-icons/fa";



// Íconos
import AddIcon from '@assets/AddIcon.svg';
import UpdateIcon from '@assets/updateIcon.svg';
import DeleteIcon from '@assets/deleteIcon.svg';
import SearchIcon from '@assets/SearchIcon.svg';

export default function Proveedores() {
  // =================== HOOKS PRINCIPALES ===================
  const { 
    proveedores, 
    loading: loadingProveedores, 
    error: errorProveedores, 
    fetchProveedores 
  } = useProveedoresConRepresentantes(true);

  const { 
    handleCreateProveedorConRepresentante, 
    loading: loadingCreate,
    isOpen: showCreateModal, 
    openModal, 
    closeModal 
  } = useCreateProveedorConRepresentante();

  const { 
    updateProveedor: handleUpdateProveedor, 
    loading: loadingUpdate 
  } = useUpdateProveedor();

  const { 
    deleteProveedor: handleDeleteProveedor, 
    loading: loadingDelete 
  } = useDeleteProveedor();

  const { 
    createRepresentante: handleCreateRepresentante,
    updateRepresentante: handleUpdateRepresentante,
    deleteRepresentante: handleDeleteRepresentante,
    loading: loadingRepresentantes
  } = useRepresentantes();

  // =================== ESTADOS LOCALES ===================
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRol, setFilterRol] = useState('');
  const [filterTieneRepresentante, setFilterTieneRepresentante] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [sortField, setSortField] = useState('rol_proveedor');
  const [sortOrder, setSortOrder] = useState('asc');

  // Estados de modales
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showCreateRepresentanteModal, setShowCreateRepresentanteModal] = useState(false);
  const [showUpdateRepresentanteModal, setShowUpdateRepresentanteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Estados de datos seleccionados
  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [selectedRepresentante, setSelectedRepresentante] = useState(null);

  // =================== FILTROS Y ORDENAMIENTO ===================
  
  // Filtrar proveedores
  const filteredProveedores = proveedores.filter(proveedor => {
    // Filtro por búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        proveedor.rol_proveedor?.toLowerCase().includes(term) ||
        proveedor.rut_proveedor?.toLowerCase().includes(term) ||
        proveedor.correo_proveedor?.toLowerCase().includes(term) ||
        proveedor.fono_proveedor?.toLowerCase().includes(term) ||
        proveedor.representante?.nombre_completo?.toLowerCase().includes(term) ||
        proveedor.representante?.cargo_representante?.toLowerCase().includes(term);
      
      if (!matchesSearch) return false;
    }

    // Filtro por rol
    if (filterRol) {
      if (!proveedor.rol_proveedor?.toLowerCase().includes(filterRol.toLowerCase())) {
        return false;
      }
    }

    // Filtro por representante
    if (filterTieneRepresentante === 'con') {
      if (!proveedor.representante) return false;
    } else if (filterTieneRepresentante === 'sin') {
      if (proveedor.representante) return false;
    }

    return true;
  });

  // Ordenar proveedores
  const sortedProveedores = [...filteredProveedores].sort((a, b) => {
    let aValue = a[sortField] || '';
    let bValue = b[sortField] || '';
    
    // Casos especiales para campos anidados
    if (sortField === 'representante_nombre') {
      aValue = a.representante?.nombre_completo || '';
      bValue = b.representante?.nombre_completo || '';
    }
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Obtener roles únicos para el filtro
  const rolesUnicos = [...new Set(proveedores.map(p => p.rol_proveedor))].filter(Boolean);

  // =================== FUNCIONES DE MANEJO ===================

  // Función para ordenar
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Icono de ordenamiento
  const getSortIcon = (field) => {
    if (sortField !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  // Manejar creación de proveedor
  const handleCreateSuccess = async (data) => {
    const [result, error] = await handleCreateProveedorConRepresentante(data);
    
    if (result) {
      showSuccessAlert('¡Proveedor creado!', 'El proveedor se ha registrado exitosamente');
      closeModal();
      await fetchProveedores();
      return [result, null];
    } else {
      showErrorAlert('Error', error || 'No se pudo crear el proveedor');
      return [null, error];
    }
  };

  // Manejar edición de proveedor
  const handleEditProveedor = (proveedor) => {
    setSelectedProveedor(proveedor);
    setShowUpdateModal(true);
  };

  const handleUpdateSuccess = async (id, data) => {
    const result = await handleUpdateProveedor(id, data);
    
    if (result) {
      setShowUpdateModal(false);
      setSelectedProveedor(null);
      await fetchProveedores();
      return [result, null];
    } else {
      return [null, 'Error al actualizar proveedor'];
    }
  };

  // Manejar representantes
  const handleAddRepresentante = (proveedor) => {
    setSelectedProveedor(proveedor);
    setShowCreateRepresentanteModal(true);
  };

  const handleEditRepresentante = (representante, proveedor) => {
    setSelectedRepresentante(representante);
    setSelectedProveedor(proveedor);
    setShowUpdateRepresentanteModal(true);
  };

  const handleCreateRepresentanteSuccess = async (id_proveedor, data) => {
    const result = await handleCreateRepresentante(id_proveedor, data);
    
    if (result) {
      setShowCreateRepresentanteModal(false);
      setSelectedProveedor(null);
      await fetchProveedores();
      return [result, null];
    } else {
      return [null, 'Error al crear representante'];
    }
  };

  const handleUpdateRepresentanteSuccess = async (id_representante, data) => {
    const result = await handleUpdateRepresentante(id_representante, data);
    
    if (result) {
      setShowUpdateRepresentanteModal(false);
      setSelectedRepresentante(null);
      setSelectedProveedor(null);
      await fetchProveedores();
      return [result, null];
    } else {
      return [null, 'Error al actualizar representante'];
    }
  };

  const handleDeleteRepresentanteAction = async (id_representante) => {
    const success = await handleDeleteRepresentante(id_representante);
    
    if (success) {
      await fetchProveedores();
      if (showDetailsModal) {
        // Actualizar el modal de detalles si está abierto
        const updatedProveedor = sortedProveedores.find(p => p.id_proveedor === selectedProveedor?.id_proveedor);
        setSelectedProveedor(updatedProveedor);
      }
    }
  };

  // Ver detalles del proveedor
  const handleViewDetails = (proveedor) => {
    setSelectedProveedor(proveedor);
    setShowDetailsModal(true);
  };

  // Manejar eliminación de proveedor
  const handleDelete = async (id) => {
    try {
      const result = await deleteDataAlert();
      if (result.isConfirmed) {
        const success = await handleDeleteProveedor(id);
        if (success) {
          await fetchProveedores();
          setSelectedItems(prev => prev.filter(item => item !== id));
        }
      }
    } catch (error) {
      showErrorAlert('Error', 'No se pudo eliminar el proveedor');
    }
  };

  // Manejar eliminación múltiple
  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;
    
    try {
      const result = await deleteDataAlert();
      if (result.isConfirmed) {
        const promises = selectedItems.map(id => handleDeleteProveedor(id, false));
        const results = await Promise.all(promises);
        const successCount = results.filter(Boolean).length;
        
        if (successCount > 0) {
          showSuccessAlert('Éxito', `${successCount} proveedores eliminados correctamente`);
          await fetchProveedores();
          setSelectedItems([]);
        }
      }
    } catch (error) {
      showErrorAlert('Error', 'No se pudieron eliminar los proveedores seleccionados');
    }
  };

  // Toggle selección individual
  const toggleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  // Toggle selección total
  const toggleSelectAll = () => {
    if (selectedItems.length === sortedProveedores.length && sortedProveedores.length > 0) {
      setSelectedItems([]);
    } else {
      setSelectedItems(sortedProveedores.map(p => p.id_proveedor));
    }
  };

  // Limpiar filtros
  const limpiarFiltros = () => {
    setSearchTerm('');
    setFilterRol('');
    setFilterTieneRepresentante('');
    setSortField('rol_proveedor');
    setSortOrder('asc');
  };

  // =================== ESTADOS DE CARGA ===================
  
  if (loadingProveedores) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-stone-600 rounded-full animate-spin"></div>
        <p className="text-gray-600 text-lg font-medium">Cargando proveedores...</p>
      </div>
    );
  }

  if (errorProveedores) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="text-6xl">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-800">Error al cargar proveedores</h2>
        <p className="text-gray-600">{errorProveedores}</p>
        <button
          onClick={fetchProveedores}
          className="bg-stone-600 hover:bg-stone-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          🔄 Reintentar
        </button>
      </div>
    );
  }

  // =================== RENDER PRINCIPAL ===================
  
  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Content container with proper margin to avoid navbar overlap */}
      <div className="pt-[calc(9vh+1rem)] px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <FaHandshake className="text-stone-600" />
            Gestión de Proveedores
          </h1>
            <p className="text-gray-600">
              Administra los proveedores y sus representantes - Total: {proveedores.length} | Mostrando: {sortedProveedores.length}
            </p>
            {selectedItems.length > 0 && (
              <p className="text-stone-600 font-medium mt-1">
                📝 {selectedItems.length} elemento{selectedItems.length > 1 ? 's' : ''} seleccionado{selectedItems.length > 1 ? 's' : ''}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            {selectedItems.length > 0 && (
              <button
                onClick={handleBulkDelete}
                disabled={loadingDelete}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold px-4 py-3 rounded-xl shadow-md transition-all duration-300 flex items-center gap-2"
              >
                <img src={DeleteIcon} alt="Eliminar" className="w-5 h-5 filter brightness-0 invert" />
                Eliminar ({selectedItems.length})
              </button>
            )}
            <button
              onClick={openModal}
              disabled={loadingCreate}
              className="bg-gradient-to-r from-stone-600 to-stone-700 hover:from-stone-700 hover:to-stone-800 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all duration-300 flex items-center gap-2"
            >
              <img src={AddIcon} alt="Agregar" className="w-5 h-5 filter brightness-0 invert" />
              {loadingCreate ? 'Creando...' : 'Nuevo Proveedor'}
            </button>
          </div>
        </div>

        {/* Filtros y Búsqueda */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                🔍 Buscar:
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por nombre, RUT, correo, representante..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2.5 pl-10 border-2 border-gray-200 rounded-lg focus:border-stone-500 focus:outline-none transition-colors"
                />
                <img 
                  src={SearchIcon} 
                  alt="Buscar" 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                📊 Tipo de Proveedor:
              </label>
              <select
                value={filterRol}
                onChange={(e) => setFilterRol(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-stone-500 focus:outline-none transition-colors"
              >
                <option value="">Todos los tipos</option>
                {rolesUnicos.map((rol, i) => (
                  <option key={i} value={rol}>{rol}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                👤 Representante:
              </label>
              <select
                value={filterTieneRepresentante}
                onChange={(e) => setFilterTieneRepresentante(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-stone-500 focus:outline-none transition-colors"
              >
                <option value="">Todos</option>
                <option value="con">✓ Con representante</option>
                <option value="sin">✗ Sin representante</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={limpiarFiltros}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white px-5 py-2.5 rounded-lg transition-colors text-sm font-medium"
              >
                🔄 Limpiar filtros
              </button>
            </div>
          </div>
          
          {/* Información de filtros activos */}
          {(searchTerm || filterRol || filterTieneRepresentante) && (
            <div className="mt-4 p-3 bg-stone-50 rounded-lg border-l-4 border-stone-500">
              <p className="text-sm text-stone-700">
                <strong>Filtros activos:</strong>
                {searchTerm && ` Búsqueda: "${searchTerm}"`}
                {filterRol && ` | Tipo: "${filterRol}"`}
                {filterTieneRepresentante && ` | Representante: ${filterTieneRepresentante === 'con' ? 'Con representante' : 'Sin representante'}`}
              </p>
            </div>
          )}
        </div>

        {/* Tabla de proveedores */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-600 text-white">
                <tr>
                  <th className="px-3 py-4 text-left">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={selectedItems.length === sortedProveedores.length && sortedProveedores.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 accent-stone-400 cursor-pointer"
                      />
                    </div>
                  </th>
                  <th 
                    className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-stone-700 transition-colors"
                    onClick={() => handleSort('rol_proveedor')}
                  >
                    <div className="flex items-center gap-1">
                      Proveedor {getSortIcon('rol_proveedor')}
                    </div>
                  </th>
                  <th 
                    className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-stone-700 transition-colors"
                    onClick={() => handleSort('rut_proveedor')}
                  >
                    <div className="flex items-center gap-1">
                      RUT {getSortIcon('rut_proveedor')}
                    </div>
                  </th>
                  <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Contacto
                  </th>
                  <th 
                    className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-stone-700 transition-colors"
                    onClick={() => handleSort('representante_nombre')}
                  >
                    <div className="flex items-center gap-1">
                      Representante {getSortIcon('representante_nombre')}
                    </div>
                  </th>
                  <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedProveedores.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-4xl">📭</span>
                        <p className="text-lg">No hay proveedores que mostrar</p>
                        <p className="text-sm">
                          {proveedores.length === 0 
                            ? 'Crea tu primer proveedor haciendo clic en "Nuevo Proveedor"' 
                            : 'Intenta cambiar los filtros para encontrar lo que buscas'
                          }
                        </p>
                        {proveedores.length === 0 && (
                          <button
                            onClick={openModal}
                            className="mt-3 bg-stone-600 hover:bg-stone-700 text-white px-6 py-2 rounded-lg transition-colors"
                          >
                            ➕ Crear Primer Proveedor
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedProveedores.map((proveedor) => (
                    <tr key={proveedor.id_proveedor} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-4 whitespace-nowrap">
                        <input 
                          type="checkbox" 
                          checked={selectedItems.includes(proveedor.id_proveedor)}
                          onChange={() => toggleSelectItem(proveedor.id_proveedor)}
                          className="w-4 h-4 accent-stone-400 cursor-pointer"
                        />
                      </td>
                      
                      <td className="px-3 py-4">
                        <div className="flex flex-col">
                          <button
                            onClick={() => handleViewDetails(proveedor)}
                            className="font-semibold text-gray-900 hover:text-stone-600 text-left transition-colors cursor-pointer"
                          >
                            {proveedor.rol_proveedor}
                          </button>
                          <span className="text-sm text-gray-500">ID: {proveedor.id_proveedor}</span>
                        </div>
                      </td>

                      <td className="px-3 py-4 whitespace-nowrap">
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                          {proveedor.rut_proveedor}
                        </span>
                      </td>

                      <td className="px-3 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1 text-sm">
                            📧 <a href={`mailto:${proveedor.correo_proveedor}`} className="text-blue-600 hover:text-blue-800 transition-colors">{proveedor.correo_proveedor}</a>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            📞 <a href={`tel:${proveedor.fono_proveedor}`} className="text-green-600 hover:text-green-800 transition-colors">{proveedor.fono_proveedor}</a>
                          </div>
                        </div>
                      </td>

                      <td className="px-3 py-4">
                        {proveedor.representante ? (
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">
                              👤 {proveedor.representante.nombre_completo}
                            </span>
                            <span className="text-sm text-gray-500">
                              {proveedor.representante.cargo_representante}
                            </span>
                            <span className="text-xs text-blue-600">
                              {proveedor.representante.correo_representante}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                              ⚠️ Sin representante
                            </span>
                            <button
                              onClick={() => handleAddRepresentante(proveedor)}
                              className="text-green-600 hover:text-green-800 transition-colors text-xs"
                              title="Agregar representante"
                            >
                              ➕ Agregar
                            </button>
                          </div>
                        )}
                      </td>

                      <td className="px-3 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          ✓ Activo
                        </span>
                      </td>

                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleViewDetails(proveedor)}
                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ver detalles"
                          >
                            👁️
                          </button>
                          <button
                            onClick={() => handleEditProveedor(proveedor)}
                            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                            title="Editar proveedor"
                          >
                            <img src={UpdateIcon} alt="Editar" className="w-5 h-5" />
                          </button>
                          {!proveedor.representante && (
                            <button
                              onClick={() => handleAddRepresentante(proveedor)}
                              className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                              title="Agregar representante"
                            >
                              👤➕
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(proveedor.id_proveedor)}
                            disabled={loadingDelete}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Eliminar proveedor"
                          >
                            <img src={DeleteIcon} alt="Eliminar" className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer con estadísticas */}
        <div className="mt-4 text-center">
          <div className="bg-white inline-block px-6 py-3 rounded-full shadow-sm">
            <p className="text-sm text-gray-600">
              Mostrando <span className="font-bold text-stone-600">{sortedProveedores.length}</span> de{' '}
              <span className="font-bold text-stone-600">{proveedores.length}</span> proveedores
            </p>
            {proveedores.length > 0 && (
              <div className="mt-2 flex gap-4 text-xs text-gray-500 justify-center">
                <span>👥 {proveedores.filter(p => p.representante).length} con representante</span>
                <span>⚠️ {proveedores.filter(p => !p.representante).length} sin representante</span>
                <span>📊 {rolesUnicos.length} tipos diferentes</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =================== MODALES =================== */}
      
      {/* Modal de creación de proveedor */}
      <PopupCreateProveedorConRepresentante
        show={showCreateModal}
        setShow={closeModal}
        onSubmit={handleCreateSuccess}
      />

      {/* Modal de edición de proveedor */}
      <PopupUpdateProveedor
        show={showUpdateModal}
        setShow={setShowUpdateModal}
        proveedor={selectedProveedor}
        onSubmit={handleUpdateSuccess}
      />

      {/* Modal de creación de representante */}
      <PopupCreateRepresentante
        show={showCreateRepresentanteModal}
        setShow={setShowCreateRepresentanteModal}
        proveedor={selectedProveedor}
        onSubmit={handleCreateRepresentanteSuccess}
      />

      {/* Modal de edición de representante */}
      <PopupUpdateRepresentante
        show={showUpdateRepresentanteModal}
        setShow={setShowUpdateRepresentanteModal}
        representante={selectedRepresentante}
        proveedor={selectedProveedor}
        onSubmit={handleUpdateRepresentanteSuccess}
      />

      {/* Modal de detalles del proveedor */}
      <PopupViewProveedorDetails
        show={showDetailsModal}
        setShow={setShowDetailsModal}
        proveedor={selectedProveedor}
        onEditProveedor={handleEditProveedor}
        onAddRepresentante={handleAddRepresentante}
        onEditRepresentante={handleEditRepresentante}
        onDeleteRepresentante={handleDeleteRepresentanteAction}
      />
    </div>
  );
}