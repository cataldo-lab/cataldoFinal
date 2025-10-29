import { useState } from 'react';
import CloseIcon from '@assets/XIcon.svg';
import QuestionIcon from '@assets/QuestionCircleIcon.svg';

export default function PopupCreateProveedorConRepresentante({ 
  show, 
  setShow, 
  onSubmit 
}) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [incluirRepresentante, setIncluirRepresentante] = useState(true);
  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: '"Montserrat", sans-serif',
    backgroundColor: 'white',
    outline: 'none',
    transition: 'border-color 0.2s',
    letterSpacing: 'normal',
    wordSpacing: 'normal'
  };

  // Estados del formulario
  const [formData, setFormData] = useState({
    // Datos del proveedor
    rol_proveedor: '',
    rut_proveedor: '',
    fono_proveedor: '',
    correo_proveedor: '',
    
    // Datos del representante
    nombre_representante: '',
    apellido_representante: '',
    rut_representante: '',
    cargo_representante: '',
    fono_representante: '',
    correo_representante: ''
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
    setError(null);
    setLoading(true);

    try {
      // Validar datos del proveedor
      if (!formData.rol_proveedor || !formData.rut_proveedor || 
          !formData.fono_proveedor || !formData.correo_proveedor) {
        setError('Por favor completa todos los campos del proveedor');
        setLoading(false);
        return;
      }

      // Si incluye representante, validar sus datos
      if (incluirRepresentante) {
        if (!formData.nombre_representante || !formData.apellido_representante || 
            !formData.rut_representante || !formData.cargo_representante || 
            !formData.fono_representante || !formData.correo_representante) {
          setError('Por favor completa todos los campos del representante');
          setLoading(false);
          return;
        }
      }

      // Preparar datos para enviar
      const dataToSend = {
        proveedor: {
          rol_proveedor: formData.rol_proveedor.trim(),
          rut_proveedor: formData.rut_proveedor.trim(),
          fono_proveedor: formData.fono_proveedor.trim(),
          correo_proveedor: formData.correo_proveedor.trim().toLowerCase()
        },
        representante: incluirRepresentante ? {
          nombre_representante: formData.nombre_representante.trim(),
          apellido_representante: formData.apellido_representante.trim(),
          rut_representante: formData.rut_representante.trim(),
          cargo_representante: formData.cargo_representante.trim(),
          fono_representante: formData.fono_representante.trim(),
          correo_representante: formData.correo_representante.trim().toLowerCase()
        } : {}
      };

      console.log('📤 Datos a enviar:', dataToSend);

      const [success, errorMsg] = await onSubmit(dataToSend);
      
      if (success) {
        // Resetear formulario
        setFormData({
          rol_proveedor: '',
          rut_proveedor: '',
          fono_proveedor: '',
          correo_proveedor: '',
          nombre_representante: '',
          apellido_representante: '',
          rut_representante: '',
          cargo_representante: '',
          fono_representante: '',
          correo_representante: ''
        });
        setError(null);
        setShow(false);
      } else {
        setError(errorMsg || 'Error al crear proveedor');
      }
    } catch (error) {
      console.error('❌ Error al crear proveedor:', error);
      setError('Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="bg">
      <div className="popup" style={{ 
        height: 'auto', 
        maxHeight: '95vh', 
        maxWidth: '800px', 
        overflowY: 'auto',
        padding: '30px'
      }}>
        <button 
          className='close' 
          onClick={handleClose}
          disabled={loading}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'none',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            padding: '5px',
            zIndex: 10,
            opacity: loading ? 0.5 : 1
          }}
        >
          <img src={CloseIcon} alt="Cerrar" style={{ width: '24px', height: '24px' }} />
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
          <span style={{ fontSize: '32px' }}>🏢</span>
          Crear Nuevo Proveedor
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '25px', fontSize: '14px' }}>
          Completa la información del proveedor y opcionalmente su representante
        </p>

        {error && (
          <div style={{
            margin: '0 0 20px 0',
            padding: '12px 16px',
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            borderRadius: '8px',
            border: '1px solid #fecaca',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* ===== SECCIÓN PROVEEDOR ===== */}
          <div style={{
            backgroundColor: '#f9fafb',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '20px',
            border: '2px solid #e5e7eb'
          }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              marginBottom: '15px',
              color: '#374151',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>🏢</span> Información del Proveedor
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ 
                  display: 'block', 
                  fontWeight: '600', 
                  marginBottom: '6px',
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Nombre / Rol del Proveedor *
                </label>
                <input
                  type="text"
                  name="rol_proveedor"
                  value={formData.rol_proveedor}
                  onChange={handleChange}
                  placeholder="Ej: Maderas del Sur S.A."
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#78716c'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontWeight: '600', 
                  marginBottom: '6px',
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  RUT del Proveedor *
                </label>
                <input
                  type="text"
                  name="rut_proveedor"
                  value={formData.rut_proveedor}
                  onChange={handleChange}
                  placeholder="12.345.678-9"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#78716c'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontWeight: '600', 
                  marginBottom: '6px',
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Teléfono *
                </label>
                <input
                  type="text"
                  name="fono_proveedor"
                  value={formData.fono_proveedor}
                  onChange={handleChange}
                  placeholder="+56912345678"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#78716c'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ 
                  display: 'block', 
                  fontWeight: '600', 
                  marginBottom: '6px',
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Correo Electrónico *
                </label>
                <input
                type="email"
                name="correo_proveedor"
                value={formData.correo_proveedor}
                onChange={handleChange}
                placeholder="contacto@proveedor.cl"
                required
                style={{
                  ...inputStyle,
                  border: '2px solid #d1d5db'
                }}
                onFocus={(e) => e.target.style.borderColor = '#78716c'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
              </div>
            </div>
          </div>

          {/* ===== CHECKBOX INCLUIR REPRESENTANTE ===== */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: '#fef3c7',
            borderRadius: '8px',
            border: '2px solid #fcd34d'
          }}>
            <input
              type="checkbox"
              id="incluir_representante"
              checked={incluirRepresentante}
              onChange={(e) => setIncluirRepresentante(e.target.checked)}
              style={{
                width: '20px',
                height: '20px',
                cursor: 'pointer',
                accentColor: '#78716c'
              }}
            />
            <label 
              htmlFor="incluir_representante" 
              style={{ 
                fontWeight: '600', 
                cursor: 'pointer',
                color: '#92400e',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>👤</span>
              Agregar representante del proveedor
            </label>
          </div>

          {/* ===== SECCIÓN REPRESENTANTE ===== */}
          {incluirRepresentante && (
            <div style={{
              backgroundColor: '#f0fdf4',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '20px',
              border: '2px solid #bbf7d0'
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                marginBottom: '15px',
                color: '#166534',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>👤</span> Información del Representante
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontWeight: '600', 
                    marginBottom: '6px',
                    color: '#166534',
                    fontSize: '14px'
                  }}>
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="nombre_representante"
                    value={formData.nombre_representante}
                    onChange={handleChange}
                    placeholder="Juan"
                    required={incluirRepresentante}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #bbf7d0',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#22c55e'}
                    onBlur={(e) => e.target.style.borderColor = '#bbf7d0'}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontWeight: '600', 
                    marginBottom: '6px',
                    color: '#166534',
                    fontSize: '14px'
                  }}>
                    Apellido *
                  </label>
                  <input
                    type="text"
                    name="apellido_representante"
                    value={formData.apellido_representante}
                    onChange={handleChange}
                    placeholder="Pérez"
                    required={incluirRepresentante}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #bbf7d0',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#22c55e'}
                    onBlur={(e) => e.target.style.borderColor = '#bbf7d0'}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontWeight: '600', 
                    marginBottom: '6px',
                    color: '#166534',
                    fontSize: '14px'
                  }}>
                    RUT *
                  </label>
                  <input
                    type="text"
                    name="rut_representante"
                    value={formData.rut_representante}
                    onChange={handleChange}
                    placeholder="12.345.678-9"
                    required={incluirRepresentante}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #bbf7d0',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#22c55e'}
                    onBlur={(e) => e.target.style.borderColor = '#bbf7d0'}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontWeight: '600', 
                    marginBottom: '6px',
                    color: '#166534',
                    fontSize: '14px'
                  }}>
                    Cargo *
                  </label>
                  <input
                    type="text"
                    name="cargo_representante"
                    value={formData.cargo_representante}
                    onChange={handleChange}
                    placeholder="Gerente de Ventas"
                    required={incluirRepresentante}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #bbf7d0',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#22c55e'}
                    onBlur={(e) => e.target.style.borderColor = '#bbf7d0'}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontWeight: '600', 
                    marginBottom: '6px',
                    color: '#166534',
                    fontSize: '14px'
                  }}>
                    Teléfono *
                  </label>
                  <input
                    type="text"
                    name="fono_representante"
                    value={formData.fono_representante}
                    onChange={handleChange}
                    placeholder="+56987654321"
                    required={incluirRepresentante}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #bbf7d0',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#22c55e'}
                    onBlur={(e) => e.target.style.borderColor = '#bbf7d0'}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontWeight: '600', 
                    marginBottom: '6px',
                    color: '#166534',
                    fontSize: '14px'
                  }}>
                    Correo *
                  </label>
                  <input
                  type="email"
                  name="correo_representante"
                  value={formData.correo_representante}
                  onChange={handleChange}
                  placeholder="representante@proveedor.cl"
                  required={incluirRepresentante}
                  style={{
                    ...inputStyle,
                    border: '2px solid #bbf7d0'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#22c55e'}
                  onBlur={(e) => e.target.style.borderColor = '#bbf7d0'}
                />
                </div>
              </div>
            </div>
          )}

          {/* ===== BOTONES ===== */}
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            justifyContent: 'flex-end',
            marginTop: '25px'
          }}>
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              style={{
                padding: '12px 24px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
                transition: 'all 0.2s',
                fontSize: '14px'
              }}
              onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#4b5563')}
              onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#6b7280')}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px 24px',
                backgroundColor: '#78716c',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px'
              }}
              onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#57534e')}
              onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#78716c')}
            >
              {loading ? (
                <>
                  <span style={{ 
                    display: 'inline-block', 
                    width: '16px', 
                    height: '16px', 
                    border: '2px solid white', 
                    borderTopColor: 'transparent', 
                    borderRadius: '50%', 
                    animation: 'spin 0.8s linear infinite' 
                  }} />
                  Creando...
                </>
              ) : (
                <>
                  <span>✓</span>
                  Crear Proveedor
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}