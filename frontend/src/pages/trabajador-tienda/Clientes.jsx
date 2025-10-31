// src/pages/ClientesPage.jsx

import { useState } from 'react';

import {useClientes} from '@hooks/clientes/useClientes';
import { useCliente } from '@hooks/clientes/useCliente';
import { useClienteDetalle } from '@hooks/clientes/useClienteDetalle';
import { useCreateCliente } from '@hooks/clientes/useCreateCliente';
import { useUpdateCliente } from '@hooks/clientes/useUpdateCliente';
import { useDeleteCliente } from '@hooks/clientes/useDeleteCliente';

//import './ClientesPage.css'; 

const ClientesPage = () => {
  // Estados para controlar los modales/vistas
  const [vistaActual, setVistaActual] = useState('lista'); // 'lista', 'crear', 'editar', 'detalle'
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  // Hooks
  const { clientes, loading: loadingLista, error: errorLista, refetch } = useClientes();
  const { 
    usuario: usuarioDetalle, 
    clienteDetalle, 
    loading: loadingDetalle 
  } = useClienteDetalle(clienteSeleccionado?.id);

  return (
    <div className="clientes-page">
      <div className="clientes-header">
        <h1>Gestión de Clientes</h1>
        {vistaActual === 'lista' && (
          <button 
            className="btn btn-primary"
            onClick={() => setVistaActual('crear')}
          >
            + Nuevo Cliente
          </button>
        )}
      </div>

      {/* Vista según el estado */}
      {vistaActual === 'lista' && (
        <ListaClientes
          clientes={clientes}
          loading={loadingLista}
          error={errorLista}
          refetch={refetch}
          onVerDetalle={(cliente) => {
            setClienteSeleccionado(cliente);
            setVistaActual('detalle');
          }}
          onEditar={(cliente) => {
            setClienteSeleccionado(cliente);
            setVistaActual('editar');
          }}
        />
      )}

      {vistaActual === 'crear' && (
        <CrearClienteForm
          onSuccess={() => {
            setVistaActual('lista');
            refetch();
          }}
          onCancel={() => setVistaActual('lista')}
        />
      )}

      {vistaActual === 'editar' && clienteSeleccionado && (
        <EditarClienteForm
          clienteId={clienteSeleccionado.id}
          onSuccess={() => {
            setVistaActual('lista');
            refetch();
          }}
          onCancel={() => setVistaActual('lista')}
        />
      )}

      {vistaActual === 'detalle' && clienteSeleccionado && (
        <DetalleCliente
          usuario={usuarioDetalle}
          clienteDetalle={clienteDetalle}
          loading={loadingDetalle}
          onVolver={() => setVistaActual('lista')}
          onEditar={() => setVistaActual('editar')}
        />
      )}
    </div>
  );
};

// ==================== COMPONENTE: LISTA DE CLIENTES ====================

const ListaClientes = ({ clientes, loading, error, refetch, onVerDetalle, onEditar }) => {
  const { blockCliente, deleteCliente } = useDeleteCliente();
  const [busqueda, setBusqueda] = useState('');

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nombreCompleto?.toLowerCase().includes(busqueda.toLowerCase()) ||
    cliente.email?.toLowerCase().includes(busqueda.toLowerCase()) ||
    cliente.rut?.includes(busqueda)
  );

  const handleBloquear = async (id, nombre) => {
    const motivo = prompt(`¿Motivo para bloquear a ${nombre}?`);
    if (motivo !== null) {
      const resultado = await blockCliente(id, motivo);
      if (resultado.success) {
        alert('Cliente bloqueado exitosamente');
        refetch();
      } else {
        alert(`Error: ${resultado.message}`);
      }
    }
  };

  const handleEliminar = async (id, nombre, soft = true) => {
    const mensaje = soft 
      ? `¿Desea bloquear al cliente ${nombre}?`
      : `¿Desea ELIMINAR PERMANENTEMENTE al cliente ${nombre}? Esta acción no se puede deshacer.`;
    
    if (confirm(mensaje)) {
      const resultado = await deleteCliente(id, soft);
      if (resultado.success) {
        alert(soft ? 'Cliente bloqueado' : 'Cliente eliminado permanentemente');
        refetch();
      } else {
        alert(`Error: ${resultado.message}`);
      }
    }
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
      {/* Barra de búsqueda */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por nombre, email o RUT..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="search-input"
        />
        <button onClick={refetch} className="btn btn-secondary" title="Recargar">
          🔄 Recargar
        </button>
      </div>

      {/* Estadísticas */}
      <div className="stats">
        <span>Total de clientes: <strong>{clientes.length}</strong></span>
        {busqueda && (
          <span> | Resultados: <strong>{clientesFiltrados.length}</strong></span>
        )}
      </div>

      {/* Tabla de clientes */}
      {clientesFiltrados.length === 0 ? (
        <div className="empty-state">
          <p>No se encontraron clientes</p>
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
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientesFiltrados.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.id}</td>
                  <td>{cliente.nombreCompleto}</td>
                  <td>{cliente.email}</td>
                  <td>{cliente.rut}</td>
                  <td>
                    <span className={`badge badge-${cliente.rol === 'BLOQUEADO' ? 'danger' : 'success'}`}>
                      {cliente.rol === 'BLOQUEADO' ? '🔒 Bloqueado' : '✅ Activo'}
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
                    {cliente.rol !== 'BLOQUEADO' && (
                      <button
                        onClick={() => handleBloquear(cliente.id, cliente.nombreCompleto)}
                        className="btn btn-sm btn-danger"
                        title="Bloquear"
                      >
                        🔒
                      </button>
                    )}
                    <button
                      onClick={() => handleEliminar(cliente.id, cliente.nombreCompleto, true)}
                      className="btn btn-sm btn-danger"
                      title="Eliminar (soft)"
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

// ==================== COMPONENTE: CREAR CLIENTE ====================

const CrearClienteForm = ({ onSuccess, onCancel }) => {
  const { createFull, loading, error, success, resetState } = useCreateCliente();

  // Estados del formulario
  const [formData, setFormData] = useState({
    // Datos de usuario
    nombreCompleto: '',
    email: '',
    password: '',
    rut: '',
    // Datos de cliente
    telefono: '',
    direccion: '',
    comuna: '',
    ciudad: '',
    region: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      nombreCompleto: formData.nombreCompleto,
      email: formData.email,
      password: formData.password,
      rut: formData.rut
    };

    const clienteData = {
      telefono: formData.telefono,
      direccion: formData.direccion,
      comuna: formData.comuna,
      ciudad: formData.ciudad,
      region: formData.region
    };

    const resultado = await createFull(userData, clienteData);

    if (resultado.success) {
      alert('✅ Cliente creado exitosamente');
      onSuccess();
    }
  };

  const handleCancel = () => {
    resetState();
    onCancel();
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Crear Nuevo Cliente</h2>
        <button onClick={handleCancel} className="btn btn-secondary">
          ← Volver
        </button>
      </div>

      <form onSubmit={handleSubmit} className="cliente-form">
        {/* Sección: Datos de Usuario */}
        <fieldset>
          <legend>Datos de Usuario</legend>
          
          <div className="form-group">
            <label htmlFor="nombreCompleto">Nombre Completo *</label>
            <input
              type="text"
              id="nombreCompleto"
              name="nombreCompleto"
              value={formData.nombreCompleto}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="rut">RUT *</label>
            <input
              type="text"
              id="rut"
              name="rut"
              placeholder="12345678-9"
              value={formData.rut}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>
        </fieldset>

        {/* Sección: Datos de Cliente */}
        <fieldset>
          <legend>Datos de Cliente</legend>

          <div className="form-group">
            <label htmlFor="telefono">Teléfono</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              placeholder="+56912345678"
              value={formData.telefono}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="direccion">Dirección</label>
            <input
              type="text"
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="comuna">Comuna</label>
              <input
                type="text"
                id="comuna"
                name="comuna"
                value={formData.comuna}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="ciudad">Ciudad</label>
              <input
                type="text"
                id="ciudad"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="region">Región</label>
            <input
              type="text"
              id="region"
              name="region"
              value={formData.region}
              onChange={handleChange}
            />
          </div>
        </fieldset>

        {/* Mensajes de error/éxito */}
        {error && (
          <div className="alert alert-danger">
            ❌ {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            ✅ Cliente creado exitosamente
          </div>
        )}

        {/* Botones */}
        <div className="form-actions">
          <button
            type="button"
            onClick={handleCancel}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Creando...' : 'Crear Cliente'}
          </button>
        </div>
      </form>
    </div>
  );
};

// ==================== COMPONENTE: EDITAR CLIENTE ====================

const EditarClienteForm = ({ clienteId, onSuccess, onCancel }) => {
  const { usuario, clienteDetalle, loading: loadingData } = useClienteDetalle(clienteId);
  const { updateFull, loading, error, resetState } = useUpdateCliente();

  const [formData, setFormData] = useState({
    nombreCompleto: '',
    email: '',
    telefono: '',
    direccion: '',
    comuna: '',
    ciudad: '',
    region: ''
  });

  // Cargar datos cuando estén disponibles
  useState(() => {
    if (usuario && clienteDetalle) {
      setFormData({
        nombreCompleto: usuario.nombreCompleto || '',
        email: usuario.email || '',
        telefono: clienteDetalle.telefono || '',
        direccion: clienteDetalle.direccion || '',
        comuna: clienteDetalle.comuna || '',
        ciudad: clienteDetalle.ciudad || '',
        region: clienteDetalle.region || ''
      });
    }
  }, [usuario, clienteDetalle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      nombreCompleto: formData.nombreCompleto,
      email: formData.email
    };

    const clienteData = {
      telefono: formData.telefono,
      direccion: formData.direccion,
      comuna: formData.comuna,
      ciudad: formData.ciudad,
      region: formData.region
    };

    const resultado = await updateFull(clienteId, userData, clienteData);

    if (resultado.success) {
      alert('✅ Cliente actualizado exitosamente');
      onSuccess();
    }
  };

  const handleCancel = () => {
    resetState();
    onCancel();
  };

  if (loadingData) {
    return <div className="loading-container">Cargando datos del cliente...</div>;
  }

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Editar Cliente</h2>
        <button onClick={handleCancel} className="btn btn-secondary">
          ← Volver
        </button>
      </div>

      <form onSubmit={handleSubmit} className="cliente-form">
        <fieldset>
          <legend>Datos de Usuario</legend>
          
          <div className="form-group">
            <label htmlFor="nombreCompleto">Nombre Completo</label>
            <input
              type="text"
              id="nombreCompleto"
              name="nombreCompleto"
              value={formData.nombreCompleto}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>Datos de Cliente</legend>

          <div className="form-group">
            <label htmlFor="telefono">Teléfono</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="direccion">Dirección</label>
            <input
              type="text"
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="comuna">Comuna</label>
              <input
                type="text"
                id="comuna"
                name="comuna"
                value={formData.comuna}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="ciudad">Ciudad</label>
              <input
                type="text"
                id="ciudad"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="region">Región</label>
            <input
              type="text"
              id="region"
              name="region"
              value={formData.region}
              onChange={handleChange}
            />
          </div>
        </fieldset>

        {error && (
          <div className="alert alert-danger">
            ❌ {error}
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            onClick={handleCancel}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
};

// ==================== COMPONENTE: DETALLE CLIENTE ====================

const DetalleCliente = ({ usuario, clienteDetalle, loading, onVolver, onEditar }) => {
  if (loading) {
    return <div className="loading-container">Cargando detalles...</div>;
  }

  return (
    <div className="detalle-container">
      <div className="detalle-header">
        <h2>Detalle del Cliente</h2>
        <div>
          <button onClick={onVolver} className="btn btn-secondary">
            ← Volver
          </button>
          <button onClick={onEditar} className="btn btn-primary">
            ✏️ Editar
          </button>
        </div>
      </div>

      <div className="detalle-content">
        {/* Datos de Usuario */}
        <section className="detalle-section">
          <h3>Información de Usuario</h3>
          <div className="detalle-grid">
            <div className="detalle-item">
              <strong>ID:</strong>
              <span>{usuario?.id}</span>
            </div>
            <div className="detalle-item">
              <strong>Nombre Completo:</strong>
              <span>{usuario?.nombreCompleto}</span>
            </div>
            <div className="detalle-item">
              <strong>Email:</strong>
              <span>{usuario?.email}</span>
            </div>
            <div className="detalle-item">
              <strong>RUT:</strong>
              <span>{usuario?.rut}</span>
            </div>
            <div className="detalle-item">
              <strong>Rol:</strong>
              <span className={`badge badge-${usuario?.rol === 'BLOQUEADO' ? 'danger' : 'success'}`}>
                {usuario?.rol}
              </span>
            </div>
          </div>
        </section>

        {/* Datos de Cliente */}
        <section className="detalle-section">
          <h3>Información de Cliente</h3>
          <div className="detalle-grid">
            <div className="detalle-item">
              <strong>Teléfono:</strong>
              <span>{clienteDetalle?.telefono || 'No especificado'}</span>
            </div>
            <div className="detalle-item">
              <strong>Dirección:</strong>
              <span>{clienteDetalle?.direccion || 'No especificada'}</span>
            </div>
            <div className="detalle-item">
              <strong>Comuna:</strong>
              <span>{clienteDetalle?.comuna || 'No especificada'}</span>
            </div>
            <div className="detalle-item">
              <strong>Ciudad:</strong>
              <span>{clienteDetalle?.ciudad || 'No especificada'}</span>
            </div>
            <div className="detalle-item">
              <strong>Región:</strong>
              <span>{clienteDetalle?.region || 'No especificada'}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ClientesPage;