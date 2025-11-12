import { useState, useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { FaTimes, FaPlus, FaTrash, FaShoppingCart, FaCalendarAlt, FaSearch, FaUserPlus } from 'react-icons/fa';
import { useCrearOperacion } from '@hooks/papeles/useCrearOperacion';
import PopUpCrearCliente from '@components/popup/trabajadorTienda/cliente/popUpCrearCliente';
import Swal from 'sweetalert2';

const CrearOperacionModal = ({ isOpen, onClose, onSuccess, clientes = [], productos = [], onClienteCreado }) => {
    // React Hook Form
    const { control, handleSubmit: handleFormSubmit, watch, setValue, reset: resetForm, formState: { errors } } = useForm({
        defaultValues: {
            id_cliente: '',
            estado_operacion: 'pendiente',
            descripcion_operacion: '',
            cantidad_abono: 0,
            fecha_entrega_estimada: ''
        }
    });

    // Observar valores del formulario
    const formData = {
        id_cliente: watch('id_cliente'),
        estado_operacion: watch('estado_operacion'),
        descripcion_operacion: watch('descripcion_operacion'),
        cantidad_abono: watch('cantidad_abono'),
        fecha_entrega_estimada: watch('fecha_entrega_estimada')
    };

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
            setValue('fecha_entrega_estimada', fechaCalculada.toISOString().split('T')[0]);
        } else {
            setValue('fecha_entrega_estimada', '');
        }
    }, [diasHabiles, formData.cantidad_abono, setValue]);

    // Resetear abono cuando es cotización
    useEffect(() => {
        if (formData.estado_operacion === 'cotizacion') {
            setValue('cantidad_abono', 0);
        }
    }, [formData.estado_operacion, setValue]);

    // Mostrar error con SweetAlert2
    useEffect(() => {
        if (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error al crear operación',
                text: error,
                confirmButtonColor: '#57534e'
            });
        }
    }, [error]);

    // Agregar producto a la lista
    const handleAgregarProducto = () => {
        if (!productoActual.id_producto) {
            Swal.fire({
                icon: 'warning',
                title: 'Producto requerido',
                text: 'Por favor seleccione un producto',
                confirmButtonColor: '#57534e'
            });
            return;
        }

        if (productoActual.cantidad <= 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Cantidad inválida',
                text: 'La cantidad debe ser mayor a 0',
                confirmButtonColor: '#57534e'
            });
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
        setBusquedaProducto('');
    };

    // Eliminar producto de la lista
    const handleEliminarProducto = (index) => {
        setProductosSeleccionados(productosSeleccionados.filter((_, i) => i !== index));
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
        // Llamar al callback para recargar la lista de clientes
        if (onClienteCreado) {
            onClienteCreado();
        }
    };

    // Enviar formulario
    const onSubmit = async (data) => {
        if (productosSeleccionados.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Sin productos',
                text: 'Debe agregar al menos un producto a la operación',
                confirmButtonColor: '#57534e'
            });
            return;
        }

        const result = await crearOperacion(
            {
                id_cliente: parseInt(data.id_cliente),
                estado_operacion: data.estado_operacion,
                descripcion_operacion: data.descripcion_operacion || null,
                cantidad_abono: parseFloat(data.cantidad_abono) || 0,
                fecha_entrega_estimada: data.fecha_entrega_estimada || null
            },
            productosSeleccionados.map(prod => ({
                id_producto: prod.id_producto,
                cantidad: prod.cantidad,
                precio_unitario: prod.precio_unitario,
                especificaciones: prod.especificaciones || null
            }))
        );

        if (result.success) {
            Swal.fire({
                icon: 'success',
                title: '¡Operación creada!',
                text: 'La operación se ha registrado exitosamente',
                confirmButtonColor: '#57534e',
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                onSuccess(result.data);
                handleClose();
            });
        }
    };

    const handleClose = () => {
        resetForm();
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 mt-12">
            <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[85vh] overflow-hidden flex flex-col">
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
                    <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-6">
                        {/* Datos de Operación */}
                        <div className="bg-stone-50 rounded-lg p-6 border border-stone-200">
                            <h3 className="text-lg font-bold text-stone-800 mb-5 flex items-center gap-2">
                                <FaShoppingCart className="text-stone-600" />
                                Datos de la Operación
                            </h3>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Columna 1: Cliente */}
                                <div className="lg:col-span-2">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-stone-700">
                                            Cliente *
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setMostrarPopupCrearCliente(true)}
                                            className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1.5 font-medium"
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
                                            className="w-full pl-10 pr-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent text-sm bg-white"
                                        />
                                    </div>

                                    <Controller
                                        name="id_cliente"
                                        control={control}
                                        rules={{ required: 'Debe seleccionar un cliente' }}
                                        render={({ field }) => (
                                            <>
                                                <select
                                                    {...field}
                                                    className={`w-full px-3 py-2 border ${errors.id_cliente ? 'border-red-500 bg-red-50' : 'border-stone-300'} 
                                                        rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent bg-white mt-7.5`}
                                                >
                                                    <option value="">Seleccione un cliente</option>
                                                    {clientesFiltrados.map(cliente => (
                                                        <option key={cliente.id} value={cliente.id}>
                                                            {cliente.nombreCompleto} - {cliente.rut}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.id_cliente && (
                                                    <p className="mt-1 text-red-600 text-xs flex items-center gap-1">
                                                        <span>⚠️</span> {errors.id_cliente.message}
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    />
                                    
                                    {busquedaCliente && clientesFiltrados.length === 0 && (
                                        <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                                            <span>⚠️</span>
                                            No se encontraron clientes. Puede crear uno nuevo con el botón "+ Nuevo Cliente"
                                        </p>
                                    )}
                                    {busquedaCliente && clientesFiltrados.length > 0 && (
                                        <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
                                            <span>✓</span>
                                            Mostrando {clientesFiltrados.length} de {clientes.length} clientes
                                        </p>
                                    )}
                                </div>

                                {/* Columna 2: Estado y Abono */}
                                <div className="space-y-4">
                                    {/* Estado */}
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-2">
                                            Estado *
                                        </label>
                                        <Controller
                                            name="estado_operacion"
                                            control={control}
                                            render={({ field }) => (
                                                <select
                                                    {...field}
                                                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent bg-white"
                                                >
                                                    <option value="cotizacion">Cotización</option>
                                                    <option value="orden_trabajo">Orden de Trabajo</option>
                                                    <option value="pendiente">Pendiente</option>
                                                    <option value="en_proceso">En Proceso</option>
                                                </select>
                                            )}
                                        />
                                    </div>

                                    {/* Abono Inicial */}
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-2">
                                            Abono Inicial
                                            {formData.estado_operacion === 'cotizacion' && (
                                                <span className="text-xs text-orange-600 ml-2">(No disponible en cotización)</span>
                                            )}
                                        </label>
                                        <Controller
                                            name="cantidad_abono"
                                            control={control}
                                            rules={{ 
                                                min: { value: 0, message: 'El abono no puede ser negativo' }
                                            }}
                                            render={({ field }) => (
                                                <>
                                                    <input
                                                        {...field}
                                                        type="number"
                                                        min="0"
                                                        step="1"
                                                        disabled={formData.estado_operacion === 'cotizacion'}
                                                        className={`w-full px-3 py-2 border ${errors.cantidad_abono ? 'border-red-500 bg-red-50' : 'border-stone-300'} rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent ${
                                                            formData.estado_operacion === 'cotizacion' 
                                                                ? 'bg-gray-100 cursor-not-allowed opacity-60' 
                                                                : 'bg-white'
                                                        }`}
                                                        placeholder="$0"
                                                    />
                                                    {errors.cantidad_abono && (
                                                        <p className="mt-1 text-red-600 text-xs flex items-center gap-1">
                                                            <span>⚠️</span> {errors.cantidad_abono.message}
                                                        </p>
                                                    )}
                                                </>
                                            )}
                                        />
                                        {formData.cantidad_abono > 0 && formData.estado_operacion !== 'cotizacion' && (
                                            <p className="text-xs text-blue-600 mt-1.5 flex items-center gap-1 font-medium">
                                                <FaCalendarAlt />
                                                Orden de Trabajo
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Descripción - Full width */}
                                <div className="lg:col-span-3">
                                    <label className="block text-sm font-medium text-stone-700 mb-2">
                                        Descripción
                                    </label>
                                    <Controller
                                        name="descripcion_operacion"
                                        control={control}
                                        rules={{ maxLength: { value: 500, message: 'Máximo 500 caracteres' } }}
                                        render={({ field }) => (
                                            <>
                                                <textarea
                                                    {...field}
                                                    rows="2"
                                                    className={`w-full px-3 py-2 border ${errors.descripcion_operacion ? 'border-red-500 bg-red-50' : 'border-stone-300'} rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent resize-none bg-white`}
                                                    placeholder="Descripción de la operación..."
                                                />
                                                {errors.descripcion_operacion && (
                                                    <p className="mt-1 text-red-600 text-xs flex items-center gap-1">
                                                        <span>⚠️</span> {errors.descripcion_operacion.message}
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Fecha de Entrega - Solo si hay abono */}
                        {formData.cantidad_abono > 0 && (
                            <div className="bg-gradient-to-br from-stone-50 to-stone-100 rounded-lg p-6 border-2 border-stone-200 shadow-sm">
                                <h3 className="text-lg font-bold text-stone-800 mb-5 flex items-center gap-2">
                                    <FaCalendarAlt />
                                    Fecha de Entrega Estimada
                                </h3>

                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-stone-700">
                                        Seleccione el plazo de entrega en días hábiles:
                                    </label>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Columna izquierda: Opciones */}
                                        <div className="space-y-4">
                                            {/* Opciones predefinidas */}
                                            <div className="grid grid-cols-3 gap-2">
                                                {[5, 15, 30, 40, 60].map((dias) => (
                                                    <button
                                                        key={dias}
                                                        type="button"
                                                        onClick={() => setDiasHabiles(dias)}
                                                        className={`px-3 py-2.5 rounded-lg border-2 transition-all font-semibold text-sm ${
                                                            diasHabiles === dias
                                                                ? 'bg-stone-700 text-white border-stone-700 shadow-md transform scale-105'
                                                                : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400 hover:bg-stone-50'
                                                        }`}
                                                    >
                                                        {dias} días
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Opción personalizada */}
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
                                                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent bg-white font-medium"
                                                    placeholder="Ej: 25"
                                                />
                                            </div>
                                        </div>

                                        {/* Columna derecha: Vista previa */}
                                        {diasHabiles > 0 && (
                                            <div className="p-5 bg-white border-2 border-stone-300 rounded-lg shadow-sm flex flex-col justify-center">
                                                <p className="text-xs text-stone-700 font-semibold mb-2 uppercase tracking-wide">
                                                    Fecha de entrega estimada:
                                                </p>
                                                <p className="text-xl font-bold text-stone-900 mb-2">
                                                    {calcularFechaEntrega(diasHabiles).toLocaleDateString('es-CL', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                                <p className="text-xs text-stone-600 flex items-center gap-1">
                                                    <span className="inline-block w-2 h-2 bg-stone-700 rounded-full"></span>
                                                    {diasHabiles} días hábiles desde hoy
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Agregar Productos */}
                        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                            <h3 className="text-lg font-bold text-stone-800 mb-5 flex items-center gap-2">
                                <FaPlus className="text-blue-600" />
                                Agregar Productos
                            </h3>

                            {/* Buscador de productos */}
                            <div className="relative mb-4">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar producto por nombre..."
                                    value={busquedaProducto}
                                    onChange={(e) => setBusquedaProducto(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                                />
                            </div>
                            {busquedaProducto && productosFiltrados.length > 0 && (
                                <p className="text-xs text-green-600 mb-4 flex items-center gap-1">
                                    <span>✓</span>
                                    Mostrando {productosFiltrados.length} de {productos.length} productos
                                </p>
                            )}

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
                                {/* Producto */}
                                <div className="lg:col-span-5">
                                    <label className="block text-xs font-medium text-stone-700 mb-1">Producto *</label>
                                    <select
                                        name="id_producto"
                                        value={productoActual.id_producto}
                                        onChange={handleProductoChange}
                                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                                    >
                                        <option value="">Seleccione producto</option>
                                        {productosFiltrados.map(prod => (
                                            <option key={prod.id_producto} value={prod.id_producto}>
                                                {prod.nombre_producto} - ${prod.precio_venta?.toLocaleString()}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Cantidad */}
                                <div className="lg:col-span-2">
                                    <label className="block text-xs font-medium text-stone-700 mb-1">Cantidad</label>
                                    <input
                                        type="number"
                                        name="cantidad"
                                        value={productoActual.cantidad}
                                        onChange={handleProductoChange}
                                        min="1"
                                        placeholder="1"
                                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                                    />
                                </div>

                                {/* Precio */}
                                <div className="lg:col-span-3">
                                    <label className="block text-xs font-medium text-stone-700 mb-1">Precio Unit.</label>
                                    <input
                                        type="number"
                                        name="precio_unitario"
                                        value={productoActual.precio_unitario}
                                        onChange={handleProductoChange}
                                        min="0"
                                        placeholder="$0"
                                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                                    />
                                </div>

                                {/* Botón Agregar */}
                                <div className="lg:col-span-2 lg:mt-6">
                                    <button
                                        type="button"
                                        onClick={handleAgregarProducto}
                                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
                                    >
                                        <FaPlus /> Agregar
                                    </button>
                                </div>
                            </div>

                            {/* Especificaciones */}
                            {productoActual.id_producto && (
                                <div className="mt-4">
                                    <label className="block text-xs font-medium text-stone-700 mb-1">Especificaciones (opcional)</label>
                                    <input
                                        type="text"
                                        name="especificaciones"
                                        value={productoActual.especificaciones}
                                        onChange={handleProductoChange}
                                        placeholder="Ej: Color rojo, medidas especiales..."
                                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
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
                        onClick={handleFormSubmit(onSubmit)}
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