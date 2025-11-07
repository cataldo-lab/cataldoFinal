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
  FaClipboardList,
  FaInfoCircle,
  FaCrown
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
        maxWidth: '950px',
        overflowY: 'auto',
        padding: '0',
        background: 'linear-gradient(to bottom, #ffffff 0%, #f9fafb 100%)'
      }}>
        {/* Header con gradiente */}
        <div style={{
          background: 'linear-gradient(135deg, #78716c 0%, #57534e 100%)',
          padding: '30px 40px',
          borderRadius: '16px 16px 0 0',
          position: 'relative',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <button
            className='close'
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: 'none',
              cursor: 'pointer',
              padding: '10px',
              borderRadius: '50%',
              zIndex: 10,
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <FaTimes style={{ width: '20px', height: '20px', color: 'white' }} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              padding: '15px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FaBuilding style={{ fontSize: '36px', color: 'white' }} />
            </div>
            <div>
              <h2 style={{
                fontSize: '32px',
                fontWeight: 'bold',
                margin: '0',
                color: 'white',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                Detalles del Proveedor
              </h2>
              <p style={{
                color: 'rgba(255, 255, 255, 0.9)',
                margin: '5px 0 0 0',
                fontSize: '15px',
                fontWeight: '300'
              }}>
                Información completa del proveedor y sus representantes
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding: '30px 40px' }}>

          {/* ===== INFORMACIÓN DEL PROVEEDOR ===== */}
          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '16px',
            marginBottom: '25px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
            transition: 'all 0.3s ease'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              paddingBottom: '15px',
              borderBottom: '2px solid #f3f4f6'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #78716c 0%, #57534e 100%)',
                  padding: '10px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 6px -1px rgba(120, 113, 108, 0.3)'
                }}>
                  <FaBuilding style={{ fontSize: '20px', color: 'white' }} />
                </div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#1f2937',
                  margin: 0
                }}>
                  Información del Proveedor
                </h3>
              </div>
              <button
                onClick={() => onEditProveedor && onEditProveedor(proveedor)}
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #78716c 0%, #57534e 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 4px rgba(120, 113, 108, 0.2)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(120, 113, 108, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(120, 113, 108, 0.2)';
                }}
              >
                <FaEdit style={{ width: '14px', height: '14px' }} />
                Editar Proveedor
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
              {/* Datos Generales */}
              <div style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '15px'
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    padding: '8px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FaClipboardList style={{ fontSize: '16px', color: 'white' }} />
                  </div>
                  <h4 style={{
                    fontSize: '15px',
                    fontWeight: '700',
                    color: '#1e293b',
                    margin: 0
                  }}>
                    Datos Generales
                  </h4>
                </div>
                <div style={{ fontSize: '14px', color: '#475569', lineHeight: '2' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 0',
                    borderBottom: '1px dashed #cbd5e1'
                  }}>
                    <span style={{ fontWeight: '600', color: '#334155', minWidth: '70px' }}>ID:</span>
                    <span style={{
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      color: 'white',
                      padding: '3px 10px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '700',
                      fontFamily: 'monospace'
                    }}>
                      #{proveedor.id_proveedor}
                    </span>
                  </div>
                  <div style={{
                    padding: '8px 0',
                    borderBottom: '1px dashed #cbd5e1'
                  }}>
                    <span style={{ fontWeight: '600', color: '#334155', display: 'block', marginBottom: '4px' }}>Empresa:</span>
                    <span style={{ fontWeight: '700', color: '#1e293b', fontSize: '15px' }}>{proveedor.rol_proveedor}</span>
                  </div>
                  <div style={{ padding: '8px 0' }}>
                    <span style={{ fontWeight: '600', color: '#334155', display: 'block', marginBottom: '4px' }}>RUT:</span>
                    <span style={{
                      fontFamily: 'monospace',
                      backgroundColor: '#ffffff',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      border: '2px solid #e2e8f0',
                      display: 'inline-block'
                    }}>
                      {proveedor.rut_proveedor}
                    </span>
                  </div>
                </div>
              </div>

              {/* Información de Contacto */}
              <div style={{
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #bbf7d0'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '15px'
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    padding: '8px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FaPhone style={{ fontSize: '16px', color: 'white' }} />
                  </div>
                  <h4 style={{
                    fontSize: '15px',
                    fontWeight: '700',
                    color: '#064e3b',
                    margin: 0
                  }}>
                    Información de Contacto
                  </h4>
                </div>
                <div style={{ fontSize: '14px', color: '#065f46', lineHeight: '2' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 0',
                    borderBottom: '1px dashed #bbf7d0'
                  }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      padding: '8px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '32px',
                      minHeight: '32px'
                    }}>
                      <FaPhone style={{ fontSize: '14px', color: 'white' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: '600', color: '#065f46', marginBottom: '2px' }}>Teléfono</div>
                      <a href={`tel:${proveedor.fono_proveedor}`} style={{
                        color: '#059669',
                        textDecoration: 'none',
                        fontWeight: '700',
                        fontSize: '15px',
                        transition: 'color 0.2s'
                      }}>
                        {proveedor.fono_proveedor}
                      </a>
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 0'
                  }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                      padding: '8px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '32px',
                      minHeight: '32px'
                    }}>
                      <FaEnvelope style={{ fontSize: '14px', color: 'white' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '11px', fontWeight: '600', color: '#065f46', marginBottom: '2px' }}>Correo Electrónico</div>
                      <a href={`mailto:${proveedor.correo_proveedor}`} style={{
                        color: '#0284c7',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '13px',
                        wordBreak: 'break-all',
                        transition: 'color 0.2s'
                      }}>
                        {proveedor.correo_proveedor}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Estadísticas si existen */}
            {proveedor.estadisticas && (
              <div style={{
                marginTop: '25px',
                paddingTop: '25px',
                borderTop: '2px solid #f3f4f6'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '15px'
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    padding: '8px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FaChartBar style={{ fontSize: '16px', color: 'white' }} />
                  </div>
                  <h4 style={{
                    fontSize: '15px',
                    fontWeight: '700',
                    color: '#1f2937',
                    margin: 0
                  }}>
                    Estadísticas del Proveedor
                  </h4>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '15px'
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
                    padding: '16px',
                    borderRadius: '12px',
                    textAlign: 'center',
                    border: '2px solid #c4b5fd',
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{
                      fontSize: '32px',
                      fontWeight: '800',
                      color: '#5b21b6',
                      marginBottom: '5px'
                    }}>
                      {proveedor.estadisticas.total_materiales || 0}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: '#7c3aed',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Materiales
                    </div>
                  </div>
                  <div style={{
                    background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                    padding: '16px',
                    borderRadius: '12px',
                    textAlign: 'center',
                    border: '2px solid #93c5fd',
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{
                      fontSize: '32px',
                      fontWeight: '800',
                      color: '#1d4ed8',
                      marginBottom: '5px'
                    }}>
                      {proveedor.estadisticas.total_representantes || 0}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: '#2563eb',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Representantes
                    </div>
                  </div>
                  <div style={{
                    background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                    padding: '16px',
                    borderRadius: '12px',
                    textAlign: 'center',
                    border: '2px solid #6ee7b7',
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{
                      fontSize: '32px',
                      fontWeight: '800',
                      color: '#047857',
                      marginBottom: '5px'
                    }}>
                      {proveedor.estadisticas.materiales_activos || 0}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: '#059669',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Activos
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ===== REPRESENTANTES ===== */}
          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '16px',
            marginBottom: '25px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              paddingBottom: '15px',
              borderBottom: '2px solid #f3f4f6'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  padding: '10px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.3)'
                }}>
                  <FaUsers style={{ fontSize: '20px', color: 'white' }} />
                </div>
                <div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#1f2937',
                    margin: 0
                  }}>
                    Representantes
                  </h3>
                  <span style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    fontWeight: '500'
                  }}>
                    {tieneRepresentantes ? `${proveedor.representantes.length} representante${proveedor.representantes.length > 1 ? 's' : ''}` : 'Sin representantes'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onAddRepresentante && onAddRepresentante(proveedor)}
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 4px rgba(34, 197, 94, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(34, 197, 94, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(34, 197, 94, 0.3)';
                }}
              >
                <FaPlus />
                Agregar Representante
              </button>
            </div>

            {tieneRepresentantes ? (
              <div style={{ display: 'grid', gap: '18px' }}>
                {proveedor.representantes.map((representante, index) => (
                  <div key={representante.id_representante || index} style={{
                    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '2px solid #bbf7d0',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {/* Badge de número de representante */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      fontSize: '14px',
                      boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)'
                    }}>
                      {index + 1}
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '15px',
                      paddingLeft: '45px'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                          <div style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            padding: '8px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <FaUserTie style={{ fontSize: '18px', color: 'white' }} />
                          </div>
                          <h4 style={{
                            fontSize: '18px',
                            fontWeight: '700',
                            color: '#064e3b',
                            margin: 0
                          }}>
                            {representante.nombre_representante} {representante.apellido_representante}
                          </h4>
                        </div>
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.7)',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          display: 'inline-block',
                          marginLeft: '50px'
                        }}>
                          <span style={{
                            fontSize: '14px',
                            color: '#059669',
                            fontWeight: '600'
                          }}>
                            {representante.cargo_representante}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => onEditRepresentante && onEditRepresentante(representante, proveedor)}
                          style={{
                            padding: '8px',
                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 2px 4px rgba(245, 158, 11, 0.3)'
                          }}
                          title="Editar representante"
                          onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 8px rgba(245, 158, 11, 0.4)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 4px rgba(245, 158, 11, 0.3)';
                          }}
                        >
                          <FaEdit style={{ width: '14px', height: '14px' }} />
                        </button>
                        <button
                          onClick={() => onDeleteRepresentante && onDeleteRepresentante(representante.id_representante)}
                          style={{
                            padding: '8px',
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)'
                          }}
                          title="Eliminar representante"
                          onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 8px rgba(239, 68, 68, 0.4)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 4px rgba(239, 68, 68, 0.3)';
                          }}
                        >
                          <FaTrash style={{ width: '14px', height: '14px' }} />
                        </button>
                      </div>
                    </div>

                    {/* Información de contacto del representante */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '15px',
                      marginTop: '15px',
                      paddingTop: '15px',
                      borderTop: '2px dashed #bbf7d0'
                    }}>
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.6)',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #bbf7d0'
                      }}>
                        <div style={{
                          fontSize: '11px',
                          fontWeight: '600',
                          color: '#065f46',
                          marginBottom: '6px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          RUT
                        </div>
                        <div style={{
                          fontFamily: 'monospace',
                          fontSize: '14px',
                          fontWeight: '700',
                          color: '#064e3b'
                        }}>
                          {representante.rut_representante}
                        </div>
                      </div>

                      <div style={{
                        background: 'rgba(255, 255, 255, 0.6)',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #bbf7d0'
                      }}>
                        <div style={{
                          fontSize: '11px',
                          fontWeight: '600',
                          color: '#065f46',
                          marginBottom: '6px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <FaPhone style={{ fontSize: '10px' }} /> Teléfono
                        </div>
                        <a href={`tel:${representante.fono_representante}`} style={{
                          color: '#059669',
                          textDecoration: 'none',
                          fontWeight: '700',
                          fontSize: '14px'
                        }}>
                          {representante.fono_representante}
                        </a>
                      </div>

                      <div style={{
                        background: 'rgba(255, 255, 255, 0.6)',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #bbf7d0',
                        gridColumn: 'span 2'
                      }}>
                        <div style={{
                          fontSize: '11px',
                          fontWeight: '600',
                          color: '#065f46',
                          marginBottom: '6px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <FaEnvelope style={{ fontSize: '10px' }} /> Correo Electrónico
                        </div>
                        <a href={`mailto:${representante.correo_representante}`} style={{
                          color: '#0284c7',
                          textDecoration: 'none',
                          fontWeight: '600',
                          fontSize: '14px',
                          wordBreak: 'break-all'
                        }}>
                          {representante.correo_representante}
                        </a>
                      </div>

                      {representante.creado_en && (
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.6)',
                          padding: '12px',
                          borderRadius: '8px',
                          border: '1px solid #bbf7d0',
                          gridColumn: 'span 2'
                        }}>
                          <div style={{
                            fontSize: '11px',
                            fontWeight: '600',
                            color: '#065f46',
                            marginBottom: '6px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <FaInfoCircle style={{ fontSize: '10px' }} /> Fecha de Registro
                          </div>
                          <div style={{
                            fontWeight: '600',
                            fontSize: '14px',
                            color: '#064e3b'
                          }}>
                            {new Date(representante.creado_en).toLocaleDateString('es-CL', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '50px 20px',
                color: '#6b7280',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '15px',
                background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
                borderRadius: '12px',
                border: '2px dashed #d1d5db'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
                  padding: '20px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FaUserTie style={{ fontSize: '48px', color: '#9ca3af' }} />
                </div>
                <div>
                  <p style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    marginBottom: '5px',
                    color: '#374151'
                  }}>
                    Sin representantes asignados
                  </p>
                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    fontWeight: '500'
                  }}>
                    Este proveedor aún no tiene representantes registrados
                  </p>
                </div>
                <button
                  onClick={() => onAddRepresentante && onAddRepresentante(proveedor)}
                  style={{
                    marginTop: '10px',
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 4px rgba(34, 197, 94, 0.3)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(34, 197, 94, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(34, 197, 94, 0.3)';
                  }}
                >
                  <FaPlus />
                  Agregar Primer Representante
                </button>
              </div>
            )}
          </div>

          {/* ===== BOTONES DE ACCIÓN ===== */}
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
            paddingTop: '20px',
            borderTop: '2px solid #f3f4f6'
          }}>
            <button
              onClick={handleClose}
              style={{
                padding: '12px 30px',
                background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '14px',
                boxShadow: '0 2px 4px rgba(107, 114, 128, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(107, 114, 128, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(107, 114, 128, 0.3)';
              }}
            >
              <FaTimes style={{ fontSize: '14px' }} />
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}