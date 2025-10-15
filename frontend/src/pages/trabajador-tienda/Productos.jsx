// frontend/src/pages/TrabajadorTienda/Productos/Productos.jsx
import { useState, useEffect } from 'react';
import { getProductos, getCategorias, deleteProducto } from '@services/producto.service.js';

export default function Productos() {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filtros
    const [filtros, setFiltros] = useState({
        categoria: '',
        activo: true,
        busqueda: ''
    });

    // Cargar productos al montar
    useEffect(() => {
        cargarDatos();
    }, [filtros.categoria, filtros.activo]);

    const cargarDatos = async () => {
        setLoading(true);
        try {
            const responseProductos = await getProductos({
                categoria: filtros.categoria || undefined,
                activo: filtros.activo
            });
            
            if (responseProductos.status === 'Success') {
                setProductos(responseProductos.data);
            }

            if (categorias.length === 0) {
                const responseCategorias = await getCategorias();
                if (responseCategorias.status === 'Success') {
                    setCategorias(responseCategorias.data);
                }
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFiltroChange = (campo, valor) => {
        setFiltros(prev => ({ ...prev, [campo]: valor }));
    };

    const productosFiltrados = productos.filter(p =>
        p.nombre_producto.toLowerCase().includes(filtros.busqueda.toLowerCase())
    );

    const formatPrecio = (precio) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP'
        }).format(precio);
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
                        <p className="text-gray-600">Administra el catálogo de productos y servicios</p>
                    </div>
                    <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300">
                        <span className="text-xl">+</span> Nuevo Producto
                    </button>
                </div>

                {/* Filtros */}
                <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-2 block">Categoría:</label>
                            <select
                                value={filtros.categoria}
                                onChange={(e) => handleFiltroChange('categoria', e.target.value)}
                                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                            >
                                <option value="">Todas</option>
                                {categorias.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-2 block">Estado:</label>
                            <select
                                value={filtros.activo}
                                onChange={(e) => handleFiltroChange('activo', e.target.value === 'true')}
                                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                            >
                                <option value="true">Activos</option>
                                <option value="false">Inactivos</option>
                            </select>
                        </div>

                        <div className="lg:col-span-2">
                            <label className="text-sm font-semibold text-gray-700 mb-2 block">Buscar:</label>
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
                        onClick={() => setFiltros({ categoria: '', activo: true, busqueda: '' })}
                        className="mt-4 bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg"
                    >
                        Limpiar filtros
                    </button>
                </div>

                {/* Tabla */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase">ID</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Nombre</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Categoría</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Precio</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Estado</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {productosFiltrados.map((producto) => (
                                <tr key={producto.id_producto} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">{producto.id_producto}</td>
                                    <td className="px-6 py-4 font-semibold">{producto.nombre_producto}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                            {producto.categoria_producto}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-green-600">
                                        {formatPrecio(producto.precio_venta)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${producto.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {producto.activo ? '✓ Activo' : '✗ Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button className="p-2 hover:bg-blue-50 rounded-lg text-xl">👁️</button>
                                            <button className="p-2 hover:bg-orange-50 rounded-lg text-xl">✏️</button>
                                            <button className="p-2 hover:bg-red-50 rounded-lg text-xl">🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 text-center text-gray-600 text-sm">
                    Mostrando {productosFiltrados.length} de {productos.length} productos
                </div>
            </div>
        </div>
    );
}