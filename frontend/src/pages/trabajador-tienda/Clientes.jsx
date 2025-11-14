// src/pages/trabajador-tienda/Clientes.jsx

import { useState } from 'react';
import { useClientes } from '@hooks/clientes/useClientes';
import { useSearchClientes } from '@hooks/clientes/useSearchClientes';


// Importar los popups
import PopUpCrearCliente from '@components/popup/trabajadorTienda/cliente/popUpCrearCliente';
import PopUpEditarCliente from '@components/popup/trabajadorTienda/cliente/popUpEditarCliente';
import PopUpDetalleCliente from '@components/popup/trabajadorTienda/cliente/popUpDetalleCliente';
import PopUpBloquearCliente from '@components/popup/trabajadorTienda/cliente/popUpBloquearCliente';
import PopUpEliminarCliente from '@components/popup/trabajadorTienda/cliente/popUpEliminarCliente';

import '@styles/trabajadorTienda/Clientes.css';
import ViewIcon from '@assets/ViewIcon.svg';
import UpdateIcon from '@assets/updateIcon.svg';
import PasskeyIcon from '@assets/PasskeyIcon.svg'; // o usa otro icono para bloquear
import DeleteIcon from '@assets/deleteIcon.svg';
import ChevronDownIcon from '@assets/ChevronDownIcon.svg';

import { FaUser, FaSearch, FaSync, FaFilter, FaChevronDown, FaChevronUp, FaPlus } from 'react-icons/fa';

// ==================== COMPONENTE PRINCIPAL: PÁGINA DE CLIENTES ====================


const ClientesPage = () => {
  // Estados para controlar los modales
  const [modalCrear, setModalCrear] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalDetalle, setModalDetalle] = useState(false);
  const [modalBloquear, setModalBloquear] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  // Hooks
  const { clientes, total, loading: loadingLista, error: errorLista, refetch } = useClientes();
  const { 
    clientes: clientesBusqueda,
    loading: loadingBusqueda,
    error: errorBusqueda,
    search,
    clearResults,
    filtrosActivos,
    total: totalBusqueda
  } = useSearchClientes();

  // Estado para modo de búsqueda
  const [modoBusqueda, setModoBusqueda] = useState(false);

  const clientesMostrar = modoBusqueda ? clientesBusqueda : clientes;
  const loadingMostrar = modoBusqueda ? loadingBusqueda : loadingLista;
  const errorMostrar = modoBusqueda ? errorBusqueda : errorLista;
  const totalMostrar = modoBusqueda ? totalBusqueda : total;

  const handleAbrirDetalle = (cliente) => {
    setClienteSeleccionado(cliente);
    setModalDetalle(true);
  };

  const handleAbrirEditar = (cliente) => {
    setClienteSeleccionado(cliente);
    setModalEditar(true);
  };

  const handleAbrirBloquear = (cliente) => {
    setClienteSeleccionado(cliente);
    setModalBloquear(true);
  };

  const handleAbrirEliminar = (cliente) => {
    setClienteSeleccionado(cliente);
    setModalEliminar(true);
  };

  const handleBuscar = (filtros) => {
    if (Object.keys(filtros).length > 0) {
      setModoBusqueda(true);
      search(filtros);
    } else {
      setModoBusqueda(false);
      clearResults();
    }
  };

  const handleLimpiarBusqueda = () => {
    setModoBusqueda(false);
    clearResults();
  };

  const handleEditarDesdeDetalle = () => {
    setModalDetalle(false);
    setModalEditar(true);
  };

  return (

    <div className="mt-30">
    <div className="clientes-page">
      <div className="clientes-header flex items-center justify-between mb-4">
  
      <div className="flex items-center gap-2">
        <FaUser className="text-stone-700 text-xl" />
        <h1 className="text-xl font-semibold text-stone-800">
          Gestión de Clientes
        </h1>
      </div>

  <button
    className="px-6 py-2.5 bg-stone-700 text-white font-medium rounded-lg hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
    onClick={() => setModalCrear(true)}
  >
    <FaPlus className="text-sm" />
    Nuevo Cliente
  </button>

</div>

      {/* Componente principal con búsqueda integrada */}
      <ListaClientes
        clientes={clientesMostrar}
        loading={loadingMostrar}
        error={errorMostrar}
        refetch={refetch}
        onVerDetalle={handleAbrirDetalle}
        onEditar={handleAbrirEditar}
        onBloquear={handleAbrirBloquear}
        onEliminar={handleAbrirEliminar}
        onBuscar={handleBuscar}
        onLimpiarBusqueda={handleLimpiarBusqueda}
        modoBusqueda={modoBusqueda}
        filtrosActivos={filtrosActivos}
        total={totalMostrar}
      />

      {/* PopUp: Crear Cliente */}
      <PopUpCrearCliente
        isOpen={modalCrear}
        onClose={() => setModalCrear(false)}
        onSuccess={() => {
          setModalCrear(false);
          refetch();
        }}
      />

      {/* PopUp: Editar Cliente */}
      {clienteSeleccionado && (
        <PopUpEditarCliente
          isOpen={modalEditar}
          onClose={() => setModalEditar(false)}
          onSuccess={() => {
            setModalEditar(false);
            refetch();
          }}
          clienteId={clienteSeleccionado.id}
        />
      )}

      {/* PopUp: Detalle Cliente */}
      {clienteSeleccionado && (
        <PopUpDetalleCliente
          isOpen={modalDetalle}
          onClose={() => setModalDetalle(false)}
          onEditar={handleEditarDesdeDetalle}
          clienteId={clienteSeleccionado.id}
        />
      )}

      {/* PopUp: Bloquear Cliente */}
      {clienteSeleccionado && (
        <PopUpBloquearCliente
          isOpen={modalBloquear}
          onClose={() => setModalBloquear(false)}
          onSuccess={() => {
            setModalBloquear(false);
            refetch();
          }}
          cliente={clienteSeleccionado}
        />
      )}

      {/* PopUp: Eliminar Cliente */}
      {clienteSeleccionado && (
        <PopUpEliminarCliente
          isOpen={modalEliminar}
          onClose={() => setModalEliminar(false)}
          onSuccess={() => {
            setModalEliminar(false);
            refetch();
          }}
          cliente={clienteSeleccionado}
        />
      )}
    </div>
    </div>
  );
};

// ==================== COMPONENTE: LISTA DE CLIENTES CON BÚSQUEDA ====================

const ListaClientes = ({ 
  clientes, 
  loading, 
  error, 
  refetch, 
  onVerDetalle, 
  onEditar, 
  onBloquear,
  onEliminar,
  onBuscar,
  onLimpiarBusqueda,
  modoBusqueda,
  filtrosActivos,
  total
}) => {
  // Estados para el formulario de búsqueda
  const [filtros, setFiltros] = useState({
    nombre: '',
    email: '',
    categoria: ''
  });

  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const handleChangeFiltro = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    const filtrosActivos = Object.fromEntries(
      Object.entries(filtros).filter(([_, value]) => value.trim() !== '')
    );
    onBuscar(filtrosActivos);
  };

  const handleLimpiar = () => {
    setFiltros({
      nombre: '',
      email: '',
      categoria: ''
    });
    onLimpiarBusqueda();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <div className="w-12 h-12 border-4 border-stone-200 border-t-stone-600 rounded-full animate-spin"></div>
        <p className="text-stone-600 font-medium">Cargando clientes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4 bg-red-50 rounded-lg border border-red-200">
        <p className="text-red-600 font-medium">❌ {error}</p>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-stone-700 text-white rounded-lg hover:bg-stone-800 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
   <div className="mt-5">
    <div className="bg-white rounded-lg shadow-sm border border-stone-200">
      {/* Barra de búsqueda avanzada */}
      <div className="border-b border-stone-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <FaFilter className="text-stone-600" />
            <h3 className="text-lg font-semibold text-stone-800">Búsqueda de Clientes</h3>
          </div>
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors font-medium text-sm flex items-center gap-2"
          >
            {mostrarFiltros ? <FaChevronUp /> : <FaChevronDown />}
            {mostrarFiltros ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </button>
        </div>

        {mostrarFiltros && (
          <form onSubmit={handleBuscar} className="p-4 bg-stone-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="nombre" className="text-sm font-medium text-stone-700">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  placeholder="Buscar por nombre..."
                  value={filtros.nombre}
                  onChange={handleChangeFiltro}
                  className="px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium text-stone-700">Email</label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  placeholder="Buscar por email..."
                  value={filtros.email}
                  onChange={handleChangeFiltro}
                  className="px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="categoria" className="text-sm font-medium text-stone-700">Categoría</label>
                <select
                  id="categoria"
                  name="categoria"
                  value={filtros.categoria}
                  onChange={handleChangeFiltro}
                  className="px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent bg-white"
                >
                  <option value="">Todas</option>
                  <option value="regular">Regular</option>
                  <option value="vip">VIP</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="px-5 py-2 bg-stone-700 text-white rounded-lg hover:bg-stone-800 transition-colors font-medium flex items-center gap-2"
              >
                <FaSearch />
                Buscar
              </button>
              <button
                type="button"
                onClick={handleLimpiar}
                className="px-5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors font-medium flex items-center gap-2"
              >
                <FaSync />
                Limpiar
              </button>
              <button
                type="button"
                onClick={refetch}
                className="px-5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors font-medium flex items-center gap-2"
              >
                <FaSync />
                Recargar Todos
              </button>
            </div>
          </form>
        )}

        {/* Mostrar filtros activos */}
        {modoBusqueda && Object.keys(filtrosActivos).length > 0 && (
          <div className="px-4 py-3 bg-stone-100 border-t border-stone-200">
            <span className="text-sm font-medium text-stone-700 mr-3">Filtros aplicados:</span>
            <div className="inline-flex flex-wrap gap-2 mt-2">
              {Object.entries(filtrosActivos).map(([key, value]) => (
                <span key={key} className="px-3 py-1 bg-stone-700 text-white text-sm rounded-full">
                  {key}: <strong>{value}</strong>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Estadísticas */}
      <div className="px-4 py-3 bg-stone-50 border-b border-stone-200">
        <span className="text-sm text-stone-600">
          {modoBusqueda ? (
            <>Resultados de búsqueda: <strong className="text-stone-800">{total}</strong></>
          ) : (
            <>Total de clientes: <strong className="text-stone-800">{total}</strong></>
          )}
        </span>
      </div>

      {/* Tabla de clientes */}
      {clientes.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-stone-500 font-medium">
            {modoBusqueda
              ? '🔍 No se encontraron clientes con los filtros aplicados'
              : '📋 No hay clientes registrados'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-100 border-b border-stone-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-stone-700">Nombre Completo</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-stone-700">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-stone-700">RUT</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-stone-700">Categoría</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-stone-700">Estado</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-stone-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {clientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-stone-800 font-medium">{cliente.nombreCompleto}</td>
                  <td className="px-4 py-3 text-sm text-stone-600">{cliente.email}</td>
                  <td className="px-4 py-3 text-sm text-stone-600">{cliente.rut}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      cliente.cliente?.categoria_cliente === 'vip'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : cliente.cliente?.categoria_cliente === 'premium'
                        ? 'bg-purple-100 text-purple-800 border border-purple-200'
                        : 'bg-stone-100 text-stone-700 border border-stone-200'
                    }`}>
                      {cliente.cliente?.categoria_cliente === 'vip' && '⭐ VIP'}
                      {cliente.cliente?.categoria_cliente === 'premium' && '💎 Premium'}
                      {(!cliente.cliente?.categoria_cliente || cliente.cliente?.categoria_cliente === 'regular') && '👤 Regular'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      cliente.rol === 'bloqueado'
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : 'bg-green-100 text-green-800 border border-green-200'
                    }`}>
                      {cliente.rol === 'bloqueado' ? '🔒 Bloqueado' : '✅ Activo'}
                    </span>
                  </td>


            <td className="px-4 py-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onVerDetalle(cliente)}
                  className="inline-flex items-center justify-center p-2 bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-700 rounded-lg transition-all duration-200"
                  title="Ver detalles"
                >
                  <img src={ViewIcon} alt="Ver" className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onEditar(cliente)}
                  className="inline-flex items-center justify-center p-2 bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-700 rounded-lg transition-all duration-200"
                  title="Editar"
                >
                  <img src={UpdateIcon} alt="Editar" className="w-4 h-4" />
                </button>

                {cliente.rol !== 'bloqueado' && (
                  <button
                    onClick={() => onBloquear(cliente)}
                    className="inline-flex items-center justify-center p-2 bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-700 rounded-lg transition-all duration-200"
                    title="Bloquear"
                  >
                    <img src={PasskeyIcon} alt="Bloquear" className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => onEliminar(cliente)}
                  className="inline-flex items-center justify-center p-2 bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 rounded-lg transition-all duration-200"
                  title="Eliminar"
                >
                  <img src={DeleteIcon} alt="Eliminar" className="w-4 h-4" />
                </button>
              </div>
            </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </div>
  );
};

export default ClientesPage;