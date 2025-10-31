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
    <div className="clientes-page">
      <div className="clientes-header">
        <h1>Gestión de Clientes</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setModalCrear(true)}
        >
          + Nuevo Cliente
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
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando clientes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">❌ {error}</p>
        <button onClick={refetch} className="btn btn-secondary">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="lista-clientes-container">
      {/* Barra de búsqueda avanzada */}
      <div className="search-section">
        <div className="search-header">
          <h3>🔍 Búsqueda de Clientes</h3>
          <button 
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="btn btn-sm btn-secondary"
          >
            {mostrarFiltros ? '▲ Ocultar Filtros' : '▼ Mostrar Filtros'}
          </button>
        </div>

        {mostrarFiltros && (
          <form onSubmit={handleBuscar} className="search-form">
            <div className="search-filters">
              <div className="form-group">
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  placeholder="Buscar por nombre..."
                  value={filtros.nombre}
                  onChange={handleChangeFiltro}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  placeholder="Buscar por email..."
                  value={filtros.email}
                  onChange={handleChangeFiltro}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="categoria">Categoría</label>
                <select
                  id="categoria"
                  name="categoria"
                  value={filtros.categoria}
                  onChange={handleChangeFiltro}
                  className="form-control"
                >
                  <option value="">Todas</option>
                  <option value="regular">Regular</option>
                  <option value="vip">VIP</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
            </div>

            <div className="search-actions">
              <button type="submit" className="btn btn-primary">
                🔍 Buscar
              </button>
              <button 
                type="button" 
                onClick={handleLimpiar} 
                className="btn btn-secondary"
              >
                🔄 Limpiar
              </button>
              <button 
                type="button" 
                onClick={refetch} 
                className="btn btn-secondary"
              >
                ↻ Recargar Todos
              </button>
            </div>
          </form>
        )}

        {/* Mostrar filtros activos */}
        {modoBusqueda && Object.keys(filtrosActivos).length > 0 && (
          <div className="filtros-activos">
            <span className="filtros-label">Filtros aplicados:</span>
            {Object.entries(filtrosActivos).map(([key, value]) => (
              <span key={key} className="filtro-tag">
                {key}: <strong>{value}</strong>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Estadísticas */}
      <div className="stats">
        <span>
          {modoBusqueda ? (
            <>Resultados de búsqueda: <strong>{total}</strong></>
          ) : (
            <>Total de clientes: <strong>{total}</strong></>
          )}
        </span>
      </div>

      {/* Tabla de clientes */}
      {clientes.length === 0 ? (
        <div className="empty-state">
          <p>
            {modoBusqueda 
              ? '🔍 No se encontraron clientes con los filtros aplicados' 
              : '📋 No hay clientes registrados'}
          </p>
        </div>
      ) : (
        <div className="table-container">
          <table className="clientes-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre Completo</th>
                <th>Email</th>
                <th>RUT</th>
                <th>Categoría</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.id}</td>
                  <td>{cliente.nombreCompleto}</td>
                  <td>{cliente.email}</td>
                  <td>{cliente.rut}</td>
                  <td>
                    <span className={`badge badge-categoria badge-${cliente.cliente?.categoria_cliente || 'regular'}`}>
                      {cliente.cliente?.categoria_cliente === 'vip' && '⭐ VIP'}
                      {cliente.cliente?.categoria_cliente === 'premium' && '💎 Premium'}
                      {(!cliente.cliente?.categoria_cliente || cliente.cliente?.categoria_cliente === 'regular') && '👤 Regular'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${cliente.rol === 'bloqueado' ? 'danger' : 'success'}`}>
                      {cliente.rol === 'bloqueado' ? '🔒 Bloqueado' : '✅ Activo'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      onClick={() => onVerDetalle(cliente)}
                      className="btn btn-sm btn-info"
                      title="Ver detalles"
                    >
                      👁️
                    </button>
                    <button
                      onClick={() => onEditar(cliente)}
                      className="btn btn-sm btn-warning"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    {cliente.rol !== 'bloqueado' && (
                      <button
                        onClick={() => onBloquear(cliente)}
                        className="btn btn-sm btn-danger"
                        title="Bloquear"
                      >
                        🔒
                      </button>
                    )}
                    <button
                      onClick={() => onEliminar(cliente)}
                      className="btn btn-sm btn-danger"
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClientesPage;