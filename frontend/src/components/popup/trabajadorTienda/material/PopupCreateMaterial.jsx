// frontend/src/components/popup/trabajadorTienda/material/PopupCreateMaterial.jsx
import { useState } from 'react';
import Form from '@components/Form';
import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';
import QuestionIcon from '@assets/QuestionCircleIcon.svg';

export default function PopupCreateMaterial({ 
  show, 
  setShow, 
  proveedores,
  onSubmit 
}) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setError(null);
    setLoading(true);

    try {
      // Validar datos obligatorios
      if (!formData.nombre_material || !formData.unidad_medida || !formData.precio_unitario) {
        setError('Por favor completa todos los campos obligatorios');
        setLoading(false);
        return;
      }

      // Validar precio positivo
      if (parseFloat(formData.precio_unitario) <= 0) {
        setError('El precio unitario debe ser mayor a 0');
        setLoading(false);
        return;
      }

      // Validar stock mínimo
      

      const existencia = parseInt(formData.existencia_material) || 0;

      if (existencia < 0) {
        setError('La existencia no puede ser negativa');
        setLoading(false);
        return;
      }

      // Formatear datos para enviar
      const materialData = {
        nombre_material: formData.nombre_material.trim(),
        unidad_medida: formData.unidad_medida,
        precio_unitario: parseFloat(formData.precio_unitario),
        stock_minimo: existencia,
        existencia_material: existencia,
        id_proveedor: formData.id_proveedor ? parseInt(formData.id_proveedor) : null,
        activo: true
      };

      console.log('📤 Datos a enviar:', materialData);

      const [success, errorMsg] = await onSubmit(materialData);
      
      if (success) {
        setShow(false);
        // Resetear el formulario
        setError(null);
      } else {
        setError(errorMsg || 'Error al crear material');
      }
    } catch (error) {
      console.error('❌ Error al crear material:', error);
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

  // Preparar opciones mostrando representantes
  const opcionesProveedores = Array.isArray(proveedores) 
    ? proveedores.map(p => {
        if (p.representante) {
          return {
            value: p.id_proveedor.toString(),
            label: `👤 ${p.representante.nombre_completo} - ${p.rol_proveedor}`
          };
        }
        return {
          value: p.id_proveedor.toString(),
          label: `🏢 ${p.rol_proveedor}`
        };
      })
    : [];

  return (
    <div className="bg">
      <div className="popup" style={{ height: 'auto', maxHeight: '90vh', maxWidth: '600px', overflowY: 'auto' }}>
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

        {error && (
          <div className="error-message visible" style={{
            margin: '10px 20px',
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

        <Form
          title="Crear Nuevo Material"
          fields={[
            {
              label: "Nombre del Material *",
              name: "nombre_material",
              placeholder: 'Ej: Madera de Pino 2x4',
              fieldType: 'input',
              type: "text",
              required: true,
              minLength: 3,
              maxLength: 100,
            },
            {
              label: "Unidad de Medida *",
              name: "unidad_medida",
              fieldType: 'select',
              options: [
                { value: 'unidad', label: 'Unidades (u)' },
                { value: 'm', label: 'Metros (m)' },
                { value: 'cm', label: 'Centímetros (cm)' },
                { value: 'mm', label: 'Milímetros (mm)' },
                { value: 'kg', label: 'Kilogramos (kg)' },
                { value: 'g', label: 'Gramos (g)' },
                { value: 'lt', label: 'Litros (L)' },
                { value: 'ml', label: 'Mililitros (ml)' },
                { value: 'paquete', label: 'Paquetes' },
                { value: 'docena', label: 'Docenas' },
                { value: 'par', label: 'Pares' }
              ],
              required: true,
              defaultValue: ''
            },
            {
              label: "Precio Unitario * (CLP)",
              name: "precio_unitario",
              placeholder: '5000',
              fieldType: 'input',
              type: "number",
              required: true,
              min: 0,
              step: "1"
            },
            {
              label: (
                <span>
                  Existencia Inicial
                  <span className='tooltip-icon' style={{ marginLeft: '5px' }}>
                    <img src={QuestionIcon} alt="Ayuda" style={{ width: '16px', height: '16px' }} />
                    <span className='tooltip-text'>Cantidad actual en inventario (opcional, por defecto 0)</span>
                  </span>
                </span>
              ),
              name: "existencia_material",
              placeholder: '0',
              fieldType: 'input',
              type: "number",
              required: false,
              min: 0,
              defaultValue: '0'
            },
            {
              label: (
                <span>
                  Proveedor / Representante
                  <span className='tooltip-icon' style={{ marginLeft: '5px' }}>
                    <img src={QuestionIcon} alt="Ayuda" style={{ width: '16px', height: '16px' }} />
                    <span className='tooltip-text'>Selecciona el representante/proveedor del material (opcional)</span>
                  </span>
                </span>
              ),
              name: "id_proveedor",
              fieldType: 'select',
              options: [
                { value: '', label: '-- Sin proveedor --' },
                ...opcionesProveedores
              ],
              required: false
            }
          ]}
          onSubmit={handleSubmit}
          buttonText={loading ? "Creando..." : "Crear Material"}
          backgroundColor={'#fff'}
          buttonDisabled={loading}
        />
      </div>
    </div>
  );
}