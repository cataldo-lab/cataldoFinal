import { useState, useEffect, useMemo } from 'react';
import { FaTimes, FaPlus, FaTrash, FaShoppingCart, FaCalendarAlt, FaSearch, FaUserPlus } from 'react-icons/fa';
import { useCrearOperacion } from '@hooks/papeles/useCrearOperacion';
import PopUpCrearCliente from '@components/popup/trabajadorTienda/cliente/popUpCrearCliente';

const CrearOperacionModal = ({ isOpen, onClose, onSuccess, clientes = [], productos = [] }) => {
    // Estados del formulario
    const [formData, setFormData] = useState({
        id_cliente: '',
        estado_operacion: 'pendiente',
        descripcion_operacion: '',
        cantidad_abono: 0,
        fecha_entrega_estimada: ''
    });

    // Estados para días hábiles
    const [diasHabiles, setDiasHabiles] = useState(30);

    // Estados para búsqueda y filtros
    const [busquedaCliente, setBusquedaCliente] = useState('');
    const [busquedaProducto, setBusquedaProducto] = useState('');
    const [mostrarPopupCrearCliente, setMostrarPopupCrearCliente] = useState(false);

    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [productoActual, setProductoActual] = useState({
        id_producto: '',
        cantidad: 1,
        precio_unitario: '',
        especificaciones: ''
    });

    const { loading, error, success, crearOperacion, reset } = useCrearOperacion();

    // Filtrar clientes según búsqueda
    const clientesFiltrados = useMemo(() => {
        if (!busquedaCliente.trim()) return clientes;

        const termino = busquedaCliente.toLowerCase();
        return clientes.filter(cliente =>
            cliente.nombreCompleto?.toLowerCase().includes(termino) ||
            cliente.email?.toLowerCase().includes(termino) ||
            cliente.rut?.toLowerCase().includes(termino)
        );
    }, [clientes, busquedaCliente]);

    // Filtrar productos según búsqueda
    const productosFiltrados = useMemo(() => {
        if (!busquedaProducto.trim()) return productos;

        const termino = busquedaProducto.toLowerCase();
        return productos.filter(producto =>
            producto.nombre_producto?.toLowerCase().includes(termino) ||
            producto.descripcion_producto?.toLowerCase().includes(termino)
        );
    }, [productos, busquedaProducto]);

    // Calcular costo total
    const costoTotal = productosSeleccionados.reduce((sum, prod) => {
        const precio = parseFloat(prod.precio_unitario) || 0;
        const cantidad = parseInt(prod.cantidad) || 0;
        return sum + (precio * cantidad);
    }, 0);

    const saldoPendiente = costoTotal - (parseFloat(formData.cantidad_abono) || 0);

    // Calcular fecha de entrega sumando días hábiles (excluyendo sábados y domingos)
    const calcularFechaEntrega = (diasHabilesParam) => {
        const fecha = new Date();
        let diasAgregados = 0;

        while (diasAgregados < diasHabilesParam) {
            fecha.setDate(fecha.getDate() + 1);
            const diaSemana = fecha.getDay();
            // 0 = Domingo, 6 = Sábado
            if (diaSemana !== 0 && diaSemana !== 6) {
                diasAgregados++;
            }
        }

        return fecha;
    };

    // Actualizar fecha de entrega cuando cambian los días hábiles
    useEffect(() => {
        if (formData.cantidad_abono > 0 && diasHabiles > 0) {
            const fechaCalculada = calcularFechaEntrega(diasHabiles);
            setFormData(prev => ({
                ...prev,
                fecha_entrega_estimada: fechaCalculada.toISOString().split('T')[0]
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                fecha_entrega_estimada: ''
            }));
        }
    }, [diasHabiles, formData.cantidad_abono]);

    // Agregar producto a la lista
    const handleAgregarProducto = () => {
        if (!productoActual.id_producto) {
            alert('Seleccione un producto');
            return;
        }

        if (productoActual.cantidad <= 0) {
            alert('La cantidad debe ser mayor a 0');
            return;
        }

        const producto = productos.find(p => p.id_producto === parseInt(productoActual.id_producto));
        if (!producto) return;

        const precioUnitario = productoActual.precio_unitario || producto.precio_venta;

        setProductosSeleccionados([...productosSeleccionados, {
            ...productoActual,
            id_producto: parseInt(productoActual.id_producto),
            cantidad: parseInt(productoActual.cantidad),
            precio_unitario: parseFloat(precioUnitario),
            nombre_producto: producto.nombre_producto
        }]);

        // Resetear producto actual
        setProductoActual({
            id_producto: '',
            cantidad: 1,
            precio_unitario: '',
            especificaciones: ''
        });
    };

    // Eliminar producto de la lista
    const handleEliminarProducto = (index) => {
        setProductosSeleccionados(productosSeleccionados.filter((_, i) => i !== index));
    };

    // Manejar cambios en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Manejar cambios en producto actual
    const handleProductoChange = (e) => {
        const { name, value } = e.target;
        setProductoActual(prev => ({
            ...prev,
            [name]: value
        }));

        // Auto-cargar precio del producto
        if (name === 'id_producto' && value) {
            const producto = productos.find(p => p.id_producto === parseInt(value));
            if (producto) {
                setProductoActual(prev => ({
                    ...prev,
                    precio_unitario: producto.precio_venta
                }));
            }
        }
    };

    // Handler para cerrar el popup de crear cliente
    const handleClienteCreado = () => {
        setMostrarPopupCrearCliente(false);
        // Aquí se debería refrescar la lista de clientes, pero como viene de props,
        // el componente padre debería manejar esto
        // Por ahora solo cerramos el popup
    };

    // Enviar formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.id_cliente) {
            alert('Seleccione un cliente');
            return;
        }

        if (productosSeleccionados.length === 0) {
            alert('Debe agregar al menos un producto');
            return;
        }

        const result = await crearOperacion(
            {
                id_cliente: parseInt(formData.id_cliente),
                estado_operacion: formData.estado_operacion,
                descripcion_operacion: formData.descripcion_operacion || null,
                cantidad_abono: parseFloat(formData.cantidad_abono) || 0,
                fecha_entrega_estimada: formData.fecha_entrega_estimada || null
            },
            productosSeleccionados.map(prod => ({
                id_producto: prod.id_producto,
                cantidad: prod.cantidad,
                precio_unitario: prod.precio_unitario,
                especificaciones: prod.especificaciones || null
            }))
        );

        if (result.success) {
            setTimeout(() => {
                onSuccess(result.data);
                handleClose();
            }, 1500);
        }
    };

    const handleClose = () => {
        setFormData({
            id_cliente: '',
            estado_operacion: 'pendiente',
            descripcion_operacion: '',
            cantidad_abono: 0,
            fecha_entrega_estimada: ''
        });
        setProductosSeleccionados([]);
        setProductoActual({
            id_producto: '',
            cantidad: 1,
            precio_unitario: '',
            especificaciones: ''
        });
        setDiasHabiles(30);
        setBusquedaCliente('');
        setBusquedaProducto('');
        reset();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-stone-600 to-stone-700 px-6 py-5 flex justify-between items-center flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                            <FaShoppingCart className="text-white text-xl" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Crear Operación</h2>
                            <p className="text-stone-200 text-sm">Nueva operación con productos</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                    >
                        <FaTimes className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Datos de Operación */}
                        <div className="bg-stone-50 rounded-lg p-5">
                            <h3 className="text-lg font-bold text-stone-800 mb-4">Datos de la Operación</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Cliente con búsqueda */}
                                <div className="md:col-span-2">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-stone-700">
                                            Cliente *
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setMostrarPopupCrearCliente(true)}
                                            className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1.5"
                                        >
                                            <FaUserPlus />
                                            Nuevo Cliente
                                        </button>
                                    </div>

                                    {/* Buscador de cliente */}
                                    <div className="relative mb-2">
                                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 text-sm" />
                                        <input
                                            type="text"
                                            placeholder="Buscar cliente por nombre, email o RUT..."
                                            value={busquedaCliente}
                                            onChange={(e) => setBusquedaCliente(e.target.value)}
                                            className="w-full pl-10 pr-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent text-sm"
                                        />
                                    </div>

                                    <select
                                        name="id_cliente"
                                        value={formData.id_cliente}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                                    >
                                        <option value="">Seleccione un cliente</option>
                                        {clientesFiltrados.map(cliente => (
                                            <option key={cliente.id} value={cliente.id}>
                                                {cliente.nombreCompleto} - {cliente.rut}
                                            </option>
                                        ))}
                                    </select>
                                    {busquedaCliente && clientesFiltrados.length === 0 && (
                                        <p className="text-xs text-red-600 mt-1">
                                            No se encontraron clientes. Puede crear uno nuevo con el botón "+ Nuevo Cliente"
                                        </p>
                                    )}
                                    {busquedaCliente && clientesFiltrados.length > 0 && (
                                        <p className="text-xs text-stone-500 mt-1">
                                            Mostrando {clientesFiltrados.length} de {clientes.length} clientes
                                        </p>
                                    )}
                                </div>

                                {/* Estado */}
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">
                                        Estado *
                                    </label>
                                    <select
                                        name="estado_operacion"
                                        value={formData.estado_operacion}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                                    >
                                        <option value="cotizacion">Cotización</option>
                                        <option value="orden_trabajo">Orden de Trabajo</option>
                                        <option value="pendiente">Pendiente</option>
                                        <option value="en_proceso">En Proceso</option>
                                    </select>
                                </div>

                                {/* Abono Inicial */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-stone-700 mb-1">
                                        Abono Inicial
                                    </label>
                                    <input
                                        type="number"
                                        name="cantidad_abono"
                                        value={formData.cantidad_abono}
                                        onChange={handleChange}
                                        min="0"
                                        step="1"
                                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                                        placeholder="0"
                                    />
                                    {formData.cantidad_abono > 0 && (
                                        <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                                            <FaCalendarAlt />
                                            Orden de Trabajo - Configure la fecha de entrega abajo
                                        </p>
                                    )}
                                </div>

                                {/* Descripción */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-stone-700 mb-1">
                                        Descripción
                                    </label>
                                    <textarea
                                        name="descripcion_operacion"
                                        value={formData.descripcion_operacion}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                                        placeholder="Descripción de la operación..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Fecha de Entrega - Solo si hay abono */}
                        {formData.cantidad_abono > 0 && (
                            <div className="bg-purple-50 rounded-lg p-5 border-2 border-purple-200">
                                <h3 className="text-lg font-bold text-purple-800 mb-4 flex items-center gap-2">
                                    <FaCalendarAlt />
                                    Fecha de Entrega Estimada (Orden de Trabajo)
                                </h3>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-stone-700 mb-3">
                                        Seleccione el plazo de entrega en días hábiles:
                                    </label>

                                    {/* Opciones predefinidas */}
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                                        {[5, 15, 30, 40, 60].map((dias) => (
                                            <button
                                                key={dias}
                                                type="button"
                                                onClick={() => setDiasHabiles(dias)}
                                                className={`px-4 py-3 rounded-lg border-2 transition-all font-medium ${
                                                    diasHabiles === dias
                                                        ? 'bg-purple-600 text-white border-purple-600 shadow-lg'
                                                        : 'bg-white text-stone-700 border-stone-300 hover:border-purple-400 hover:bg-purple-50'
                                                }`}
                                            >
                                                {dias} días
                                            </button>
                                        ))}
                                    </div>

                                    {/* Opción personalizada */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-stone-600 mb-2">
                                                O ingrese días hábiles personalizados:
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="365"
                                                value={diasHabiles}
                                                onChange={(e) => setDiasHabiles(parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                placeholder="Ej: 25"
                                            />
                                        </div>

                                        {/* Vista previa de la fecha */}
                                        {diasHabiles > 0 && (
                                            <div className="p-4 bg-white border-2 border-purple-300 rounded-lg">
                                                <p className="text-xs text-purple-700 font-medium mb-1">
                                                    Fecha de entrega estimada:
                                                </p>
                                                <p className="text-base font-bold text-purple-900">
                                                    {calcularFechaEntrega(diasHabiles).toLocaleDateString('es-CL', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                                <p className="text-xs text-purple-600 mt-1">
                                                    ({diasHabiles} días hábiles)
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Agregar Productos */}
                        <div className="bg-blue-50 rounded-lg p-5">
                            <h3 className="text-lg font-bold text-stone-800 mb-4">Agregar Productos</h3>

                            {/* Buscador de productos */}
                            <div className="relative mb-3">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 text-sm" />
                                <input
                                    type="text"
                                    placeholder="Buscar producto por nombre..."
                                    value={busquedaProducto}
                                    onChange={(e) => setBusquedaProducto(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                                />
                            </div>
                            {busquedaProducto && productosFiltrados.length > 0 && (
                                <p className="text-xs text-stone-500 mb-3">
                                    Mostrando {productosFiltrados.length} de {productos.length} productos
                                </p>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                                <div className="md:col-span-2">
                                    <select
                                        name="id_producto"
                                        value={productoActual.id_producto}
                                        onChange={handleProductoChange}
                                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Seleccione producto</option>
                                        {productosFiltrados.map(prod => (
                                            <option key={prod.id_producto} value={prod.id_producto}>
                                                {prod.nombre_producto} - ${prod.precio_venta?.toLocaleString()}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <input
                                        type="number"
                                        name="cantidad"
                                        value={productoActual.cantidad}
                                        onChange={handleProductoChange}
                                        min="1"
                                        placeholder="Cant."
                                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <input
                                        type="number"
                                        name="precio_unitario"
                                        value={productoActual.precio_unitario}
                                        onChange={handleProductoChange}
                                        min="0"
                                        placeholder="Precio"
                                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <button
                                        type="button"
                                        onClick={handleAgregarProducto}
                                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FaPlus /> Agregar
                                    </button>
                                </div>
                            </div>

                            {productoActual.id_producto && (
                                <div className="mt-3">
                                    <input
                                        type="text"
                                        name="especificaciones"
                                        value={productoActual.especificaciones}
                                        onChange={handleProductoChange}
                                        placeholder="Especificaciones opcionales..."
                                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Lista de Productos */}
                        {productosSeleccionados.length > 0 && (
                            <div className="bg-green-50 rounded-lg p-5">
                                <h3 className="text-lg font-bold text-stone-800 mb-4">
                                    Productos Agregados ({productosSeleccionados.length})
                                </h3>
                                <div className="space-y-2">
                                    {productosSeleccionados.map((prod, index) => (
                                        <div key={index} className="bg-white rounded-lg p-3 flex items-center justify-between">
                                            <div className="flex-1">
                                                <p className="font-semibold text-stone-800">{prod.nombre_producto}</p>
                                                <p className="text-sm text-stone-600">
                                                    Cantidad: {prod.cantidad} × ${prod.precio_unitario.toLocaleString()} =
                                                    <span className="font-bold text-green-600 ml-1">
                                                        ${(prod.cantidad * prod.precio_unitario).toLocaleString()}
                                                    </span>
                                                </p>
                                                {prod.especificaciones && (
                                                    <p className="text-xs text-stone-500 italic">{prod.especificaciones}</p>
                                                )}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleEliminarProducto(index)}
                                                className="ml-3 p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Totales */}
                                <div className="mt-4 pt-4 border-t border-green-200 space-y-2">
                                    <div className="flex justify-between text-lg">
                                        <span className="font-semibold">Costo Total:</span>
                                        <span className="font-bold text-green-600">${costoTotal.toLocaleString()}</span>
                                    </div>
                                    {formData.cantidad_abono > 0 && (
                                        <>
                                            <div className="flex justify-between text-sm">
                                                <span>Abono Inicial:</span>
                                                <span className="text-blue-600">-${parseFloat(formData.cantidad_abono).toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between text-lg font-bold">
                                                <span>Saldo Pendiente:</span>
                                                <span className="text-red-600">${saldoPendiente.toLocaleString()}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Mensajes */}
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                                <p className="text-red-800">{error}</p>
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
                                <p className="text-green-800">✅ Operación creada exitosamente</p>
                            </div>
                        )}
                    </form>
                </div>

                {/* Footer */}
                <div className="bg-stone-50 px-6 py-4 flex justify-end gap-3 flex-shrink-0 border-t border-stone-200">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={loading}
                        className="px-6 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-100 transition-colors disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={loading || productosSeleccionados.length === 0}
                        className="px-6 py-2 bg-stone-600 text-white rounded-lg hover:bg-stone-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creando...' : 'Crear Operación'}
                    </button>
                </div>
            </div>

            {/* PopUp: Crear Cliente */}
            <PopUpCrearCliente
                isOpen={mostrarPopupCrearCliente}
                onClose={() => setMostrarPopupCrearCliente(false)}
                onSuccess={handleClienteCreado}
            />
        </div>
    );
};

export default CrearOperacionModal;
