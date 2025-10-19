// frontend/src/pages/trabajador-tienda/Materiales.jsx
import { useState } from 'react';
import { useMateriales, useFormatPrecio } from '@hooks/materiales/useMateriales';
import { showErrorAlert, showSuccessAlert, deleteDataAlert } from '@helpers/sweetAlert.js';
import { useNavigate } from 'react-router-dom';

// Icons (asegúrate de tener estos íconos en tu carpeta de assets)
import AddIcon from '@assets/AddIcon.svg';
import UpdateIcon from '@assets/updateIcon.svg';
import DeleteIcon from '@assets/deleteIcon.svg';
import SearchIcon from '@assets/SearchIcon.svg';

export default function Materiales() {
  const navigate = useNavigate();
  const {
    materiales,
    proveedores,
    categorias,
    loading,
    filtros,
    handleFiltroChange,
    limpiarFiltros,
    handleDeleteMaterial,
    fetchMateriales
  } = useMateriales();

  const { formatPrecio } = useFormatPrecio();
  const [selectedItems, setSelectedItems] = useState([]);

  const handleDelete = async (id) => {
    try {
      const result = await deleteDataAlert();
      if (result.isConfirmed) {
        await handleDeleteMaterial(id);
        setSelectedItems([]);
      }
    } catch (error) {
      showErrorAlert('Error', 'No se pudo desactivar el material');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;
    
    try {
      const result = await deleteDataAlert();
      if (result.isConfirmed) {
        const promises = selectedItems.map(id => handleDeleteMaterial(id));
        await Promise.all(promises);
        showSuccessAlert('Éxito', `${selectedItems.length} materiales desactivados correctamente`);
        setSelectedItems([]);
      }
    } catch (error) {
      showErrorAlert('Error', 'No se pudieron desactivar los materiales seleccionados');
    }
  };

  const toggleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === materiales.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(materiales.map(m => m.id_material));
    }
  };

  const getEstadoStockBadge = (estadoStock) => {
    const colores = {
      critico: 'bg-red-100 text-red-800',
      bajo: 'bg-orange-100 text-orange-800',
      medio: 'bg-yellow-100 text-yellow-800',
      normal: 'bg-green-100 text-green-800'
    };

    const iconos = {
      critico: '🔴',
      bajo: '🟠',
      medio: '🟡',
      normal: '🟢'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colores[estadoStock.nivel]}`}>
        {iconos[estadoStock.nivel]} {estadoStock.mensaje}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-gray-600 text-lg font-medium">Cargando materiales...</p>
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
              <span className="text-4xl md:text-5xl">🔧</span>
              Gestión de Materiales
            </h1>
            <p className="text-gray-600">
              Administra el inventario de materiales y suministros - Total: {materiales.length}
            </p>
          </div>
          <div className="flex gap-3">
            {selectedItems.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-3 rounded-xl shadow-md transition-all duration-300 flex items-center gap-2"
              >
                <img src={DeleteIcon} alt="Eliminar" className="w-5 h-5 filter brightness-0 invert" />
                Desactivar ({selectedItems.length})
              </button>
            )}
            <button
              onClick={() => navigate('/trabajador/materials/create')}
              className="bg-gradient-to-r from-stone-600 to-stone-700 hover:from-stone-700 hover:to-stone-800 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all duration-300 flex items-center gap-2"
            >
              <img src={AddIcon} alt="Agregar" className="w-5 h-5 filter brightness-0 invert" />
              Nuevo Material
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filtro de Categoría */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Categoría:
              </label>
              <select
                value={filtros.categoria_unidad}
                onChange={(e) => handleFiltroChange('categoria_unidad', e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-stone-500 focus:outline-none"
              >
                <option value="">Todas las categorías</option>
                {categorias.map((cat, i) => (
                  <option key={i} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro de Estado */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Estado:
              </label>
              <select
                value={filtros.activo.toString()}
                onChange={(e) => handleFiltroChange('activo', e.target.value === 'true')}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-stone-500 focus:outline-none"
              >
                <option value="true">✓ Activos</option>
                <option value="false">✗ Inactivos</option>
              </select>
            </div>

            {/* Filtro de Proveedor */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Proveedor:
              </label>
              <select
                value={filtros.id_proveedor}
                onChange={(e) => handleFiltroChange('id_proveedor', e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-stone-500 focus:outline-none"
              >
                <option value="">Todos los proveedores</option>
                {proveedores.map((prov) => (
                  <option key={prov.id_proveedor} value={prov.id_proveedor}>
                    {prov.nombre_representanter} {prov.apellido_representante}
                  </option>
                ))}
              </select>
            </div>

            {/* Búsqueda */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                🔍 Buscar:
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por nombre..."
                  value={filtros.busqueda}
                  onChange={(e) => handleFiltroChange('busqueda', e.target.value)}
                  className="w-full px-4 py-2.5 pl-10 border-2 border-gray-200 rounded-lg focus:border-stone-500 focus:outline-none"
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
          <div className="mt-4 flex items-center gap-2">
            <input
              type="checkbox"
              id="bajo_stock"
              checked={filtros.bajo_stock}
              onChange={(e) => handleFiltroChange('bajo_stock', e.target.checked)}
              className="w-4 h-4 accent-red-600 cursor-pointer"
            />
            <label htmlFor="bajo_stock" className="text-sm font-semibold text-gray-700 cursor-pointer">
              ⚠️ Mostrar solo materiales con stock bajo
            </label>
          </div>

          <button
            onClick={limpiarFiltros}
            className="mt-4 bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg transition-colors text-sm"
          >
            🔄 Limpiar filtros
          </button>
        </div>

        {/* Tabla de materiales */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-600 text-white">
                <tr>
                  <th className="px-3 py-4 text-left">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={selectedItems.length === materiales.length && materiales.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 accent-stone-400 cursor-pointer"
                      />
                    </div>
                  </th>
                  <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider">Nombre</th>
                  <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider">Stock</th>
                  <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider">Unidad</th>
                  <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider">Precio Unit.</th>
                  <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider">Proveedor</th>
                  <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider">Estado Stock</th>
                  <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {materiales.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-4xl">📭</span>
                        <p className="text-lg">No hay materiales que mostrar</p>
                        <p className="text-sm">Intenta cambiar los filtros o crear un nuevo material</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  materiales.map((material) => (
                    <tr key={material.id_material} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-4 whitespace-nowrap">
                        <input 
                          type="checkbox" 
                          checked={selectedItems.includes(material.id_material)}
                          onChange={() => toggleSelectItem(material.id_material)}
                          className="w-4 h-4 accent-stone-400 cursor-pointer"
                        />
                      </td>
                      
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">{material.nombre_material}</span>
                          <span className="text-xs text-gray-500">
                            Stock mín: {material.stock_minimo}
                          </span>
                        </div>
                      </td>

                      <td className="px-3 py-4 whitespace-nowrap">
                        <span className={`font-bold text-lg ${
                          material.existencia_material === 0 ? 'text-red-600' :
                          material.existencia_material <= material.stock_minimo ? 'text-orange-600' :
                          'text-green-600'
                        }`}>
                          {material.existencia_material}
                        </span>
                      </td>

                      <td className="px-3 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {material.unidad_medida}
                        </span>
                      </td>

                      <td className="px-3 py-4 whitespace-nowrap font-semibold text-green-600">
                        {formatPrecio(material.precio_unitario)}
                      </td>

                      <td className="px-3 py-4 whitespace-nowrap">
                        {material.proveedor ? (
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">
                              {material.proveedor.nombre_completo}
                            </span>
                            <span className="text-xs text-gray-500">
                              {material.proveedor.fono_proveedor}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Sin proveedor</span>
                        )}
                      </td>

                      <td className="px-3 py-4 whitespace-nowrap">
                        {getEstadoStockBadge(material.estado_stock)}
                      </td>

                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/trabajador/materials/${material.id_material}`)}
                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ver detalle"
                          >
                            <span className="text-xl">👁️</span>
                          </button>
                          <button
                            onClick={() => navigate(`/trabajador/materials/${material.id_material}/edit`)}
                            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <img src={UpdateIcon} alt="Editar" className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(material.id_material)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title={material.activo ? "Desactivar" : "Activar"}
                          >
                            <img src={DeleteIcon} alt="Eliminar/Activar" className="w-5 h-5" />
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
            Mostrando <span className="font-bold text-stone-600">{materiales.length}</span> materiales
          </p>
        </div>
      </div>
    </div>
  );
}