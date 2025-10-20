// frontend/src/pages/trabajador-tienda/TrabajadorOperaciones.jsx
import { useState, useEffect } from 'react';
import Table from '@components/Table';
import Search from '@components/Search';
import PopupCreateOperacion from '@components/popup/trabajadorTienda/PopupCreateOperacion';
import PopupUpdateOperacion from '@components/popup/trabajadorTienda/PopupUpdateOperacion';
import AddIcon from '@assets/AddIcon.svg';
import UpdateIcon from '@assets/updateIcon.svg';
import DeleteIcon from '@assets/deleteIcon.svg';
import { getOperations, createOperation} from '@services/trabajadorTienda.service';
import { showSuccessAlert, showErrorAlert, deleteDataAlert } from '@helpers/sweetAlert.js';

const TrabajadorOperations = () => {
    const [operations, setOperations] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [productos, setProductos] = useState([]);
    const [filter, setFilter] = useState('');
    const [selectedOperation, setSelectedOperation] = useState(null);
    const [showCreatePopup, setShowCreatePopup] = useState(false);
    const [showUpdatePopup, setShowUpdatePopup] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOperations();
        // In a real app, you would also load clientes and productos
        // loadClientes();
        // loadProductos();
    }, []);

    const loadOperations = async () => {
        setLoading(true);
        try {
            const response = await getOperations();
            if (response.status === 'Success') {
                setOperations(response.data || []);
            } else {
                showErrorAlert('Error', 'No se pudieron cargar las operaciones');
            }
        } catch (error) {
            console.error('Error al cargar operaciones:', error);
            showErrorAlert('Error', 'Error al cargar operaciones');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOperation = async (operationData) => {
        try {
            const response = await createOperation(operationData);
            if (response.status === 'Success') {
                showSuccessAlert('Éxito', 'Operación creada correctamente');
                await loadOperations();
                return true;
            } else {
                showErrorAlert('Error', response.message || 'Error al crear operación');
                return false;
            }
        } catch (error) {
            console.error('Error al crear operación:', error);
            showErrorAlert('Error', 'Error al crear operación');
            return false;
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const response = await updateEstadoOperacion(id, newStatus);
            if (response.status === 'Success') {
                showSuccessAlert('Éxito', 'Estado actualizado correctamente');
                await loadOperations();
                return true;
            } else {
                showErrorAlert('Error', response.message || 'Error al actualizar estado');
                return false;
            }
        } catch (error) {
            console.error('Error al actualizar estado:', error);
            showErrorAlert('Error', 'Error al actualizar estado');
            return false;
        }
    };

    const formatMoney = (amount) => {
        return new Intl.NumberFormat('es-CL', { 
            style: 'currency', 
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            'pendiente': 'bg-orange-100 text-orange-800',
            'en_proceso': 'bg-yellow-100 text-yellow-800',
            'terminada': 'bg-purple-100 text-purple-800',
            'completada': 'bg-green-100 text-green-800',
            'entregada': 'bg-teal-100 text-teal-800',
            'pagada': 'bg-emerald-100 text-emerald-800',
            'anulada': 'bg-red-100 text-red-800'
        };
        
        const statusLabels = {
            'pendiente': 'Pendiente',
            'en_proceso': 'En Proceso',
            'terminada': 'Terminada',
            'completada': 'Completada',
            'entregada': 'Entregada',
            'pagada': 'Pagada',
            'anulada': 'Anulada'
        };
        
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
                {statusLabels[status] || status}
            </span>
        );
    };

    const columns = [
        { title: "ID", field: "id_operacion", width: 70 },
        { title: "Cliente", field: "cliente", width: 180 },
        { title: "Descripción", field: "descripcion", width: 250 },
        { 
            title: "Estado", 
            field: "estado", 
            width: 120,
            formatter: (cell) => {
                const status = cell.getValue();
                return getStatusBadge(status);
            }
        },
        { 
            title: "Costo", 
            field: "costo", 
            width: 120,
            formatter: (cell) => formatMoney(cell.getValue())
        },
        { title: "Entrega", field: "fecha_entrega", width: 120 },
        {
            title: "Acciones",
            width: 120,
            formatter: (cell) => {
                const id = cell.getRow().getData().id_operacion;
                return `
                <div class="flex gap-2">
                    <button class="edit-btn p-1 hover:bg-stone-100 rounded" data-id="${id}">
                        <img src="${UpdateIcon}" alt="Editar" class="w-5 h-5" />
                    </button>
                    <button class="status-btn p-1 hover:bg-blue-100 rounded" data-id="${id}">
                        🔄
                    </button>
                </div>`;
            },
            cellClick: (e, cell) => {
                if (e.target.closest('.edit-btn') || e.target.closest('.status-btn')) {
                    const id = e.target.closest('button').dataset.id;
                    const operation = operations.find(op => op.id_operacion == id);
                    
                    if (e.target.closest('.edit-btn')) {
                        setSelectedOperation(operation);
                        setShowUpdatePopup(true);
                    } else if (e.target.closest('.status-btn')) {
                        // Show a dropdown or modal to select new status
                        // For simplicity, we'll just move to the next state
                        const statuses = ['pendiente', 'en_proceso', 'terminada', 'completada', 'entregada', 'pagada'];
                        const currentIndex = statuses.indexOf(operation.estado);
                        const nextStatus = statuses[(currentIndex + 1) % statuses.length];
                        
                        handleUpdateStatus(id, nextStatus);
                    }
                }
            }
        }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-600"></div>
                <p className="ml-3 text-lg text-stone-600">Cargando operaciones...</p>
            </div>
        );
    }

    return (
        <div className="pt-[calc(9vh+1rem)] px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-stone-700">Operaciones</h1>
                
                <button
                    onClick={() => setShowCreatePopup(true)}
                    className="bg-stone-600 hover:bg-stone-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md flex items-center gap-2 transition-colors"
                >
                    <img src={AddIcon} alt="Agregar" className="w-5 h-5 filter brightness-0 invert" />
                    Nueva Operación
                </button>
            </div>
            
            <div className="mb-6 flex justify-between">
                <Search 
                    value={filter} 
                    onChange={(e) => setFilter(e.target.value)} 
                    placeholder="Buscar operación..."
                />
                
                <div className="flex gap-3">
                    <select 
                        className="px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500"
                        onChange={(e) => setFilter(e.target.value ? e.target.value : '')}
                    >
                        <option value="">Todos los estados</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="en_proceso">En Proceso</option>
                        <option value="terminada">Terminada</option>
                        <option value="completada">Completada</option>
                        <option value="entregada">Entregada</option>
                        <option value="pagada">Pagada</option>
                    </select>
                </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <Table 
                    data={operations}
                    columns={columns}
                    filter={filter}
                    dataToFilter="descripcion"
                    initialSortName="id_operacion"
                    onSelectionChange={(selected) => setSelectedOperation(selected[0])}
                />
            </div>
            
            {/* Popups */}
            <PopupCreateOperacion 
                show={showCreatePopup}
                setShow={setShowCreatePopup}
                clientes={clientes}
                productos={productos}
                onSubmit={handleCreateOperation}
            />
            
            <PopupUpdateOperacion 
                show={showUpdatePopup}
                setShow={setShowUpdatePopup}
                operacion={selectedOperation}
                clientes={clientes}
                productos={productos}
                onSubmit={handleUpdateOperation}
            />
        </div>
    );
};

export default TrabajadorOperations;