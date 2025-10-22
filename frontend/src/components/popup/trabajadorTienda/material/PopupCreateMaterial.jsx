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

  const handleSubmit = async (formData) => {
    setError(null);

    try {
      // Validar datos obligatorios
      if (!formData.nombre_material || !formData.unidad_medida || !formData.precio_unitario) {
        setError('Por favor completa todos los campos obligatorios');
        return;
      }

      // Formatear datos para enviar
      const materialData = {
        nombre_material: formData.nombre_material.trim(),
        unidad_medida: formData.unidad_medida,
        precio_unitario: parseFloat(formData.precio_unitario),
        stock_minimo: parseInt(formData.stock_minimo) || 10,
        existencia_material: parseInt(formData.existencia_material) || 0,
        id_proveedor: formData.id_proveedor || null,
        observaciones_material: formData.observaciones_material || null,
        activo: true
      };

      console.log('📤 Datos a enviar:', materialData);

      const [success, errorMsg] = await onSubmit(materialData);
      
      if (success) {
        setShow(false);
      } else {
        setError(errorMsg || 'Error al crear material');
      }
    } catch (error) {
      console.error('❌ Error al crear material:', error);
      setError('Ocurrió un error inesperado');
    }
  };

  if (!show) return null;

  return (
    <div className="bg">
      <div className="popup" style={{ height: '650px', maxWidth: '90vw', overflowY: 'auto' }}>
        <button 
          className='close' 
          onClick={() => setShow(false)}
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
          <img src={CloseIcon} alt="Cerrar" style={{ width: '24px', height: '24px' }} />
        </button>

        {error && (
          <div className="error-message visible" style={{
            margin: '10px 20px',
            padding: '10px',
            backgroundColor: '#ffebee',
            color: '#c62828',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <Form
          title="Crear Nuevo Material"
          fields={[
            {
              label: "Nombre del Material",
              name: "nombre_material",
              placeholder: 'Madera de Pino 2x4',
              fieldType: 'input',
              type: "text",
              required: true,
              minLength: 3,
              maxLength: 100,
            },
            {
              label: "Unidad de Medida",
              name: "unidad_medida",
              fieldType: 'select',
              options: [
                { value: 'metros', label: 'Metros (m)' },
                { value: 'kilos', label: 'Kilogramos (kg)' },
                { value: 'litros', label: 'Litros (L)' },
                { value: 'unidades', label: 'Unidades (u)' },
                { value: 'metros2', label: 'Metros cuadrados (m²)' },
                { value: 'metros3', label: 'Metros cúbicos (m³)' },
                { value: 'cajas', label: 'Cajas' },
                { value: 'paquetes', label: 'Paquetes' }
              ],
              required: true,
              defaultValue: 'unidades'
            },
            {
              label: "Precio Unitario",
              name: "precio_unitario",
              placeholder: '5000',
              fieldType: 'input',
              type: "number",
              required: true,
              min: 0,
              step: "0.01"
            },
            {
              label: (
                <span>
                  Stock Mínimo
                  <span className='tooltip-icon'>
                    <img src={QuestionIcon} alt="Ayuda" />
                    <span className='tooltip-text'>Cantidad mínima antes de alerta</span>
                  </span>
                </span>
              ),
              name: "stock_minimo",
              placeholder: '10',
              fieldType: 'input',
              type: "number",
              required: false,
              min: 0,
              defaultValue: '10'
            },
            {
              label: (
                <span>
                  Existencia Inicial
                  <span className='tooltip-icon'>
                    <img src={QuestionIcon} alt="Ayuda" />
                    <span className='tooltip-text'>Cantidad actual en inventario</span>
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
                  Proveedor
                  <span className='tooltip-icon'>
                    <img src={QuestionIcon} alt="Ayuda" />
                    <span className='tooltip-text'>Opcional - puedes dejarlo vacío</span>
                  </span>
                </span>
              ),
              name: "id_proveedor",
              fieldType: 'select',
              options: [
                { value: '', label: 'Sin proveedor' },
                ...proveedores.map(p => ({
                  value: p.id_proveedor,
                  label: p.rol_proveedor
                }))
              ],
              required: false
            },
            {
              label: (
                <span>
                  Observaciones
                  <span className='tooltip-icon'>
                    <img src={QuestionIcon} alt="Ayuda" />
                    <span className='tooltip-text'>Campo opcional</span>
                  </span>
                </span>
              ),
              name: "observaciones_material",
              placeholder: 'Notas adicionales sobre el material...',
              fieldType: 'textarea',
              required: false,
              maxLength: 500
            }
          ]}
          onSubmit={handleSubmit}
          buttonText="Crear Material"
          backgroundColor={'#fff'}
        />
      </div>
    </div>
  );
}