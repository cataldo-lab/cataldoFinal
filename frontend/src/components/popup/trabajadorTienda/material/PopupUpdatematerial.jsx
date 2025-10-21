// frontend/src/components/popup/trabajadorTienda/material/PopupUpdatematerial.jsx
import { useState, useEffect } from 'react';
import Form from '@components/Form';
import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';
import QuestionIcon from '@assets/QuestionCircleIcon.svg';

export default function PopupUpdateMaterial({ 
  show, 
  setShow, 
  material,
  proveedores,
  onSubmit 
}) {
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!show) {
      setError(null);
    }
  }, [show]);

  const handleSubmit = async (formData) => {
    setError(null);

    try {
      if (!formData.nombre_material || !formData.unidad_medida || !formData.precio_unitario) {
        setError('Por favor completa todos los campos obligatorios');
        return;
      }

      const materialData = {
        nombre_material: formData.nombre_material.trim(),
        unidad_medida: formData.unidad_medida,
        precio_unitario: parseFloat(formData.precio_unitario),
        stock_minimo: parseInt(formData.stock_minimo),
        existencia_material: parseInt(formData.existencia_material),
        id_proveedor: formData.id_proveedor || null,
        observaciones_material: formData.observaciones_material || null,
        activo: formData.activo === 'true'
      };

      console.log('📤 Actualizando material:', materialData);

      const [success, errorMsg] = await onSubmit(material.id_material, materialData);
      
      if (success) {
        setShow(false);
      } else {
        setError(errorMsg || 'Error al actualizar material');
      }
    } catch (error) {
      console.error('❌ Error al actualizar material:', error);
      setError('Ocurrió un error inesperado');
    }
  };

  if (!show || !material) return null;

  return (
    <div className="bg">
      <div className="popup" style={{ height: '700px', maxWidth: '90vw', overflowY: 'auto' }}>
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
          title={`Editar Material #${material.id_material}`}
          fields={[
            {
              label: "Nombre del Material",
              name: "nombre_material",
              defaultValue: material.nombre_material,
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
              defaultValue: material.unidad_medida
            },
            {
              label: "Precio Unitario",
              name: "precio_unitario",
              defaultValue: material.precio_unitario,
              placeholder: '5000',
              fieldType: 'input',
              type: "number",
              required: true,
              min: 0,
              step: "0.01"
            },
            {
              label: "Stock Mínimo",
              name: "stock_minimo",
              defaultValue: material.stock_minimo,
              placeholder: '10',
              fieldType: 'input',
              type: "number",
              required: true,
              min: 0
            },
            {
              label: "Existencia Actual",
              name: "existencia_material",
              defaultValue: material.existencia_material,
              placeholder: '0',
              fieldType: 'input',
              type: "number",
              required: true,
              min: 0
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
                  label: `${p.nombre_representanter || ''} ${p.apellido_representante || ''}`.trim()
                }))
              ],
              required: false,
              defaultValue: material.id_proveedor || ''
            },
            {
              label: "Estado",
              name: "activo",
              fieldType: 'select',
              options: [
                { value: 'true', label: 'Activo' },
                { value: 'false', label: 'Inactivo' }
              ],
              required: true,
              defaultValue: material.activo ? 'true' : 'false'
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
              defaultValue: material.observaciones_material || '',
              placeholder: 'Notas adicionales sobre el material...',
              fieldType: 'textarea',
              required: false,
              maxLength: 500
            }
          ]}
          onSubmit={handleSubmit}
          buttonText="Actualizar Material"
          backgroundColor={'#fff'}
        />
      </div>
    </div>
  );
}