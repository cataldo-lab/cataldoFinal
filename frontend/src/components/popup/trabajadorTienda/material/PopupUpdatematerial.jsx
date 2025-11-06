// frontend/src/components/popup/trabajadorTienda/material/PopupUpdateMaterial.jsx
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!show) {
      setError(null);
      setLoading(false);
    }
  }, [show]);

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
      if (parseInt(formData.stock_minimo) < 0) {
        setError('El stock mínimo no puede ser negativo');
        setLoading(false);
        return;
      }

      // Validar existencia
      if (parseInt(formData.existencia_material) < 0) {
        setError('La existencia no puede ser negativa');
        setLoading(false);
        return;
      }

      // Formatear datos para enviar
      const materialData = {
        nombre_material: formData.nombre_material.trim(),
        unidad_medida: formData.unidad_medida,
        precio_unitario: parseFloat(formData.precio_unitario),
        stock_minimo: parseInt(formData.stock_minimo),
        existencia_material: parseInt(formData.existencia_material),
        id_proveedor: formData.id_proveedor ? parseInt(formData.id_proveedor) : null,
        activo: true 
      };

      console.log('📤 PopupUpdate - ID del material:', material.id_material, 'Tipo:', typeof material.id_material);
      console.log('📤 PopupUpdate - Datos:', materialData);
      console.log('📤 Actualizando material:', materialData);

      const [success, errorMsg] = await onSubmit(material.id_material, materialData);
      
      if (success) {
        setShow(false);
        setError(null);
      } else {
        setError(errorMsg || 'Error al actualizar material');
      }
    } catch (error) {
      console.error('❌ Error al actualizar material:', error);
      setError('Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setShow(false);
  };

  if (!show || !material) return null;

  // Calcular estado del stock
  const stockStatus = material.existencia_material < material.stock_minimo ? 'bajo' : 'normal';
  const stockColor = stockStatus === 'bajo' ? '#f59e0b' : '#10b981';

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

        {/* Información del material */}
        <div style={{
          margin: '10px 20px',
          padding: '12px 16px',
          backgroundColor: '#f3f4f6',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
              ID Material: #{material.id_material}
            </span>
            <span style={{
              fontSize: '12px',
              fontWeight: '600',
              color: stockColor,
              backgroundColor: stockStatus === 'bajo' ? '#fef3c7' : '#d1fae5',
              padding: '4px 12px',
              borderRadius: '12px'
            }}>
              {stockStatus === 'bajo' ? '⚠️ Stock Bajo' : '✓ Stock Normal'}
            </span>
          </div>
          {material.proveedor && (
            <div style={{ fontSize: '13px', color: '#6b7280' }}>
              Proveedor: <span style={{ fontWeight: '500', color: '#374151' }}>{material.proveedor.rol_proveedor}</span>
            </div>
          )}
        </div>

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
          title="Editar Material"
          fields={[
            {
              label: "Nombre del Material *",
              name: "nombre_material",
              defaultValue: material.nombre_material,
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
              defaultValue: material.unidad_medida
            },
            {
              label: "Precio Unitario * (CLP)",
              name: "precio_unitario",
              defaultValue: material.precio_unitario,
              placeholder: '5000',
              fieldType: 'input',
              type: "number",
              required: true,
              min: 0,
              step: "1"
            },
            {
              label: "Stock Mínimo *",
              name: "stock_minimo",
              defaultValue: material.stock_minimo,
              placeholder: '10',
              fieldType: 'input',
              type: "number",
              required: true,
              min: 0
            },
            {
              label: (
                <span>
                  Existencia Actual *
                  <span className='tooltip-icon' style={{ marginLeft: '5px' }}>
                    <img src={QuestionIcon} alt="Ayuda" style={{ width: '16px', height: '16px' }} />
                    <span className='tooltip-text'>Cantidad disponible en inventario</span>
                  </span>
                </span>
              ),
              name: "existencia_material",
              defaultValue: material.existencia_material,
              placeholder: '0',
              fieldType: 'input',
              type: "number",
              required: true,
              min: 0
            },
            {
            label: "Proveedor",
            name: "id_proveedor",
            fieldType: 'select',
            options: [
              { value: '', label: '-- Sin proveedor --' },
              ...(Array.isArray(proveedores) ? proveedores.map(p => {
                // Si tiene representante, mostrar su nombre
                if (p.representante) {
                  return {
                    value: p.id_proveedor.toString(),
                    label: `👤 ${p.representante.nombre_completo} - ${p.rol_proveedor}`
                  };
                }
                // Si no tiene representante, solo mostrar el nombre del proveedor
                return {
                  value: p.id_proveedor.toString(),
                  label: `🏢 ${p.rol_proveedor}`
                };
              }) : [])
            ],
            required: false,
            defaultValue: material.proveedor?.id_proveedor?.toString() || ''
          }
          ]}
          onSubmit={handleSubmit}
          buttonText={loading ? "Actualizando..." : "Actualizar Material"}
          backgroundColor={'#fff'}
          buttonDisabled={loading}
        />
      </div>
    </div>
  );
}