// frontend/src/pages/trabajador-tienda/Materiales.jsx
import { useState, useEffect } from 'react';
import { useGetMateriales } from '@hooks/materiales/useGetMateriales';
import { useCreateMaterial } from '@hooks/materiales/useCreateMaterial';
import { useUpdateMaterial } from '@hooks/materiales/useUpdateMaterial';
//import { useDeleteMaterial } from '@hooks/materiales/useDeleteMaterial';
import  useGetProveedores  from '@hooks/prooveedores/useGetProveedores';
import { showErrorAlert, showSuccessAlert, deleteDataAlert } from '@helpers/sweetAlert.js';
import PopupCreateMaterial from '@components/popup/trabajadorTienda/material/PopupCreateMaterial';
import PopupUpdateMaterial from '@components/popup/trabajadorTienda/material/PopupUpdateMaterial';

import AddIcon from '@assets/AddIcon.svg';
import UpdateIcon from '@assets/updateIcon.svg';
import DeleteIcon from '@assets/deleteIcon.svg';
import SearchIcon from '@assets/SearchIcon.svg';

export default function Materiales() {
  // ===== HOOKS =====
  const { 
    materiales, 
    loading: loadingMateriales, 
    error: errorMateriales,
    fetchMateriales 
  } = useGetMateriales(true);

  const { createMaterial, loading: loadingCreate } = useCreateMaterial();
  const { updateMaterial, loading: loadingUpdate } = useUpdateMaterial();
  //const { deleteMaterial, loading: loadingDelete } = useDeleteMaterial();
  const { proveedores, fetchProveedores } = useGetProveedores();

  // ===== ESTADOS LOCALES =====
  const [selectedItems, setSelectedItems] = useState([]);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [materialSeleccionado, setMaterialSeleccionado] = useState(null);
  const [materialesFiltrados, setMaterialesFiltrados] = useState([]);
  
  const [filtros, setFiltros] = useState({
    activo: true,
    id_proveedor: '',
    busqueda: '',
    bajo_stock: false
  });

  // ===== EFECTOS =====
  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [materiales, filtros]);

  // ===== FUNCIONES DE CARGA =====
  const cargarDatos = async () => {
    const filtrosAPI = {
      activo: filtros.activo,
      bajo_stock: filtros.bajo_stock || undefined,
      id_proveedor: filtros.id_proveedor || undefined
    };
    
    await Promise.all([
      fetchMateriales(filtrosAPI),
      fetchProveedores()
    ]);
  };

  const aplicarFiltros = () => {
    if (!Array.isArray(materiales)) {
      setMaterialesFiltrados([]);
      return;
    }

    let resultado = [...materiales];

    // Filtro de búsqueda por nombre
    if (filtros.busqueda && filtros.busqueda.trim() !== '') {
      const busquedaLower = filtros.busqueda.toLowerCase().trim();
      resultado = resultado.filter(m => 
        m.nombre_material && m.nombre_material.toLowerCase().includes(busquedaLower)
      );
    }

    setMaterialesFiltrados(resultado);
  };

  // ===== HANDLERS DE FILTROS =====
  const handleFiltroChange = async (campo, valor) => {
    const nuevosFiltros = {
      ...filtros,
      [campo]: valor
    };
    
    setFiltros(nuevosFiltros);

    // Si cambia un filtro de API, recargar
    if (['activo', 'bajo_stock', 'id_proveedor'].includes(campo)) {
      const filtrosAPI = {
        activo: nuevosFiltros.activo,
        bajo_stock: nuevosFiltros.bajo_stock || undefined,
        id_proveedor: nuevosFiltros.id_proveedor || undefined
      };
      
      await fetchMateriales(filtrosAPI);
    }
  };

  const limpiarFiltros = async () => {
    setFiltros({
      activo: true,
      id_proveedor: '',
      busqueda: '',
      bajo_stock: false
    });
    await fetchMateriales({ activo: true });
  };

  // ===== HANDLERS DE CRUD =====
  const handleCreateMaterial = async (materialData) => {
    const resultado = await createMaterial(materialData);
    if (resultado) {
      setShowCreatePopup(false);
      await cargarDatos();
      return [true, null];
    }
    return [false, 'Error al crear material'];
  };

  const handleUpdateMaterial = async (id, materialData) => {
    const resultado = await updateMaterial(id, materialData);
    if (resultado) {
      setShowUpdatePopup(false);
      setMaterialSeleccionado(null);
      await cargarDatos();
      return [true, null];
    }
    return [false, 'Error al actualizar material'];
  };

  const handleDeleteMaterial = async (id) => {
    try {
      const result = await deleteDataAlert();
      if (result.isConfirmed) {
        const exito = await deleteMaterial(id, false);
        if (exito) {
          setSelectedItems(selectedItems.filter(item => item !== id));
          await cargarDatos();
        }
      }
    } catch (error) {
      console.error('Error al eliminar material:', error);
      showErrorAlert('Error', 'No se pudo desactivar el material');
    }
  };

  const handleEdit = (material) => {
    setMaterialSeleccionado(material);
    setShowUpdatePopup(true);
  };

  // ===== HANDLERS DE SELECCIÓN =====
  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) {
      showErrorAlert('Error', 'No hay materiales seleccionados');
      return;
    }
    
    try {
      const result = await deleteDataAlert();
      if (result.isConfirmed) {
        const promises = selectedItems.map(id => deleteMaterial(id, false));
        const resultados = await Promise.all(promises);
        
        const exitosos = resultados.filter(r => r === true).length;
        
        if (exitosos > 0) {
          showSuccessAlert(
            'Éxito', 
            `${exitosos} material(es) desactivado(s) correctamente`
          );
          setSelectedItems([]);
          await cargarDatos();
        }
      }
    } catch (error) {
      console.error('Error al eliminar materiales:', error);
      showErrorAlert('Error', 'No se pudieron desactivar algunos materiales');
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
    if (!Array.isArray(materialesFiltrados)) return;
    
    setSelectedItems(prev => 
      prev.length === materialesFiltrados.length 
        ? [] 
        : materialesFiltrados.map(m => m.id_material)
    );
  };

  // ===== UTILIDADES =====
  const formatPrecio = (precio) => {
    if (precio === null || precio === undefined) return '$0';
    
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(precio);
  };

  const getEstadoStockBadge = (estadoStock) => {
    if (!estadoStock || !estadoStock.nivel) return null;

    const estilos = {
      critico: {
        className: 'bg-red-100 text-red-800 border-red-200',
        icon: '🔴',
        textColor: 'text-red-600'
      },
      bajo: {
        className: 'bg-orange-100 text-orange-800 border-orange-200',
        icon: '🟠',
        textColor: 'text-orange-600'
      },
      medio: {
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: '🟡',
        textColor: 'text-yellow-600'
      },
      normal: {
        className: 'bg-green-100 text-green-800 border-green-200',
        icon: '🟢',
        textColor: 'text-green-600'
      }
    };

    const estilo = estilos[estadoStock.nivel] || estilos.normal;

    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${estilo.className} inline-flex items-center gap-1.5`}>
        <span className="text-base">{estilo.icon}</span>
        {estadoStock.mensaje}
      </span>
    );
  };

  const getStockColor = (existencia, stockMinimo) => {
    if (existencia === 0) return 'text-red-600 font-bold';
    if (existencia <= stockMinimo) return 'text-orange-600 font-bold';
    if (existencia <= stockMinimo * 1.5) return 'text-yellow-600 font-bold';
    return 'text-green-600 font-bold';
  };

  // ===== COMPONENTES =====
  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center h-screen gap-4 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-gray-200 border-t-stone-600 rounded-full animate-spin"></div>
        <span className="absolute inset-0 flex items-center justify-center text-2xl">🔧</span>
      </div>
      <p className="text-gray-600 text-lg font-semibold animate-pulse">Cargando materiales...</p>
      <p className="text-gray-500 text-sm">Obteniendo inventario actualizado</p>
    </div>
  );

  const EmptyState = () => (
    <tr>
      <td colSpan="8" className="px-6 py-12 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-5xl">📭</span>
          </div>
          <div>
            <p className="text-gray-700 text-lg font-semibold mb-1">No hay materiales que mostrar</p>
            <p className="text-gray-500 text-sm">Intenta cambiar los filtros o crear un nuevo material</p>
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
  if (loadingMateriales) return <LoadingState />;

  if (errorMateriales) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <div className="text-center">
            <span className="text-6xl mb-4 block">❌</span>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error al cargar</h2>
            <p className="text-gray-600 mb-4">{errorMateriales}</p>
            <button
              onClick={cargarDatos}
              className="bg-stone-600 hover:bg-stone-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              🔄 Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const materialesParaMostrar = Array.isArray(materialesFiltrados) ? materialesFiltrados : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-8">
      <div className="pt-[calc(9vh+1rem)] px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* ===== HEADER ===== */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
              <span className="text-4xl md:text-5xl">🔧</span>
              Gestión de Materiales
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <span>Administra el inventario de materiales y suministros</span>
              <span className="px-2 py-0.5 bg-stone-600 text-white rounded-full text-xs font-semibold">
                {materialesParaMostrar.length} materiales
              </span>
            </p>
          </div>
          
          <div className="flex gap-3 flex-wrap">
            {selectedItems.length > 0 && (
              <button
                onClick={handleBulkDelete}
                disabled={loadingDelete}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold 
                px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 
                flex items-center gap-2 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <img src={DeleteIcon} alt="Eliminar" className="w-5 h-5 filter brightness-0 invert" />
                {loadingDelete ? 'Desactivando...' : `Desactivar (${selectedItems.length})`}
              </button>
            )}
            <button
              onClick={() => setShowCreatePopup(true)}
              disabled={loadingCreate}
              className="bg-gradient-to-r from-stone-600 to-stone-700 hover:from-stone-700 
              hover:to-stone-800 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 transform hover:scale-105 disabled:opacity-50"
            >
              <img src={AddIcon} alt="Agregar" className="w-5 h-5 filter brightness-0 invert" />
              Nuevo Material
            </button>
          </div>
        </div>

        {/* ===== FILTROS ===== */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span>🔍</span> Filtros de búsqueda
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Filtro de Estado */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 block">
                ⚡ Estado
              </label>
              <select
                value={filtros.activo.toString()}
                onChange={(e) => handleFiltroChange('activo', e.target.value === 'true')}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-stone-500 focus:ring-2 focus:ring-stone-200 focus:outline-none transition-all"
              >
                <option value="true">✓ Activos</option>
                <option value="false">✗ Inactivos</option>
              </select>
            </div>

            {/* Filtro de Proveedor */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 block">
                🏢 Proveedor
              </label>
              <select
                value={filtros.id_proveedor}
                onChange={(e) => handleFiltroChange('id_proveedor', e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-stone-500 focus:ring-2 focus:ring-stone-200 focus:outline-none transition-all"
              >
                <option value="">Todos los proveedores</option>
                {Array.isArray(proveedores) && proveedores.map((prov) => (
                  <option key={prov.id_proveedor} value={prov.id_proveedor}>
                    {prov.nombre_representanter} {prov.apellido_representante}
                  </option>
                ))}
              </select>
            </div>

            {/* Búsqueda */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 block">
                🔎 Buscar
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por nombre..."
                  value={filtros.busqueda}
                  onChange={(e) => handleFiltroChange('busqueda', e.target.value)}
                  className="w-full px-4 py-2.5 pl-10 border-2 border-gray-200 rounded-lg 
                  focus:border-stone-500 focus:ring-2 focus:ring-stone-200 focus:outline-none transition-all"
                />
                <img 
                  src={SearchIcon} 
                  alt="Buscar" 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
                />
              </div>
            </div>
          </div>

          {/* Stock bajo checkbox */}
          <div className="mt-4 flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <input
              type="checkbox"
              id="bajo_stock"
              checked={filtros.bajo_stock}
              onChange={(e) => handleFiltroChange('bajo_stock', e.target.checked)}
              className="w-5 h-5 accent-orange-600 cursor-pointer"
            />
            <label htmlFor="bajo_stock" className="text-sm font-semibold text-orange-800 cursor-pointer flex items-center gap-2">
              <span>⚠️</span>
              Mostrar solo materiales con stock bajo
            </label>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={limpiarFiltros}
              disabled={loadingMateriales}
              className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg 
              transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50"
            >
              <span>🔄</span> Limpiar filtros
            </button>
            <button
              onClick={cargarDatos}
              disabled={loadingMateriales}
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg 
              transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50"
            >
              <span>↻</span> {loadingMateriales ? 'Actualizando...' : 'Actualizar'}
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
                      checked={selectedItems.length === materialesParaMostrar.length && materialesParaMostrar.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 accent-stone-400 cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Material</th>
                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Stock</th>
                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Unidad</th>
                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Precio</th>
                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Proveedor</th>
                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Estado Stock</th>
                  <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {materialesParaMostrar.length === 0 ? (
                  <EmptyState />
                ) : (
                  materialesParaMostrar.map((material, index) => (
                    <tr 
                      key={material.id_material} 
                      className={`hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                      }`}
                    >
                      <td className="px-4 py-4">
                        <input 
                          type="checkbox" 
                          checked={selectedItems.includes(material.id_material)}
                          onChange={() => toggleSelectItem(material.id_material)}
                          className="w-4 h-4 accent-stone-600 cursor-pointer"
                        />
                      </td>
                      
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-gray-900">{material.nombre_material}</span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <span>📊</span>
                            Stock mín: <span className="font-medium">{material.stock_minimo}</span>
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={`text-2xl font-bold ${getStockColor(material.existencia_material, material.stock_minimo)}`}>
                            {material.existencia_material}
                          </span>
                          {material.existencia_material <= material.stock_minimo && (
                            <span className="text-xs text-orange-600 font-medium">⚠️ Reabastecer</span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                          {material.unidad_medida}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span className="text-green-700 font-bold text-base">
                          {formatPrecio(material.precio_unitario)}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        {material.proveedor ? (
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-gray-900">
                              {material.proveedor.nombre_completo}
                            </span>
                            {material.proveedor.fono_proveedor && (
                              <span className="text-xs text-gray-500">
                                📞 {material.proveedor.fono_proveedor}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400 italic">Sin proveedor</span>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        {getEstadoStockBadge(material.estado_stock)}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleEdit(material)}
                            disabled={loadingUpdate}
                            className="p-2.5 hover:bg-stone-100 rounded-lg transition-all duration-200 disabled:opacity-50"
                            title="Editar"
                          >
                            <img src={UpdateIcon} alt="Editar" className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMaterial(material.id_material)}
                            disabled={loadingDelete}
                            className="p-2.5 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50"
                            title="Desactivar"
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

        {/* ===== FOOTER ===== */}
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-600 bg-white px-6 py-3 rounded-full 
          shadow-sm border border-gray-100">
            Mostrando <span className="font-bold text-stone-600">{materialesParaMostrar.length}</span> materiales
            {selectedItems.length > 0 && (
              <span className="ml-2 text-orange-600">
                • <span className="font-bold">{selectedItems.length}</span> seleccionados
              </span>
            )}
          </div>
          
          {materialesParaMostrar.some(m => m.existencia_material <= m.stock_minimo) && (
            <div className="bg-orange-100 border border-orange-300 text-orange-800 
            px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
              <span>⚠️</span>
              {materialesParaMostrar.filter(m => m.existencia_material <= m.stock_minimo).length} materiales requieren atención
            </div>
          )}
        </div>
      </div>

      {/* ===== POPUPS ===== */}
      <PopupCreateMaterial
        show={showCreatePopup}
        setShow={setShowCreatePopup}
        proveedores={Array.isArray(proveedores) ? proveedores : []}
        onSubmit={handleCreateMaterial}
      />

      <PopupUpdateMaterial
        show={showUpdatePopup}
        setShow={setShowUpdatePopup}
        material={materialSeleccionado}
        proveedores={Array.isArray(proveedores) ? proveedores : []}
        onSubmit={handleUpdateMaterial}
      />
    </div>
  );
}