// frontend/src/pages/trabajador-tienda/Papeles.jsx
import { useState, useMemo, useEffect } from 'react';
import { useGetClientesConCompras } from '@hooks/papeles/useGetClientesConCompras';
import { useGetClienteConComprasById } from '@hooks/papeles/useGetClienteConComprasById';
import { getProductos } from '@services/producto.service';
import { updateEstadoOperacion, updateOperacion, EstadosOperacion, getEstadoLabel, getEstadoColor } from '@services/operacion.service';
import CrearOperacionModal from '@components/operaciones/CrearOperacionModal';
import { FaEye, FaUser, FaFileInvoiceDollar, FaChartLine, FaSearch, FaTimes, FaFilter, FaPlus, FaHistory, FaMoneyBillWave, FaPrint, FaFileAlt, FaCheckCircle, FaTimesCircle, FaShoppingCart, FaSyncAlt, FaHourglassHalf, FaBox } from 'react-icons/fa';

const Papeles = () => {
    const [selectedClienteId, setSelectedClienteId] = useState(null);

    // Estados para filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [filterOperaciones, setFilterOperaciones] = useState('all'); // all, 0, 1, 2+
    const [filterDeuda, setFilterDeuda] = useState('all'); // all, con_deuda, sin_deuda
    const [sortBy, setSortBy] = useState('nombre'); // nombre, operaciones, gastado, pendiente
    const [sortOrder, setSortOrder] = useState('asc'); // asc, desc
    const [showFilters, setShowFilters] = useState(false);

    // Estados para modal de crear operación
    const [showCrearModal, setShowCrearModal] = useState(false);
    const [productos, setProductos] = useState([]);

    // Estados para cambio de estado de operaciones
    const [cambiandoEstado, setCambiandoEstado] = useState({});
    const [mensajeEstado, setMensajeEstado] = useState({ tipo: null, texto: null });

    // Estados para abonos
    const [mostrarAbonoModal, setMostrarAbonoModal] = useState({});
    const [montoAbono, setMontoAbono] = useState({});
    const [procesandoAbono, setProcesandoAbono] = useState({});

    // Estados para historial desplegable
    const [historialAbierto, setHistorialAbierto] = useState({});

    // Estados para modal de fecha de entrega
    const [mostrarModalFechaEntrega, setMostrarModalFechaEntrega] = useState({});
    const [diasHabilesSeleccionados, setDiasHabilesSeleccionados] = useState({});
    const [operacionParaOrden, setOperacionParaOrden] = useState(null);
    const [clienteParaOrden, setClienteParaOrden] = useState(null);
    
    const { 
        clientes, 
        estadisticas, 
        loading: loadingClientes, 
        error: errorClientes, 
        fetchClientes 
    } = useGetClientesConCompras(true);

    const {
        cliente,
        loading: loadingCliente,
        fetchCliente,
        reset: resetCliente
    } = useGetClienteConComprasById();

    // Cargar productos activos
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await getProductos({ activo: true });
                if (response.status === 'Success' && response.data) {
                    setProductos(response.data);
                }
            } catch (error) {
                console.error('Error al cargar productos:', error);
            }
        };
        fetchProductos();
    }, []);

    // Filtrar y ordenar clientes
    const clientesFiltrados = useMemo(() => {
        let resultado = [...clientes];

        // Filtro de búsqueda
        if (searchTerm.trim() !== '') {
            const search = searchTerm.toLowerCase();
            resultado = resultado.filter(cliente => 
                cliente.nombreCompleto.toLowerCase().includes(search) ||
                cliente.email.toLowerCase().includes(search) ||
                cliente.rut.toLowerCase().includes(search)
            );
        }

        // Filtro de operaciones
        if (filterOperaciones !== 'all') {
            if (filterOperaciones === '0') {
                resultado = resultado.filter(c => c.resumen_compras.total_operaciones === 0);
            } else if (filterOperaciones === '1') {
                resultado = resultado.filter(c => c.resumen_compras.total_operaciones === 1);
            } else if (filterOperaciones === '2+') {
                resultado = resultado.filter(c => c.resumen_compras.total_operaciones >= 2);
            }
        }

        // Filtro de deuda
        if (filterDeuda !== 'all') {
            if (filterDeuda === 'con_deuda') {
                resultado = resultado.filter(c => c.resumen_compras.total_pendiente > 0);
            } else if (filterDeuda === 'sin_deuda') {
                resultado = resultado.filter(c => c.resumen_compras.total_pendiente === 0);
            }
        }

        // Ordenamiento
        resultado.sort((a, b) => {
            let compareA, compareB;

            switch (sortBy) {
                case 'nombre':
                    compareA = a.nombreCompleto.toLowerCase();
                    compareB = b.nombreCompleto.toLowerCase();
                    break;
                case 'operaciones':
                    compareA = a.resumen_compras.total_operaciones;
                    compareB = b.resumen_compras.total_operaciones;
                    break;
                case 'gastado':
                    compareA = a.resumen_compras.total_gastado;
                    compareB = b.resumen_compras.total_gastado;
                    break;
                case 'pendiente':
                    compareA = a.resumen_compras.total_pendiente;
                    compareB = b.resumen_compras.total_pendiente;
                    break;
                default:
                    compareA = a.nombreCompleto.toLowerCase();
                    compareB = b.nombreCompleto.toLowerCase();
            }

            if (sortOrder === 'asc') {
                return compareA > compareB ? 1 : compareA < compareB ? -1 : 0;
            } else {
                return compareA < compareB ? 1 : compareA > compareB ? -1 : 0;
            }
        });

        return resultado;
    }, [clientes, searchTerm, filterOperaciones, filterDeuda, sortBy, sortOrder]);

    // Limpiar todos los filtros
    const limpiarFiltros = () => {
        setSearchTerm('');
        setFilterOperaciones('all');
        setFilterDeuda('all');
        setSortBy('nombre');
        setSortOrder('asc');
    };

    // Verificar si hay filtros activos
    const hayFiltrosActivos = searchTerm !== '' || filterOperaciones !== 'all' || filterDeuda !== 'all' || sortBy !== 'nombre' || sortOrder !== 'asc';

    const handleVerDetalles = async (id_cliente) => {
        setSelectedClienteId(id_cliente);
        await fetchCliente(id_cliente);
    };

    const handleCloseModal = () => {
        setSelectedClienteId(null);
        resetCliente();
    };

    const handleOperacionCreada = (nuevaOperacion) => {
        fetchClientes(); // Refrescar lista de clientes
        setShowCrearModal(false);
    };

    const handleCambiarEstado = async (idOperacion, nuevoEstado, compra) => {
        // Validación para estado "pagada"
        if (nuevoEstado === EstadosOperacion.PAGADA) {
            const saldoPendiente = parseFloat(compra.saldo_pendiente || 0);
            const costoOperacion = parseFloat(compra.costo_operacion || 0);
            const cantidadAbono = parseFloat(compra.cantidad_abono || 0);

            // El saldo pendiente debe ser exactamente 0 y el abono debe ser igual al costo total
            if (saldoPendiente !== 0 || cantidadAbono !== costoOperacion) {
                setMensajeEstado({
                    tipo: 'error',
                    texto: `No se puede marcar como "Pagada". El saldo pendiente debe ser $0 y el monto abonado debe ser igual al total de la operación. Actual: Abonado ${formatCurrency(cantidadAbono)} de ${formatCurrency(costoOperacion)}, Pendiente: ${formatCurrency(saldoPendiente)}`
                });

                // Limpiar mensaje después de 5 segundos
                setTimeout(() => {
                    setMensajeEstado({ tipo: null, texto: null });
                }, 5000);

                return; // No continuar con el cambio de estado
            }
        }

        setCambiandoEstado(prev => ({ ...prev, [idOperacion]: true }));
        setMensajeEstado({ tipo: null, texto: null });

        try {
            const response = await updateEstadoOperacion(idOperacion, nuevoEstado);

            if (response.status === 'Success') {
                setMensajeEstado({
                    tipo: 'success',
                    texto: `Estado actualizado a "${getEstadoLabel(nuevoEstado)}" exitosamente`
                });

                // Refrescar datos del cliente
                if (selectedClienteId) {
                    await fetchCliente(selectedClienteId);
                }
                await fetchClientes();

                // Limpiar mensaje después de 3 segundos
                setTimeout(() => {
                    setMensajeEstado({ tipo: null, texto: null });
                }, 3000);
            } else {
                setMensajeEstado({
                    tipo: 'error',
                    texto: response.message || 'Error al actualizar el estado'
                });
            }
        } catch (error) {
            console.error('Error al cambiar estado:', error);
            setMensajeEstado({
                tipo: 'error',
                texto: 'Error de conexión al cambiar el estado'
            });
        } finally {
            setCambiandoEstado(prev => ({ ...prev, [idOperacion]: false }));
        }
    };

    const handleMostrarAbono = (idOperacion, saldoPendiente) => {
        setMostrarAbonoModal(prev => ({ ...prev, [idOperacion]: true }));
        // Sugerir el saldo pendiente como monto inicial
        setMontoAbono(prev => ({ ...prev, [idOperacion]: saldoPendiente }));
    };

    const handleCancelarAbono = (idOperacion) => {
        setMostrarAbonoModal(prev => ({ ...prev, [idOperacion]: false }));
        setMontoAbono(prev => ({ ...prev, [idOperacion]: 0 }));
    };

    const handleRealizarAbono = async (idOperacion, compra) => {
        const monto = parseFloat(montoAbono[idOperacion] || 0);
        const abonoActual = parseFloat(compra.cantidad_abono || 0);
        const costoTotal = parseFloat(compra.costo_operacion || 0);

        // Validaciones
        if (monto <= 0) {
            setMensajeEstado({
                tipo: 'error',
                texto: 'El monto del abono debe ser mayor a $0'
            });
            setTimeout(() => setMensajeEstado({ tipo: null, texto: null }), 3000);
            return;
        }

        const nuevoAbono = abonoActual + monto;

        if (nuevoAbono > costoTotal) {
            setMensajeEstado({
                tipo: 'error',
                texto: `El abono total no puede exceder el costo de la operación. Máximo permitido: ${formatCurrency(costoTotal - abonoActual)}`
            });
            setTimeout(() => setMensajeEstado({ tipo: null, texto: null }), 5000);
            return;
        }

        setProcesandoAbono(prev => ({ ...prev, [idOperacion]: true }));
        setMensajeEstado({ tipo: null, texto: null });

        try {
            const response = await updateOperacion(idOperacion, {
                cantidad_abono: nuevoAbono
            });

            if (response.status === 'Success') {
                setMensajeEstado({
                    tipo: 'success',
                    texto: `Abono de ${formatCurrency(monto)} realizado exitosamente. Nuevo total abonado: ${formatCurrency(nuevoAbono)}`
                });

                // Refrescar datos
                if (selectedClienteId) {
                    await fetchCliente(selectedClienteId);
                }
                await fetchClientes();

                // Cerrar modal de abono
                handleCancelarAbono(idOperacion);

                // Limpiar mensaje después de 3 segundos
                setTimeout(() => {
                    setMensajeEstado({ tipo: null, texto: null });
                }, 3000);
            } else {
                setMensajeEstado({
                    tipo: 'error',
                    texto: response.message || 'Error al realizar el abono'
                });
            }
        } catch (error) {
            console.error('Error al realizar abono:', error);
            setMensajeEstado({
                tipo: 'error',
                texto: 'Error de conexión al realizar el abono'
            });
        } finally {
            setProcesandoAbono(prev => ({ ...prev, [idOperacion]: false }));
        }
    };

    // Calcular fecha de entrega sumando días hábiles (excluyendo sábados y domingos)
    const calcularFechaEntrega = (diasHabiles) => {
        const fecha = new Date();
        let diasAgregados = 0;

        while (diasAgregados < diasHabiles) {
            fecha.setDate(fecha.getDate() + 1);
            const diaSemana = fecha.getDay();
            // 0 = Domingo, 6 = Sábado
            if (diaSemana !== 0 && diaSemana !== 6) {
                diasAgregados++;
            }
        }

        return fecha;
    };

    const handleMostrarModalFechaEntrega = (operacion, cliente) => {
        setOperacionParaOrden(operacion);
        setClienteParaOrden(cliente);
        setMostrarModalFechaEntrega(prev => ({ ...prev, [operacion.id_operacion]: true }));
        // Valor por defecto: 30 días hábiles
        setDiasHabilesSeleccionados(prev => ({ ...prev, [operacion.id_operacion]: 30 }));
    };

    const handleCancelarModalFechaEntrega = (idOperacion) => {
        setMostrarModalFechaEntrega(prev => ({ ...prev, [idOperacion]: false }));
        setDiasHabilesSeleccionados(prev => ({ ...prev, [idOperacion]: 30 }));
        setOperacionParaOrden(null);
        setClienteParaOrden(null);
    };

    const handleGenerarOrdenConFecha = async (operacion, cliente) => {
        const diasHabiles = parseInt(diasHabilesSeleccionados[operacion.id_operacion] || 30);
        const fechaEntrega = calcularFechaEntrega(diasHabiles);

        // Actualizar la operación con la fecha de entrega estimada Y cambiar estado a orden_trabajo
        try {
            // 1. Actualizar fecha de entrega
            await updateOperacion(operacion.id_operacion, {
                fecha_entrega_estimada: fechaEntrega.toISOString()
            });

            // 2. Cambiar estado a "orden_trabajo" (esto registrará fecha_primer_abono en backend)
            await updateEstadoOperacion(operacion.id_operacion, EstadosOperacion.ORDEN_TRABAJO);

            // 3. Refrescar datos
            if (selectedClienteId) {
                await fetchCliente(selectedClienteId);
            }
            await fetchClientes();

            // 4. Crear objeto operacion actualizado con la nueva fecha y estado
            const operacionActualizada = {
                ...operacion,
                fecha_entrega_estimada: fechaEntrega.toISOString(),
                estado_operacion: EstadosOperacion.ORDEN_TRABAJO
            };

            // 5. Generar el documento con la fecha actualizada
            generarDocumento(operacionActualizada, cliente, 'orden_trabajo');

            // 6. Cerrar modal
            handleCancelarModalFechaEntrega(operacion.id_operacion);

            // 7. Mostrar mensaje de éxito
            setMensajeEstado({
                tipo: 'success',
                texto: 'Orden de trabajo generada exitosamente. Primer abono registrado.'
            });
            setTimeout(() => setMensajeEstado({ tipo: null, texto: null }), 3000);

        } catch (error) {
            console.error('Error al generar orden de trabajo:', error);
            setMensajeEstado({
                tipo: 'error',
                texto: 'Error al generar la orden de trabajo'
            });
        }
    };

    const generarDocumento = (operacion, cliente, tipo = 'cotizacion') => {
        const titulo = tipo === 'cotizacion' ? 'COTIZACIÓN' : 'ORDEN DE TRABAJO';
        const fechaActual = new Date().toLocaleDateString('es-CL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${titulo} #${operacion.id_operacion}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; background: white; color: #333; }
        .documento { max-width: 800px; margin: 0 auto; border: 2px solid #333; padding: 30px; }
        .header { text-align: center; border-bottom: 3px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { font-size: 32px; color: #333; margin-bottom: 10px; letter-spacing: 2px; }
        .header .numero { font-size: 18px; color: #666; margin-bottom: 5px; }
        .header .fecha { font-size: 14px; color: #999; }

        .seccion { margin-bottom: 25px; }
        .seccion-titulo { background: #333; color: white; padding: 10px 15px; font-weight: bold; font-size: 16px; margin-bottom: 15px; }

        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .info-item { padding: 8px 0; border-bottom: 1px solid #eee; }
        .info-item label { font-weight: bold; color: #555; display: block; font-size: 12px; margin-bottom: 3px; }
        .info-item value { color: #333; font-size: 14px; }

        .tabla { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .tabla thead { background: #f5f5f5; }
        .tabla th { padding: 12px; text-align: left; font-weight: bold; border-bottom: 2px solid #333; font-size: 14px; }
        .tabla td { padding: 12px; border-bottom: 1px solid #ddd; font-size: 14px; }
        .tabla tbody tr:hover { background: #fafafa; }
        .tabla .text-right { text-align: right; }
        .tabla .text-center { text-align: center; }

        .totales { margin-top: 20px; border-top: 2px solid #333; padding-top: 15px; }
        .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 16px; }
        .total-row.final { font-weight: bold; font-size: 20px; border-top: 2px solid #333; padding-top: 12px; margin-top: 10px; }
        .total-row.final .valor { color: #2563eb; }

        .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #333; text-align: center; }
        .firma { margin-top: 60px; }
        .firma-linea { border-top: 2px solid #333; width: 300px; margin: 0 auto; padding-top: 10px; }

        .estado-badge { display: inline-block; padding: 5px 12px; border-radius: 15px; font-size: 12px; font-weight: bold; }
        .estado-cotizacion { background: #dbeafe; color: #1e40af; }
        .estado-orden { background: #dcfce7; color: #166534; }

        @media print {
            body { padding: 0; }
            .documento { border: none; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="documento">
        <!-- Header -->
        <div class="header">
            <h1>${titulo}</h1>
            <div class="numero">N° ${operacion.id_operacion}</div>
            <div class="fecha">${fechaActual}</div>
            <span class="estado-badge ${tipo === 'cotizacion' ? 'estado-cotizacion' : 'estado-orden'}">
                ${tipo === 'cotizacion' ? 'COTIZACIÓN' : 'ORDEN DE TRABAJO'}
            </span>
        </div>

        <!-- Datos del Cliente -->
        <div class="seccion">
            <div class="seccion-titulo">DATOS DEL CLIENTE</div>
            <div class="info-grid">
                <div class="info-item">
                    <label>Nombre Completo:</label>
                    <value>${cliente.nombreCompleto || 'N/A'}</value>
                </div>
                <div class="info-item">
                    <label>RUT:</label>
                    <value>${cliente.rut || 'N/A'}</value>
                </div>
                <div class="info-item">
                    <label>Correo Electrónico:</label>
                    <value>${cliente.email || 'N/A'}</value>
                </div>
                <div class="info-item">
                    <label>Teléfono:</label>
                    <value>${cliente.telefono || 'N/A'}</value>
                </div>
                
            </div>
        </div>

        <!-- Detalles de la Operación -->
        <div class="seccion">
            <div class="seccion-titulo">DETALLE DE LA OPERACIÓN</div>

            ${operacion.descripcion_operacion ? `
                <div class="info-item" style="margin-bottom: 15px;">
                    <label>Descripción:</label>
                    <value>${operacion.descripcion_operacion}</value>
                </div>
            ` : ''}

            <table class="tabla">
                <thead>
                    <tr>
                        <th style="width: 50px;" class="text-center">Cant.</th>
                        <th>Producto</th>
                        <th>Especificaciones</th>
                        <th class="text-right">Precio Unit.</th>
                        <th class="text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${operacion.productos && operacion.productos.length > 0
                        ? operacion.productos.map(prod => `
                            <tr>
                                <td class="text-center">${prod.cantidad}</td>
                                <td><strong>${prod.producto?.nombre_producto || 'N/A'}</strong></td>
                                <td>${prod.especificaciones || '-'}</td>
                                <td class="text-right">${formatCurrency(prod.precio_unitario || 0)}</td>
                                <td class="text-right"><strong>${formatCurrency(prod.precio_total || 0)}</strong></td>
                            </tr>
                        `).join('')
                        : '<tr><td colspan="5" style="text-align: center; padding: 20px; color: #999;">No hay productos</td></tr>'
                    }
                </tbody>
            </table>

            <!-- Totales -->
            <div class="totales">
                <div class="total-row final">
                    <span>TOTAL:</span>
                    <span class="valor">${formatCurrency(operacion.costo_operacion || 0)}</span>
                </div>
                ${operacion.cantidad_abono > 0 ? `
                    <div class="total-row">
                        <span>Abonado:</span>
                        <span>${formatCurrency(operacion.cantidad_abono || 0)}</span>
                    </div>
                    <div class="total-row">
                        <span>Saldo Pendiente:</span>
                        <span style="color: #dc2626;">${formatCurrency(operacion.saldo_pendiente || 0)}</span>
                    </div>
                ` : ''}
            </div>
        </div>

        <!-- Información Adicional -->
        <div class="seccion">
            <div class="seccion-titulo">INFORMACIÓN ADICIONAL</div>
            <div class="info-grid">
                <div class="info-item">
                    <label>Fecha de Creación:</label>
                    <value>${new Date(operacion.fecha_creacion).toLocaleDateString('es-CL')}</value>
                </div>
                ${operacion.fecha_entrega_estimada ? `
                    <div class="info-item">
                        <label>Fecha de Entrega Estimada:</label>
                        <value>${new Date(operacion.fecha_entrega_estimada).toLocaleDateString('es-CL')}</value>
                    </div>
                ` : ''}
                <div class="info-item">
                    <label>Estado:</label>
                    <value><strong>${operacion.estado_operacion.toUpperCase().replace('_', ' ')}</strong></value>
                </div>
            </div>
        </div>

        <!-- Footer con Firma -->
        <div class="footer">
            <div class="firma">
                <div class="firma-linea">
                    <strong>Firma y Timbre</strong>
                </div>
            </div>
            <p style="margin-top: 30px; font-size: 12px; color: #999;">
                Documento generado el ${new Date().toLocaleString('es-CL')}
            </p>
        </div>

        <!-- Botón de Impresión -->
        <div class="no-print" style="text-align: center; margin-top: 30px;">
            <button onclick="window.print()" style="background: #333; color: white; padding: 12px 30px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; font-weight: bold;">
                Imprimir / Guardar PDF
            </button>
        </div>
    </div>
</body>
</html>
        `;

        // Abrir en nueva ventana
        const ventana = window.open('', '_blank');
        ventana.document.write(htmlContent);
        ventana.document.close();
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(value);
    };

    if (loadingClientes) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-stone-200 rounded-full"></div>
                        <div className="w-16 h-16 border-4 border-stone-600 rounded-full animate-spin absolute top-0 border-t-transparent"></div>
                    </div>
                    <p className="mt-4 text-stone-600 font-medium">Cargando clientes...</p>
                </div>
            </div>
        );
    }

    if (errorClientes) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">
                <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 max-w-md shadow-lg">
                    <div className="flex items-center mb-2">
                        <FaTimesCircle className="text-2xl mr-3 text-red-600" />
                        <h3 className="text-lg font-semibold text-red-800">Error</h3>
                    </div>
                    <p className="text-red-700 mb-4">{errorClientes}</p>
                    <button
                        onClick={fetchClientes}
                        className="w-full px-4 py-2 bg-stone-600 text-white rounded-lg hover:bg-stone-700 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                        <FaSyncAlt />
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto pt-20">
                
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-stone-800 mb-2 flex items-center gap-3">
                            <FaFileInvoiceDollar className="text-stone-600" />
                            Papeles - Clientes con Compras
                        </h1>
                        <p className="text-stone-600">Gestión de clientes y sus operaciones</p>
                    </div>
                    <button
                        onClick={() => setShowCrearModal(true)}
                        className="px-6 py-3 bg-stone-600 text-white rounded-lg hover:bg-stone-700 transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl font-medium"
                    >
                        <FaPlus />
                        Nueva Operación
                    </button>
                </div>

                {/* Estadísticas Generales */}
                {estadisticas && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-stone-600 uppercase tracking-wide">Total Clientes</p>
                                    <p className="text-3xl font-bold text-stone-800 mt-2">
                                        {estadisticas.total_clientes}
                                    </p>
                                </div>
                                <FaUser className="text-4xl text-blue-500 opacity-20" />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-stone-600 uppercase tracking-wide">Total Operaciones</p>
                                    <p className="text-3xl font-bold text-stone-800 mt-2">
                                        {estadisticas.total_operaciones}
                                    </p>
                                </div>
                                <FaChartLine className="text-4xl text-purple-500 opacity-20" />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-stone-600 uppercase tracking-wide">Total Facturado</p>
                                    <p className="text-2xl font-bold text-green-600 mt-2">
                                        {formatCurrency(estadisticas.total_facturado)}
                                    </p>
                                </div>
                                <FaMoneyBillWave className="text-4xl text-green-500 opacity-20" />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-stone-600 uppercase tracking-wide">Por Cobrar</p>
                                    <p className="text-2xl font-bold text-red-600 mt-2">
                                        {formatCurrency(estadisticas.total_por_cobrar)}
                                    </p>
                                </div>
                                <FaHourglassHalf className="text-4xl text-red-500 opacity-20" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Panel de Filtros */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        
                        {/* Barra de búsqueda */}
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre, email o RUT..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-10 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-all"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600"
                                    >
                                        <FaTimes />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Botón de filtros (móvil) */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-stone-600 text-white rounded-lg hover:bg-stone-700 transition-colors"
                        >
                            <FaFilter />
                            Filtros
                            {hayFiltrosActivos && (
                                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    !
                                </span>
                            )}
                        </button>

                        {/* Filtros (desktop siempre visible, móvil condicional) */}
                        <div className={`flex flex-col lg:flex-row gap-3 ${showFilters ? 'block' : 'hidden lg:flex'}`}>
                            {/* Filtro de operaciones */}
                            <select
                                value={filterOperaciones}
                                onChange={(e) => setFilterOperaciones(e.target.value)}
                                className="px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent bg-white"
                            >
                                <option value="all">Todas las operaciones</option>
                                <option value="0">Sin operaciones</option>
                                <option value="1">1 operación</option>
                                <option value="2+">2+ operaciones</option>
                            </select>

                            {/* Filtro de deuda */}
                            <select
                                value={filterDeuda}
                                onChange={(e) => setFilterDeuda(e.target.value)}
                                className="px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent bg-white"
                            >
                                <option value="all">Todos los estados</option>
                                <option value="con_deuda">Con deuda pendiente</option>
                                <option value="sin_deuda">Sin deuda</option>
                            </select>

                            {/* Ordenar por */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent bg-white"
                            >
                                <option value="nombre">Ordenar por nombre</option>
                                <option value="operaciones">Ordenar por operaciones</option>
                                <option value="gastado">Ordenar por total gastado</option>
                                <option value="pendiente">Ordenar por pendiente</option>
                            </select>

                            {/* Dirección de orden */}
                            <button
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                className="px-4 py-2.5 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors bg-white"
                                title={sortOrder === 'asc' ? 'Ascendente' : 'Descendente'}
                            >
                                {sortOrder === 'asc' ? '↑' : '↓'}
                            </button>

                            {/* Limpiar filtros */}
                            {hayFiltrosActivos && (
                                <button
                                    onClick={limpiarFiltros}
                                    className="px-4 py-2.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium flex items-center gap-2"
                                >
                                    <FaTimes />
                                    Limpiar
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Resumen de filtros activos */}
                    {clientesFiltrados.length !== clientes.length && (
                        <div className="mt-4 pt-4 border-t border-stone-200">
                            <p className="text-sm text-stone-600">
                                Mostrando <span className="font-bold text-stone-800">{clientesFiltrados.length}</span> de <span className="font-bold text-stone-800">{clientes.length}</span> clientes
                            </p>
                        </div>
                    )}
                </div>

                {/* Tabla de Clientes */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="px-6 py-4 bg-gradient-to-r from-stone-600 to-stone-700 border-b border-stone-200">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            <FaUser />
                            Lista de Clientes ({clientesFiltrados.length})
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-stone-200">
                            <thead className="bg-stone-50">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-stone-700 uppercase tracking-wider">
                                        Cliente
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-stone-700 uppercase tracking-wider">
                                        RUT
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-stone-700 uppercase tracking-wider">
                                        N° Operaciones por Cliente
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-stone-700 uppercase tracking-wider">
                                        Total Gastado
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-stone-700 uppercase tracking-wider">
                                        Pendiente
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-stone-700 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-stone-200">
                                {clientesFiltrados.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center">
                                                <FaSearch className="text-6xl mb-4 text-stone-300" />
                                                <p className="text-stone-500 text-lg">
                                                    {hayFiltrosActivos
                                                        ? 'No se encontraron clientes con los filtros aplicados'
                                                        : 'No hay clientes con compras registradas'
                                                    }
                                                </p>
                                                {hayFiltrosActivos && (
                                                    <button
                                                        onClick={limpiarFiltros}
                                                        className="mt-4 px-6 py-2 bg-stone-600 text-white rounded-lg hover:bg-stone-700 transition-colors"
                                                    >
                                                        Limpiar filtros
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    clientesFiltrados.map((cliente) => (
                                        <tr key={cliente.id} className="hover:bg-stone-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-stone-200 rounded-full flex items-center justify-center">
                                                        <FaUser className="text-stone-600" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-stone-900">
                                                            {cliente.nombreCompleto}
                                                        </div>
                                                        <div className="text-sm text-stone-500">
                                                            {cliente.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-stone-600 font-mono">
                                                    {cliente.rut}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                    {cliente.resumen_compras.total_operaciones}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <span className="text-sm font-bold text-green-600">
                                                    {formatCurrency(cliente.resumen_compras.total_gastado)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <span className={`text-sm font-bold ${
                                                    cliente.resumen_compras.total_pendiente > 0 
                                                        ? 'text-red-600' 
                                                        : 'text-green-600'
                                                }`}>
                                                    {formatCurrency(cliente.resumen_compras.total_pendiente)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <button
                                                    onClick={() => handleVerDetalles(cliente.id)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-stone-600 text-white rounded-lg hover:bg-stone-700 transition-colors text-sm font-medium shadow-sm hover:shadow-md"
                                                >
                                                    <FaEye />
                                                    Ver Detalles
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal de Crear Operación */}
                <CrearOperacionModal
                    isOpen={showCrearModal}
                    onClose={() => setShowCrearModal(false)}
                    onSuccess={handleOperacionCreada}
                    clientes={clientes}
                    productos={productos}
                    onClienteCreado={fetchClientes}
                />

               {selectedClienteId && cliente && (
    <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseModal();
        }}
    >
        <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header del Modal - FIJO */}
            <div className="bg-gradient-to-r from-stone-600 to-stone-700 px-6 py-5 flex justify-between items-center flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                        <FaUser className="text-white text-xl" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">
                            {cliente.nombreCompleto}
                        </h2>
                        <p className="text-stone-200 text-sm">{cliente.email}</p>
                    </div>
                </div>
                <button
                    onClick={handleCloseModal}
                    className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Contenido con Scroll */}
            <div className="flex-1 overflow-y-auto">
                {loadingCliente ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-stone-200 rounded-full"></div>
                            <div className="w-16 h-16 border-4 border-stone-600 rounded-full animate-spin absolute top-0 border-t-transparent"></div>
                        </div>
                    </div>
                ) : (
                    <div className="p-6 space-y-6">
                        {/* Mensaje de éxito/error */}
                        {mensajeEstado.texto && (
                            <div className={`p-4 rounded-lg border ${
                                mensajeEstado.tipo === 'success'
                                    ? 'bg-green-50 border-green-500 text-green-800'
                                    : 'bg-red-50 border-red-500 text-red-800'
                            }`}>
                                <div className="flex items-center gap-2">
                                    {mensajeEstado.tipo === 'success' ? (
                                        <FaCheckCircle className="text-xl" />
                                    ) : (
                                        <FaTimesCircle className="text-xl" />
                                    )}
                                    <p className="font-medium">{mensajeEstado.texto}</p>
                                </div>
                            </div>
                        )}
                        {/* Información Personal - Compacta */}
                        <div className="bg-stone-50 rounded-lg p-4">
                            <h3 className="text-lg font-bold text-stone-800 mb-3 flex items-center gap-2">
                                <FaUser className="text-stone-600" />
                                Información Personal
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                <div>
                                    <p className="text-stone-600 font-medium">RUT</p>
                                    <p className="font-mono text-stone-800">{cliente.rut}</p>
                                </div>
                                <div>
                                    <p className="text-stone-600 font-medium">Teléfono</p>
                                    <p className="text-stone-800">{cliente.telefono || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-stone-600 font-medium">Categoría</p>
                                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium mt-1">
                                        {cliente.info_cliente?.categoria_cliente || 'Regular'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Resumen de Compras - Grid compacto */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                                <p className="text-xs text-blue-700 font-medium">Operaciones</p>
                                <p className="text-2xl font-bold text-blue-900 mt-1">
                                    {cliente.resumen_compras.total_operaciones}
                                </p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                                <p className="text-xs text-green-700 font-medium">Total Gastado</p>
                                <p className="text-lg font-bold text-green-900 mt-1">
                                    {formatCurrency(cliente.resumen_compras.total_gastado)}
                                </p>
                            </div>
                            <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                                <p className="text-xs text-yellow-700 font-medium">Abonado</p>
                                <p className="text-lg font-bold text-yellow-900 mt-1">
                                    {formatCurrency(cliente.resumen_compras.total_abonado)}
                                </p>
                            </div>
                            <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                                <p className="text-xs text-red-700 font-medium">Pendiente</p>
                                <p className="text-lg font-bold text-red-900 mt-1">
                                    {formatCurrency(cliente.resumen_compras.total_pendiente)}
                                </p>
                            </div>
                        </div>

                        {/* Historial de Compras - Diseño lineal y compacto */}
                        <div>
                            <h3 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
                                <FaShoppingCart className="text-stone-600" />
                                Historial de Compras ({cliente.compras?.length || 0})
                            </h3>

                            {/* Lista de compras con scroll interno */}
                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-custom">
                                {cliente.compras && cliente.compras.length > 0 ? (
                                    cliente.compras.map((compra) => (
                                        <div
                                            key={compra.id_operacion}
                                            className="border border-stone-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                                        >
                                            {/* Header de la compra - Una línea */}
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-lg font-bold text-stone-800">
                                                        #{compra.id_operacion}
                                                    </span>
                                                    <span className="text-xs text-stone-500">
                                                        {new Date(compra.fecha_creacion).toLocaleDateString('es-CL')}
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xl font-bold text-green-600">
                                                        {formatCurrency(compra.costo_operacion)}
                                                    </p>
                                                    {compra.saldo_pendiente > 0 && (
                                                        <p className="text-xs text-red-600 font-medium">
                                                            Pdte: {formatCurrency(compra.saldo_pendiente)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Botones de Documentos - Condicionados por abono */}
                                            <div className="flex gap-2 mb-3">
                                                {compra.cantidad_abono === 0 || compra.cantidad_abono === null ? (
                                                    <button
                                                        onClick={() => generarDocumento(compra, cliente, 'cotizacion')}
                                                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium flex items-center justify-center gap-2"
                                                        title="Generar Cotización"
                                                    >
                                                        <FaFileAlt />
                                                        Cotización
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleMostrarModalFechaEntrega(compra, cliente)}
                                                        className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs font-medium flex items-center justify-center gap-2"
                                                        title="Generar Orden de Trabajo"
                                                    >
                                                        <FaPrint />
                                                        Orden de Trabajo
                                                    </button>
                                                )}
                                            </div>

                                            {/* Selector de estado */}
                                            <div className="mb-3">
                                                <label className="block text-xs font-bold text-stone-700 mb-1">
                                                    Cambiar Estado:
                                                </label>
                                                <select
                                                    value={compra.estado_operacion}
                                                    onChange={(e) => handleCambiarEstado(compra.id_operacion, e.target.value, compra)}
                                                    disabled={cambiandoEstado[compra.id_operacion]}
                                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent text-sm ${
                                                        cambiandoEstado[compra.id_operacion] ? 'opacity-50 cursor-not-allowed' : ''
                                                    } ${
                                                        compra.estado_operacion === 'completada' || compra.estado_operacion === 'pagada' || compra.estado_operacion === 'entregada' ? 'bg-green-50 border-green-300' :
                                                        compra.estado_operacion === 'en_proceso' ? 'bg-blue-50 border-blue-300' :
                                                        compra.estado_operacion === 'pendiente' ? 'bg-yellow-50 border-yellow-300' :
                                                        compra.estado_operacion === 'anulada' ? 'bg-red-50 border-red-300' :
                                                        'bg-stone-50 border-stone-300'
                                                    }`}
                                                >
                                                    <option value={EstadosOperacion.COTIZACION}>
                                                        {getEstadoLabel(EstadosOperacion.COTIZACION)}
                                                    </option>
                                                    <option value={EstadosOperacion.ORDEN_TRABAJO}>
                                                        {getEstadoLabel(EstadosOperacion.ORDEN_TRABAJO)}
                                                    </option>
                                                    <option value={EstadosOperacion.PENDIENTE}>
                                                        {getEstadoLabel(EstadosOperacion.PENDIENTE)}
                                                    </option>
                                                    <option value={EstadosOperacion.EN_PROCESO}>
                                                        {getEstadoLabel(EstadosOperacion.EN_PROCESO)}
                                                    </option>
                                                    <option value={EstadosOperacion.TERMINADA}>
                                                        {getEstadoLabel(EstadosOperacion.TERMINADA)}
                                                    </option>
                                                    <option value={EstadosOperacion.COMPLETADA}>
                                                        {getEstadoLabel(EstadosOperacion.COMPLETADA)}
                                                    </option>
                                                    <option value={EstadosOperacion.ENTREGADA}>
                                                        {getEstadoLabel(EstadosOperacion.ENTREGADA)}
                                                    </option>
                                                    <option value={EstadosOperacion.PAGADA}>
                                                        {getEstadoLabel(EstadosOperacion.PAGADA)}
                                                    </option>
                                                    <option value={EstadosOperacion.ANULADA}>
                                                        {getEstadoLabel(EstadosOperacion.ANULADA)}
                                                    </option>
                                                </select>
                                                {cambiandoEstado[compra.id_operacion] && (
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <div className="w-3 h-3 border-2 border-stone-500 rounded-full animate-spin border-t-transparent"></div>
                                                        <span className="text-xs text-stone-500">Actualizando estado...</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Sección de Abonos */}
                                            <div className="mb-3 border-t border-stone-100 pt-3">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <FaMoneyBillWave className="text-green-600 text-xs" />
                                                        <p className="text-xs font-bold text-stone-700">Información de Pago</p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2 mb-2">
                                                    <div className="bg-green-50 border border-green-200 rounded px-2 py-1">
                                                        <p className="text-xs text-green-700 font-medium">Abonado</p>
                                                        <p className="text-sm font-bold text-green-800">
                                                            {formatCurrency(compra.cantidad_abono || 0)}
                                                        </p>
                                                    </div>
                                                    <div className={`border rounded px-2 py-1 ${
                                                        compra.saldo_pendiente > 0
                                                            ? 'bg-red-50 border-red-200'
                                                            : 'bg-green-50 border-green-200'
                                                    }`}>
                                                        <p className={`text-xs font-medium ${
                                                            compra.saldo_pendiente > 0 ? 'text-red-700' : 'text-green-700'
                                                        }`}>
                                                            Pendiente
                                                        </p>
                                                        <p className={`text-sm font-bold ${
                                                            compra.saldo_pendiente > 0 ? 'text-red-800' : 'text-green-800'
                                                        }`}>
                                                            {formatCurrency(compra.saldo_pendiente || 0)}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Botón/Campo de abono */}
                                                {compra.saldo_pendiente > 0 && (
                                                    <>
                                                        {!mostrarAbonoModal[compra.id_operacion] ? (
                                                            <button
                                                                onClick={() => handleMostrarAbono(compra.id_operacion, compra.saldo_pendiente)}
                                                                className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-medium flex items-center justify-center gap-2"
                                                            >
                                                                <FaMoneyBillWave />
                                                                Realizar Abono
                                                            </button>
                                                        ) : (
                                                            <div className="space-y-2">
                                                                <label className="block text-xs font-bold text-stone-700">
                                                                    Monto a Abonar:
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    max={compra.saldo_pendiente}
                                                                    value={montoAbono[compra.id_operacion] || ''}
                                                                    onChange={(e) => setMontoAbono(prev => ({
                                                                        ...prev,
                                                                        [compra.id_operacion]: e.target.value
                                                                    }))}
                                                                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                                                                    placeholder="Ingrese el monto"
                                                                    disabled={procesandoAbono[compra.id_operacion]}
                                                                />
                                                                <div className="flex gap-2">
                                                                    <button
                                                                        onClick={() => handleRealizarAbono(compra.id_operacion, compra)}
                                                                        disabled={procesandoAbono[compra.id_operacion]}
                                                                        className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                                                    >
                                                                        {procesandoAbono[compra.id_operacion] ? 'Procesando...' : 'Confirmar'}
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleCancelarAbono(compra.id_operacion)}
                                                                        disabled={procesandoAbono[compra.id_operacion]}
                                                                        className="flex-1 px-3 py-2 bg-stone-300 text-stone-700 rounded-lg hover:bg-stone-400 transition-colors text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                                                    >
                                                                        Cancelar
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>

                                            {/* Historial de cambios - Desplegable */}
                                            {compra.historial && compra.historial.length > 0 && (
                                                <div className="mb-3 border-t border-stone-100 pt-3">
                                                    <button
                                                        onClick={() => setHistorialAbierto(prev => ({
                                                            ...prev,
                                                            [compra.id_operacion]: !prev[compra.id_operacion]
                                                        }))}
                                                        className="w-full flex items-center justify-between px-3 py-2 bg-stone-50 hover:bg-stone-100 rounded-lg transition-colors"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <FaHistory className="text-stone-600 text-xs" />
                                                            <p className="text-xs font-bold text-stone-700">
                                                                Historial de Cambios ({compra.historial.length})
                                                            </p>
                                                        </div>
                                                        <span className={`text-stone-600 transform transition-transform ${
                                                            historialAbierto[compra.id_operacion] ? 'rotate-180' : ''
                                                        }`}>
                                                            ▼
                                                        </span>
                                                    </button>

                                                    {historialAbierto[compra.id_operacion] && (
                                                        <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                                                            {compra.historial
                                                                .sort((a, b) => new Date(b.fecha_cambio) - new Date(a.fecha_cambio))
                                                                .map((hist, idx) => {
                                                                    // Determinar qué estado fue activado
                                                                    const estadoActivado = Object.entries(hist).find(([key, value]) =>
                                                                        value === true && key !== 'id_h_operacion' && key !== 'fecha_cambio'
                                                                    );

                                                                    if (!estadoActivado) return null;

                                                                    const [estado] = estadoActivado;

                                                                    return (
                                                                        <div
                                                                            key={hist.id_h_operacion || idx}
                                                                            className="flex justify-between items-center text-xs bg-stone-100 rounded px-3 py-2 border border-stone-200 hover:bg-stone-200 transition-colors"
                                                                        >
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="w-2 h-2 bg-stone-500 rounded-full"></span>
                                                                                <span className="font-medium text-stone-700">
                                                                                    {getEstadoLabel(estado)}
                                                                                </span>
                                                                            </div>
                                                                            <span className="text-stone-500">
                                                                                {new Date(hist.fecha_cambio).toLocaleDateString('es-CL', {
                                                                                    year: 'numeric',
                                                                                    month: 'short',
                                                                                    day: 'numeric',
                                                                                    hour: '2-digit',
                                                                                    minute: '2-digit'
                                                                                })}
                                                                            </span>
                                                                        </div>
                                                                    );
                                                                })
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Productos - Lista compacta */}
                                            {compra.productos && compra.productos.length > 0 && (
                                                <div className="border-t border-stone-100 pt-3">
                                                    <p className="text-xs font-bold text-stone-700 mb-2">
                                                        Productos ({compra.productos.length}):
                                                    </p>
                                                    <div className="space-y-1">
                                                        {compra.productos.map((prod) => (
                                                            <div 
                                                                key={prod.id_producto_operacion} 
                                                                className="flex justify-between items-center text-xs bg-stone-50 rounded px-3 py-2"
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <span className="w-6 h-6 bg-stone-200 rounded-full flex items-center justify-center text-stone-600 font-bold">
                                                                        {prod.cantidad}
                                                                    </span>
                                                                    <span className="text-stone-700 font-medium">
                                                                        {prod.producto?.nombre_producto}
                                                                    </span>
                                                                </div>
                                                                <span className="font-bold text-stone-800">
                                                                    {formatCurrency(prod.precio_total)}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 bg-stone-50 rounded-lg">
                                        <FaBox className="text-6xl text-stone-300 mx-auto mb-4" />
                                        <p className="text-stone-500 mt-4">No hay compras registradas</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
)}

                {/* Modal de Fecha de Entrega para Orden de Trabajo */}
                {operacionParaOrden && mostrarModalFechaEntrega[operacionParaOrden.id_operacion] && (
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60]"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) handleCancelarModalFechaEntrega(operacionParaOrden.id_operacion);
                        }}
                    >
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 rounded-t-2xl">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <FaPrint />
                                    Fecha de Entrega Estimada
                                </h3>
                                <p className="text-purple-100 text-sm mt-1">
                                    Orden de Trabajo #{operacionParaOrden.id_operacion}
                                </p>
                            </div>

                            {/* Body */}
                            <div className="p-6">
                                <div className="mb-4">
                                    <label className="block text-sm font-bold text-stone-700 mb-3">
                                        Seleccione el plazo de entrega en días hábiles:
                                    </label>

                                    {/* Opciones predefinidas */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        {[5, 15, 30, 40, 60].map((dias) => (
                                            <button
                                                key={dias}
                                                onClick={() => setDiasHabilesSeleccionados(prev => ({
                                                    ...prev,
                                                    [operacionParaOrden.id_operacion]: dias
                                                }))}
                                                className={`px-4 py-3 rounded-lg border-2 transition-all font-medium ${
                                                    diasHabilesSeleccionados[operacionParaOrden.id_operacion] === dias
                                                        ? 'bg-purple-600 text-white border-purple-600 shadow-lg'
                                                        : 'bg-white text-stone-700 border-stone-300 hover:border-purple-400 hover:bg-purple-50'
                                                }`}
                                            >
                                                {dias} días hábiles
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
                                            value={diasHabilesSeleccionados[operacionParaOrden.id_operacion] || ''}
                                            onChange={(e) => setDiasHabilesSeleccionados(prev => ({
                                                ...prev,
                                                [operacionParaOrden.id_operacion]: parseInt(e.target.value) || 0
                                            }))}
                                            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder="Ej: 25"
                                        />
                                    </div>

                                    {/* Vista previa de la fecha */}
                                    {diasHabilesSeleccionados[operacionParaOrden.id_operacion] > 0 && (
                                        <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                                            <p className="text-sm text-purple-700 font-medium mb-1">
                                                Fecha de entrega estimada:
                                            </p>
                                            <p className="text-lg font-bold text-purple-900">
                                                {calcularFechaEntrega(diasHabilesSeleccionados[operacionParaOrden.id_operacion]).toLocaleDateString('es-CL', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                            <p className="text-xs text-purple-600 mt-1">
                                                ({diasHabilesSeleccionados[operacionParaOrden.id_operacion]} días hábiles desde hoy, excluyendo fines de semana)
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Botones de acción */}
                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={() => handleCancelarModalFechaEntrega(operacionParaOrden.id_operacion)}
                                        className="flex-1 px-4 py-3 bg-stone-300 text-stone-700 rounded-lg hover:bg-stone-400 transition-colors font-medium"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={() => handleGenerarOrdenConFecha(operacionParaOrden, clienteParaOrden)}
                                        disabled={!diasHabilesSeleccionados[operacionParaOrden.id_operacion] || diasHabilesSeleccionados[operacionParaOrden.id_operacion] <= 0}
                                        className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        <FaPrint />
                                        Generar Orden
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Papeles;