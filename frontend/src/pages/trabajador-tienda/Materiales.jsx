// frontend/src/pages/trabajador-tienda/Materiales.jsx
import { useState, useEffect } from 'react';

import { useMaterialesConRepresentantes } from "@hooks/materiales/useMaterialesConRepresentantes";
import { useCreateMaterial } from "@hooks/materiales/useCreateMaterial";
import { useUpdateMaterial } from "@hooks/materiales/useUpdateMaterial";
import { useDeleteMaterial } from "@hooks/materiales/useDeleteMaterial";
import { showErrorAlert, showSuccessAlert, deleteDataAlert } from '@helpers/sweetAlert.js';
import PopupCreateMaterial from '@components/popup/trabajadorTienda/material/PopupCreateMaterial';
import PopupUpdateMaterial from '@components/popup/trabajadorTienda/material/PopupUpdateMaterial';
//import useProveedoresSafe from '@hooks/prooveedores/useProveedoresSafe';
import { useProveedoresConRepresentantes } from '@hooks/prooveedores/useProveedoresConRepresentantes';
import  PopupCreateProveedorConRepresentante  from
 '@components/popup/trabajadorTienda/proveedor/PopupCreateProveedorConRepresentante.jsx';
import { useCreateProveedorConRepresentante } from '@hooks/prooveedores/useCreateProveedorConRepresentante'
import {
  FaPhone,
  FaUser,
  FaWarehouse,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaSync,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaCircle,
  FaInbox,
  FaSpinner,
  FaChartBar,
  FaBuilding,
  FaRedo,
  FaBan
} from 'react-icons/fa';


function PaginatedTable({data, itemsPerPage=10}){
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);
}

export default function Materiales() {
  // ===== HOOKS =====
  const { 
    materiales, 
    loading: loadingMateriales, 
    error: errorMateriales,
    fetchMaterialesConRepresentantes 
  } = useMaterialesConRepresentantes(true); // true = auto fetch

  


  const { 
    handleCreateMaterial: createMaterialAction, 
    loading: loadingCreate 
  } = useCreateMaterial();
  
  const { 
    handleUpdateMaterial: updateMaterialAction, 
    loading: loadingUpdate 
  } = useUpdateMaterial();
  
  const { 
    handleDeleteMaterial: deleteMaterialAction, 
    loading: loadingDelete 
  } = useDeleteMaterial();

  const { 
    proveedores, 
    loading: loadingProveedores, 
    fetchProveedores 
  } = useProveedoresConRepresentantes();

  const {
  handleCreateProveedorConRepresentante,  
  loading: loadingCreateProveedor,
  isOpen,
  openModal,
  closeModal
} = useCreateProveedorConRepresentante();

  // ===== ESTADOS LOCALES =====
  const [selectedItems, setSelectedItems] = useState([]);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [materialSeleccionado, setMaterialSeleccionado] = useState(null);
  const [materialesFiltrados, setMaterialesFiltrados] = useState([]);
  
  const [filtros, setFiltros] = useState({
    id_proveedor: '',
    busqueda: '',
    bajo_stock: false,
    mostrar_inactivos: false
  });

  // ===== EFECTOS =====
  useEffect(() => {
    fetchProveedores();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [materiales, filtros]);

  // ===== FUNCIONES DE FILTRADO =====
  const aplicarFiltros = () => {
    if (!Array.isArray(materiales)) {
      setMaterialesFiltrados([]);
      return;
    }

    let resultado = [...materiales];

    // Filtro por proveedor
    if (filtros.id_proveedor) {
      resultado = resultado.filter(m => 
        m.proveedor?.id_proveedor === parseInt(filtros.id_proveedor)
      );
    }

    // Filtro de búsqueda por nombre
    if (filtros.busqueda && filtros.busqueda.trim() !== '') {
      const busquedaLower = filtros.busqueda.toLowerCase().trim();
      resultado = resultado.filter(m => 
        m.nombre_material && m.nombre_material.toLowerCase().includes(busquedaLower)
      );
    }

    // Filtro de stock bajo
    if (filtros.bajo_stock) {
      resultado = resultado.filter(m => 
        m.existencia_material < m.stock_minimo
      );
    }

    setMaterialesFiltrados(resultado);
  };

  // ===== HANDLERS DE FILTROS =====
  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      id_proveedor: '',
      busqueda: '',
      bajo_stock: false
    });
  };

  // ===== HANDLERS DE CRUD =====
  const handleCreateMaterial = async (materialData) => {
    const [newMaterial, error] = await createMaterialAction(materialData);
    
    if (newMaterial) {
      showSuccessAlert('Éxito', 'Material creado correctamente');
      setShowCreatePopup(false);
      await fetchMaterialesConRepresentantes();
      return [true, null];
    } else {
      showErrorAlert('Error', error || 'Error al crear material');
      return [false, error];
    }
  };

const handleUpdateMaterial = async (id, materialData) => {
  console.log('🎯 Materiales.jsx - ID:', id, 'Tipo:', typeof id); 
  
  const [updatedMaterial, error] = await updateMaterialAction(id, materialData);
  
  if (updatedMaterial) {
    showSuccessAlert('Éxito', 'Material actualizado correctamente');
    setShowUpdatePopup(false);
    setMaterialSeleccionado(null);
    await fetchMaterialesConRepresentantes();
    return [true, null];
  } else {
    showErrorAlert('Error', error || 'Error al actualizar material');
    return [false, error];
  }
};

  

  const handleDeleteMaterial = async (id) => {
    try {
      const result = await deleteDataAlert();
      if (result.isConfirmed) {
        const [success, error] = await deleteMaterialAction(id, false);
        
        if (success) {
          showSuccessAlert('Éxito', 'Material desactivado correctamente');
          setSelectedItems(selectedItems.filter(item => item !== id));
          await fetchMaterialesConRepresentantes();
        } else {
          showErrorAlert('Error', error || 'No se pudo desactivar el material');
        }
      }
    } catch (error) {
      console.error('Error al eliminar material:', error);
      showErrorAlert('Error', 'Error inesperado al desactivar el material');
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
        const promises = selectedItems.map(id => deleteMaterialAction(id, false));
        const resultados = await Promise.all(promises);
        
        const exitosos = resultados.filter(([success]) => success === true).length;
        
        if (exitosos > 0) {
          showSuccessAlert(
            'Éxito', 
            `${exitosos} material(es) desactivado(s) correctamente`
          );
          setSelectedItems([]);
          await fetchMaterialesConRepresentantes();
        } else {
          showErrorAlert('Error', 'No se pudieron desactivar los materiales');
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

  const getEstadoStockBadge = (material) => {
    const { existencia_material, stock_minimo } = material;

    let nivel, className, IconComponent, mensaje;

    if (existencia_material === 0) {
      nivel = 'critico';
      className = 'bg-red-100 text-red-800 border-red-200';
      IconComponent = FaTimesCircle;
      mensaje = 'Sin stock';
    } else if (existencia_material < stock_minimo * 0.5) {
      nivel = 'critico';
      className = 'bg-red-100 text-red-800 border-red-200';
      IconComponent = FaCircle;
      mensaje = 'Crítico';
    } else if (existencia_material < stock_minimo) {
      nivel = 'bajo';
      className = 'bg-orange-100 text-orange-800 border-orange-200';
      IconComponent = FaCircle;
      mensaje = 'Stock bajo';
    } else if (existencia_material < stock_minimo * 1.5) {
      nivel = 'medio';
      className = 'bg-yellow-100 text-yellow-800 border-yellow-200';
      IconComponent = FaCircle;
      mensaje = 'Stock medio';
    } else {
      nivel = 'normal';
      className = 'bg-green-100 text-green-800 border-green-200';
      IconComponent = FaCheckCircle;
      mensaje = 'Stock normal';
    }

    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${className} inline-flex items-center gap-1.5`}>
        <IconComponent className="text-sm" />
        {mensaje}
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
    <div className="flex flex-col items-center justify-center h-screen gap-4 bg-gradient-to-br from-stone-50 to-stone-100">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-stone-200 border-t-stone-600 rounded-full animate-spin"></div>
        <FaWarehouse className="absolute inset-0 m-auto text-3xl text-stone-600" />
      </div>
      <p className="text-stone-700 text-lg font-semibold animate-pulse">Cargando materiales...</p>
      <p className="text-stone-500 text-sm">Obteniendo inventario actualizado</p>
    </div>
  );

  const EmptyState = () => (
    <tr>
      <td colSpan="9" className="px-6 py-12 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center">
            <FaInbox className="text-5xl text-stone-400" />
          </div>
          <div>
            <p className="text-stone-700 text-lg font-semibold mb-1">No hay materiales que mostrar</p>
            <p className="text-stone-500 text-sm">Intenta cambiar los filtros o crear un nuevo material</p>
          </div>
          <button
            onClick={limpiarFiltros}
            className="mt-2 px-4 py-2 bg-stone-600 hover:bg-stone-700 text-white
            rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <FaRedo /> Limpiar filtros
          </button>
        </div>
      </td>
    </tr>
  );

  // ===== RENDER =====
  if (loadingMateriales) return <LoadingState />;

  if (errorMateriales) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <div className="text-center">
            <FaTimesCircle className="text-6xl mb-4 mx-auto text-red-500" />
            <h2 className="text-2xl font-bold text-stone-800 mb-2">Error al cargar</h2>
            <p className="text-stone-600 mb-4">{errorMateriales}</p>
            <button
              onClick={fetchMaterialesConRepresentantes}
              className="bg-stone-600 hover:bg-stone-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2 mx-auto"
            >
              <FaSync /> Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const materialesParaMostrar = Array.isArray(materialesFiltrados) ? materialesFiltrados : [];



  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 pb-8">
      <div className="pt-[calc(9vh+1rem)] px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        {/* ===== HEADER ===== */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-2 flex items-center gap-3">
              <FaWarehouse className="text-stone-600" />
              Gestión de Materiales
            </h1>
            <p className="text-stone-600 flex items-center gap-2">
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
                <FaTrash className="w-5 h-5" />
                {loadingDelete ? 'Desactivando...' : `Desactivar (${selectedItems.length})`}
              </button>
            )}
            <button
              onClick={() => setShowCreatePopup(true)}
              disabled={loadingCreate}
              className="bg-gradient-to-r from-stone-600 to-stone-700 hover:from-stone-700
              hover:to-stone-800 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 transform hover:scale-105 disabled:opacity-50"
            >
              <FaPlus className="w-5 h-5" />
              Nuevo Material
            </button>
          </div>
        </div>

        {/* ===== FILTROS ===== */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-6 border border-stone-100">
          <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
            <FaFilter className="text-stone-600" /> Filtros de búsqueda
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filtro de Proveedor */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-700 block flex items-center gap-2">
                <FaBuilding className="text-stone-600" /> Proveedor
              </label>
              <select
                value={filtros.id_proveedor}
                onChange={(e) => handleFiltroChange('id_proveedor', e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-stone-200 rounded-lg focus:border-stone-500 focus:ring-2 focus:ring-stone-200 focus:outline-none transition-all"
              >
                <option value="">Todos los proveedores</option>
                {Array.isArray(proveedores) && proveedores.map((prov) => (
                  <option key={prov.id_proveedor} value={prov.id_proveedor}>
                    {prov.rol_proveedor}
                  </option>
                ))}
              </select>
            </div>

            {/* Búsqueda */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-700 block flex items-center gap-2">
                <FaSearch className="text-stone-600" /> Buscar
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por nombre..."
                  value={filtros.busqueda}
                  onChange={(e) => handleFiltroChange('busqueda', e.target.value)}
                  className="w-full px-4 py-2.5 pl-10 border-2 border-stone-200 rounded-lg
                  focus:border-stone-500 focus:ring-2 focus:ring-stone-200 focus:outline-none transition-all"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" />
              </div>
            </div>

            {/* Stock bajo checkbox */}
            <div className="space-y-2 flex items-end">
              <div className="w-full flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <input
                  type="checkbox"
                  id="bajo_stock"
                  checked={filtros.bajo_stock}
                  onChange={(e) => handleFiltroChange('bajo_stock', e.target.checked)}
                  className="w-5 h-5 accent-orange-600 cursor-pointer"
                />
                <label htmlFor="bajo_stock" className="text-sm font-semibold text-orange-800
                cursor-pointer flex items-center gap-2">
                  <FaExclamationTriangle />
                  Stock bajo
                </label>
              </div>
            </div>



            {/* Agregar proveedor */}
          <div className="flex items-end">
          <button
          onClick={openModal}
          className="w-full px-4 py-2.5 bg-stone-600 hover:bg-stone-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
        >
          <FaPlus /> Agregar proveedor
        </button>
          </div>

          </div>



          <div className="mt-4 flex gap-2">
            <button
              onClick={limpiarFiltros}
              className="bg-stone-500 hover:bg-stone-600 text-white px-5 py-2 rounded-lg
              transition-colors text-sm font-medium flex items-center gap-2"
            >
              <FaRedo /> Limpiar filtros
            </button>
            <button
              onClick={fetchMaterialesConRepresentantes}
              disabled={loadingMateriales}
              className="bg-stone-600 hover:bg-stone-700 text-white px-5 py-2 rounded-lg
              transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50"
            >
              <FaSync /> {loadingMateriales ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>
        </div>

        {/* ===== TABLA ===== */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-stone-100">
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
                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Representante</th>
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
                          <span className="font-semibold text-stone-900">{material.nombre_material}</span>
                          <span className="text-xs text-stone-500 flex items-center gap-1">
                            <FaChartBar className="text-stone-400" />
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
                            <span className="text-xs text-orange-600 font-medium flex items-center gap-1">
                              <FaExclamationTriangle /> Reabastecer
                            </span>
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
                            <span className="text-sm font-medium text-stone-900 flex items-center gap-2">
                              <FaBuilding className="text-stone-600" />
                              {material.proveedor.rol_proveedor}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-stone-400 italic">Sin proveedor</span>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        {material.representante ? (
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-stone-700 font-medium items-center gap-2 flex">
                              <FaUser className="w-4 h-4 text-stone-600" />
                              {material.representante.nombre_completo}
                            </span>


                            <span className="text-xs text-stone-600">
                              {material.representante.cargo_representante}
                            </span>
                            {material.representante.fono_representante && (
                              <span className="text-xs text-stone-600 font-medium flex items-center gap-1">
                              <FaPhone className="text-stone-500" /> {material.representante.fono_representante}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-stone-400 italic">Sin representante</span>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        {getEstadoStockBadge(material)}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleEdit(material)}
                            disabled={loadingUpdate}
                            className="p-2.5 hover:bg-stone-100 rounded-lg transition-all duration-200 disabled:opacity-50"
                            title="Editar"
                          >
                            <FaEdit className="w-5 h-5 text-stone-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteMaterial(material.id_material)}
                            disabled={loadingDelete}
                            className="p-2.5 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50"
                            title="Desactivar"
                          >
                            <FaBan className="w-5 h-5 text-red-600" />
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
        <div className="mt-6 flex justify-between items-center flex-wrap gap-4">
          <div className="text-sm text-stone-600 bg-white px-6 py-3 rounded-full
          shadow-sm border border-stone-100">
            Mostrando <span className="font-bold text-stone-700">{materialesParaMostrar.length}</span> materiales
            {selectedItems.length > 0 && (
              <span className="ml-2 text-orange-600">
                • <span className="font-bold">{selectedItems.length}</span> seleccionados
              </span>
            )}
          </div>

          {materialesParaMostrar.some(m => m.existencia_material <= m.stock_minimo) && (
            <div className="bg-orange-100 border border-orange-300 text-orange-800
            px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
              <FaExclamationTriangle />
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

      <PopupCreateProveedorConRepresentante
      show={isOpen}
      setShow={closeModal}
      onSubmit={async (data) => {
        const [result, error] = await handleCreateProveedorConRepresentante(data);
        if (result) {
          showSuccessAlert('Éxito', 'Proveedor creado correctamente');
          await fetchProveedores(); // Recargar lista de proveedores
          return [true, null];
        } else {
          showErrorAlert('Error', error || 'Error al crear proveedor');
          return [false, error];
    }
  }}
/>
    </div>
  );
}