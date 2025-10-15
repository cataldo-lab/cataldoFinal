// frontend/src/pages/trabajador-tienda/Productos.jsx
import { useState } from 'react';
import { useProductos, useFormatPrecio } from '@hooks/productos/useProductos';
import PopupCreateProducto from '@components/popup/trabajadorTienda/PopupCreateProducto';
import PopupUpdateProducto from '@components/popup/trabajadorTienda/PopupUpdateProducto';
import AddIcon from '@assets/AddIcon.svg';
import UpdateIcon from '@assets/updateIcon.svg';
import DeleteIcon from '@assets/deleteIcon.svg';
import UpdateIconDisable from '@assets/updateIconDisabled.svg';
import DeleteIconDisable from '@assets/deleteIconDisabled.svg';

export default function Productos() {
  const {
    productos,
    categorias,
    loading,
    filtros,
    handleFiltroChange,
    limpiarFiltros,
    handleCreateProducto,
    handleUpdateProducto,
    handleDeleteProducto
  } = useProductos();

  const { formatPrecio } = useFormatPrecio();

  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const handleEdit = (producto) => {
    setProductoSeleccionado(producto);
    setShowUpdatePopup(true);
  };

  const handleDelete = async (id) => {
    await handleDeleteProducto(id);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-gray-600 text-lg font-medium">Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto pt-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
              <span className="text-5xl">📦</span>
              Gestión de Productos
            </h1>
            <p className="text-gray-600">
              Administra el catálogo de productos y servicios - Total: {productos.length}
            </p>
          </div>
          <button
            onClick={() => setShowCreatePopup(true)}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300 flex items-center gap-2"
          >
            <img src={AddIcon} alt="Agregar" className="w-5 h-5 filter brightness-0 invert" />
            Nuevo Producto
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Categoría:
              </label>
              <select
                value={filtros.categoria}
                onChange={(e) => handleFiltroChange('categoria', e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="">Todas las categorías</option>
                {categorias.map((cat, i) => (
                  <option key={i} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Estado:
              </label>
              <select
                value={filtros.activo}
                onChange={(e) => handleFiltroChange('activo', e.target.value === 'true')}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="true">✓ Activos</option>
                <option value="false">✗ Inactivos</option>
              </select>
            </div>

            <div className="lg:col-span-2">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                🔍 Buscar:
              </label>
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={filtros.busqueda}
                onChange={(e) => handleFiltroChange('busqueda', e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <button
            onClick={limpiarFiltros}
            className="mt-4 bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg transition-colors"
          >
            🔄 Limpiar filtros
          </button>
        </div>

        {/* Tabla de productos */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {productos.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-4xl">📭</span>
                        <p className="text-lg">No hay productos que mostrar</p>
                        <p className="text-sm">Intenta cambiar los filtros o crear un nuevo producto</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  productos.map((producto) => (
                    <tr key={producto.id_producto} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        #{producto.id_producto}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {producto.nombre_producto}
                        {producto.oferta && (
                          <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                            🔥 Oferta
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {producto.categoria_producto}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          producto.servicio 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {producto.servicio ? '🛠️ Servicio' : '📦 Producto'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-green-600">
                        {formatPrecio(producto.precio_venta)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          producto.activo 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {producto.activo ? '✓ Activo' : '✗ Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(producto)}
                            className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <img src={UpdateIcon} alt="Editar" className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(producto.id_producto)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
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

        {/* Footer con contador */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 bg-white inline-block px-6 py-3 rounded-full shadow-sm">
            Mostrando <span className="font-bold text-blue-600">{productos.length}</span> productos
          </p>
        </div>
      </div>

      {/* Popups */}
      <PopupCreateProducto
        show={showCreatePopup}
        setShow={setShowCreatePopup}
        categorias={categorias}
        onSubmit={handleCreateProducto}
      />

      <PopupUpdateProducto
        show={showUpdatePopup}
        setShow={setShowUpdatePopup}
        producto={productoSeleccionado}
        categorias={categorias}
        onSubmit={handleUpdateProducto}
      />
    </div>
  );
}