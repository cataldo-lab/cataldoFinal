import { useState, useEffect } from 'react';
import {
  FaTimes,
  FaBuilding,
  FaUsers,
  FaUserTie,
  FaEdit,
  FaTrash,
  FaPlus,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaChartBar,
  FaClipboardList
} from 'react-icons/fa';

export default function PopupViewProveedorDetails({ 
  show, 
  setShow, 
  proveedor,
  onEditProveedor,
  onAddRepresentante,
  onEditRepresentante,
  onDeleteRepresentante 
}) {
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setShow(false);
  };

  if (!show || !proveedor) return null;

  const tieneRepresentantes = proveedor.representantes && proveedor.representantes.length > 0;

  return (
    <div className="bg">
      <div className="popup" style={{ 
        height: 'auto', 
        maxHeight: '95vh', 
        maxWidth: '900px', 
        overflowY: 'auto',
        padding: '30px'
      }}>
        <button
          className='close'
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '5px',
            zIndex: 10
          }}
        >
          <FaTimes style={{ width: '24px', height: '24px' }} />
        </button>

        <h2 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          marginBottom: '10px',
          color: '#1f2937',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <FaBuilding style={{ fontSize: '32px', color: '#78716c' }} />
          Detalles del Proveedor
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '25px', fontSize: '14px' }}>
          Información completa del proveedor y sus representantes
        </p>

        {/* ===== INFORMACIÓN DEL PROVEEDOR ===== */}
        <div style={{
          backgroundColor: '#f9fafb',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '20px',
          border: '2px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#374151',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              margin: 0
            }}>
              <FaBuilding /> Información del Proveedor
            </h3>
            <button
              onClick={() => onEditProveedor && onEditProveedor(proveedor)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#78716c',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '500',
                cursor: 'pointer',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#57534e'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#78716c'}
            >
              <FaEdit style={{ width: '14px', height: '14px' }} />
              Editar
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <h4 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <FaClipboardList /> Datos Generales
              </h4>
              <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>
                <p><strong>ID:</strong> #{proveedor.id_proveedor}</p>
                <p><strong>Empresa:</strong> {proveedor.rol_proveedor}</p>
                <p><strong>RUT:</strong> <span style={{ fontFamily: 'monospace', backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>{proveedor.rut_proveedor}</span></p>
              </div>
            </div>

            <div>
              <h4 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <FaPhone /> Información de Contacto
              </h4>
              <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>
                <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FaPhone className="text-sm" />
                  <strong>Teléfono:</strong> <a href={`tel:${proveedor.fono_proveedor}`} style={{ color: '#059669', textDecoration: 'none' }}>{proveedor.fono_proveedor}</a>
                </p>
                <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FaEnvelope className="text-sm" />
                  <strong>Correo:</strong> <a href={`mailto:${proveedor.correo_proveedor}`} style={{ color: '#0284c7', textDecoration: 'none' }}>{proveedor.correo_proveedor}</a>
                </p>
              </div>
            </div>
          </div>

          {/* Estadísticas si existen */}
          {proveedor.estadisticas && (
            <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #e5e7eb' }}>
              <h4 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <FaChartBar /> Estadísticas
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                <div style={{ padding: '8px 12px', backgroundColor: '#ddd6fe', borderRadius: '6px', textAlign: 'center' }}>
                  <span style={{ fontWeight: '600', color: '#5b21b6' }}>{proveedor.estadisticas.total_materiales || 0}</span>
                  <div style={{ fontSize: '12px', color: '#7c3aed' }}>Materiales</div>
                </div>
                <div style={{ padding: '8px 12px', backgroundColor: '#bfdbfe', borderRadius: '6px', textAlign: 'center' }}>
                  <span style={{ fontWeight: '600', color: '#1d4ed8' }}>{proveedor.estadisticas.total_representantes || 0}</span>
                  <div style={{ fontSize: '12px', color: '#2563eb' }}>Representantes</div>
                </div>
                <div style={{ padding: '8px 12px', backgroundColor: '#bbf7d0', borderRadius: '6px', textAlign: 'center' }}>
                  <span style={{ fontWeight: '600', color: '#059669' }}>{proveedor.estadisticas.materiales_activos || 0}</span>
                  <div style={{ fontSize: '12px', color: '#10b981' }}>Activos</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ===== REPRESENTANTES ===== */}
        <div style={{
          backgroundColor: '#f0fdf4',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '20px',
          border: '2px solid #bbf7d0'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#166534',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              margin: 0
            }}>
              <FaUsers /> Representantes ({tieneRepresentantes ? proveedor.representantes.length : 0})
            </h3>
            <button
              onClick={() => onAddRepresentante && onAddRepresentante(proveedor)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#22c55e',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '500',
                cursor: 'pointer',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#16a34a'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#22c55e'}
            >
              <FaPlus />
              Agregar
            </button>
          </div>

          {tieneRepresentantes ? (
            <div style={{ display: 'grid', gap: '15px' }}>
              {proveedor.representantes.map((representante, index) => (
                <div key={representante.id_representante || index} style={{
                  padding: '15px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  border: '1px solid #bbf7d0'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '10px'
                  }}>
                    <div>
                      <h4 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#166534',
                        margin: '0 0 5px 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <FaUserTie /> {representante.nombre_representante} {representante.apellido_representante}
                      </h4>
                      <p style={{ 
                        fontSize: '14px', 
                        color: '#059669',
                        margin: '0 0 8px 0',
                        fontWeight: '500'
                      }}>
                        {representante.cargo_representante}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => onEditRepresentante && onEditRepresentante(representante, proveedor)}
                        style={{
                          padding: '6px',
                          backgroundColor: '#f59e0b',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'background-color 0.2s'
                        }}
                        title="Editar representante"
                        onMouseOver={(e) => e.target.style.backgroundColor = '#d97706'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#f59e0b'}
                      >
                        <FaEdit style={{ width: '12px', height: '12px' }} />
                      </button>
                      <button
                        onClick={() => onDeleteRepresentante && onDeleteRepresentante(representante.id_representante)}
                        style={{
                          padding: '6px',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'background-color 0.2s'
                        }}
                        title="Eliminar representante"
                        onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
                      >
                        <FaTrash style={{ width: '12px', height: '12px' }} />
                      </button>
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '13px', color: '#6b7280' }}>
                    <div>
                      <p><strong>RUT:</strong> <span style={{ fontFamily: 'monospace' }}>{representante.rut_representante}</span></p>
                      <p><strong>Teléfono:</strong> <a href={`tel:${representante.fono_representante}`} style={{ color: '#059669', textDecoration: 'none' }}>{representante.fono_representante}</a></p>
                    </div>
                    <div>
                      <p><strong>Correo:</strong> <a href={`mailto:${representante.correo_representante}`} style={{ color: '#0284c7', textDecoration: 'none' }}>{representante.correo_representante}</a></p>
                      {representante.creado_en && (
                        <p><strong>Creado:</strong> {new Date(representante.creado_en).toLocaleDateString('es-CL')}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#6b7280',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px'
            }}>
              <FaUserTie style={{ fontSize: '48px', color: '#d1d5db' }} />
              <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '5px' }}>
                Sin representantes
              </p>
              <p style={{ fontSize: '14px' }}>
                Este proveedor no tiene representantes asignados
              </p>
            </div>
          )}
        </div>

        {/* ===== BOTONES DE ACCIÓN ===== */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          justifyContent: 'flex-end',
          marginTop: '25px'
        }}>
          <button
            onClick={handleClose}
            style={{
              padding: '12px 24px',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontSize: '14px'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#4b5563'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#6b7280'}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}