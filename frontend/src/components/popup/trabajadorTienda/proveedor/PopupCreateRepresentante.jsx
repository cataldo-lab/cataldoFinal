import { useState } from 'react';
import {
  FaTimes,
  FaUserPlus,
  FaUserTie,
  FaClipboardList,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner
} from 'react-icons/fa';

export default function PopupCreateRepresentante({ 
  show, 
  setShow, 
  proveedor,
  onSubmit 
}) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Estados del formulario
  const [formData, setFormData] = useState({
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
      // Validar datos del representante
      if (!formData.nombre_representante || !formData.apellido_representante || 
          !formData.rut_representante || !formData.cargo_representante || 
          !formData.fono_representante || !formData.correo_representante) {
        setError('Por favor completa todos los campos del representante');
        setLoading(false);
        return;
      }

      // Preparar datos para enviar
      const dataToSend = {
        nombre_representante: formData.nombre_representante.trim(),
        apellido_representante: formData.apellido_representante.trim(),
        rut_representante: formData.rut_representante.trim(),
        cargo_representante: formData.cargo_representante.trim(),
        fono_representante: formData.fono_representante.trim(),
        correo_representante: formData.correo_representante.trim().toLowerCase()
      };

      console.log('📤 Datos del representante a enviar:', dataToSend);

      const [success, errorMsg] = await onSubmit(proveedor.id_proveedor, dataToSend);
      
      if (success) {
        // Resetear formulario
        setFormData({
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
        setError(errorMsg || 'Error al crear representante');
      }
    } catch (error) {
      console.error('❌ Error al crear representante:', error);
      setError('Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setFormData({
      nombre_representante: '',
      apellido_representante: '',
      rut_representante: '',
      cargo_representante: '',
      fono_representante: '',
      correo_representante: ''
    });
    setShow(false);
  };

  if (!show || !proveedor) return null;

  return (
    <div
      className="bg popup-layer-2"
      style={{
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)'
      }}
    >
      <div className="popup" style={{ 
        height: 'auto', 
        maxHeight: '90vh', 
        maxWidth: '700px', 
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
          <FaUserPlus style={{ fontSize: '32px', color: '#22c55e' }} />
          Agregar Representante
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '25px', fontSize: '14px' }}>
          Agrega un representante para <strong>{proveedor.rol_proveedor}</strong>
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
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <FaExclamationTriangle />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* ===== INFORMACIÓN DEL PROVEEDOR ===== */}
          <div style={{
            backgroundColor: '#f3f4f6',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #d1d5db'
          }}>
            <h4 style={{
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '8px',
              color: '#374151',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <FaClipboardList /> Información del Proveedor:
            </h4>
            <div style={{ fontSize: '13px', color: '#6b7280' }}>
              <p><strong>Empresa:</strong> {proveedor.rol_proveedor}</p>
              <p><strong>RUT:</strong> {proveedor.rut_proveedor}</p>
              <p><strong>Contacto:</strong> {proveedor.correo_proveedor}</p>
            </div>
          </div>

          {/* ===== SECCIÓN REPRESENTANTE ===== */}
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
              <FaUserTie /> Datos del Representante
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
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #bbf7d0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
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
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #bbf7d0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
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
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #bbf7d0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
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
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #bbf7d0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
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
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #bbf7d0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
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
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  name="correo_representante"
                  value={formData.correo_representante}
                  onChange={handleChange}
                  placeholder="representante@proveedor.cl"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #bbf7d0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#22c55e'}
                  onBlur={(e) => e.target.style.borderColor = '#bbf7d0'}
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
                backgroundColor: '#22c55e',
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
              onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#16a34a')}
              onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#22c55e')}
            >
              {loading ? (
                <>
                  <FaSpinner style={{
                    display: 'inline-block',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                  Creando...
                </>
              ) : (
                <>
                  <FaCheckCircle />
                  Agregar Representante
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