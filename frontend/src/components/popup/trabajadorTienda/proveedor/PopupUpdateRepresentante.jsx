// frontend/src/components/popup/trabajadorTienda/proveedor/PopupUpdateRepresentante.jsx
import { useState, useEffect } from 'react';
import { FaTimes, FaEdit, FaUserTie, FaSpinner, FaIdCard, FaPhone, FaEnvelope, FaBriefcase } from 'react-icons/fa';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert.js';

export default function PopupUpdateRepresentante({ show, setShow, representante, proveedor, onSubmit }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre_representante: '',
    apellido_representante: '',
    rut_representante: '',
    cargo_representante: '',
    fono_representante: '',
    correo_representante: ''
  });

  // Prellenar el formulario cuando cambia el representante
  useEffect(() => {
    if (representante) {
      setFormData({
        nombre_representante: representante.nombre_representante || '',
        apellido_representante: representante.apellido_representante || '',
        rut_representante: representante.rut_representante || '',
        cargo_representante: representante.cargo_representante || '',
        fono_representante: representante.fono_representante || '',
        correo_representante: representante.correo_representante || ''
      });
    }
  }, [representante]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!representante?.id_representante) {
      showErrorAlert('Error', 'No se encontró el ID del representante');
      return;
    }

    setLoading(true);

    try {
      const [result, error] = await onSubmit(representante.id_representante, formData);

      if (result) {
        showSuccessAlert('¡Actualizado!', 'El representante se actualizó exitosamente');
        handleClose();
      } else {
        showErrorAlert('Error', error || 'No se pudo actualizar el representante');
      }
    } catch (error) {
      showErrorAlert('Error', 'Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShow(false);
  };

  if (!show || !representante || !proveedor) return null;

  return (
    <div className="bg" style={{ zIndex: 1001 }}>
      <div className="popup" style={{
        maxWidth: '700px',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: 'white',
        borderRadius: '16px'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
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
              <FaEdit style={{ fontSize: '28px', color: 'white' }} />
            </div>
            <div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                margin: '0',
                color: 'white',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                Actualizar Representante
              </h2>
              <p style={{
                color: 'rgba(255, 255, 255, 0.9)',
                margin: '3px 0 0 0',
                fontSize: '13px',
                fontWeight: '300'
              }}>
                Proveedor: {proveedor.rol_proveedor}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '25px 30px' }}>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '20px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px',
              paddingBottom: '12px',
              borderBottom: '2px solid #f3f4f6'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                padding: '8px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FaUserTie style={{ fontSize: '16px', color: 'white' }} />
              </div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#1f2937',
                margin: 0
              }}>
                Datos del Representante
              </h3>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '15px'
            }}>
              {/* Nombre */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Nombre *
                </label>
                <input
                  type="text"
                  name="nombre_representante"
                  value={formData.nombre_representante}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              {/* Apellido */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Apellido *
                </label>
                <input
                  type="text"
                  name="apellido_representante"
                  value={formData.apellido_representante}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              {/* RUT */}
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  <FaIdCard style={{ fontSize: '12px' }} />
                  RUT *
                </label>
                <input
                  type="text"
                  name="rut_representante"
                  value={formData.rut_representante}
                  onChange={handleChange}
                  placeholder="12.345.678-9"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'monospace',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              {/* Cargo */}
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  <FaBriefcase style={{ fontSize: '12px' }} />
                  Cargo *
                </label>
                <input
                  type="text"
                  name="cargo_representante"
                  value={formData.cargo_representante}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              {/* Teléfono */}
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  <FaPhone style={{ fontSize: '12px' }} />
                  Teléfono *
                </label>
                <input
                  type="tel"
                  name="fono_representante"
                  value={formData.fono_representante}
                  onChange={handleChange}
                  placeholder="+56 9 1234 5678"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              {/* Correo */}
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  <FaEnvelope style={{ fontSize: '12px' }} />
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  name="correo_representante"
                  value={formData.correo_representante}
                  onChange={handleChange}
                  placeholder="ejemplo@correo.com"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'flex-end',
            paddingTop: '15px',
            borderTop: '2px solid #f3f4f6'
          }}>
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              style={{
                padding: '10px 24px',
                background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '13px',
                opacity: loading ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(107, 114, 128, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              <FaTimes style={{ fontSize: '12px' }} />
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 24px',
                background: loading
                  ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                  : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(245, 158, 11, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {loading ? (
                <>
                  <FaSpinner style={{ fontSize: '12px', animation: 'spin 1s linear infinite' }} />
                  Actualizando...
                </>
              ) : (
                <>
                  <FaEdit style={{ fontSize: '12px' }} />
                  Actualizar Representante
                </>
              )}
            </button>
          </div>
        </form>
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
}
