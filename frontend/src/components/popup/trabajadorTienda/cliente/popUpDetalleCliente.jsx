// frontend/src/components/popup/trabajadorTienda/cliente/popUpDetalleCliente.jsx

import { useClienteDetalle } from '@hooks/clientes/useClienteDetalle';
import {
  FaTimes,
  FaUser,
  FaIdCard,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCrown,
  FaGem,
  FaWhatsapp,
  FaPercentage,
  FaCheckCircle,
  FaTimesCircle,
  FaEdit,
  FaShieldAlt,
  FaGlobe,
  FaMapPin,
  FaCity
} from 'react-icons/fa';

const PopUpDetalleCliente = ({ isOpen, onClose, onEditar, clienteId }) => {
  const { usuario, clienteDetalle, loading } = useClienteDetalle(clienteId);

  if (!isOpen) return null;

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
          background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
          padding: '20px 30px',
          borderRadius: '16px 16px 0 0',
          position: 'relative',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <button
            className='close'
            onClick={onClose}
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
              <FaUser style={{ fontSize: '28px', color: 'white' }} />
            </div>
            <div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                margin: '0',
                color: 'white',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                Detalle del Cliente
              </h2>
              <p style={{
                color: 'rgba(255, 255, 255, 0.9)',
                margin: '3px 0 0 0',
                fontSize: '13px',
                fontWeight: '300'
              }}>
                Información completa del cliente
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 20px',
            gap: '16px'
          }}>
            <div style={{ position: 'relative', width: '64px', height: '64px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                border: '4px solid #e5e7eb',
                borderRadius: '50%'
              }}></div>
              <div style={{
                width: '64px',
                height: '64px',
                border: '4px solid #6b7280',
                borderTop: '4px solid transparent',
                borderRadius: '50%',
                position: 'absolute',
                top: '0',
                animation: 'spin 1s linear infinite'
              }}></div>
            </div>
            <p style={{ color: '#6b7280', fontWeight: '600' }}>Cargando detalles...</p>
          </div>
        ) : (
          <div style={{ padding: '25px 30px' }}>

            {/* ===== INFORMACIÓN DE USUARIO ===== */}
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
                alignItems: 'center',
                gap: '10px',
                marginBottom: '15px',
                paddingBottom: '12px',
                borderBottom: '2px solid #f3f4f6'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                  padding: '8px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(107, 114, 128, 0.3)'
                }}>
                  <FaUser style={{ fontSize: '16px', color: 'white' }} />
                </div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#1f2937',
                  margin: 0
                }}>
                  Información de Usuario
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                {/* Nombre Completo */}
                <div style={{
                  background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                  padding: '15px',
                  borderRadius: '10px',
                  border: '1px solid #d1d5db',
                  gridColumn: 'span 2'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px'
                  }}>
                    <FaUser style={{ fontSize: '14px', color: '#4b5563' }} />
                    <h4 style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      color: '#374151',
                      margin: 0,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Nombre Completo
                    </h4>
                  </div>
                  <p style={{
                    fontSize: '15px',
                    fontWeight: '700',
                    color: '#1f2937',
                    margin: 0
                  }}>
                    {usuario?.nombreCompleto}
                  </p>
                </div>

                {/* Estado */}
                <div style={{
                  background: usuario?.rol === 'bloqueado'
                    ? 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)'
                    : 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                  padding: '15px',
                  borderRadius: '10px',
                  border: usuario?.rol === 'bloqueado' ? '1px solid #fca5a5' : '1px solid #6ee7b7',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: usuario?.rol === 'bloqueado' ? '#991b1b' : '#065f46',
                    marginBottom: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Estado
                  </div>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: '700',
                    color: usuario?.rol === 'bloqueado' ? '#dc2626' : '#059669'
                  }}>
                    {usuario?.rol === 'bloqueado' ? '🔒 Bloqueado' : '✅ Activo'}
                  </div>
                </div>

                {/* RUT */}
                <div style={{
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  padding: '15px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '8px'
                  }}>
                    <FaIdCard style={{ fontSize: '12px', color: '#64748b' }} />
                    <div style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      color: '#475569',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      RUT
                    </div>
                  </div>
                  <div style={{
                    fontFamily: 'monospace',
                    backgroundColor: '#ffffff',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '700',
                    border: '1px solid #e2e8f0',
                    color: '#1e293b'
                  }}>
                    {usuario?.rut}
                  </div>
                </div>

                {/* Email */}
                <div style={{
                  background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                  padding: '15px',
                  borderRadius: '10px',
                  border: '1px solid #fcd34d'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '8px'
                  }}>
                    <FaEnvelope style={{ fontSize: '12px', color: '#d97706' }} />
                    <div style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      color: '#92400e',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Email
                    </div>
                  </div>
                  <a href={`mailto:${usuario?.email}`} style={{
                    color: '#b45309',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '13px',
                    wordBreak: 'break-all',
                    display: 'block'
                  }}>
                    {usuario?.email}
                  </a>
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
                    gap: '6px',
                    marginBottom: '8px'
                  }}>
                    <FaPhone style={{ fontSize: '12px', color: '#059669' }} />
                    <div style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      color: '#065f46',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Teléfono
                    </div>
                  </div>
                  <a href={`tel:${usuario?.telefono}`} style={{
                    color: '#059669',
                    textDecoration: 'none',
                    fontWeight: '700',
                    fontSize: '14px'
                  }}>
                    {usuario?.telefono || '—'}
                  </a>
                </div>
              </div>

              {/* Dirección */}
              {(usuario?.calle || usuario?.comuna) && (
                <div style={{
                  marginTop: '20px',
                  paddingTop: '20px',
                  borderTop: '2px solid #f3f4f6'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px'
                  }}>
                    <FaMapMarkerAlt style={{ fontSize: '14px', color: '#ef4444' }} />
                    <h4 style={{
                      fontSize: '13px',
                      fontWeight: '700',
                      color: '#1f2937',
                      margin: 0
                    }}>
                      Dirección
                    </h4>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    {usuario?.calle && (
                      <div style={{
                        background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #fecaca',
                        gridColumn: 'span 2'
                      }}>
                        <div style={{
                          fontSize: '10px',
                          fontWeight: '700',
                          color: '#991b1b',
                          marginBottom: '4px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Calle
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#7f1d1d' }}>
                          {usuario.calle}
                        </div>
                      </div>
                    )}

                    {usuario?.comuna && (
                      <>
                        <div style={{
                          background: '#ffffff',
                          padding: '10px',
                          borderRadius: '6px',
                          border: '1px solid #e5e7eb'
                        }}>
                          <div style={{
                            fontSize: '10px',
                            fontWeight: '600',
                            color: '#6b7280',
                            marginBottom: '3px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <FaMapPin style={{ fontSize: '9px' }} /> Comuna
                          </div>
                          <div style={{ fontSize: '12px', fontWeight: '700', color: '#1f2937' }}>
                            {usuario.comuna.nombre_comuna}
                          </div>
                        </div>

                        {usuario.comuna.provincia && (
                          <div style={{
                            background: '#ffffff',
                            padding: '10px',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb'
                          }}>
                            <div style={{
                              fontSize: '10px',
                              fontWeight: '600',
                              color: '#6b7280',
                              marginBottom: '3px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <FaCity style={{ fontSize: '9px' }} /> Provincia
                            </div>
                            <div style={{ fontSize: '12px', fontWeight: '700', color: '#1f2937' }}>
                              {usuario.comuna.provincia.nombre_provincia}
                            </div>
                          </div>
                        )}

                        {usuario.comuna.provincia?.region && (
                          <div style={{
                            background: '#ffffff',
                            padding: '10px',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb'
                          }}>
                            <div style={{
                              fontSize: '10px',
                              fontWeight: '600',
                              color: '#6b7280',
                              marginBottom: '3px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <FaGlobe style={{ fontSize: '9px' }} /> Región
                            </div>
                            <div style={{ fontSize: '12px', fontWeight: '700', color: '#1f2937' }}>
                              {usuario.comuna.provincia.region.nombre_region}
                            </div>
                          </div>
                        )}

                        {usuario.comuna.provincia?.region?.pais && (
                          <div style={{
                            background: '#ffffff',
                            padding: '10px',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb'
                          }}>
                            <div style={{
                              fontSize: '10px',
                              fontWeight: '600',
                              color: '#6b7280',
                              marginBottom: '3px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <FaShieldAlt style={{ fontSize: '9px' }} /> País
                            </div>
                            <div style={{ fontSize: '12px', fontWeight: '700', color: '#1f2937' }}>
                              {usuario.comuna.provincia.region.pais.nombre_pais}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Fecha de Registro */}
              {usuario?.createdAt && (
                <div style={{
                  marginTop: '20px',
                  paddingTop: '20px',
                  borderTop: '2px solid #f3f4f6',
                  background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #c4b5fd'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '6px'
                  }}>
                    <FaCalendarAlt style={{ fontSize: '12px', color: '#7c3aed' }} />
                    <div style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      color: '#5b21b6',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Fecha de Registro
                    </div>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#6b21a8' }}>
                    {new Date(usuario.createdAt).toLocaleDateString('es-CL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* ===== INFORMACIÓN DE CLIENTE ===== */}
            {clienteDetalle && (
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
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '15px',
                  paddingBottom: '12px',
                  borderBottom: '2px solid #f3f4f6'
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    padding: '8px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(139, 92, 246, 0.3)'
                  }}>
                    <FaIdCard style={{ fontSize: '16px', color: 'white' }} />
                  </div>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#1f2937',
                    margin: 0
                  }}>
                    Información de Cliente
                  </h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                  {/* Categoría */}
                  <div style={{
                    background: clienteDetalle.categoria_cliente === 'vip'
                      ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
                      : clienteDetalle.categoria_cliente === 'premium'
                      ? 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)'
                      : 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                    padding: '15px',
                    borderRadius: '10px',
                    border: clienteDetalle.categoria_cliente === 'vip'
                      ? '1px solid #fcd34d'
                      : clienteDetalle.categoria_cliente === 'premium'
                      ? '1px solid #a5b4fc'
                      : '1px solid #d1d5db',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '32px', marginBottom: '6px' }}>
                      {clienteDetalle.categoria_cliente === 'vip' && <FaCrown style={{ color: '#d97706' }} />}
                      {clienteDetalle.categoria_cliente === 'premium' && <FaGem style={{ color: '#6366f1' }} />}
                      {(!clienteDetalle.categoria_cliente || clienteDetalle.categoria_cliente === 'regular') && <FaUser style={{ color: '#6b7280' }} />}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      color: clienteDetalle.categoria_cliente === 'vip'
                        ? '#92400e'
                        : clienteDetalle.categoria_cliente === 'premium'
                        ? '#4338ca'
                        : '#4b5563',
                      marginBottom: '3px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Categoría
                    </div>
                    <div style={{
                      fontSize: '13px',
                      fontWeight: '700',
                      color: clienteDetalle.categoria_cliente === 'vip'
                        ? '#b45309'
                        : clienteDetalle.categoria_cliente === 'premium'
                        ? '#4f46e5'
                        : '#6b7280'
                    }}>
                      {clienteDetalle.categoria_cliente === 'vip' && 'VIP'}
                      {clienteDetalle.categoria_cliente === 'premium' && 'Premium'}
                      {(!clienteDetalle.categoria_cliente || clienteDetalle.categoria_cliente === 'regular') && 'Regular'}
                    </div>
                  </div>

                  {/* Descuento */}
                  <div style={{
                    background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                    padding: '15px',
                    borderRadius: '10px',
                    border: '1px solid #6ee7b7',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '32px', marginBottom: '6px' }}>
                      <FaPercentage style={{ color: '#059669' }} />
                    </div>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      color: '#065f46',
                      marginBottom: '3px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Descuento
                    </div>
                    <div style={{
                      fontSize: '24px',
                      fontWeight: '800',
                      color: '#047857'
                    }}>
                      {clienteDetalle.descuento_cliente || 0}%
                    </div>
                  </div>

                  {/* Uso de Datos */}
                  <div style={{
                    background: clienteDetalle.Acepta_uso_datos
                      ? 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)'
                      : 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                    padding: '15px',
                    borderRadius: '10px',
                    border: clienteDetalle.Acepta_uso_datos ? '1px solid #9ca3af' : '1px solid #d1d5db',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '32px', marginBottom: '6px' }}>
                      {clienteDetalle.Acepta_uso_datos
                        ? <FaCheckCircle style={{ color: '#4b5563' }} />
                        : <FaTimesCircle style={{ color: '#9ca3af' }} />
                      }
                    </div>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      color: clienteDetalle.Acepta_uso_datos ? '#374151' : '#6b7280',
                      marginBottom: '3px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Uso de Datos
                    </div>
                    <div style={{
                      fontSize: '13px',
                      fontWeight: '700',
                      color: clienteDetalle.Acepta_uso_datos ? '#1f2937' : '#9ca3af'
                    }}>
                      {clienteDetalle.Acepta_uso_datos ? 'Acepta' : 'No acepta'}
                    </div>
                  </div>

                  {/* WhatsApp */}
                  {clienteDetalle.whatsapp_cliente && (
                    <div style={{
                      background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                      padding: '15px',
                      borderRadius: '10px',
                      border: '1px solid #86efac'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '8px'
                      }}>
                        <FaWhatsapp style={{ fontSize: '14px', color: '#16a34a' }} />
                        <div style={{
                          fontSize: '11px',
                          fontWeight: '700',
                          color: '#166534',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          WhatsApp
                        </div>
                      </div>
                      <a href={`https://wa.me/${clienteDetalle.whatsapp_cliente}`} style={{
                        color: '#15803d',
                        textDecoration: 'none',
                        fontWeight: '700',
                        fontSize: '14px'
                      }}>
                        {clienteDetalle.whatsapp_cliente}
                      </a>
                    </div>
                  )}

                  {/* Email Alterno */}
                  {clienteDetalle.correo_alterno_cliente && (
                    <div style={{
                      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                      padding: '15px',
                      borderRadius: '10px',
                      border: '1px solid #fcd34d',
                      gridColumn: clienteDetalle.whatsapp_cliente ? 'span 1' : 'span 2'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '8px'
                      }}>
                        <FaEnvelope style={{ fontSize: '12px', color: '#d97706' }} />
                        <div style={{
                          fontSize: '11px',
                          fontWeight: '700',
                          color: '#92400e',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Email Alterno
                        </div>
                      </div>
                      <a href={`mailto:${clienteDetalle.correo_alterno_cliente}`} style={{
                        color: '#b45309',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '13px',
                        wordBreak: 'break-all'
                      }}>
                        {clienteDetalle.correo_alterno_cliente}
                      </a>
                    </div>
                  )}

                  {/* Cumpleaños */}
                  {clienteDetalle.cumpleanos_cliente && (
                    <div style={{
                      background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
                      padding: '15px',
                      borderRadius: '10px',
                      border: '1px solid #f9a8d4',
                      gridColumn: !clienteDetalle.whatsapp_cliente ? 'span 1' : 'span 3'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '8px'
                      }}>
                        <FaCalendarAlt style={{ fontSize: '12px', color: '#db2777' }} />
                        <div style={{
                          fontSize: '11px',
                          fontWeight: '700',
                          color: '#9f1239',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Cumpleaños
                        </div>
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#be123c' }}>
                        {new Date(clienteDetalle.cumpleanos_cliente).toLocaleDateString('es-CL', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ===== BOTONES DE ACCIÓN ===== */}
            <div style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'flex-end',
              paddingTop: '15px',
              borderTop: '2px solid #f3f4f6'
            }}>
              <button
                onClick={onClose}
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
              <button
                onClick={onEditar}
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
                <FaEdit style={{ fontSize: '12px' }} />
                Editar Cliente
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default PopUpDetalleCliente;
