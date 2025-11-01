// src/pages/trabajador-tienda/Proveedores.jsx

import { useState, useEffect } from 'react';
import { useProveedoresConRepresentantes } from '@hooks/prooveedores/useProveedoresConRepresentantes.jsx';
import { useCreateProveedorConRepresentante } from '@hooks/prooveedores/useCreateProveedorConRepresentante.jsx';
import { useDeleteProveedor } from '@hooks/prooveedores/useDeleteProveedor.jsx';
import PopupCreateProveedorConRepresentante from '@components/popup/trabajadorTienda/proveedor/PopupCreateProveedorConRepresentante.jsx';
import { showSuccessAlert, showErrorAlert, deleteDataAlert } from '@helpers/sweetAlert.js';

// Íconos
import AddIcon from '@assets/AddIcon.svg';
import UpdateIcon from '@assets/updateIcon.svg';
import DeleteIcon from '@assets/deleteIcon.svg';
import SearchIcon from '@assets/SearchIcon.svg';

export default function Proveedores() {
  // Hooks principales
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
    deleteProveedor: handleDeleteProveedor, 
    loading: loadingDelete 
  } = useDeleteProveedor();

  // Estados locales
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRol, setFilterRol] = useState('');
  const [filterTieneRepresentante, setFilterTieneRepresentante] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

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

  // Obtener roles únicos para el filtro
  const rolesUnicos = [...new Set(proveedores.map(p => p.rol_proveedor))].filter(Boolean);

  // Manejar creación de proveedor
  const handleCreateSuccess = async (data) => {
    const [result, error] = await handleCreateProveedorConRepresentante(data);
    
    if (result) {
      showSuccessAlert('¡Proveedor creado!', 'El proveedor se ha registrado exitosamente');
      closeModal();
      await fetchProveedores(); // Recargar la lista
      return [result, null];
    } else {
      showErrorAlert('Error', error || 'No se pudo crear el proveedor');
      return [null, error];
    }
  };

  // Manejar eliminación de proveedor
  const handleDelete = async (id) => {
    try {
      const result = await deleteDataAlert();
      if (result.isConfirmed) {
        const success = await handleDeleteProveedor(id);
        if (success) {
          await fetchProveedores(); // Recargar la lista
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
    if (selectedItems.length === filteredProveedores.length && filteredProveedores.length > 0) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredProveedores.map(p => p.id_proveedor));
    }
  };

  // Limpiar filtros
  const limpiarFiltros = () => {
    setSearchTerm('');
    setFilterRol('');
    setFilterTieneRepresentante('');
  };

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

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Content container with proper margin to avoid navbar overlap */}
      <div className="pt-[calc(9vh+1rem)] px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
              🏢 Gestión de Proveedores
            </h1>
            <p className="text-gray-600">
              Administra los proveedores y sus representantes - Total: {proveedores.length}
            </p>
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

        {/* Filtros */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                🔍 Buscar:
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por nombre, RUT, correo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2.5 pl-10 border-2 border-gray-200 rounded-lg focus:border-stone-500 focus:outline-none"
                />
                <img 
                  src={SearchIcon} 
                  alt="Buscar" 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Tipo de Proveedor:
              </label>
              <select
                value={filterRol}
                onChange={(e) => setFilterRol(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-stone-500 focus:outline-none"
              >
                <option value="">Todos los tipos</option>
                {rolesUnicos.map((rol, i) => (
                  <option key={i} value={rol}>{rol}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Representante:
              </label>
              <select
                value={filterTieneRepresentante}
                onChange={(e) => setFilterTieneRepresentante(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-stone-500 focus:outline-none"
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
                        checked={selectedItems.length === filteredProveedores.length && filteredProveedores.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 accent-stone-400 cursor-pointer"
                      />
                    </div>
                  </th>
                  <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider">Proveedor</th>
                  <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider">RUT</th>
                  <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider">Contacto</th>
                  <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider">Representante</th>
                  <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider">Estado</th>
                  <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProveedores.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-4xl">📭</span>
                        <p className="text-lg">No hay proveedores que mostrar</p>
                        <p className="text-sm">
                          {proveedores.length === 0 
                            ? 'Crea tu primer proveedor' 
                            : 'Intenta cambiar los filtros'
                          }
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProveedores.map((proveedor) => (
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
                          <span className="font-semibold text-gray-900">{proveedor.rol_proveedor}</span>
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
                            📧 <span className="text-blue-600">{proveedor.correo_proveedor}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            📞 <span className="text-green-600">{proveedor.fono_proveedor}</span>
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
                          <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                            ⚠️ Sin representante
                          </span>
                        )}
                      </td>

                      <td className="px-3 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          ✓ Activo
                        </span>
                      </td>

                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                            title="Editar proveedor"
                          >
                            <img src={UpdateIcon} alt="Editar" className="w-5 h-5" />
                          </button>
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

        {/* Footer con contador */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 bg-white inline-block px-6 py-3 rounded-full shadow-sm">
            Mostrando <span className="font-bold text-stone-600">{filteredProveedores.length}</span> de{' '}
            <span className="font-bold text-stone-600">{proveedores.length}</span> proveedores
          </p>
        </div>
      </div>

      {/* Modal de creación */}
      <PopupCreateProveedorConRepresentante
        show={showCreateModal}
        setShow={closeModal}
        onSubmit={handleCreateSuccess}
      />
    </div>
  );
}