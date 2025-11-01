import { useState, useEffect } from 'react';
import CloseIcon from '@assets/XIcon.svg';

export default function PopupUpdateProveedor({ 
  show, 
  setShow, 
  proveedor,
  onSubmit 
}) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Estados del formulario
  const [formData, setFormData] = useState({
    rol_proveedor: '',
    rut_proveedor: '',
    fono_proveedor: '',
    correo_proveedor: ''
  });

  // Efecto para cargar datos del proveedor cuando se abre el modal
  useEffect(() => {
    if (show && proveedor) {
      setFormData({
        rol_proveedor: proveedor.rol_proveedor || '',
        rut_proveedor: proveedor.rut_proveedor || '',
        fono_proveedor: proveedor.fono_proveedor || '',
        correo_proveedor: proveedor.correo_proveedor || ''
      });
      setError(null);
    }
  }, [show, proveedor]);

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

      // Preparar datos para enviar (solo los que han cambiado)
      const dataToSend = {};
      
      if (formData.rol_proveedor !== proveedor.rol_proveedor) {
        dataToSend.rol_proveedor = formData.rol_proveedor.trim();
      }
      if (formData.rut_proveedor !== proveedor.rut_proveedor) {
        dataToSend.rut_proveedor = formData.rut_proveedor.trim();
      }
      if (formData.fono_proveedor !== proveedor.fono_proveedor) {
        dataToSend.fono_proveedor = formData.fono_proveedor.trim();
      }
      if (formData.correo_proveedor !== proveedor.correo_proveedor) {
        dataToSend.correo_proveedor = formData.correo_proveedor.trim().toLowerCase();
      }

      // Si no hay cambios
      if (Object.keys(dataToSend).length === 0) {
        setError('No se han detectado cambios');
        setLoading(false);
        return;
      }

      console.log('📤 Datos a enviar:', dataToSend);

      const [success, errorMsg] = await onSubmit(proveedor.id_proveedor, dataToSend);
      
      if (success) {
        setError(null);
        setShow(false);
      } else {
        setError(errorMsg || 'Error al actualizar proveedor');
      }
    } catch (error) {
      console.error('❌ Error al actualizar proveedor:', error);
      setError('Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setShow(false);
  };

  if (!show || !proveedor) return null;

  return (
    <div className="bg">
      <div className="popup" style={{ 
        height: 'auto', 
        maxHeight: '90vh', 
        maxWidth: '600px', 
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
          <span style={{ fontSize: '32px' }}>✏️</span>
          Editar Proveedor
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '25px', fontSize: '14px' }}>
          Actualiza la información del proveedor {proveedor.rol_proveedor}
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
          {/* ===== INFORMACIÓN DEL PROVEEDOR ===== */}
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
              <div>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
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
              </div>

              <div>
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
            </div>
          </div>

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
                  Actualizando...
                </>
              ) : (
                <>
                  <span>💾</span>
                  Guardar Cambios
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