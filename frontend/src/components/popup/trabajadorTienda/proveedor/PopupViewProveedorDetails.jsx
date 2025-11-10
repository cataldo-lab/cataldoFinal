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

  const tieneRepresentantes = proveedor.representante !== null && proveedor.representante !== undefined;

  return (
    <div className="bg">
      <div className="popup" style={{
        height: 'auto',
        maxHeight: '90vh',
        maxWidth: '1100px',
        overflowY: 'auto',
        padding: '0',
        background: 'linear-gradient(to bottom, #ffffff 0%, #f9fafb 100%)'
      }}>
        {/* Header con gradiente */}
        <div style={{
          background: 'linear-gradient(135deg, #78716c 0%, #57534e 100%)',
          padding: '20px 30px',
          borderRadius: '16px 16px 0 0',
          position: 'relative',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <button
            className='close'
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
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
            <FaTimes style={{ width: '18px', height: '18px', color: 'white' }} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              padding: '12px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FaBuilding style={{ fontSize: '28px', color: 'white' }} />
            </div>
            <div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                margin: '0',
                color: 'white',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                Detalles del Proveedor
              </h2>
              <p style={{
                color: 'rgba(255, 255, 255, 0.9)',
                margin: '3px 0 0 0',
                fontSize: '13px',
                fontWeight: '300'
              }}>
                Información completa del proveedor y su representante
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding: '25px 30px' }}>

          {/* ===== INFORMACIÓN DEL PROVEEDOR ===== */}
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '20px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.3s ease'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '15px',
              paddingBottom: '12px',
              borderBottom: '2px solid #f3f4f6'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #78716c 0%, #57534e 100%)',
                  padding: '8px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(120, 113, 108, 0.3)'
                }}>
                  <FaBuilding style={{ fontSize: '16px', color: 'white' }} />
                </div>
                <h3 style={{
                  fontSize: '16px',
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
                  padding: '8px 16px',
                  background: 'linear-gradient(135deg, #78716c 0%, #57534e 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
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
                <FaEdit style={{ width: '12px', height: '12px' }} />
                Editar
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              {/* Datos Generales */}
              <div style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                padding: '15px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    padding: '6px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FaClipboardList style={{ fontSize: '14px', color: 'white' }} />
                  </div>
                  <h4 style={{
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#1e293b',
                    margin: 0
                  }}>
                    Datos Generales
                  </h4>
                </div>
                <div style={{ fontSize: '12px', color: '#475569', lineHeight: '1.6' }}>
                 {/* <div style={{
                    padding: '6px 0',
                    borderBottom: '1px dashed #cbd5e1'
                  }}>
                    <span style={{ fontWeight: '600', color: '#334155', display: 'block', marginBottom: '3px', fontSize: '11px' }}>ID</span>
                    
                    <span style={{
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '700',
                      fontFamily: 'monospace'
                    }}>
                      #{proveedor.id_proveedor}
                    </span>
                    
                  </div>*/}
                  <div style={{
                    padding: '6px 0',
                    borderBottom: '1px dashed #cbd5e1'
                  }}>
                    <span style={{ fontWeight: '600', color: '#334155', display: 'block', marginBottom: '3px', fontSize: '11px' }}>Empresa</span>
                    <span style={{ fontWeight: '700', color: '#1e293b', fontSize: '13px' }}>{proveedor.rol_proveedor}</span>
                  </div>
                  <div style={{ padding: '6px 0' }}>
                    <span style={{ fontWeight: '600', color: '#334155', display: 'block', marginBottom: '3px', fontSize: '11px' }}>RUT</span>
                    <span style={{
                      fontFamily: 'monospace',
                      backgroundColor: '#ffffff',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600',
                      border: '1px solid #e2e8f0',
                      display: 'inline-block'
                    }}>
                      {proveedor.rut_proveedor}
                    </span>
                  </div>
                </div>
              </div>

              {/* Teléfono */}
              <div style={{
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                padding: '15px',
                borderRadius: '10px',
                border: '1px solid #bbf7d0'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    padding: '6px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FaPhone style={{ fontSize: '14px', color: 'white' }} />
                  </div>
                  <h4 style={{
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#064e3b',
                    margin: 0
                  }}>
                    Teléfono
                  </h4>
                </div>
                <div style={{ fontSize: '12px', color: '#065f46' }}>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: '#065f46', marginBottom: '6px' }}>Número de contacto</div>
                  <a href={`tel:${proveedor.fono_proveedor}`} style={{
                    color: '#059669',
                    textDecoration: 'none',
                    fontWeight: '700',
                    fontSize: '14px',
                    transition: 'color 0.2s',
                    display: 'block'
                  }}>
                    {proveedor.fono_proveedor}
                  </a>
                </div>
              </div>

              {/* Correo */}
              <div style={{
                background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                padding: '15px',
                borderRadius: '10px',
                border: '1px solid #93c5fd'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                    padding: '6px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FaEnvelope style={{ fontSize: '14px', color: 'white' }} />
                  </div>
                  <h4 style={{
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#0c4a6e',
                    margin: 0
                  }}>
                    Correo Electrónico
                  </h4>
                </div>
                <div style={{ fontSize: '12px', color: '#0c4a6e' }}>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: '#0c4a6e', marginBottom: '6px' }}>Email de contacto</div>
                  <a href={`mailto:${proveedor.correo_proveedor}`} style={{
                    color: '#0284c7',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '12px',
                    wordBreak: 'break-all',
                    transition: 'color 0.2s',
                    display: 'block'
                  }}>
                    {proveedor.correo_proveedor}
                  </a>
                </div>
              </div>
            </div>

            {/* Estadísticas si existen */}
            {proveedor.estadisticas && (
              <div style={{
                marginTop: '20px',
                paddingTop: '15px',
                borderTop: '2px solid #f3f4f6'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    padding: '6px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FaChartBar style={{ fontSize: '14px', color: 'white' }} />
                  </div>
                  <h4 style={{
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#1f2937',
                    margin: 0
                  }}>
                    Estadísticas del Proveedor
                  </h4>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '12px'
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
                    padding: '12px',
                    borderRadius: '10px',
                    textAlign: 'center',
                    border: '1px solid #c4b5fd'
                  }}>
                    <div style={{
                      fontSize: '24px',
                      fontWeight: '800',
                      color: '#5b21b6',
                      marginBottom: '3px'
                    }}>
                      {proveedor.estadisticas.total_materiales || 0}
                    </div>
                    <div style={{
                      fontSize: '11px',
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
                    padding: '12px',
                    borderRadius: '10px',
                    textAlign: 'center',
                    border: '1px solid #93c5fd'
                  }}>
                    <div style={{
                      fontSize: '24px',
                      fontWeight: '800',
                      color: '#1d4ed8',
                      marginBottom: '3px'
                    }}>
                      {proveedor.estadisticas.total_representantes || 0}
                    </div>
                    <div style={{
                      fontSize: '11px',
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
                    padding: '12px',
                    borderRadius: '10px',
                    textAlign: 'center',
                    border: '1px solid #6ee7b7'
                  }}>
                    <div style={{
                      fontSize: '24px',
                      fontWeight: '800',
                      color: '#047857',
                      marginBottom: '3px'
                    }}>
                      {proveedor.estadisticas.materiales_activos || 0}
                    </div>
                    <div style={{
                      fontSize: '11px',
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

          {/* ===== REPRESENTANTE ===== */}
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '20px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '15px',
              paddingBottom: '12px',
              borderBottom: '2px solid #f3f4f6'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  padding: '8px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)'
                }}>
                  <FaUserTie style={{ fontSize: '16px', color: 'white' }} />
                </div>
                <div>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#1f2937',
                    margin: 0
                  }}>
                    Representante
                  </h3>
                  <span style={{
                    fontSize: '11px',
                    color: '#6b7280',
                    fontWeight: '500'
                  }}>
                    
                  </span>
                </div>
              </div>
              {!tieneRepresentantes ? (
                <button
                  onClick={() => onAddRepresentante && onAddRepresentante(proveedor)}
                  style={{
                    padding: '8px 16px',
                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
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
                  Agregar
                </button>



              ) : (
                <button
                  onClick={() => {
                    const representante = proveedor.representante;
                    onEditRepresentante && onEditRepresentante(representante, proveedor);
                  }}
                  style={{
                    padding: '8px 16px',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 4px rgba(245, 158, 11, 0.3)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(245, 158, 11, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(245, 158, 11, 0.3)';
                  }}
                >
                  <FaEdit />
                  Actualizar
                </button>
              )}
            </div>
            



            {tieneRepresentantes ? (
              <div>
                <div style={{
                    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                    padding: '15px',
                    borderRadius: '10px',
                    border: '1px solid #bbf7d0'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '12px'
                    }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{
                          fontSize: '15px',
                          fontWeight: '700',
                          color: '#064e3b',
                          margin: '0 0 4px 0'
                        }}>
                          {proveedor.representante.nombre_representante} {proveedor.representante.apellido_representante}
                        </h4>
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.7)',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          display: 'inline-block'
                        }}>
                          <span style={{
                            fontSize: '12px',
                            color: '#059669',
                            fontWeight: '600'
                          }}>
                            {proveedor.representante.cargo_representante}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => onEditRepresentante && onEditRepresentante(proveedor.representante, proveedor)}
                          style={{
                            padding: '6px',
                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
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
                          <FaEdit style={{ width: '12px', height: '12px' }} />
                        </button>
                        <button
                          onClick={() => onDeleteRepresentante && onDeleteRepresentante(proveedor.representante.id_representante)}
                          style={{
                            padding: '6px',
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
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
                          <FaTrash style={{ width: '12px', height: '12px' }} />
                        </button>
                      </div>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '12px',
                      paddingTop: '12px',
                      borderTop: '1px dashed #bbf7d0'
                    }}>
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.6)',
                        padding: '10px',
                        borderRadius: '6px',
                        border: '1px solid #bbf7d0'
                      }}>
                        <div style={{
                          fontSize: '10px',
                          fontWeight: '600',
                          color: '#065f46',
                          marginBottom: '4px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          RUT
                        </div>
                        <div style={{
                          fontFamily: 'monospace',
                          fontSize: '12px',
                          fontWeight: '700',
                          color: '#064e3b'
                        }}>
                          {proveedor.representante.rut_representante}
                        </div>
                      </div>

                      <div style={{
                        background: 'rgba(255, 255, 255, 0.6)',
                        padding: '10px',
                        borderRadius: '6px',
                        border: '1px solid #bbf7d0'
                      }}>
                        <div style={{
                          fontSize: '10px',
                          fontWeight: '600',
                          color: '#065f46',
                          marginBottom: '4px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}>
                          <FaPhone style={{ fontSize: '9px' }} /> Teléfono
                        </div>
                        <a href={`tel:${proveedor.representante.fono_representante}`} style={{
                          color: '#059669',
                          textDecoration: 'none',
                          fontWeight: '700',
                          fontSize: '12px'
                        }}>
                          {proveedor.representante.fono_representante}
                        </a>
                      </div>

                      <div style={{
                        background: 'rgba(255, 255, 255, 0.6)',
                        padding: '10px',
                        borderRadius: '6px',
                        border: '1px solid #bbf7d0',
                        gridColumn: 'span 2'
                      }}>
                        <div style={{
                          fontSize: '10px',
                          fontWeight: '600',
                          color: '#065f46',
                          marginBottom: '4px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}>
                          <FaEnvelope style={{ fontSize: '9px' }} /> Correo
                        </div>
                        <a href={`mailto:${proveedor.representante.correo_representante}`} style={{
                          color: '#0284c7',
                          textDecoration: 'none',
                          fontWeight: '600',
                          fontSize: '12px',
                          wordBreak: 'break-all'
                        }}>
                          {proveedor.representante.correo_representante}
                        </a>
                      </div>
                    </div>
                  </div>
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '30px 20px',
                color: '#6b7280',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
                borderRadius: '10px',
                border: '1px dashed #d1d5db'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
                  padding: '15px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FaUserTie style={{ fontSize: '32px', color: '#9ca3af' }} />
                </div>
                <div>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    marginBottom: '3px',
                    color: '#374151'
                  }}>
                    Sin representante asignado
                  </p>
                  <p style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    fontWeight: '500'
                  }}>
                    Este proveedor no tiene un representante registrado
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ===== BOTONES DE ACCIÓN ===== */}
          <div style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'flex-end',
            paddingTop: '15px',
            borderTop: '2px solid #f3f4f6'
          }}>
            <button
              onClick={handleClose}
              style={{
                padding: '10px 24px',
                background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '13px',
                boxShadow: '0 2px 4px rgba(107, 114, 128, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
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
              <FaTimes style={{ fontSize: '12px' }} />
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}